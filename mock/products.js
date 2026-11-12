// The shop data behind GET /api/products — shared by the dev server
// (mock/api-plugin.js) and by the checks (checks/). Do not edit.
//
// One name contains text that LOOKS like HTML: it must appear on the page
// exactly as written, tags and all.
export const PRODUCTS = [
  { id: 'tshirt', name: 'T-shirt', price: 180000, description: 'Cotton, regular fit.' },
  { id: 'hoodie', name: 'Hoodie', price: 420000, description: 'Fleece-lined, with a zip pocket.' },
  { id: 'somi', name: 'Áo sơ mi tay dài kẻ sọc xanh navy', price: 350000, description: 'Long sleeves, navy stripes.' },
  { id: 'cap', name: 'Cap', price: 95000, description: 'Adjustable strap.' },
  { id: 'tote', name: 'Tote bag', price: 120000, description: 'Canvas, fits a 14-inch laptop.' },
  { id: 'socks', name: 'Socks, 3 pairs', price: 75000, description: 'Cotton blend.' },
  { id: 'jacket', name: 'Jacket', price: 890000, description: 'Water-resistant shell.' },
  { id: 'scarf', name: 'Scarf <i>limited</i>', price: 160000, description: 'Wool. Only 7 made.' },
];

// The API's search: products whose name contains the text, ignoring case.
export function search(q = '') {
  const needle = q.trim().toLowerCase();
  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(needle));
}
