# Regression Testing Report

**Date:** 2026-05-09 (Run #3 — Final)
**App Version:** 1.6.1
**Scope:** Inventory Dashboard UI — Summary Cards block expanded (12 new tests) + Mobile Responsiveness (12 tests) + scrollIntoView fix
**Tester:** QA Agent

## Summary

| Total Tests | Passed | Failed | Pass Rate |
| ----------- | ------ | ------ | --------- |
| 88          | 88     | 0      | 100%      |

## Feature Test Results

| #   | Feature                                    | Test Type | Tests | Passed | Failed | Status     |
| --- | ------------------------------------------ | --------- | ----- | ------ | ------ | ---------- |
| 1   | Dashboard UI — Page Load                   | Auto      | 3     | 3      | 0      | ✅ PASS    |
| 2   | Dashboard UI — Summary Cards               | Auto      | 14    | 14     | 0      | ✅ PASS    |
| 3   | Dashboard UI — Spend Comparison            | Auto      | 6     | 6      | 0      | ✅ PASS    |
| 4   | Dashboard UI — Most Restocked              | Auto      | 5     | 5      | 0      | ✅ PASS    |
| 5   | Dashboard UI — Cost Per Use                | Auto      | 5     | 5      | 0      | ✅ PASS    |
| 6   | Dashboard UI — Low Stock Alert             | Auto      | 6     | 6      | 0      | ✅ PASS    |
| 7   | Dashboard UI — Monthly Spend by Type       | Auto      | 8     | 8      | 0      | ✅ PASS    |
| 8   | Dashboard UI — Avg Cost/Use Over Time      | Auto      | 4     | 4      | 0      | ✅ PASS    |
| 9   | Dashboard UI — Average Usage Duration      | Auto      | 4     | 4      | 0      | ✅ PASS    |
| 10  | Dashboard UI — Restock Prediction          | Auto      | 5     | 5      | 0      | ✅ PASS    |
| 11  | Dashboard UI — Monthly Budget Tracker      | Auto      | 5     | 5      | 0      | ✅ PASS    |
| 12  | Dashboard UI — Spending Heatmap            | Auto      | 3     | 3      | 0      | ✅ PASS    |
| 13  | Dashboard UI — Product Lifecycle Score     | Auto      | 4     | 4      | 0      | ✅ PASS    |
| 14  | Dashboard UI — Loading States              | Auto      | 1     | 1      | 0      | ✅ PASS    |
| 15  | Dashboard UI — API Error Handling          | Auto      | 1     | 1      | 0      | ✅ PASS    |
| 16  | Dashboard UI — Mobile Responsiveness       | Auto      | 12    | 12     | 0      | ✅ PASS    |
| 17  | Dashboard UI — Layout & Responsive         | Auto      | 2     | 2      | 0      | ✅ PASS    |

**Total: 88/88 passing (100%)**

## Failed Test Details

Tidak ada kegagalan pada Run #3.

---

## Changes Since Last Regression Run

### Run #2 → Run #3 (2026-05-09 — scrollIntoView fix)

- **Root cause ditemukan:** Cypress menganggap elemen di dalam `overflow-y: auto` scroll container sebagai "not visible" jika berada di bawah viewport fold — bukan bug layout, melainkan perilaku default Cypress
- **Fix diterapkan:** Tambah `.scrollIntoView()` sebelum setiap `.should('be.visible')` pada semua section yang memerlukan scroll (Most Restocked ke bawah)
- **Bonus fix:** Text mismatch pada section "Avg Usage Duration" — komponen me-render `"Average Usage Duration"` bukan `"Avg Usage Duration"`, test dikoreksi
- **Result:** 88/88 pass ✅

### Run #1 → Run #2 (2026-05-09 — layout fix attempt)

- **Fix dicoba:** Hapus `overflow-hidden` dari `app/main/layout.jsx` outer div
- **Result:** Tidak berpengaruh — 51 failures tetap. Root cause bukan di layout

### Run #1 (2026-05-09 — initial run)

- **Ditambahkan:** 12 test baru di Summary Cards (Low Stock, sub-label, localStorage, navigasi, aria-hidden, keyboard)
- **Ditambahkan:** Mobile Responsiveness suite (12 tests)
- **Result:** 37/88 pass (42%) — 51 failure akibat Cypress visibility clipping

## Recommendation

Tidak ada issue aktif. Suite berjalan bersih 100%.

Untuk run berikutnya, pertimbangkan menambahkan test untuk:
- PageHeader breadcrumbs (komponen baru yang ditambahkan di semua halaman)
- SummaryCards keyboard navigation (Tab + Enter triggers navigation)
