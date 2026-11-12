// A fake shop API inside the Vite dev server, with switchable test
// conditions — the same idea as session 5's server.mjs. Do not edit.
//
//   GET  /api/products?q=<text>  → 200, JSON array of products whose name contains <text>
//   GET  /__mode                 → the current test condition
//   POST /__mode  {"mode": "…"}  → switch it (the Test conditions panel does this)
import { search } from './products.js';

export const MODES = {
  normal: 'answers after 150 ms',
  slow: 'answers after 2 s',
  error: 'answers HTTP 500 with a JSON error',
  empty: 'answers []',
  'out-of-order': 'an empty or one-letter search answers after 1.5 s, longer ones after 150 ms',
};

let mode = 'normal';

function sendJson(res, status, body) {
  if (res.writableEnded || res.destroyed) return;
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function later(res, ms, fn) {
  const timer = setTimeout(fn, ms);
  res.on('close', () => clearTimeout(timer));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
  });
}

export default function mockApi() {
  return {
    name: 'session6-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');

        if (url.pathname === '/__mode') {
          if (req.method === 'POST') {
            try {
              const { mode: next } = JSON.parse(await readBody(req));
              if (!(next in MODES)) return sendJson(res, 400, { error: `unknown mode ${next}` });
              mode = next;
              console.log(`[mock api] mode → ${mode}`);
            } catch {
              return sendJson(res, 400, { error: 'send {"mode": "..."}' });
            }
          }
          return sendJson(res, 200, { mode, modes: MODES });
        }

        if (url.pathname === '/api/products' && req.method === 'GET') {
          const q = url.searchParams.get('q') ?? '';
          const current = mode;
          console.log(`[mock api] GET /api/products?q=${JSON.stringify(q)} (${current})`);
          if (current === 'error') return later(res, 150, () => sendJson(res, 500, { error: 'Database unavailable' }));
          if (current === 'empty') return later(res, 150, () => sendJson(res, 200, []));
          let ms = 150;
          if (current === 'slow') ms = 2000;
          if (current === 'out-of-order' && q.trim().length <= 1) ms = 1500;
          return later(res, ms, () => sendJson(res, 200, search(q)));
        }

        next();
      });
    },
  };
}
