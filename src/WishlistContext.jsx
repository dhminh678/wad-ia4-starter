import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext(null);

// One provider for the whole page. It keeps the saved products (in the order
// they were saved); the count is computed from that list, not stored.
export function WishlistProvider({ children }) {
  const [saved, setSaved] = useState([]); // [{ id, name }]

  const isSaved = (id) => saved.some((p) => p.id === id);
  const toggle = (product) =>
    setSaved((list) =>
      list.some((p) => p.id === product.id)
        ? list.filter((p) => p.id !== product.id)
        : [...list, { id: product.id, name: product.name }],
    );

  return (
    <WishlistContext.Provider value={{ saved, count: saved.length, isSaved, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return value;
}
