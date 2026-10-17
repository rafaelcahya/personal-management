---
name: test-run-report
description: Run this repo's Cypress tests the required way (app-up check, headed Chrome, scoped specs, reading only the summary) and update the cumulative QA report at cypress/reports/qa-coverage.md, plus the regression gate the user runs. Use whenever tests need to be run or the QA report needs updating.
---

# Test Run + QA Report

## 1. Check the app is up

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Not 2xx/3xx → stop and report **blocked: localhost:3000 is not running**. You can't ask the user yourself; the caller will.

## 2. Run headed, scoped to your specs

```bash
npx cypress run --config-file=cypress.config.js --headed --browser chrome \
  --spec "cypress/e2e/{module}/{menu}/{menu}-api.cy.js" 2>&1 | tail -60
```

- **Always `--headed`**, never headless (project rule).
- Only the specs you added or changed. Several: comma-separate them in `--spec`.
- Read the summary table and the failing tests only. Don't paste the full log anywhere.
- Fix and re-run until 100% pass. If a failure is a real app bug, don't bend the test — post an Endpoint Gap or id Request on the issue (see `git-workflow`) and report it.
- Tests that need extra setup (e.g. an IDOR row) take it via `--env NAME=value`; say so in the spec header and in your result.

## 3. Update `cypress/reports/qa-coverage.md`

The report is **cumulative** — update or add rows, never rewrite it from scratch.

1. Header: set `**Last Updated:** YYYY-MM-DD (feature #n — what was covered)` and `**Branch:**`.
2. **Detailed Breakdown** → the module's section: add or update the row for your spec (file, endpoint(s), test count).
3. Recalculate **Module Overview** and **Summary** totals and percentages from the rows you changed.
4. App version, when the report asks for it, comes from the `Version:` header in `.claude/prd/PRD_Shared.md`.

Put the report change in your plan run first (which rows change) — it's a shared file.

## 4. Post the result on the issue

Use the Test Result format in `git-workflow` → handoff formats: specs, pass count, routes still returning 422, report updated.

## 5. Regression gate (the user runs it)

The user runs:

```bash
npm run cy:regression        # cypress/run-regression.mjs
! npm run cy:summary         # pastes a compact summary into the conversation
```

- Wait for the real output — never estimate pass/fail.
- Known gaps in `run-regression.mjs`: it runs groups **headless** and only covers `api-auth`, `auth`, inventory `dashboard`, inventory `product`, and `running`. Trading, notifications, and home specs aren't in it — run those specs directly (step 2) when your feature touches them.
