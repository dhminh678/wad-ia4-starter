import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 250;

// Fetches GET /api/products?q=<query>. Keeps the old products on screen while a
// request is out, drops answers for an older text, and reports failures.
export function useProducts(query) {
  const [debounced, setDebounced] = useState(query);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (query === debounced) return undefined;
    const timer = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debounced]);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetch(`/api/products?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus('ok');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // an older search: not a failure
        setProducts([]);
        setStatus('error');
      });
    return () => controller.abort();
  }, [debounced, attempt]);

  const retry = () => setAttempt((n) => n + 1);
  return { products, status, retry };
}
