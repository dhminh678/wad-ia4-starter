import { useWishlist } from '../WishlistContext.jsx';

export default function Header() {
  const { count } = useWishlist();
  return (
    <header className="site-header">
      <h1>Shop</h1>
      <p>Saved: {count}</p>
    </header>
  );
}
