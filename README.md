# IA#4 — React and a CSS framework, with a review

**CSC13008 · individual assignment · 3% of the course · 100 points**
**The rubric is attached to the Classroom assignment — read it before you start.**

Your assistant writes the code. You decide what to keep — and you prove it
with the checks, the *Done means* table below, and `REVIEW.md`, not with "it
looks fine" or "the assistant says the tests pass".

What to build is in two files, both given to your assistant:

- [`brief.md`](brief.md) — the session 6 shop page: search, status line,
  products, cart. If you finished it in session 6, start from your own code.
- [`brief-ia4.md`](brief-ia4.md) — what IA#4 adds: a wishlist shared through
  a context, a checkout form, one CSS framework.

## Set up — start this first, it downloads about 70 MB

You need **Node 18.18 or newer** (`node --version`) and a network
connection for the install.

```bash
cd ia4-starter
npm install
git init && git add . && git commit -m "starter"
npm run dev        # http://localhost:5173 — the page and a fake API
npm test           # the checks in checks/ — 19 fail on the starter: that is the point
npm run lint       # ESLint with the React hooks rules
```

Already have a session 6 folder that passes? Copy its `src/` over this
starter's `src/` **after** the starter commit, and commit that as its own
step: `git commit -m "session 6 page"`.

Port taken? `npm run dev -- --port 5174`. Do not open `index.html` by
double-clicking it: the page needs the dev server for its API.

**Commit before every request to your assistant.** Then `git diff` shows
exactly what it wrote — the raw material of `REVIEW.md`.

## How to work

1. **Read both briefs yourself first.** Mark the three requirements you think
   an assistant is most likely to get wrong.
2. **Ask for a plan first** — the components, where each piece of state lives
   (cart, wishlist, form fields), what the context holds. Read it against the
   *Structure* sections before you let it write code.
3. Let it implement one part at a time — W, then F, then C. Commit before each.
4. After each part, run **every** row of *Done means*. A failing row gets
   **one precise sentence** to the assistant; run the table again.
5. Read each diff and write `REVIEW.md` as you go, not at the end.

## Test conditions

The yellow panel at the bottom right switches how the fake API answers, from
the next request on. It is not part of your app.

| Mode | What `GET /api/products?q=` does |
|---|---|
| `normal` | answers after 150 ms |
| `slow` | answers after 2 s |
| `error` | answers `500` with a JSON error body |
| `empty` | answers `[]` |
| `out-of-order` | an empty or one-letter search answers after 1.5 s, longer ones after 150 ms — so a later request can come back first |

The terminal running `npm run dev` prints one line per request, with the mode
it arrived under. Keep it next to the browser.

## Done means

| # | Do this | You should see |
|---|---|---|
| 1 | `npm test` | `Tests  19 passed (19)` |
| 2 | `npm run lint` | no output at all — no warnings, no `eslint-disable` added anywhere |
| 3 | `git diff --stat <starter commit> -- checks mock eslint.config.js index.html public` | **nothing**. If the assistant edited a check to make it pass, this is where it shows |
| 4 | Mode `normal`, reload | 8 cards in the API's order, prices like `95.000 đ`; the last one reads `Scarf <i>limited</i>` with the brackets visible |
| 5 | Mode `slow`, type `cap` | `Loading products…` for about 2 s, **while the old cards stay on screen**; then only Cap |
| 6 | Mode `error`, reload; switch to `normal`, press Retry | `Could not load products.`, no cards, a Retry button. After Retry: 8 cards, the button gone |
| 7 | Mode `out-of-order`, clear the box, type `sc` quickly, wait 3 s | only the scarf — and still only the scarf after 3 s. No error message |
| 8 | Network tab, filter `products`, type `cap` slowly | one request per text you typed — `q=c`, `q=ca`, `q=cap` (or fewer, with a debounce). Nothing more while you wait. On reload, a first request marked *(canceled)* is React's `StrictMode` at work, not a bug |
| 9 | Open *Details* on Cap, then type `a` | Cap moves up the list and **stays open**; no other card is open |
| 10 | *Add to cart* on Hoodie, then search `shirt` | only T-shirt is listed; the cart still says `1 item` and `420.000 đ` |
| 11 | Read `src/` | the four files of `brief.md`'s *Structure* in `src/components/` (more are fine); `ProductCard` has no `fetch`; the list uses `key={product.id}` (not the index); no `dangerouslySetInnerHTML`; the cart total and the item count are **computed**, not kept in `useState` |
| 12 | DevTools device toolbar, 360 px wide | no sideways scrolling; every button usable |
| 13 | `git diff <starter commit> -- package.json vite.config.js` | one CSS framework added (and a form library, if you chose one) — nothing else; at most one plugin line in `vite.config.js` |
| 14 | *Save* Cap and Jacket, search `hood`, clear the box | header `Saved: 2` throughout; the Saved panel lists Cap, Jacket; Cap's *Save* is pressed again |
| 15 | React DevTools → *Components* | **one** wishlist provider, above the header, the cards and the panel |
| 16 | Add Hoodie; fill Name and Phone; *Place order*; look at the address bar | the confirmation; cart `0 items`; the address bar unchanged — no `?name=` |
| 17 | *Place order* with every field empty; then Phone `090123456` | a message under Name and Phone, and `Add something to the cart first.`; then the phone message only for Phone |
| 18 | `Tab` from the search box to *Place order* | every button and field reachable, in reading order, with a visible focus ring |
| 19 | DevTools → *Network* → *Offline*, reload; then 360, 768 and 1280 px | the page still styled — the framework comes from `npm`, not a CDN; no sideways scroll; products in more than one column at 1280 |
| 20 | Read `src/` | `src/WishlistContext.jsx`; `ProductCard` reads the wishlist through a hook; the saved count and the form errors are **computed**, not kept in `useState` |

Rows 1–3 and 13 are tools; rows 4–10 and 14–19 are the briefs, run by hand;
rows 11 and 20 are the part no test checks — the design. Passing tests is not
the same as meeting the brief.

**React DevTools** (browser extension, *Components* tab) shows each
component's props and state live — the fastest way to answer "where does the
cart live?" for row 11.

## What to tell your assistant

A precise sentence names what you did, what you saw, and the rule from the
brief. Examples of the shape — not of the bugs you will meet:

- *"Row 9: after opening Details on Cap and typing `a`, Socks is open and Cap
  is closed. The list uses the array index as `key`; use `product.id`."*
- *"Row 7: in `out-of-order` mode, typing `sc` shows every product starting
  with `s` after 1.5 s. Abort the previous request in the effect's cleanup."*
- *"Row 3: you changed `checks/catalogue.test.jsx`. Revert it; the checks are
  the spec, not the code."*

"It doesn't work" gives an assistant nothing to go on.

## `REVIEW.md` — what you kept, changed and rejected

The heart of IA#4. For **at least six** things your assistant wrote, one
entry each:

```markdown
### 3. Wishlist provider placed around the header only
- **Where:** commit a1b2c3d, `src/App.jsx` lines 31–33
- **Decision:** changed
- **What decided it:** row 14 — `Saved: 0` in the header after saving Cap
- **Why:** two providers are two wishlists; moved one provider around the whole page
- **Sentence sent:** "Row 14: the header shows Saved: 0 after I save Cap. Use one WishlistProvider around the whole page."
```

- At least one *changed* and one *rejected* — the rest may be *kept*.
- At least one entry each about the context, the form, and the CSS framework
  or another dependency.
- *What decided it* is a row you ran, a check, or a line you read — not
  "it looked right".

## Starter

Shared by two classes: 24KTPM1 and CQ2024/31. Due dates are in each class's
Classroom assignment.
