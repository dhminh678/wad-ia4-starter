import ProductCard from './ProductCard.jsx';

export default function ProductList({ products, onAdd }) {
  return (
    <ul aria-label="Products" className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 list-unstyled">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </ul>
  );
}
