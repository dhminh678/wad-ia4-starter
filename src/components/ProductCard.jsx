import { useState } from 'react';
import { formatVnd } from '../format.js';
import { useWishlist } from '../WishlistContext.jsx';

export default function ProductCard({ product, onAdd }) {
  const [open, setOpen] = useState(false);
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);
  return (
    <li className="col">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h2 className="h5 card-title text-break">{product.name}</h2>
          <p className="card-text fw-semibold">{formatVnd(product.price)}</p>
          <div className="d-flex flex-wrap gap-2 mt-auto">
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              Details
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onAdd(product)}>
              Add to cart
            </button>
            <button
              type="button"
              className={saved ? 'btn btn-dark' : 'btn btn-outline-dark'}
              aria-pressed={saved}
              onClick={() => toggle(product)}
            >
              Save
            </button>
          </div>
          {open && <p className="card-text text-break mt-2 mb-0">{product.description}</p>}
        </div>
      </div>
    </li>
  );
}
