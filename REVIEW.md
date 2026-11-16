# REVIEW.md — what the assistant wrote, and what I decided

Commits (oldest first): `a537037` starter · `aa3c131` session 6 page · `23c4fb3` wishlist · `de1dd63` checkout form · `fac426b` Bootstrap · `4c1802f` grid alignment · `eefc9b6` memoized wishlist context · `14054cf` Retry uses the current text.
Rows below are the *Done means* rows of `README.md`; "run" means I ran it in Chromium against `npm run dev`, "read" means I read the lines.

| # | Decision | Scope / Topic | Where | Deciding Evidence |
|---|---|---|---|---|
| 1 | kept | Wishlist in one context, computed count | `23c4fb3`, `WishlistContext.jsx:7–20` | Checks I1–I3; row 14 run; rows 15 & 20 read |
| 2 | kept | Checkout errors computed from fields | `de1dd63`, `CheckoutForm.jsx:17–22` | Checks I4–I8; rows 16–17 run; row 20 read |
| 3 | kept | Abort in cleanup + 250 ms debounce | `aa3c131`, `useProducts.js:14–37` | Checks C7–C8; rows 7–8 run; lint silent |
| 4 | kept | Cart stores product objects, computed count/total | `aa3c131`, `App.jsx:9–17` | Check C10; row 10 run; row 11 read |
| 5 | kept | Bootstrap 5 from npm, no CDN | `fac426b`, `package.json`, `main.jsx` | Checks C1–C3; row 19 run; rows 3 & 13 diff |
| 6 | changed | Grid alignment (remove `m-0` from `<ul>`) | `4c1802f`, `ProductList.jsx:5` | Screenshot 360 px, `getBoundingClientRect()` |
| 7 | kept | Focus ring measurement (transition timing) | `fac426b`, Bootstrap CSS | Row 18 run; measured after 250 ms transition |
| 8 | changed | Memoize wishlist context value | `eefc9b6`, `WishlistContext.jsx:10–27` | Code inspection; `npm test`; `npm run lint` |
| 9 | changed | Retry uses current input text | `14054cf`, `useProducts.js:39–43` | Code inspection; throwaway unit check; test |
| 10 | rejected | Abort guard inside fetch resolution | 2026-11-16 review proposal, uncommitted | Check C7; Fetch AbortError lifecycle; test |

### 1. Wishlist in one context, one provider above everything
- **Where:** commit 23c4fb3, `src/WishlistContext.jsx` lines 7–20 (provider), 25–28 (hook); `src/App.jsx` lines 28–44 (the one `<WishlistProvider>`)
- **Decision:** kept
- **What decided it:** checks I1–I3 pass; row 14 run (save Cap and Jacket, search `hood`, clear: header `Saved: 2` throughout, panel lists Cap and Jacket, Cap's Save pressed again); row 15 read — exactly one provider, `App.jsx:28`, wrapping `Header`, the cards and `SavedPanel`
- **Why:** the saved list lives above the product list, so a search that hides a card cannot lose it. `count` is `saved.length` (line 19), computed, not state (row 20). `ProductCard` calls `useWishlist()` (`ProductCard.jsx` line 7), no props. Alternative considered: passing wishlist props down through the component tree or having `Header` compute `saved.length` directly; exposing `count` in the context value centralises the computed property and decouples `Header` from raw array access.
- **Sentence sent:** none — nothing to correct

### 2. Checkout errors computed from the fields
- **Where:** commit de1dd63, `src/components/CheckoutForm.jsx` lines 17–22 (`nameInvalid`, `phoneInvalid`, `cartEmpty`, `showName`, `showPhone`, `showCart`), lines 48–63 (`aria-invalid`, `aria-describedby`)
- **Decision:** kept
- **What decided it:** checks I4–I8 pass; row 17 run (empty form + `Place order` → Name message, Phone message and `Add something to the cart first.`; then Hoodie in the cart, Name `An`, Phone `090123456` → only the Phone message); row 16 run (order confirmed, cart `0 items`, address bar still `http://localhost:5173/`); row 20 read — the only state is the three field values, `tried` and `confirmation`; no effect syncs errors
- **Why:** an error is a function of the field and of `tried`, so it cannot be out of date. The regex `^0\d{9}$` rejects empty, 9 digits, 11 digits and letters (check I6). Alternative considered: using a form library (`react-hook-form` / Formik) or duplicating error states in `useEffect`; computing errors directly on render is single-source-of-truth and completely eliminates synchronization bugs without extra dependencies.
- **Sentence sent:** none — nothing to correct

### 3. Latest search wins: abort in the effect cleanup, plus a 250 ms debounce
- **Where:** commit aa3c131, `src/useProducts.js` lines 14–17 (debounce), 20–22 (`AbortController`, `fetch`), 32 (`AbortError` ignored), 36 (`controller.abort()` in cleanup)
- **Decision:** kept
- **What decided it:** row 7 run (mode `out-of-order`, clear the box, type `sc`, wait 3 s: only the scarf, no `Could not load products.`); row 8 run (typing `cap` slowly: requests `c`, `ca`, `cap`, nothing more while idle); checks C7 and C8; `npm run lint` silent with the hooks rules (dependencies `[debounced, attempt]`)
- **Why:** the cleanup aborts the previous request, so an old answer can never overwrite a newer one; an aborted request is treated as dropped, not as a failure. 250 ms is under the 300 ms allowed by `brief.md`. Alternative considered: combining the debounce timer and the fetch into a single `useEffect`; keeping `debounced` as a separate state with its own timer effect isolates the timer cancellation from the network `AbortController`, and crucially lets `retry()` bypass the debounce delay and trigger an immediate fetch.
- **Sentence sent:** none — nothing to correct

### 4. Cart keeps whole products, count and total computed
- **Where:** commit aa3c131, `src/App.jsx` lines 9–17 (`cart` is `[{ product, qty }]`), `src/components/CartSummary.jsx` (`count` and `total` from `items.reduce`)
- **Decision:** kept
- **What decided it:** row 10 run (add Hoodie, search `shirt`: only T-shirt listed, cart still `1 item` and `420.000 đ`); check C10; row 11 read — no `useState` for the total or the count, `key={product.id}` (`ProductList.jsx` line 7), no `dangerouslySetInnerHTML`, no `fetch` in `ProductCard`
- **Why:** storing the product object, not just its id, means the price still counts after the list no longer contains it.
- **Sentence sent:** none — nothing to correct

### 5. Bootstrap 5 from npm, nothing else added
- **Where:** commit fac426b, `package.json` (one line added: `"bootstrap": "^5.3.9"`), `src/main.jsx` line 3 (`import 'bootstrap/dist/css/bootstrap.min.css'`)
- **Decision:** kept
- **What decided it:** row 13 run (`git diff a537037 -- package.json vite.config.js` shows only that line; `vite.config.js` unchanged); row 3 run (`git diff --stat a537037 HEAD -- checks mock eslint.config.js index.html public` prints nothing); row 19 run (Chromium with every non-localhost request blocked: zero blocked requests, page still styled, at 360/768/1280 px `scrollWidth` equals the viewport, no button or field under 44 px, 1 / 2 / 3 product columns)
- **Why:** Bootstrap needs no plugin, so `vite.config.js` stays untouched; Tailwind would have needed a plugin line there. The classes sit on the elements the briefs ask for — labels are still `<label>`, buttons still `<button>`.
- **Sentence sent:** none — nothing to correct

### 6. Product grid was inset 8 px from the rest of the page
- **Where:** commit fac426b, `src/components/ProductList.jsx` line 5 (`... list-unstyled m-0`); fixed in commit 4c1802f, same file, line 5
- **Decision:** changed
- **What decided it:** a screenshot at 360 px, then measuring `getBoundingClientRect().left`: first card at 20 px, search box / Saved / Cart at 12 px (at 1280 px: 90 vs 82). After removing `m-0`: 12/12, 36/36 and 82/82 at 360/768/1280 px; `npm test` 19 passed, lint silent, `scrollWidth` still equal to the viewport.
- **Why:** `m-0` cancels the negative margins Bootstrap's `.row` uses to offset the column gutters, so the cards sat inside the page's padding.
- **Sentence sent:** none from me. The assistant found this itself while checking row 19 by eye, which is why the "Sentence sent" field has no quote here.

### 7. Focus ring: first reading was wrong, the code was fine
- **Where:** commit fac426b, no line changed (Bootstrap's `.btn:focus-visible` and `.form-control:focus` rules from `bootstrap.min.css`)
- **Decision:** kept
- **What decided it:** row 18 run — `Tab` from the search box reaches `Place order` in 28 presses, in reading order. Measured `box-shadow` right after focus was `0px`, which looked like "no focus ring". Re-measured after 250 ms: a 4 px ring on Details, Add to cart, Save, Name, Phone, Note and Place order — the first number was taken in the middle of Bootstrap's 0.15 s transition.
- **Why:** nothing to fix in code, so no custom CSS was added. This was an important lesson in measurement methodology: Bootstrap applies a 0.15 s ease-in-out transition on focus styles, so immediate sampling resulted in a false negative. The framework styling was already fully compliant, so writing override CSS would have been redundant and fragile.
- **Sentence sent:** none — nothing to correct

### 8. Wishlist context value rebuilt on every render
- **Where:** first version in commit 23c4fb3, `src/WishlistContext.jsx` line 19 (`value={{ saved, count: saved.length, isSaved, toggle }}`); fixed in commit eefc9b6, same file, lines 10–27
- **Decision:** changed
- **What decided it:** a line I read when I reviewed the code again after submitting: the `value` object and both functions were new on every render of `WishlistProvider`, so every `useWishlist()` consumer (all cards, `Header`, `SavedPanel`) re-rendered whenever the provider did. After the change `npm test` still reports 19 passed and `npm run lint` is silent. I did not measure the re-renders in React DevTools.
- **Why:** `useCallback` for `isSaved` and `toggle`, `useMemo` for `value`, so consumers re-render only when `saved` changes. `count` is still `saved.length`, computed, not state (row 20 unchanged).
- **Sentence sent:** none from me. The assistant found it in a second review of the repo and offered to fix it; I answered "Có" (yes).

### 9. Retry sent the last debounced text, not the text in the box
- **Where:** first version in commit aa3c131, `src/useProducts.js` line 39 (`const retry = () => setAttempt((n) => n + 1);`); fixed in commit 14054cf, same file, lines 39–43
- **Decision:** changed
- **What decided it:** a line I read: `retry` only bumped `attempt`, and the fetch effect uses `debounced`. If the request failed while a newer text was still waiting out the 250 ms debounce, Retry would repeat the older text. `brief.md` item 5 says Retry sends "the same search again", so this is a corner case, not a failing row. `npm test` 19 passed and lint silent after the change. I then checked the case with a throwaway test (not in the repo): first request answers 500, I type `ab` inside the debounce, press Retry. With the old code the requests were `q=`, `q=`, `q=ab`: one redundant request for the older text, and the debounce fixed the result afterwards. With the new code they are `q=`, `q=ab`. So the old bug was a wasted request for the wrong text, not a wrong list. I did not run Retry by hand in the browser.
- **Why:** `retry` now calls `setDebounced(query)` as well as `setAttempt`. Both updates are batched, so the effect runs once and the request is for the current text.
- **Sentence sent:** none from me. Found in the same second review; I answered "Có" (yes) to the offer to fix it.

### 10. Abort check inside fetch promise resolution
- **Where:** proposed in the 2026-11-16 review session, not committed; snippet: `if (controller.signal.aborted) return;` at the top of the second `.then` in `src/useProducts.js` line 27
- **Decision:** rejected
- **What decided it:** check C7 passes without this check; lines 20–36 of `src/useProducts.js` already abort via `AbortController` and catch `AbortError`; a throwaway test with the line added passes the same 19 checks (`npm test`) and lint (`npm run lint`), showing the line is redundant because an aborted fetch promise rejects before the second `.then` can run
- **Why:** redundant defensive check that adds dead code without fixing any defect. When `controller.abort()` runs in cleanup, the fetch promise rejects and jumps straight to `.catch`, so `.then` is never reached upon abort.
- **Sentence sent:** none from me. Proposed by the assistant; I decided to reject it.

---

**Rejected:** entry 10. The assistant proposed adding an abort guard inside the second `.then` of `src/useProducts.js`, but `controller.abort()` already triggers `AbortError` and jumps to `.catch`, making the proposal redundant.
