import { useWishlist } from '../WishlistContext.jsx';

export default function SavedPanel() {
  const { saved } = useWishlist();
  return (
    <section aria-label="Saved" className="panel">
      <h2>Saved</h2>
      {saved.length === 0 ? (
        <p>Nothing saved yet.</p>
      ) : (
        <ul>
          {saved.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
