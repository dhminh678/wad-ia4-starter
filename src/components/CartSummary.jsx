import { formatVnd } from '../format.js';
import CheckoutForm from './CheckoutForm.jsx';

export default function CartSummary({ items, onOrder }) {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.product.price, 0);
  return (
    <aside aria-label="Cart" className="cart">
      <h2>Cart</h2>
      <p>{count} {count === 1 ? 'item' : 'items'}</p>
      <p>{formatVnd(total)}</p>
      <CheckoutForm count={count} total={total} onOrder={onOrder} />
    </aside>
  );
}
