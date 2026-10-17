# Tester Agent Memory

Decisions and gotchas only — stable rules live in the agent file and skills. Newest first. Keep under 200 lines.

## Lessons

- 2026-09-05 (#801): Use `beforeEach()`, not `before()`, for `cy.setupApiAuthCookies()`. `testIsolation: true` clears cookies between `it()` blocks, and `apiRequestWithSession` caches "session set" in `Cypress.env(sessionKey)` — with `before()` the first test passes and the rest silently get 401. Same pattern as `settings-api.cy.js` / `analytics-api.cy.js`.
- 2026-09-05 (#801): Supabase `.range(from, to)` past the last row returns `PGRST103 "Requested range not satisfiable"`. Fixed in `getNotifications()` (`lib/services/notification.js`) with a `head: true` count first; watch for the same 500 in other paginated services.
- 2026-06-22: POST `/api/trade/v1/event/create` returns `{ data, message }` (no `success`), unlike fee (`{ success: true, fee }`). Required: `title`, `impact_direction`, `event_date`, `links` (≥1 entry with `hyperlink` + `link`). The list endpoint doesn't select `user_id`.
- 2026-06-20: Nullable aggregate fields (e.g. `ref_band`) — guard with an early return + `cy.log()` before asserting shape. For boxplot data, assert `min <= q1 <= median <= q3 <= max` in one `it()` loop, and cross-check counts (`runs.length === summary.hr_run_count`).
- 2026-06-20: Parallel blocks (pagi/sore) — test both in one `it()` with `[a, b].forEach(...)`, plus cross-block invariants (`pagi.count + sore.count === total_runs`).
- 2026-05-07: Cypress can't load `.yaml` fixtures — tests use `app-constants.json`. The `.yaml` is for humans; always update both.
- 2026-05-07: Reports — propose the report in your plan before writing it; app version comes from the `Version:` header in `.claude/prd/PRD_Shared.md`; `cypress/reports/qa-coverage.md` is cumulative (update/append, never overwrite).

## Known Flaky / Blocked Tests (verify before relying on these — last checked 2026-05-13)

- `cypress/e2e/inventory_management/product/last-price-api.cy.js` — 16/17 tests skipped; first test fails, rest skip. Likely missing fixture data or env var.
- `cypress/e2e/inventory_management/product/product-list-ui.cy.js` — 21 tests consistently skipped (UI tests are out of scope for now).

## Open Bugs Found by QA (last checked 2026-05-13)

- P1 Auth: after reload, session redirects to `/main/inventory` instead of `/main/landing`.
- P1 Product detail: status badge and history sections clipped by `overflow-hidden` — use `.scrollIntoView()` before visibility asserts.
- P1 Add product (mobile): form fields covered by the fixed dialog footer.

## Coverage Gaps

- Auth Google OAuth UI flow — manual only (real Google redirect can't be intercepted). P2.

## Recurring Patterns

- Element clipping in scroll containers — always `.scrollIntoView()` before `be.visible`.
- Missing `id` on interactive components (seen in Auth LogoutButton, UserMenu).
- Custom Cypress commands used before being defined (`getAuthToken`, `logout`).
