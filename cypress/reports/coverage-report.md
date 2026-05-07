# Test Coverage Report

**Last Updated:** 2026-05-07
**App Version:** 1.4
**Scope:** Auth Module (PRD Section 3.3)
**Source:** `cypress/e2e/auth/` — login.cy.js, logout.cy.js, session.cy.js

---

## Coverage Summary

| Module                      | Total Features | Automated | Manual Only | Not Tested | Coverage % |
| --------------------------- | -------------- | --------- | ----------- | ---------- | ---------- |
| 3.3.1 Login Page            | 8              | 7         | 1           | 0          | 87.5%      |
| 3.3.2 Auth Callback         | 3              | 3         | 0           | 0          | 100%       |
| 3.3.3 Logout                | 6              | 6         | 0           | 0          | 100%       |
| 3.3.4 Session Expiry        | 4              | 4         | 0           | 0          | 100%       |
| **Auth Module Total**       | **21**         | **20**    | **1**       | **0**      | **95.2%**  |

> Feature count per module is derived from distinct acceptance criteria / behavior points in PRD 3.3.

---

## Automated Test Cases

| #   | File                             | Test Suite                                                   | Test Cases | Feature Covered (PRD ref)                      |
| --- | -------------------------------- | ------------------------------------------------------------ | ---------- | ---------------------------------------------- |
| 1   | `login.cy.js`                    | Login - API & Authentication                                 | 11         | 3.3.1 — Programmatic auth, redirect unauth, invalid creds, session structure & storage |
| 2   | `login.cy.js`                    | Login Page - Desktop Interactions                            | 3          | 3.3.1 — Login page render, Google button visibility (desktop) |
| 3   | `login.cy.js`                    | Login - Auth Callback - Desktop Interactions                 | 3          | 3.3.2 — no_code redirect, auth_failed redirect (desktop) |
| 4   | `login.cy.js`                    | Login - Session Persistence - Desktop Interactions           | 10         | 3.3.1 — Session persists on reload; 3.3.4 — Protected route guard (9 routes, desktop) |
| 5   | `login.cy.js`                    | Login Page - Mobile Interactions                             | 3          | 3.3.1 — Login page render, Google button (mobile) |
| 6   | `login.cy.js`                    | Login - Auth Callback - Mobile Interactions                  | 3          | 3.3.2 — no_code & auth_failed redirects (mobile) |
| 7   | `login.cy.js`                    | Login - Session Persistence - Mobile Interactions            | 10         | 3.3.1 — Session persistence; 3.3.4 — Protected route guard (9 routes, mobile) |
| 8   | `login.cy.js`                    | Login Page - Tablet Interactions                             | 3          | 3.3.1 — Login page render, Google button (tablet) |
| 9   | `login.cy.js`                    | Login - Auth Callback - Tablet Interactions                  | 3          | 3.3.2 — no_code & auth_failed redirects (tablet) |
| 10  | `login.cy.js`                    | Login - Session Persistence - Tablet Interactions            | 10         | 3.3.1 — Session persistence; 3.3.4 — Protected route guard (9 routes, tablet) |
| 11  | `login.cy.js`                    | Login Page - App Identity & Google Branding - Desktop        | 4          | 3.3.1 — App name, Google button label, aria-label, 4-colour SVG icon |
| 12  | `login.cy.js`                    | Login Page - App Identity & Google Branding - Mobile         | 2          | 3.3.1 — App name & button label on mobile      |
| 13  | `login.cy.js`                    | Login - Middleware ?next= Param Preservation - Desktop       | 4          | 3.3.0 — ?next= preserved in redirect; 3.3.4 — API 401 for unauthenticated |
| 14  | `logout.cy.js`                   | Logout - API Endpoint                                        | 3          | 3.3.3 — POST /api/auth/logout (200 auth'd, 401 unauth'd, GET rejected) |
| 15  | `logout.cy.js`                   | Logout Button - Inventory Layout - Desktop                   | 8          | 3.3.3 — LogoutButton: display, label, aria-label, keyboard, loading state, redirect, error toast, re-enable on failure |
| 16  | `logout.cy.js`                   | Logout Button - Trading Layout - Desktop                     | 5          | 3.3.3 — LogoutButton on trading layout: display, label, aria, loading, redirect |
| 17  | `logout.cy.js`                   | UserMenu - Landing Page - Desktop                            | 9          | 3.3.3 — UserMenu: trigger, avatar/initial, dropdown open, email display, sign out, error toast, keyboard accessible |
| 18  | `logout.cy.js`                   | UserMenu - Landing Page - Mobile                             | 2          | 3.3.3 — UserMenu on mobile: trigger visible, sign out in dropdown |
| 19  | `logout.cy.js`                   | UserMenu - Landing Page - Tablet                             | 2          | 3.3.3 — UserMenu on tablet: trigger visible, email + sign out in dropdown |
| 20  | `logout.cy.js`                   | Logout Button - Inventory Layout - Mobile                    | 2          | 3.3.3 — LogoutButton on inventory (mobile): display & label |
| 21  | `logout.cy.js`                   | Logout Button - Trading Layout - Mobile                      | 2          | 3.3.3 — LogoutButton on trading (mobile): display & label |
| 22  | `logout.cy.js`                   | Logout Button - Inventory Layout - Tablet                    | 1          | 3.3.3 — LogoutButton on inventory (tablet): display |
| 23  | `logout.cy.js`                   | Logout Button - Trading Layout - Tablet                      | 1          | 3.3.3 — LogoutButton on trading (tablet): display |
| 24  | `session.cy.js`                  | Session Expiry - Error Message Display - Desktop             | 4          | 3.3.1 — Error params render login page; no breakage without params |
| 25  | `session.cy.js`                  | Session Expiry - Protected Route Guards - Desktop            | 3          | 3.3.4 — Redirect to login from inventory, trading, landing |
| 26  | `session.cy.js`                  | Session Expiry - Error Message Display - Mobile              | 2          | 3.3.1 — Error params on mobile                 |
| 27  | `session.cy.js`                  | Session Expiry - Error Message Display - Tablet              | 1          | 3.3.1 — session_expired on tablet              |
| 28  | `session.cy.js`                  | Session - Toast Content Verification - Desktop               | 5          | 3.3.1 — Correct toast text per param; 3.3.4 — No session_expired toast on intentional logout |
| 29  | `session.cy.js`                  | Session - API Security - Unauthenticated Requests            | 4          | 3.3.4 — 401 for /api/user, /api/auth/logout, inventory API, trading API |
| 30  | `session.cy.js`                  | Session - Callback Open Redirect Validation                  | 2          | 3.3.2 — Open redirect prevention (external URL, double-slash ?next=) |

**Total automated tests: 126**

---

## Manual Test Cases (not yet automated)

| #   | Feature                                     | Reason Not Automated                                                                        | Priority to Automate |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Google OAuth end-to-end sign-in flow        | Requires interaction with Google's authentication UI (third-party, no programmatic control). Supabase OAuth redirects to google.com — Cypress cannot intercept cross-origin Google login UI. | Low — inherently untestable with E2E tools; covered contractually by Supabase OAuth |
| 2   | Google button loading/disabled state during OAuth redirect | Once the button is clicked for a real OAuth flow, Cypress loses control of the page as it navigates to Google. | Medium — could be partially tested by mocking `signInWithOAuth` |
| 3   | ?next= param end-to-end redirect after successful Google OAuth | Full happy-path test requires a valid Google OAuth code that cannot be replicated in CI without real credentials. Auth callback error paths are already automated; only the success+redirect path is manual. | Medium — requires test user with stable Google credentials or OAuth mock |

---

## Coverage Gap Analysis

Based on a comparison of PRD Section 3.3 requirements against the three test files:

### Fully Automated (no gaps)

- **Auth Callback (3.3.2):** All three acceptance criteria are covered — `no_code` redirect, `auth_failed` redirect, and open redirect prevention via `?next=` validation.
- **Logout (3.3.3):** All acceptance criteria are covered — loading/disabled state, redirect without `reason=session_expired`, error toast on failure, keyboard accessibility. API endpoint validated at 200/401/method levels.
- **Session Expiry (3.3.4):** All acceptance criteria are covered — `?reason=session_expired` redirect, toast content, intentional logout does NOT produce session_expired toast, API returns 401 for unauthenticated requests on all protected endpoints.

### Partial Coverage (manual-only gap)

- **Login Page (3.3.1) — Google OAuth happy path:** The PRD states: _"GIVEN I click Sign in with Google THEN I am redirected to Google OAuth and the button shows loading/disabled state."_ The button loading/disabled state during real OAuth redirect and the successful post-login redirect (via `?next=`) are not automatable because they require the Google OAuth UI. All other acceptance criteria for 3.3.1 are fully automated.

### Recommendations

| Priority | Recommendation |
| -------- | -------------- |
| High     | No critical gaps — all server-side and UI-controllable flows are automated. |
| Medium   | Add a test stub/mock for `signInWithOAuth` to cover the loading/disabled state on the Google button during the OAuth redirect without a real Google session. |
| Medium   | Document the OAuth happy-path as a manual smoke test in the CI checklist for each release. |
| Low      | Consider Playwright with browser storage injection if full OAuth end-to-end coverage becomes a requirement — Cypress's same-origin limitation makes this impractical in the current toolchain. |
