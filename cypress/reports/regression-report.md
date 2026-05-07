# Regression Testing Report

**Date:** 2026-05-07
**App Version:** 1.4
**Scope:** Auth Module — Login, Logout, Session Expiry
**Tester:** QA Agent

## Summary

| Total Features | Passed | Failed | Pass Rate |
| -------------- | ------ | ------ | --------- |
| 30             | 30     | 0      | 100%      |

> 30 feature suites (describe blocks) across 3 test files. 126 tests total, 0 failures.
> Run duration: login.cy.js 42s · logout.cy.js 47s · session.cy.js 12s · **Total: 1m 42s**

---

## Feature Test Results

### File: `login.cy.js` (70 tests)

| #   | Feature                                                      | Test Type           | Status   | Notes                                       |
| --- | ------------------------------------------------------------ | ------------------- | -------- | ------------------------------------------- |
| 1   | Login - API & Authentication                                 | API / Integration   | ✅ PASS  | Supabase session, token structure, clearAuth |
| 2   | Login Page - Desktop Interactions                            | UI / Functional     | ✅ PASS  | Page render, Google button visibility       |
| 3   | Login - Auth Callback - Desktop Interactions                 | UI / Functional     | ✅ PASS  | no_code & auth_failed redirects (desktop)   |
| 4   | Login - Session Persistence - Desktop Interactions           | UI / Functional     | ✅ PASS  | Persist on reload, redirect 9 protected routes |
| 5   | Login Page - Mobile Interactions                             | UI / Responsive     | ✅ PASS  | Page render & Google button (iphone-x)      |
| 6   | Login - Auth Callback - Mobile Interactions                  | UI / Responsive     | ✅ PASS  | no_code & auth_failed redirects (mobile)    |
| 7   | Login - Session Persistence - Mobile Interactions            | UI / Responsive     | ✅ PASS  | Persist on reload, redirect 9 protected routes |
| 8   | Login Page - Tablet Interactions                             | UI / Responsive     | ✅ PASS  | Page render & Google button (ipad-2)        |
| 9   | Login - Auth Callback - Tablet Interactions                  | UI / Responsive     | ✅ PASS  | no_code & auth_failed redirects (tablet)    |
| 10  | Login - Session Persistence - Tablet Interactions            | UI / Responsive     | ✅ PASS  | Persist on reload, redirect 9 protected routes |
| 11  | Login Page - App Identity & Google Branding - Desktop        | UI / Branding       | ✅ PASS  | App name, button label, aria-label, SVG icon |
| 12  | Login Page - App Identity & Google Branding - Mobile         | UI / Branding       | ✅ PASS  | App name & button label on mobile           |
| 13  | Login - Middleware ?next= Param Preservation - Desktop       | Middleware / API    | ✅ PASS  | ?next= param preserved, API returns 401     |

### File: `logout.cy.js` (35 tests)

| #   | Feature                                                      | Test Type           | Status   | Notes                                        |
| --- | ------------------------------------------------------------ | ------------------- | -------- | -------------------------------------------- |
| 14  | Logout - API Endpoint                                        | API / Integration   | ✅ PASS  | 200 auth'd, 401 unauth'd, GET rejected       |
| 15  | Logout Button - Inventory Layout - Desktop                   | UI / Functional     | ✅ PASS  | Display, label, aria, keyboard, loading, redirect, error toast, re-enable |
| 16  | Logout Button - Trading Layout - Desktop                     | UI / Functional     | ✅ PASS  | Display, label, aria, loading, redirect      |
| 17  | UserMenu - Landing Page - Desktop                            | UI / Functional     | ✅ PASS  | Trigger, avatar, dropdown, email, sign out, error toast, keyboard |
| 18  | UserMenu - Landing Page - Mobile                             | UI / Responsive     | ✅ PASS  | Trigger visible, dropdown sign out           |
| 19  | UserMenu - Landing Page - Tablet                             | UI / Responsive     | ✅ PASS  | Trigger visible, dropdown email + sign out   |
| 20  | Logout Button - Inventory Layout - Mobile                    | UI / Responsive     | ✅ PASS  | Display & label                              |
| 21  | Logout Button - Trading Layout - Mobile                      | UI / Responsive     | ✅ PASS  | Display & label                              |
| 22  | Logout Button - Inventory Layout - Tablet                    | UI / Responsive     | ✅ PASS  | Display                                      |
| 23  | Logout Button - Trading Layout - Tablet                      | UI / Responsive     | ✅ PASS  | Display                                      |

### File: `session.cy.js` (21 tests)

| #   | Feature                                                      | Test Type           | Status   | Notes                                        |
| --- | ------------------------------------------------------------ | ------------------- | -------- | -------------------------------------------- |
| 24  | Session Expiry - Error Message Display - Desktop             | UI / Functional     | ✅ PASS  | session_expired, auth_failed, no_code params |
| 25  | Session Expiry - Protected Route Guards - Desktop            | UI / Functional     | ✅ PASS  | Redirect from inventory, trading, landing    |
| 26  | Session Expiry - Error Message Display - Mobile              | UI / Responsive     | ✅ PASS  | session_expired, auth_failed on mobile       |
| 27  | Session Expiry - Error Message Display - Tablet              | UI / Responsive     | ✅ PASS  | session_expired on tablet                    |
| 28  | Session - Toast Content Verification - Desktop               | UI / Functional     | ✅ PASS  | Toast text per param, no toast on clean login, no session_expired toast on intentional logout |
| 29  | Session - API Security - Unauthenticated Requests            | API / Security      | ✅ PASS  | 401 for /api/user, /api/auth/logout, inventory API, trading API |
| 30  | Session - Callback Open Redirect Validation                  | Security            | ✅ PASS  | External URL and double-slash ?next= rejected |
