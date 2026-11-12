export default function SearchBox({ value, onChange }) {
  return (
    <div className="mb-2">
      <label htmlFor="search" className="form-label">Search products</label>
      <input
        id="search"
        type="search"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
