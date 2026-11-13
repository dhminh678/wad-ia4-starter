# REVIEW.md — what the assistant wrote, and what I decided

Commits (oldest first): `a537037` starter · `aa3c131` session 6 page · `23c4fb3` wishlist · `de1dd63` checkout form · `fac426b` Bootstrap · `4c1802f` grid alignment.
Rows below are the *Done means* rows of `README.md`; "run" means I ran it in Chromium against `npm run dev`, "read" means I read the lines.

### 1. Wishlist in one context, one provider above everything
- **Where:** commit 23c4fb3, `src/WishlistContext.jsx` lines 7–20 (provider), 25–28 (hook); `src/App.jsx` lines 28–44 (the one `<WishlistProvider>`)
- **Decision:** kept
- **What decided it:** checks I1–I3 pass; row 14 run (save Cap and Jacket, search `hood`, clear: header `Saved: 2` throughout, panel lists Cap and Jacket, Cap's Save pressed again); row 15 read — exactly one provider, `App.jsx:28`, wrapping `Header`, the cards and `SavedPanel`
- **Why:** the saved list lives above the product list, so a search that hides a card cannot lose it. `count` is `saved.length` (line 19), computed, not state (row 20). `ProductCard` calls `useWishlist()` (`ProductCard.jsx` line 7), no props.
- **Sentence sent:** none — nothing to correct

### 2. Checkout errors computed from the fields
- **Where:** commit de1dd63, `src/components/CheckoutForm.jsx` lines 17–22 (`nameInvalid`, `phoneInvalid`, `cartEmpty`, `showName`, `showPhone`, `showCart`), lines 48–63 (`aria-invalid`, `aria-describedby`)
- **Decision:** kept
- **What decided it:** checks I4–I8 pass; row 17 run (empty form + `Place order` → Name message, Phone message and `Add something to the cart first.`; then Hoodie in the cart, Name `An`, Phone `090123456` → only the Phone message); row 16 run (order confirmed, cart `0 items`, address bar still `http://localhost:5173/`); row 20 read — the only state is the three field values, `tried` and `confirmation`; no effect syncs errors
- **Why:** an error is a function of the field and of `tried`, so it cannot be out of date. The regex `^0\d{9}$` rejects empty, 9 digits, 11 digits and letters (check I6).
- **Sentence sent:** none — nothing to correct

### 3. Latest search wins: abort in the effect cleanup, plus a 250 ms debounce
- **Where:** commit aa3c131, `src/useProducts.js` lines 14–17 (debounce), 20–22 (`AbortController`, `fetch`), 32 (`AbortError` ignored), 36 (`controller.abort()` in cleanup)
- **Decision:** kept
- **What decided it:** row 7 run (mode `out-of-order`, clear the box, type `sc`, wait 3 s: only the scarf, no `Could not load products.`); row 8 run (typing `cap` slowly: requests `c`, `ca`, `cap`, nothing more while idle); checks C7 and C8; `npm run lint` silent with the hooks rules (dependencies `[debounced, attempt]`)
- **Why:** the cleanup aborts the previous request, so an old answer can never overwrite a newer one; an aborted request is treated as dropped, not as a failure. 250 ms is under the 300 ms allowed by `brief.md`.
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
- **Why:** nothing to fix, so no CSS was added.
- **Sentence sent:** none — nothing to correct

---

**Rejected:** none. Every row passed the first time it was run except the alignment in entry 6, so there is no entry where the assistant's output was thrown away.
