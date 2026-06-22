# Tester Agent Memory

> This file is the persistent memory for the Senior QA Engineer Agent.
> Update after every test run, code review cycle, or coverage gap discovery.
> Format: newest entries at the top of each section.

---

## Known Flaky Tests

| Test File                                                      | Test Name          | Failure Pattern                                                                 | Workaround Applied                          |
| -------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------- | ------------------------------------------- |
| cypress/e2e/inventory_management/product/product-list-ui.cy.js | (21 tests skipped) | Likely conditional logic or missing data — 0 failures but 21 skips consistently | Investigate skip conditions before next run |

---

## Persistent Bugs (Not Yet Fixed)

<!-- Bugs found during QA that are not yet resolved — avoid re-reporting them -->

| Date Found | Module                            | Bug Description                                                                                                                           | Priority | Status |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| 2026-05-13 | Auth — login.cy.js                | Session persistence redirect bug — after reload, redirects to `/main/inventory` instead of `/main/landing`                                | P1       | Open   |
| 2026-05-13 | Product — product-detail-ui.cy.js | Element visibility clipping — status badge, purchase history, usage history elements clipped by overflow-hidden; need `.scrollIntoView()` | P1       | Open   |
| 2026-05-13 | Product — add-product.cy.js       | Mobile dialog form overflow — form fields covered by dialog footer (position: fixed) on mobile viewports                                  | P1       | Open   |

---

## Coverage Gaps

| Module | Feature              | Coverage Status | Reason                                                                         | Priority to Automate |
| ------ | -------------------- | --------------- | ------------------------------------------------------------------------------ | -------------------- |
| Auth   | Google OAuth UI Flow | Manual only     | Requires real Google OAuth browser redirect — cannot be intercepted in Cypress | P2                   |

---

## Blocked Tests

| Test File                                                     | Blocked By                      | Notes                                                                                                                                                      |
| ------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cypress/e2e/inventory_management/product/last-price-api.cy.js | Unknown setup/environment issue | 16/17 tests skipped consistently. First test fails, rest are skipped. Likely missing fixture data or env variable. Investigate test setup before next run. |

---

## Regression Patterns

<!-- Classes of bugs that keep appearing across modules — signals a systemic gap -->

- 2026-05-13: **Element visibility clipping** — elements inside scrollable containers assert `be.visible` but fail because they are clipped by CSS overflow. Seen in product-detail-ui (status badge, purchase/usage history) and add-product (mobile dialog). Fix pattern: always add `.scrollIntoView()` before visibility assertions on elements inside containers.

---

## Code Review Recurring Findings

| Category | Finding                                                                   | Module                        | Frequency                         |
| -------- | ------------------------------------------------------------------------- | ----------------------------- | --------------------------------- |
| Testing  | Missing `id` on interactive components                                    | Auth (LogoutButton, UserMenu) | 2 components in v1.11             |
| Testing  | Custom Cypress commands used before being defined                         | Product module                | 2 commands (getAuthToken, logout) |
| UI       | Mobile viewport dialog overflow — form fields hidden behind sticky footer | Product module                | Multiple forms                    |

---

## Lessons Learned

- 2026-06-22: **Event create response shape** — POST `/api/trade/v1/event/create` returns `{ data: newEvent, message }` (no top-level `success` field), unlike fee which returns `{ success: true, fee }`. Required fields: `title`, `impact_direction`, `event_date`, `links` (array with at least 1 entry with `hyperlink` + `link`). Tests that seed via `AddEvent` must include all required fields or get 400. The list endpoint (`getEventList`) does NOT include `user_id` in the selected fields — items only have: `id, title, event_date, impact_direction, actual_outcome, tags, links, event_description`.
- 2026-06-20: **Temperature-efficiency test pattern** — when an endpoint returns a nullable aggregate field (`ref_band`), always guard with an early return + `cy.log()` before asserting shape. For boxplot-style data (q1/median/q3/min/max), test ordering invariant `min <= q1 <= median <= q3 <= max` in a single `it()` loop rather than separate assertions per percentile. Cross-check `runs.length === summary.hr_run_count` and `morning.count + evening.count === hr_run_count` as invariant guards.
- 2026-06-20: **Session-profile test pattern** — when an endpoint returns parallel blocks (pagi/sore), test both blocks in the same `it()` using `[res.body.pagi, res.body.sore].forEach(block => ...)` rather than writing duplicate describe blocks. Also test cross-block invariants (pagi.count + sore.count === total_runs, threshold.pagi_re_count === pagi.relative_effort_count) in dedicated `it()` assertions — they catch service-layer bugs that shape checks alone miss.
- 2026-05-14: **Regression run workflow** — `npm run cy:regression` (defined in package.json, runs `cypress/run-regression.mjs`) runs 4 groups headless with live output + saves to `cypress/reports/logs/{group}.log`. Then `! npm run cy:summary` (runs `cypress/parse-results.js`) sends compact markdown into Claude conversation. Use this to update all 3 reports. Never estimate pass/fail — wait for actual output.
- 2026-05-07: Cypress tidak support `.yaml` sebagai fixture format — `cy.fixture('app-constants')` akan gagal jika file-nya `.yaml`. File yang dipakai adalah `app-constants.json`. File `.yaml` tetap ada tapi hanya untuk human readability — selalu update keduanya jika ada perubahan constants.
- 2026-05-07: Report conventions yang disepakati user — (1) selalu tanya dulu sebelum buat report; (2) app version diambil dari `.claude/prd/PRD_Shared.md` header `Version:` field; (3) `coverage-report.md` bersifat kumulatif — jangan overwrite, hanya update/append.

---

## Cross-Agent Signals

| Date | To Agent | Finding         | Severity | Resolution |
| ---- | -------- | --------------- | -------- | ---------- |
| —    | —        | No open signals | —        | —          |
