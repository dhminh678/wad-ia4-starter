import { useState } from 'react';
import { formatVnd } from '../format.js';
import { useWishlist } from '../WishlistContext.jsx';

export default function ProductCard({ product, onAdd }) {
  const [open, setOpen] = useState(false);
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);
  return (
    <li className="card">
      <h2>{product.name}</h2>
      <p className="price">{formatVnd(product.price)}</p>
      <div className="actions">
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Details
        </button>
        <button type="button" onClick={() => onAdd(product)}>
          Add to cart
        </button>
        <button type="button" aria-pressed={saved} onClick={() => toggle(product)}>
          Save
        </button>
      </div>
      {open && <p className="description">{product.description}</p>}
    </li>
  );
}
