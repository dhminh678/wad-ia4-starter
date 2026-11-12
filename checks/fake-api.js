// Do not edit. A fake `fetch` for the checks: answers GET /api/products?q=
// from mock/products.js, with a delay you choose per search text, and honours
// AbortSignal the way the browser does.
import { vi } from 'vitest';
import { search } from '../mock/products.js';

function abortError(signal) {
  return signal?.reason ?? new DOMException('The operation was aborted.', 'AbortError');
}

export function installFakeApi({ delay = () => 20, status = 200, empty = false } = {}) {
  const requests = []; // the q of every request, in the order sent
  const fetch = vi.fn((input, init = {}) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, 'http://localhost');
    const signal = init.signal ?? (typeof input === 'object' && 'signal' in input ? input.signal : undefined);
    if (url.pathname !== '/api/products') {
      return Promise.reject(new TypeError(`checks: unexpected request ${raw}`));
    }
    const q = url.searchParams.get('q') ?? '';
    requests.push(q);
    return new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(abortError(signal));
      const timer = setTimeout(() => {
        const body = status === 200 ? (empty ? [] : search(q)) : { error: 'Database unavailable' };
        resolve(new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        }));
      }, delay(q));
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(abortError(signal));
      });
    });
  });
  vi.stubGlobal('fetch', fetch);
  return { fetch, requests };
}
