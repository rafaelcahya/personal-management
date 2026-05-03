# Regression Testing Report
**Date:** 2026-05-03
**Scope:** Authentication Module — Login, Logout, Session Expiry
**Tester:** QA Agent

---

## Summary
| Total Test Cases | Passed | Failed | Pass Rate |
|-----------------|--------|--------|-----------|
| 126 | 126 | 0 | **100%** |

---

## Spec Results
| # | Spec File | Tests | Passed | Failed | Duration |
|---|-----------|-------|--------|--------|----------|
| 1 | `logout.cy.js` | 35 | 35 | 0 | 53s |
| 2 | `login.cy.js` | 70 | 70 | 0 | 45s |
| 3 | `session.cy.js` | 21 | 21 | 0 | 13s |

---

## Feature Test Results

### Logout — API Endpoint
| # | Test | Type | Status |
|---|------|------|--------|
| 1 | POST /api/auth/logout returns 200 when authenticated | Auto | ✅ PASS |
| 2 | POST /api/auth/logout returns 401 when unauthenticated | Auto | ✅ PASS |
| 3 | GET /api/auth/logout tidak diterima (method guard) | Auto | ✅ PASS |

### Logout Button — Inventory & Trading Layout
| # | Test | Viewport | Status |
|---|------|----------|--------|
| 4 | LogoutButton visible di inventory | Desktop | ✅ PASS |
| 5 | Label "Sign out" benar | Desktop | ✅ PASS |
| 6 | aria-label "Sign out from application" | Desktop | ✅ PASS |
| 7 | Keyboard accessible (Tab + focus) | Desktop | ✅ PASS |
| 8 | Loading state "Signing out..." saat API pending | Desktop | ✅ PASS |
| 9 | Redirect ke /login setelah logout berhasil | Desktop | ✅ PASS |
| 10 | Toast error saat API gagal (500) | Desktop | ✅ PASS |
| 11 | Button kembali enabled setelah logout gagal | Desktop | ✅ PASS |
| 12 | LogoutButton visible di trading | Desktop | ✅ PASS |
| 13 | Label, aria-label, loading state (trading) | Desktop | ✅ PASS |
| 14 | Redirect ke /login setelah logout (trading) | Desktop | ✅ PASS |
| 15 | LogoutButton visible + label (inventory) | Mobile | ✅ PASS |
| 16 | LogoutButton visible + label (trading) | Mobile | ✅ PASS |
| 17 | LogoutButton visible (inventory, trading) | Tablet | ✅ PASS |

### UserMenu — Landing Page
| # | Test | Viewport | Status |
|---|------|----------|--------|
| 18 | UserMenu trigger button visible | Desktop | ✅ PASS |
| 19 | aria-label "User menu" pada trigger | Desktop | ✅ PASS |
| 20 | Avatar / inisial tampil di trigger | Desktop | ✅ PASS |
| 21 | Dropdown terbuka saat di-klik | Desktop | ✅ PASS |
| 22 | Email user tampil di dropdown | Desktop | ✅ PASS |
| 23 | Opsi "Sign out" tampil di dropdown | Desktop | ✅ PASS |
| 24 | Redirect ke /login setelah sign out dari UserMenu | Desktop | ✅ PASS |
| 25 | Toast error saat sign out gagal dari UserMenu | Desktop | ✅ PASS |
| 26 | Keyboard accessible (Enter membuka dropdown) | Desktop | ✅ PASS |
| 27 | UserMenu visible + dropdown buka (mobile) | Mobile | ✅ PASS |
| 28 | UserMenu visible + email + sign out (tablet) | Tablet | ✅ PASS |

### Login — API & Session
| # | Test | Status |
|---|------|--------|
| 29 | Autentikasi programatik via Supabase API | ✅ PASS |
| 30 | Unauthenticated user redirect ke /login | ✅ PASS |
| 31 | Root '/' redirect ke /login saat unauthenticated | ✅ PASS |
| 32 | Login dengan credentials invalid → session null | ✅ PASS |
| 33 | Session structure valid (access_token, refresh_token, user) | ✅ PASS |
| 34 | Token tidak expired | ✅ PASS |
| 35 | Session email sesuai TEST_EMAIL | ✅ PASS |
| 36 | Session tersimpan di localStorage | ✅ PASS |
| 37 | clearAuth membersihkan localStorage | ✅ PASS |
| 38 | Bypass cookie mengizinkan akses protected route | ✅ PASS |
| 39 | Authenticated user di '/' redirect ke /main/landing | ✅ PASS |
| 40 | Access token valid (string, panjang > 100) | ✅ PASS |

### Login Page — UI & Branding
| # | Test | Viewport | Status |
|---|------|----------|--------|
| 41 | App identity "Personal Management" tampil | Desktop | ✅ PASS |
| 42 | Google button label "Sign in with Google" | Desktop | ✅ PASS |
| 43 | aria-label Google button sesuai | Desktop | ✅ PASS |
| 44 | SVG Google 4-warna (≥ 4 paths) | Desktop | ✅ PASS |
| 45 | App identity & button label (mobile) | Mobile | ✅ PASS |
| 46 | UI elements tampil (desktop/mobile/tablet) | All | ✅ PASS |

### Login — Auth Callback
| # | Test | Viewport | Status |
|---|------|----------|--------|
| 47 | Callback tanpa code → /login?error=no_code | Desktop | ✅ PASS |
| 48 | Callback dengan invalid code → /login?error=auth_failed | Desktop | ✅ PASS |
| 49 | Callback tests (mobile, tablet) | Mobile/Tablet | ✅ PASS |

### Login — ?next= Param Preservation (Middleware)
| # | Test | Status |
|---|------|--------|
| 50 | Redirect dari inventory menyertakan ?next= | ✅ PASS |
| 51 | Redirect dari trading menyertakan ?next= | ✅ PASS |
| 52 | Redirect dari landing menyertakan ?next= | ✅ PASS |
| 53 | Unauthenticated API request return 401 JSON (bukan redirect) | ✅ PASS |

### Session — Toast Content
| # | Test | Status |
|---|------|--------|
| 54 | ?reason=session_expired → toast "You've been signed out" | ✅ PASS |
| 55 | ?error=auth_failed → toast "Login failed" | ✅ PASS |
| 56 | ?error=no_code → toast "Invalid login attempt" | ✅ PASS |
| 57 | Tidak ada toast saat /login tanpa params | ✅ PASS |
| 58 | Tidak ada "session expired" toast saat intentional logout | ✅ PASS |

### Session — API Security
| # | Test | Status |
|---|------|--------|
| 59 | GET /api/user → 401 tanpa auth | ✅ PASS |
| 60 | POST /api/auth/logout → 401 tanpa auth | ✅ PASS |
| 61 | GET /api/inventory/v1/get-products → 401 tanpa auth | ✅ PASS |
| 62 | GET /api/trade/v1/get-trades → 401 tanpa auth | ✅ PASS |

### Session — Open Redirect Validation
| # | Test | Status |
|---|------|--------|
| 63 | ?next=https://evil.com tanpa code → /login?error=no_code | ✅ PASS |
| 64 | ?next=//evil.com tanpa code → /login?error=no_code | ✅ PASS |

---

## Notes
- Semua test dijalankan headless dengan Cypress 15.11.0 + Electron 138
- Bypass mode (`cypress-bypass` cookie) digunakan untuk UI tests — tidak membutuhkan real OAuth flow
- Test intentional logout (`should NOT show 'session expired' toast`) menggunakan URL assertion sebagai primary signal + text check sebagai secondary, karena bypass mode tidak membuat real Supabase session sehingga Supabase client bisa emit event tak terduga
