// Test conditions panel — not part of the app, and not React. It tells the
// fake API (mock/api-plugin.js) how to answer from the next request on.
// Do not edit.
(function () {
  const panel = document.createElement('aside');
  panel.setAttribute('aria-label', 'Test conditions');
  panel.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:9999;font:13px/1.4 system-ui,sans-serif;' +
    'background:#fffbe6;color:#222;border:1px solid #c9a400;border-radius:6px;padding:6px 8px;max-width:calc(100vw - 16px)';
  panel.innerHTML = '<strong>Test conditions</strong> <select aria-label="API mode"></select> <span></span>';
  const select = panel.querySelector('select');
  const note = panel.querySelector('span');

  async function call(body) {
    const res = await fetch('/__mode', body ? {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    } : undefined);
    return res.json();
  }

  function show({ mode, modes }) {
    select.replaceChildren(...Object.keys(modes).map((m) => new Option(m, m, false, m === mode)));
    note.textContent = '— ' + modes[mode] + '. Reload or search again.';
  }

  select.addEventListener('change', async () => show(await call({ mode: select.value })));
  document.addEventListener('DOMContentLoaded', async () => {
    document.body.append(panel);
    try { show(await call()); } catch { note.textContent = 'run `npm run dev`, not a file:// page'; }
  });
})();
