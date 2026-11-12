import { formatVnd } from '../format.js';
import CheckoutForm from './CheckoutForm.jsx';

export default function CartSummary({ items, onOrder }) {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.product.price, 0);
  return (
    <aside aria-label="Cart" className="card card-body">
      <h2 className="h5">Cart</h2>
      <p className="mb-1">{count} {count === 1 ? 'item' : 'items'}</p>
      <p className="fw-semibold mb-0">{formatVnd(total)}</p>
      <CheckoutForm count={count} total={total} onOrder={onOrder} />
    </aside>
  );
}
