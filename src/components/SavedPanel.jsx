import { useWishlist } from '../WishlistContext.jsx';

export default function SavedPanel() {
  const { saved } = useWishlist();
  return (
    <section aria-label="Saved" className="card card-body">
      <h2 className="h5">Saved</h2>
      {saved.length === 0 ? (
        <p className="mb-0">Nothing saved yet.</p>
      ) : (
        <ul className="mb-0 text-break">
          {saved.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
