# IA#4 - React and a CSS Framework, with a Review (Rubric)

**CSC13008 Individual Assignment (3% of the course - 100 points)**

Start from the IA#4 starter zip attached to this assignment. Build the shop page of `brief.md` (session 6) and the three parts of `brief-ia4.md`: a wishlist through a context, a checkout form, one CSS framework with your assistant. Then show, in `REVIEW.md`, what it wrote that you kept, changed or rejected, and what decided each one.

Use your assistant. Nothing here asks you to type code yourself: it scores what the page does, what you checked, and what you decided.

---

## What is Scored

| # | Criterion | Points |
|---|---|---|
| 1 | The session 6 page (`brief.md`) | 20 |
| 2 | The wishlist (`brief-ia4.md` W1-W5) | 15 |
| 3 | The checkout form (`brief-ia4.md` F1-F5) | 15 |
| 4 | One CSS framework (`brief-ia4.md` C1-C3) | 10 |
| 5 | `REVIEW.md` | 20 |
| 6 | `AI-LOG.md` | 10 |
| 7 | Scope and commit history | 10 |

Criteria 1-4 are marked by running your page: the starter's own checks / yours first, so an edited check changes nothing - then the *Done means* rows by hand, in Chromium, with the network to anything but localhost blocked.

---

### 1. The session 6 page (20 points)

| Points | What it looks like |
|---|---|
| **18-20** | All 11 session 6 checks pass, lint is silent, and *Done means* rows 4-12 pass by hand including row 7 (out-of-order), row 9 (Details after a search) and row 10 (the cart keeps a hidden product). |
| **12-17** | One row fails by hand although the checks pass, or one check fails. |
| **5-11** | Several rows or checks fail. |
| **0-4** | The page does not load or `npm test` does not run. |

---

### 2. The wishlist (15 points)

| Points | What it looks like |
|---|---|
| **14-15** | Checks 11-13 pass. Row 14 passes. Reading `src/` (row 20): the wishlist lives in `src/WishlistContext.jsx` with one provider for the page, `ProductCard` reads it through a hook, the count is computed. |
| **9-13** | The checks pass but the design slips: the wishlist reaches the cards through props, or the count is kept in `useState`. |
| **4-8** | One of 11-13 fails—usually 13: the saved state lives in each card and is lost when the search hides it. |
| **0-3** | No wishlist, or two providers that disagree. |

---

### 3. The checkout form (15 points)

| Points | What it looks like |
|---|---|
| **14-15** | Checks 14-18 pass. Rows 16-18 pass: no reload and nothing in the address bar, one message per field after the first try, every field and button reachable with Tab. The errors are computed from the fields (row 20). |
| **9-13** | The checks pass, but the errors live in a second copy of state kept in sync by an effect, or a message is not tied to its field when you Tab to it. |
| **4-8** | One of 14-18 fails—typically an empty phone accepted, or messages shown before the first try. |
| **0-3** | No form, or submitting reloads the page. |

---

### 4. One CSS framework (10 points)

| Points | What it looks like |
|---|---|
| **9-10** | Exactly one CSS framework in `package.json`, imported from `node_modules`. Row 19 passes: styled with the network off; at 360, 768 and 1280 px no sideways scroll, nothing cut off, buttons at least 44 px tall, products in more than one column at 1280. Labels are still `<label>`, buttons still `<button>`. |
| **5-8** | One or two flaws: a button under 44 px, a small sideways scroll at 360, one column at 1280. |
| **1-4** | The framework loads from a CDN (the page is unstyled offline), or two frameworks. |
| **0** | No framework. |

---

### 5. REVIEW.md (20 points)

At least six entries, in the shape the starter's `README.md` shows: where (commit and file lines), decision (kept, changed or rejected), what decided it (a Done means row, a check, or a line you read), why, and the sentence you sent when you changed or rejected something.

| Points | What it looks like |
|---|---|
| **18-20** | Six or more entries, each tied to a commit and lines that exist. At least one changed and one rejected. At least one entry each about the context, the form, and the framework or a dependency. Every decision rests on something run or read and the code in the zip matches what the review says was done. |
| **12-17** | Six entries, but some decisions rest on "looks fine", or one of the three areas is missing. |
| **5-11** | Fewer than six entries, or entries that describe the code without a decision. |
| **0-4** | Missing, or contradicted by the code or the history. |

*An assistant that got everything right is a fine result - then the entries are kept, each with the row that showed it was right.*

---

### 6. AI-LOG.md (10 points)

| Points | What it looks like |
|---|---|
| **9-10** | One entry per request: the tool, the request, the result. Changed and Rejected match `REVIEW.md`. |
| **5-8** | Honest, but Changed/Rejected say "none" everywhere or stay vague. |
| **1-4** | One entry for everything, or clearly written after the fact. |
| **0** | Missing, or contradicted by the history. |

---

### 7. Scope and commit history (10 points)

| Points | What it looks like |
|---|---|
| **9-10** | The untouched starter is the first commit. A commit before each request to the assistant, so each of its changes is its own diff. Row 3 prints nothing; `vite.config.js` gained at most the framework's plugin line; `package.json` gained only the framework (and a form library, if you chose one). |
| **5-8** | Starter commit present, but several parts share one commit. |
| **0-4** | One commit with everything, no `.git` in the zip, or a check, `mock/` or `eslint.config.js` changed. |

*A history split or rebuilt after the work was finished does not count as one commit per part; it scores at the level for commits that mix several parts.*

---

## How to Submit

Zip your IA#4 folder including its hidden `.git` folder, without `node_modules/` and `dist/`.

At the top of the folder: `REVIEW.md`, `AI-LOG.md` and `SELF_ASSESSMENT_REPORT.md`. All written files in English. Name the zip after your student ID and the total you give yourself:  
`<StudentID>_<total>.zip`, for example `24127001_82.zip`

### Deadlines:
- **24KTPM1:** Monday, November 16, 2026, 22:00
- **CQ2024/31:** Wednesday, November 18, 2026, 22:00

The zip must contain `SELF_ASSESSMENT_REPORT.md`: one row per criterion in this rubric, the marks you claim, and evidence pointing at a file, a row, a check or a commit plus a short *what I did not manage*. The total in that table is the number in the file name. Template in Course documents on Classroom.

*A wrong file name costs no marks but delays your result—the grading script matches submissions to the class list by that name.*

Turn in from your `<StudentID>@student.hcmus.edu.vn` Google account.

---

## Honesty Adjustment

Your self-assessment is compared with the mark you actually earn. The gap is **your total − the mark**, on the same 100-point scale.

| Gap | Adjustment |
|---|---|
| **within ±10** | None (this is normal calibration) |
| **+11 to +20** | -3 |
| **+21 to +30** | -6 |
| **more than +30** | -10 |
| **-21 or worse** | -3 (read the rubric before you score yourself down) |
| **no SELF_ASSESSMENT_REPORT.md** | -10, and the file-name total is ignored |

A criterion you claim with no evidence line counts as claimed-and-not-done for this comparison.

The adjustment never takes a submission below 0.

---

## Notes

- Run the whole *Done means* table yourself before you score criteria 1-4. The marking runs the same rows.
- You may be asked to explain any line in class including lines your assistant wrote.
- Explaining what a line does and how you checked it is enough; nobody will ask you to write it from memory.