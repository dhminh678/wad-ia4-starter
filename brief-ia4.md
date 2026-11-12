# Brief — IA#4: a wishlist, a checkout form, and a CSS framework

*Give this file to your assistant together with `brief.md`. `brief.md` is
the page from session 6; this file adds to it. Everything below the line is
the spec; `README.md` explains how you check what comes back.*

---

Start from a page that meets every item of `brief.md`. Then add the three
parts below. Where this file and `brief.md` disagree, this file wins.

## W — A wishlist, shared through a context

1. **Save button.** Each product card has a `Save` button with
   `aria-pressed` (`false`/`true`). Pressing it saves the product; pressing it
   again removes it. The button's name stays `Save`.
2. **Header.** The page starts with a `<header>` containing the `<h1>Shop</h1>`
   and the text `Saved: N`, where N is the number of saved products.
3. **Saved panel.** A `<section aria-label="Saved">` lists the names of the
   saved products in a `<ul>`, in the order they were saved, as text (the scarf
   shows its angle brackets). With nothing saved, it reads `Nothing saved yet.`
4. **Saved means saved.** A saved product stays saved, counted and listed
   when the search hides it, and its `Save` button reads `aria-pressed="true"`
   when it comes back.
5. **Structure.** The wishlist lives in a React context, in
   `src/WishlistContext.jsx`, with **one** provider for the whole page.
   `ProductCard` reads it through a hook (e.g. `useWishlist()`), not through
   props. The count `N` is computed, not kept in state.

## F — A checkout form

Inside the cart, a `<form aria-label="Checkout">` with:

- `Name` — a text input with a visible `<label>`;
- `Phone` — an `<input type="tel">` with a visible `<label>`;
- `Note (optional)` — a `<textarea>` with a visible `<label>`;
- a submit button `Place order`.

1. **Stay on the page.** Submitting never reloads the page and never puts
   the fields in the address bar.
2. **One message per field, after the first try.** No error messages before
   the first `Place order`. After it, each invalid field shows its own message
   below it, linked to the field with `aria-describedby`, and has
   `aria-invalid="true"`:
   - `Name` empty or only spaces → `Enter your name.`
   - `Phone` not exactly 10 digits starting with `0` — empty included →
     `Enter a 10-digit phone number starting with 0.`
   Messages update as the fields change.
3. **Empty cart.** With an empty cart, `Place order` shows
   `Add something to the cart first.` and places nothing.
4. **A valid order** shows `Order placed for <name>: <n> item(s), <total>.` —
   for example `Order placed for An: 2 items, 515.000 đ.` — then empties the
   cart and the fields. The wishlist is not touched.
5. **Note.** Next to the note, a counter `<length>/200`; the note accepts at
   most 200 characters.

The errors are worked out from the fields, not kept in a second copy of state
that an effect keeps in sync. You may use a form library
(`react-hook-form`, Formik) or plain React state; if you use a library, the
behaviour above does not change.

## C — One CSS framework

1. Style the page with **one** CSS framework installed with `npm` — for
   example Bootstrap 5 or Tailwind CSS. Not from a CDN: the page is checked
   with the network off.
2. At 360, 768 and 1280 px wide: no sideways scrolling, nothing cut off,
   buttons at least 44 px tall, and the layout uses the width — products in
   more than one column at 1280 px.
3. Labels stay labels, buttons stay buttons: the framework changes the look,
   not the HTML elements the briefs ask for.

## Constraints (in addition to `brief.md`)

- New dependencies: the CSS framework, and a form library if you choose one.
  Nothing else.
- Do not edit anything in `checks/` or `mock/`, nor `eslint.config.js`,
  `index.html`, `public/`. `vite.config.js` may only gain the one plugin line
  your CSS framework needs, if it needs one.
- Keep every check in `checks/` passing: the 11 of session 6 and the 8 in
  `checks/ia4.test.jsx`.
