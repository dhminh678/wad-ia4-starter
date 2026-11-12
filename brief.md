# Brief — a searchable catalogue with a cart, in React

*Give this file to your assistant as it is. Everything below the line is the
spec; `README.md` explains how you check what comes back.*

---

Build the shop page of this Vite + React project. The project is already set
up: `npm run dev` serves the page and a fake API, `npm test` runs the checks
in `checks/`, `npm run lint` runs ESLint with the React hooks rules.

## The API (served by the dev server, same origin)

- `GET /api/products?q=<text>` → `200` with a JSON array of
  `{ "id": "cap", "name": "Cap", "price": 95000, "description": "Adjustable strap." }`,
  only the products whose name contains `<text>`. `q=` (empty) returns every
  product. URL-encode the text.
- It can also answer `500` with a JSON error body, answer slowly, answer
  `[]`, or answer **out of order** — a later request may come back before an
  earlier one.

## What the page must do

1. A heading `Shop`, then a search box, a status line, the product list and
   the cart.
2. **Search box:** an `<input type="search">` with a `<label>` reading
   `Search products`. On load, and whenever its text changes, request
   `GET /api/products?q=<text>`. You may wait up to 300 ms after the last
   keystroke before sending (debounce), not longer.
3. **Status line:** exactly one element with `role="status"`. While a request
   is out it reads `Loading products…`. When the answer is an empty list it
   reads `No products match.` Otherwise it is empty. While a request is out,
   the products already on screen **stay on screen** until the answer arrives.
4. **Product list:** a `<ul aria-label="Products">` with one `<li>` per
   product, in the order the API gives. In each `<li>`:
   - the name in an `<h2>`;
   - the price formatted `price.toLocaleString('vi-VN') + ' đ'`, e.g. `95.000 đ`;
   - a `Details` button with `aria-expanded` (`false`/`true`) that shows and
     hides the product's description below it;
   - an `Add to cart` button.
5. **Failure:** if the request fails — a network error or a status that is
   not 2xx — the status line reads `Could not load products.`, the list is
   empty, and a `Retry` button appears. `Retry` sends the same search again and
   disappears.
6. **Latest search wins:** answers may arrive out of order. The list must
   always show the answer for the **current** text of the search box. An
   answer for an older text is dropped — not shown, and not reported as a
   failure.
7. **Cart:** an `<aside aria-label="Cart">` showing the number of items
   (`0 items`, `1 item`, `2 items`, …) and the total, formatted like prices
   (`0 đ` when empty). `Add to cart` adds one of that product. The cart keeps
   its content when the search changes: a product that is no longer in the
   list stays in the cart, and its price still counts.
8. **Details belong to their product:** opening `Details` on one product
   opens that product only. When the list changes, a product that is still in
   the list keeps its open or closed state, and no other product inherits it.
9. **Text from the API is text:** product names and descriptions are data, not
   markup — `Scarf <i>limited</i>` shows the angle brackets, nothing in italics.
10. **One request per search text:** no repeated requests for the same text,
    and none while nothing changes. (In development, React's `StrictMode`
    runs every effect twice on mount; the first run must be cancelled by the
    effect's cleanup — that is expected.)

## Structure

- `src/App.jsx` keeps its default export `App`.
- One component per file in `src/components/`: `SearchBox.jsx`,
  `ProductList.jsx`, `ProductCard.jsx`, `CartSummary.jsx`.
- `ProductCard` receives its product and what to do on *Add to cart* through
  props. It does not fetch anything.
- The search text, the products and the cart live in `App` (or in a custom
  hook `App` calls, e.g. `src/useProducts.js`). Whether `Details` is open lives
  in `ProductCard`.
- Do not keep in state anything you can compute from other state — the cart
  total, the item count.

## Constraints

- React only: no new dependencies (no axios, no UI library, no state library).
- Do not edit anything in `checks/` or `mock/`, nor `vite.config.js`,
  `eslint.config.js`, `index.html`, `public/panel.js`, `package.json`.
- `npm test` passes and `npm run lint` reports nothing — without disabling
  any lint rule.
- Plain CSS in `src/index.css` is fine; the page must work at 360 px wide.
