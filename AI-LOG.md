# AI-LOG.md

Tool for every entry: Claude (claude.ai chat), one chat session. The five tasks below were all done in that one session and this file was written at the end of it, so the commit hashes in `git log` are the record of the order. Each task was preceded by a commit of the previous state (the first by the untouched starter, `a537037`).

## 2026-11-12 — session 6 shop page (`brief.md`)
Tool: Claude (chat).
Asked for: the page of `brief.md` — search with debounce, status line, product list, cart, `Details`, failure with Retry, latest search wins — one component per file. Commit `aa3c131`.
Kept: the split into `useProducts` + `SearchBox` / `ProductList` / `ProductCard` / `CartSummary`; the abort-in-cleanup plus 250 ms debounce; the cart as `[{ product, qty }]`. Ran `npm test` (C1–C11 pass, I1–I8 still failing as expected), `npm run lint` (silent) and rows 4–10 in Chromium (all pass).
Changed: nothing. Nothing went wrong on the first run of those rows.
Rejected: nothing.

## 2026-11-12 — wishlist through a context (W1–W5)
Tool: Claude (chat).
Asked for: `Save` with `aria-pressed`, header `Saved: N`, Saved panel, `src/WishlistContext.jsx` with one provider and a computed count. Commit `23c4fb3`.
Kept: provider + `useWishlist` hook, `Header` placed outside `<main>` so it is the page banner, `ProductCard` reading the context instead of taking props. `npm test`: I1–I3 pass; row 14 run (Saved: 2 survives a search that hides the cards); row 15 read (one provider, `App.jsx:28`).
Changed: nothing.
Rejected: nothing.

## 2026-11-12 — checkout form (F1–F5)
Tool: Claude (chat).
Asked for: form `Checkout` inside the cart, Name / Phone / Note, no reload, messages only after the first try, empty-cart message, confirmation, `<length>/200` counter, errors computed rather than stored. Commit `de1dd63`.
Kept: errors derived from the three field values and `tried` (`CheckoutForm.jsx` lines 17–22), regex `^0\d{9}$`, `aria-invalid` / `aria-describedby` only while a message shows. `npm test`: 19 passed; rows 16 and 17 run.
Changed: nothing.
Rejected: nothing.

## 2026-11-12 — one CSS framework from npm
Tool: Claude (chat).
Asked for: style the page with one framework installed with npm, no CDN, working at 360 / 768 / 1280 px, buttons at least 44 px, same HTML elements. Commit `fac426b`.
Kept: Bootstrap 5, imported in `main.jsx`; `index.css` cut to three rules. Bootstrap rather than Tailwind because Tailwind needs a plugin line in `vite.config.js` (row 13); no Tailwind code was written, so nothing was thrown away. Two clean-ups happened before the commit and are in no diff: `ProductCard.jsx` was regenerated after a scripted class edit left it mis-indented, and `package-lock.json` was reset after `npm install` rewrote it on the starter. `npm test` 19 passed, lint silent, `vite build` ok.
Changed: nothing in the commit diff.
Rejected: nothing.

## 2026-11-12 — alignment fix found by screenshot
Tool: Claude (chat).
Asked for: nothing — I did not ask for this. The assistant took a 360 px screenshot while checking row 19 and measured the layout. Commit `4c1802f`.
Kept: everything else; `npm test` 19 passed and all scripted rows pass again after the fix. A first reading of row 18 (`box-shadow: 0px` right after Tab) looked like a missing focus ring; re-measured after 250 ms every control has Bootstrap's 4 px ring, so the code was right and nothing was added.
Changed: removed `m-0` from the product `<ul>` (`ProductList.jsx` line 5). It cancelled the negative margins of Bootstrap's `.row`, so the first card sat at 20 px while the search box, Saved and Cart sat at 12 px (90 vs 82 at 1280 px). After the fix both are 12 / 36 / 82 px at 360 / 768 / 1280. This is REVIEW.md entry 6.
Rejected: nothing.