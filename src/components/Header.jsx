import { useWishlist } from '../WishlistContext.jsx';

export default function Header() {
  const { count } = useWishlist();
  return (
    <header className="container d-flex flex-wrap align-items-baseline justify-content-between gap-2 pt-3 pb-2">
      <h1 className="h2 m-0">Shop</h1>
      <p className="fw-semibold m-0">Saved: {count}</p>
    </header>
  );
}
