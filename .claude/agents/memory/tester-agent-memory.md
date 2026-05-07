# Tester Agent Memory

> This file is the persistent memory for the Senior QA Engineer Agent.
> Update after every test run, code review cycle, or coverage gap discovery.
> Format: newest entries at the top of each section.

---

## Known Flaky Tests

<!-- Tests that intermittently fail not due to bugs — log them to avoid false alarms -->

| Test File                | Test Name          | Failure Pattern                 | Workaround Applied           |
| ------------------------ | ------------------ | ------------------------------- | ---------------------------- |
| <!-- cypress/e2e/... --> | <!-- it('...') --> | <!-- timing / env / network --> | <!-- retry / skip / stub --> |

---

## Persistent Bugs (Not Yet Fixed)

<!-- Bugs found during QA that are not yet resolved — avoid re-reporting them -->

| Date Found          | Module                          | Bug Description      | Priority       | Status                                |
| ------------------- | ------------------------------- | -------------------- | -------------- | ------------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- inventory/trading/auth --> | <!-- what breaks --> | <!-- P0–P2 --> | <!-- Open / In Progress / Blocked --> |

---

## Coverage Gaps

<!-- Features that have zero or low automation coverage and why -->

| Module          | Feature          | Coverage Status         | Reason                        | Priority to Automate |
| --------------- | ---------------- | ----------------------- | ----------------------------- | -------------------- |
| <!-- module --> | <!-- feature --> | <!-- None / Partial --> | <!-- env dep / complexity --> | <!-- P0–P3 -->       |

---

## Blocked Tests

<!-- Tests that can't run due to missing env vars, external deps, or infra -->

| Test File     | Blocked By                                      | Notes                              |
| ------------- | ----------------------------------------------- | ---------------------------------- |
| <!-- file --> | <!-- CYPRESS_AUTH_SECRET / TEST_EMAIL / etc --> | <!-- what to set up to unblock --> |

---

## Regression Patterns

<!-- Classes of bugs that keep appearing across modules — signals a systemic gap -->

- <!-- YYYY-MM-DD: pattern description + modules affected -->

---

## Code Review Recurring Findings

<!-- Issues that keep appearing in frontend/backend reviews — signals a knowledge gap to address -->

| Category                  | Finding                        | Module         | Frequency           |
| ------------------------- | ------------------------------ | -------------- | ------------------- |
| <!-- Security/UX/Perf --> | <!-- what keeps showing up --> | <!-- where --> | <!-- times seen --> |

---

## Lessons Learned

<!-- Non-obvious QA discoveries — test setup quirks, Cypress behavior, auth bypass patterns -->

- 2026-05-07: Cypress tidak support `.yaml` sebagai fixture format — `cy.fixture('app-constants')` akan gagal jika file-nya `.yaml`. File yang dipakai adalah `app-constants.json`. File `.yaml` tetap ada tapi hanya untuk human readability — selalu update keduanya jika ada perubahan constants.
- 2026-05-07: Report conventions yang disepakati user — (1) selalu tanya dulu sebelum buat report; (2) app version diambil dari `.claude/PRD.md` header `Version:` field; (3) `coverage-report.md` bersifat kumulatif — jangan overwrite, hanya update/append.

---

## Cross-Agent Signals

<!-- Findings that require PM, Frontend, or Backend to act -->

| Date                | To Agent                     | Finding                 | Severity                  | Resolution                               |
| ------------------- | ---------------------------- | ----------------------- | ------------------------- | ---------------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- PM/Frontend/Backend --> | <!-- what was found --> | <!-- CRITICAL/WARNING --> | <!-- fixed / accepted risk / backlog --> |
