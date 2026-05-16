# Pending Cross-Agent Signals

> This file is the central inbox for all cross-agent communication.
> Every agent reads this at kickoff. After handling a signal, mark it `[RESOLVED]` — never delete rows.

---

## How to Use

**Writing a signal:**

1. Append a new row to the relevant section below
2. Use the exact signal format defined in `shared-knowledge.md`
3. Set status to `[PENDING]`

**Resolving a signal:**

1. Change status from `[PENDING]` to `[RESOLVED: YYYY-MM-DD]`
2. Add a one-line note on what was done

---

## Signals: Tester → Frontend (id requests)

| Status    | Date       | Signal                                                                                                                                                                                                                                                                                                                          |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PENDING] | 2026-05-13 | 🔖 id Request — Tester → Frontend · Component: LogoutButton (wherever rendered in inventory + trading layouts) · Missing IDs: `id="logoutBtn"` → the logout `<button>` element · Needed for: cypress/e2e/auth/logout.cy.js (32 failures) · Action: Add testId + register in app-constants.yaml under `test_ids.auth.logout_btn` |
| [PENDING] | 2026-05-13 | 🔖 id Request — Tester → Frontend · Component: UserMenu (landing page) · Missing IDs: `id="userMenuTrigger_landingPage"` → the menu trigger element · Needed for: cypress/e2e/auth/logout.cy.js (6 failures) · Action: Add testId + register in app-constants.yaml under `test_ids.auth.user_menu_trigger`                      |

---

## Signals: Tester → Backend (endpoint gaps)

| Status    | Date       | Signal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PENDING] | 2026-05-13 | ⚠️ Custom Command Gap — Tester → Frontend · Missing: `cy.getAuthToken()` not defined in cypress/support/commands.js — causes 9 failures across add/list/delete/update/favorite/stock/history/detail/summary product tests · Missing: `cy.logout()` not defined — causes 1 failure in product-detail-ui · Action: Define both commands in cypress/support/commands.js. `cy.getAuthToken()` should return bearer token from session; `cy.logout()` should clear session and redirect to /login |

---

## Signals: UI/UX → PM (UX gaps)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: UI/UX → Frontend (design handoff)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: Backend → Frontend (API contracts)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: Frontend → Tester (UI ready)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: PM → Any Agent (PRD change impact)

| Status                 | Date       | Target      | Signal                                                                                              |
| ---------------------- | ---------- | ----------- | --------------------------------------------------------------------------------------------------- |
| [RESOLVED: 2026-05-10] | 2026-05-10 | UI/UX Agent | Product List analysis complete. Design review selesai, PRD v1.8 sudah diupdate dengan spec lengkap. |
