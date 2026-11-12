import { useState } from 'react';
import SearchBox from './components/SearchBox.jsx';
import ProductList from './components/ProductList.jsx';
import CartSummary from './components/CartSummary.jsx';
import Header from './components/Header.jsx';
import SavedPanel from './components/SavedPanel.jsx';
import { WishlistProvider } from './WishlistContext.jsx';
import { useProducts } from './useProducts.js';

export default function App() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]); // [{ product, qty }] — keeps products the search hides
  const { products, status, retry } = useProducts(query);

  const addToCart = (product) =>
    setCart((items) =>
      items.some((i) => i.product.id === product.id)
        ? items.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { product, qty: 1 }],
    );

  let message = '';
  if (status === 'loading') message = 'Loading products…';
  else if (status === 'error') message = 'Could not load products.';
  else if (products.length === 0) message = 'No products match.';

  return (
    <WishlistProvider>
      <Header />
      <main className="container pb-5">
        <SearchBox value={query} onChange={setQuery} />
        <p role="status" className="my-2">{message}</p>
        {status === 'error' && (
          <button type="button" className="btn btn-primary mb-3" onClick={retry}>Retry</button>
        )}
        <div className="row g-4">
          <div className="col-lg-8">
              <ProductList products={products} onAdd={addToCart} />
            </div>
          <div className="col-lg-4 d-grid gap-3 align-content-start">
            <SavedPanel />
            <CartSummary items={cart} onOrder={() => setCart([])} />
          </div>
        </div>
      </main>
    </WishlistProvider>
  );
}
