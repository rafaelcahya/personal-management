# Regression Testing Report

**Date:** 2026-05-08
**App Version:** 1.4
**Scope:** Auth - Logout (`logout.cy.js`)
**Tester:** QA Agent

## Summary

| Total Features | Passed | Failed | Pass Rate |
| -------------- | ------ | ------ | --------- |
| 11             | 11     | 0      | 100%      |

## Feature Test Results

| #   | Feature                                        | Test Type | Status  | Notes                      |
| --- | ---------------------------------------------- | --------- | ------- | -------------------------- |
| 1   | Logout - API Endpoint (200 auth, 401 unauth)   | Auto      | ✅ PASS | 3 test cases               |
| 2   | Logout Button - Inventory Layout - Desktop     | Auto      | ✅ PASS | 8 test cases               |
| 3   | Logout Button - Trading Layout - Desktop       | Auto      | ✅ PASS | 5 test cases               |
| 4   | UserMenu - Landing Page - Desktop              | Auto      | ✅ PASS | 9 test cases               |
| 5   | UserMenu - Landing Page - Mobile               | Auto      | ✅ PASS | 2 test cases               |
| 6   | UserMenu - Landing Page - Tablet               | Auto      | ✅ PASS | 2 test cases               |
| 7   | Logout Button - Inventory Layout - Mobile      | Auto      | ✅ PASS | 2 test cases               |
| 8   | Logout Button - Trading Layout - Mobile        | Auto      | ✅ PASS | 2 test cases               |
| 9   | Logout Button - Inventory Layout - Tablet      | Auto      | ✅ PASS | 1 test case                |
| 10  | Logout Button - Trading Layout - Tablet        | Auto      | ✅ PASS | 1 test case                |
| 11  | Format refactor (before/beforeEach separation) | Auto      | ✅ PASS | All 35 tests still passing |

## Failed Test Details

None — all 35 tests passed.

## Technical Notes

- Dev server was returning 500 on first run (crashed) — restarted and all tests passed on second run
- `logout.cy.js` refactored: fixture loading moved to `before()`, login/visit kept in separate `beforeEach()`
