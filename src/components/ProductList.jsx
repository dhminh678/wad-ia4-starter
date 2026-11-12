import ProductCard from './ProductCard.jsx';

export default function ProductList({ products, onAdd }) {
  return (
    <ul aria-label="Products" className="products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </ul>
  );
}
