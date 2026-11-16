# AI-LOG.md

Tool for every entry: Claude (claude.ai chat). The five 2026-11-12 tasks were all done in one chat session and this file was written at the end of it, so the commit hashes in `git log` are the record of the order. The two 2026-11-16 entries come from later review sessions, after the submission commits. Each task was preceded by a commit of the previous state (the first by the untouched starter, `a537037`).

## 2026-11-12 — session 6 shop page (`brief.md`)
Tool: Claude (chat).
Asked for: the page of `brief.md` — search with debounce, status line, product list, cart, `Details`, failure with Retry, latest search wins — one component per file. Commit `aa3c131`.
Ran: `npm test` (C1–C11 pass, I1–I8 failing as expected), `npm run lint` (silent), and rows 4–10 and 12 in Chromium (all pass).
Kept: the split into `useProducts` + `SearchBox` / `ProductList` / `ProductCard` / `CartSummary`; the abort-in-cleanup plus 250 ms debounce; the cart as `[{ product, qty }]`. This is REVIEW.md entries 3 and 4.
Changed: nothing. Nothing went wrong on the first run of those rows (a later review refined Retry to use the current box text: REVIEW.md entry 9).
Rejected: nothing.

## 2026-11-12 — wishlist through a context (W1–W5)
Tool: Claude (chat).
Asked for: `Save` with `aria-pressed`, header `Saved: N`, Saved panel, `src/WishlistContext.jsx` with one provider and a computed count. Commit `23c4fb3`.
Ran: `npm test` (I1–I3 pass); row 14 in Chromium (Saved: 2 survives search); read `src/App.jsx:28` (one provider) and `src/WishlistContext.jsx:19`.
Kept: provider + `useWishlist` hook, `Header` placed outside `<main>` so it is the page banner, `ProductCard` reading the context instead of taking props. This is REVIEW.md entry 1.
Changed: nothing. Nothing needed changing at the time (a later review found the context value was rebuilt on every render: REVIEW.md entry 8).
Rejected: nothing.

## 2026-11-12 — checkout form (F1–F5)
Tool: Claude (chat).
Asked for: form `Checkout` inside the cart, Name / Phone / Note, no reload, messages only after the first try, empty-cart message, confirmation, `<length>/200` counter, errors computed rather than stored. Commit `de1dd63`.
Ran: `npm test` (19 passed); rows 16 and 17 in Chromium; read `src/components/CheckoutForm.jsx:17–22`.
Kept: errors derived from the three field values and `tried` (`CheckoutForm.jsx` lines 17–22), regex `^0\d{9}$`, `aria-invalid` / `aria-describedby` only while a message shows. This is REVIEW.md entry 2.
Changed: nothing.
Rejected: nothing.

## 2026-11-12 — one CSS framework from npm
Tool: Claude (chat).
Asked for: style the page with one framework installed with npm, no CDN, working at 360 / 768 / 1280 px, buttons at least 44 px, same HTML elements. Commit `fac426b`.
Ran: `npm test` (19 passed), `npm run lint` (silent), `npx vite build` (ok); rows 3 and 13 with `git diff` against the starter, row 19 in Chromium.
Kept: Bootstrap 5, imported in `main.jsx`; `index.css` cut to three rules. Bootstrap rather than Tailwind because Tailwind needs a plugin line in `vite.config.js` (row 13); no Tailwind code was written, so nothing was thrown away. Two clean-ups happened before the commit and are in no diff: `ProductCard.jsx` was regenerated after a scripted class edit left it mis-indented, and `package-lock.json` was reset after `npm install` rewrote it on the starter. This is REVIEW.md entry 5.
Changed: nothing in the commit diff of `fac426b` (a later screenshot inspection found the 8 px gutter inset: REVIEW.md entry 6).
Rejected: nothing.

## 2026-11-12 — alignment fix found by screenshot
Tool: Claude (chat).
Asked for: nothing — I did not ask for this. The assistant took a 360 px screenshot while checking row 19 and measured the layout. Commit `4c1802f`.
Ran: screenshot at 360 px, measured `getBoundingClientRect().left` (20 px vs 12 px); re-ran `npm test` (19 passed), lint (silent), and all scripted rows.
Kept: everything else; `npm test` 19 passed and all scripted rows pass again after the fix. A first reading of row 18 (`box-shadow: 0px` right after Tab) looked like a missing focus ring; re-measured after 250 ms every control has Bootstrap's 4 px ring, so the code was right and nothing was added (REVIEW.md entry 7).
Changed: removed `m-0` from the product `<ul>` (`ProductList.jsx` line 5). It cancelled the negative margins of Bootstrap's `.row`, so the first card sat at 20 px while the search box, Saved and Cart sat at 12 px (90 vs 82 at 1280 px). After the fix both are 12 / 36 / 82 px at 360 / 768 / 1280. This is REVIEW.md entry 6.
Rejected: nothing.

## 2026-11-16 — second review of the repo, two small fixes
Tool: Claude (chat), a new session after the submission commits.
Asked for: a check of the repository for mistakes. I did not ask for any particular fix; the assistant listed two and I answered "Có" (yes) to fixing them. It gave me the changes as two patch files and I applied them with `git am`. Commits `eefc9b6` and `14054cf`.
Ran: `npm test` (19 passed), `npm run lint` (silent), throwaway unit test for retry with batched search state.
Kept: the rest of the code; `npm test` 19 passed and `npm run lint` silent after both changes.
Changed: `WishlistContext.jsx` now memoizes the context value (`useCallback`, `useMemo`), and `useProducts.js` `retry` sets the debounced text to the current text. These are REVIEW.md entries 8 and 9. I did not test either in the browser.
Rejected: nothing.

## 2026-11-16 — review of candidates and proposal to guard fetch abort
Tool: Claude (chat).
Asked for: review six potential candidate areas in the codebase to evaluate if any should be changed, kept, or rejected.
Ran: `npm test` (19 passed), `npm run lint` (silent), throwaway copy test for candidate 6 (19 passed).
Kept: candidates 1 to 5 (`useProducts.js` debounced state, `useProducts.js` response parsing, `CheckoutForm.jsx` `role="alert"`, `CheckoutForm.jsx` `aria-live="polite"`, `WishlistContext.jsx` computed `count`).
Changed: nothing. No code modified in `src/`.
Rejected: proposal to add `if (controller.signal.aborted) return;` at the start of the second `.then` in `src/useProducts.js`. Tested in an isolated throwaway environment: all 19 checks pass without it, because `controller.abort()` rejects the fetch promise with `AbortError` and jumps to `.catch`, making an in-promise abort check redundant. This is REVIEW.md entry 10.