# Regression Testing Report

**Date:** 2026-05-08
**App Version:** 1.4
**Scope:** Landing Page
**Tester:** QA Agent

## Summary

| Total Features | Passed | Failed | Pass Rate |
| -------------- | ------ | ------ | --------- |
| 33             | 33     | 0      | 100%      |

## Feature Test Results

| #   | Feature                                          | Test Type | Status  | Notes                                      |
| --- | ------------------------------------------------ | --------- | ------- | ------------------------------------------ |
| 1   | Display user greeting with correct name          | Auto      | ✅ PASS | Reads first name from session metadata     |
| 2   | Display trade management card                    | Auto      | ✅ PASS | -                                          |
| 3   | Display inventory management card                | Auto      | ✅ PASS | -                                          |
| 4   | Navigate to Trading Dashboard via Trade button   | Auto      | ✅ PASS | -                                          |
| 5   | Navigate to Inventory List via Inventory button  | Auto      | ✅ PASS | -                                          |
| 6   | Responsive layout - mobile (iphone-x)            | Auto      | ✅ PASS | -                                          |
| 7   | Responsive layout - tablet (ipad-2)              | Auto      | ✅ PASS | -                                          |
| 8   | Responsive layout - desktop (1920x1080)          | Auto      | ✅ PASS | -                                          |
| 9   | User greeting correct name - mobile              | Auto      | ✅ PASS | -                                          |
| 10  | Navigate to Trading Dashboard - mobile           | Auto      | ✅ PASS | -                                          |
| 11  | Navigate to Inventory List - mobile              | Auto      | ✅ PASS | -                                          |
| 12  | User greeting correct name - tablet              | Auto      | ✅ PASS | -                                          |
| 13  | Navigate to Trading Dashboard - tablet           | Auto      | ✅ PASS | -                                          |
| 14  | Navigate to Inventory List - tablet              | Auto      | ✅ PASS | -                                          |
| 15  | User greeting correct name - desktop             | Auto      | ✅ PASS | -                                          |
| 16  | Navigate to Trading Dashboard - desktop          | Auto      | ✅ PASS | -                                          |
| 17  | Navigate to Inventory List - desktop             | Auto      | ✅ PASS | -                                          |
| 18  | User menu trigger visible                        | Auto      | ✅ PASS | -                                          |
| 19  | User menu opens on trigger click                 | Auto      | ✅ PASS | Shows email + sign out item                |
| 20  | User menu displays correct email                 | Auto      | ✅ PASS | Matches session user email                 |
| 21  | Logout via user menu sign out                    | Auto      | ✅ PASS | Requires real Supabase session cookie      |
| 22  | User menu trigger visible - mobile               | Auto      | ✅ PASS | -                                          |
| 23  | User menu opens on trigger click - mobile        | Auto      | ✅ PASS | -                                          |
| 24  | User menu displays correct email - mobile        | Auto      | ✅ PASS | -                                          |
| 25  | Logout via user menu sign out - mobile           | Auto      | ✅ PASS | Uses clearApiAuthCache to refresh token    |
| 26  | User menu trigger visible - tablet               | Auto      | ✅ PASS | -                                          |
| 27  | User menu opens on trigger click - tablet        | Auto      | ✅ PASS | -                                          |
| 28  | User menu displays correct email - tablet        | Auto      | ✅ PASS | -                                          |
| 29  | Logout via user menu sign out - tablet           | Auto      | ✅ PASS | Uses clearApiAuthCache to refresh token    |
| 30  | User menu trigger visible - desktop              | Auto      | ✅ PASS | -                                          |
| 31  | User menu opens on trigger click - desktop       | Auto      | ✅ PASS | -                                          |
| 32  | User menu displays correct email - desktop       | Auto      | ✅ PASS | -                                          |
| 33  | Logout via user menu sign out - desktop          | Auto      | ✅ PASS | Uses clearApiAuthCache to refresh token    |

## Failed Test Details

_None — all 33 tests passed._

## Notes & Findings During Run

- `#logoutBtn` tidak ada di DOM. Landing page hanya menggunakan `UserMenu` component (`#userMenuTrigger_landingPage`) untuk logout. `logout_btn_el` di `app-constants.json` adalah sisa konfigurasi lama yang tidak digunakan.
- `/api/auth/logout` memerlukan real Supabase session cookie (`sb-{ref}-auth-token`). Test yang menguji logout via UI harus memanggil `cy.setupApiAuthCookies()` setelah `cy.loginWithBypass()`.
- Token Supabase yang sudah di-revoke (setelah sign out) masih tersimpan di `cachedSession` module-level di `api-commands.js`. Ditangani dengan command baru `cy.clearApiAuthCache()`.
