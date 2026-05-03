# Test Coverage Report
**Date:** 2026-05-03
**Module:** Authentication (Login, Logout, Session)

---

## Coverage Summary
| Module | Total Features | Automated | Manual Only | Not Tested | Coverage % |
|--------|---------------|-----------|-------------|------------|------------|
| Login — Google OAuth flow | 6 | 6 | 0 | 0 | **100%** |
| Login — Page UI & Branding | 5 | 5 | 0 | 0 | **100%** |
| Login — Auth Callback | 3 | 3 | 0 | 0 | **100%** |
| Login — ?next= Preservation | 4 | 4 | 0 | 0 | **100%** |
| Logout — API Endpoint | 3 | 3 | 0 | 0 | **100%** |
| Logout — LogoutButton UI | 8 | 8 | 0 | 0 | **100%** |
| Logout — UserMenu (Landing) | 9 | 9 | 0 | 0 | **100%** |
| Session — Toast Content | 5 | 5 | 0 | 0 | **100%** |
| Session — Route Guards | 10 | 10 | 0 | 0 | **100%** |
| Session — API Security | 4 | 4 | 0 | 0 | **100%** |
| Session — Open Redirect | 2 | 2 | 0 | 0 | **100%** |
| **TOTAL** | **59** | **59** | **0** | **0** | **100%** |

---

## Automated Test Cases

| # | File | Describe Block | Test Count | Feature Covered |
|---|------|----------------|------------|-----------------|
| 1 | `logout.cy.js` | Logout - API Endpoint | 3 | POST /api/auth/logout auth guard, method guard |
| 2 | `logout.cy.js` | Logout Button - Inventory Layout - Desktop | 8 | Label, aria-label, keyboard, loading state, redirect, error toast, re-enable |
| 3 | `logout.cy.js` | Logout Button - Trading Layout - Desktop | 5 | Label, aria-label, loading, redirect |
| 4 | `logout.cy.js` | UserMenu - Landing Page - Desktop | 9 | Trigger, avatar, dropdown, email, sign out, redirect, error toast, keyboard |
| 5 | `logout.cy.js` | UserMenu - Landing Page - Mobile | 2 | Trigger visible, sign out in dropdown |
| 6 | `logout.cy.js` | UserMenu - Landing Page - Tablet | 2 | Trigger visible, email + sign out |
| 7 | `logout.cy.js` | Logout Button - Mobile/Tablet (Inventory & Trading) | 6 | Visibility dan label di semua viewport |
| 8 | `login.cy.js` | Login - API & Authentication | 10 | Programmatic auth, session structure, token expiry, localStorage |
| 9 | `login.cy.js` | Login Page - Desktop/Mobile/Tablet Interactions | 9 | UI elements, Google button, SVG icon |
| 10 | `login.cy.js` | Login - Auth Callback (Desktop/Mobile/Tablet) | 9 | no_code, auth_failed redirect per viewport |
| 11 | `login.cy.js` | Login - Session Persistence (Desktop/Mobile/Tablet) | 30 | Redirect ke /login dari semua protected routes per viewport |
| 12 | `login.cy.js` | Login Page - App Identity & Google Branding | 6 | "Personal Management" text, SVG paths, aria-label |
| 13 | `login.cy.js` | Login - Middleware ?next= Param Preservation | 4 | ?next= di URL, API returns 401 (bukan redirect) |
| 14 | `session.cy.js` | Session Expiry - Error Message Display | 7 | Login page visible saat error/reason params ada |
| 15 | `session.cy.js` | Session Expiry - Protected Route Guards | 3 | Redirect dari inventory, trading, landing |
| 16 | `session.cy.js` | Session - Toast Content Verification | 5 | Toast text eksak untuk semua error cases |
| 17 | `session.cy.js` | Session - API Security | 4 | 401 untuk semua unauth API calls |
| 18 | `session.cy.js` | Session - Callback Open Redirect Validation | 2 | External URL dan // prefix di ?next= param |

---

## Manual Test Cases (tidak di-automate)

| # | Feature | Alasan Tidak Di-automate | Priority |
|---|---------|--------------------------|----------|
| 1 | Google OAuth UI redirect (real browser flow) | Membutuhkan real Google account & network — tidak bisa di-mock secara end-to-end | P3 — tidak perlu automate |
| 2 | Google button loading state → redirect ke Google | State transient, hilang setelah redirect ke Google's domain | P3 |
| 3 | Open redirect validation saat code valid tapi `?next=` berbahaya | Membutuhkan valid OAuth code — tidak bisa di-fake di Cypress | P3 — sudah di-cover oleh code review |

---

## Baru Ditambahkan di Sesi Ini (vs sebelumnya)

| File | Test Baru | Alasan Ditambahkan |
|------|-----------|-------------------|
| `logout.cy.js` | Label "Sign out", aria-label baru, "Signing out..." loading text | Fix stale test dari perubahan copy text |
| `logout.cy.js` | Redirect ke /login setelah logout berhasil | Belum pernah ditest sebelumnya |
| `logout.cy.js` | Error toast saat API gagal (500) | Belum pernah ditest sebelumnya |
| `logout.cy.js` | Button kembali enabled setelah gagal | Belum pernah ditest sebelumnya |
| `logout.cy.js` | Semua test UserMenu (9 test) | Komponen baru — 0% coverage sebelumnya |
| `login.cy.js` | Fix "Continue with Google" → "Sign in with Google" | Stale assertion |
| `login.cy.js` | App identity "Personal Management" | Fitur baru — 0% coverage sebelumnya |
| `login.cy.js` | Google SVG 4-warna, aria-label | Fitur baru |
| `login.cy.js` | ?next= param di URL saat redirect | Bug yang baru diperbaiki — belum ada test |
| `login.cy.js` | API return 401 JSON (bukan redirect) | Security test baru |
| `session.cy.js` | Toast content verification (3 cases) | Sebelumnya hanya cek loginPage visible, bukan teks toast |
| `session.cy.js` | No toast saat /login tanpa params | Edge case baru |
| `session.cy.js` | No "session expired" toast saat intentional logout | Bug yang baru diperbaiki — belum ada test |
| `session.cy.js` | API Security (4 test) | 0% coverage sebelumnya |
| `session.cy.js` | Open redirect validation (2 test) | Security test baru |
