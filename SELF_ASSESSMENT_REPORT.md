# Self-assessment — IA#4

Submitted by: 24120090 — Đặng Hồng Minh

Total I claim: 90 / 100

| Criterion | Max | I claim | Evidence |
|---|---|---|---|
| The session 6 page | 20 | 20 | `npm test`: C1–C11 green; `npm run lint` silent; rows 4–10 and 12 run in Chromium against `npm run dev` (REVIEW.md entries 3 and 4; `src/useProducts.js` lines 14–37, `src/App.jsx` lines 9–17) |
| The wishlist (W1–W5) | 15 | 15 | I1–I3 green; row 14 run (`Saved: 2` survives a search that hides the cards); rows 15 and 20 read: one `<WishlistProvider>` at `src/App.jsx:28`, count is `saved.length` at `src/WishlistContext.jsx:23` (REVIEW.md entries 1 and 8) |
| The checkout form (F1–F5) | 15 | 15 | I4–I8 green; rows 16 and 17 run (three messages on an empty form, then only the phone message, then `Order placed for An: 1 item, 420.000 đ.` with the address bar unchanged); errors computed at `src/components/CheckoutForm.jsx` lines 17–22, no effect syncing them (REVIEW.md entry 2) |
| One CSS framework (C1–C3) | 10 | 10 | `package.json` gains one line (`bootstrap`), `src/main.jsx:3` imports it; row 19 run with every non-localhost request blocked: nothing blocked, page still styled; at 360 / 768 / 1280 px no sideways scroll, no control under 44 px, 1 / 2 / 3 product columns (REVIEW.md entries 5 and 6, commits `fac426b`, `4c1802f`) |
| REVIEW.md | 20 | 14 | 10 entries, each with commit/proposal, lines and the row or check that decided it; three *changed* (entry 6 `ProductList.jsx:5`, entry 8 `WishlistContext.jsx:10–27`, entry 9 `useProducts.js:39–43`), one *rejected* (entry 10, proposed abort guard in `useProducts.js`); entry 7 records a measurement that looked like a bug and was not |
| AI-LOG.md | 10 | 7 | 7 entries in the course format across three sessions (`aa3c131`, `23c4fb3`, `de1dd63`, `fac426b`, `4c1802f`, and two 2026-11-16 review entries); *Changed* and *Rejected* match REVIEW.md: three changed (`4c1802f`, `eefc9b6`, `14054cf`), one rejected (entry 10 proposal) |
| Scope and commit history | 10 | 9 | starter is the first commit (`a537037`); one commit per step; `git diff --stat a537037 HEAD -- checks mock eslint.config.js index.html public vite.config.js` prints nothing (row 3); `package.json` diff shows only the bootstrap line (row 13) |

## What I did not manage

REVIEW.md has one *rejected* entry (entry 10, an unneeded abort guard in `useProducts.js` proposed during review that was rejected after testing showed it was redundant). Entries 6, 8, and 9 were changed during development and review. Entries 6, 8, 9, and 10 have no correction sentence I sent, because the assistant found or proposed those issues during review sessions.

AI-LOG.md was written at the end of chat sessions, not after every individual step, and its entries cover three sessions rather than separate conversations per commit.

I ran the Done means rows with a script in Chromium (`/tmp/rows.py`, not part of the repo) and by reading the code for rows 11, 15 and 20. I did not click through the page by hand on a real phone, and I did not read every line of `src/` aloud the way the oral will ask me to.

## What I would do differently

Write each AI-LOG entry right after its commit, and send the assistant my own sentence for each task instead of one long brief, so that REVIEW.md can quote what I actually asked when something is changed or rejected. Read each diff before committing it and reject something deliberately where the code is worse than what I would write, instead of finishing with a log that says "none" four times.