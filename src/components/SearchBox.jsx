export default function SearchBox({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="search">Search products</label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
