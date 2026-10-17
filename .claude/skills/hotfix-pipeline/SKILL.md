---
name: hotfix-pipeline
description: Fix a bug or regression in this repo with the short path — reproduce, scope backend/frontend, targeted fix on a fix branch, review only when logic changed, scope-limited tests, regression gate. Skips PM and UI/UX. Use when the user reports something broken rather than asking for a feature.
---

# Hotfix Pipeline

```
Reproduce → Backend and/or Frontend fix → Code Reviewer (if logic changed) → Tester (scoped) → Regression gate
```

## Steps

1. **Issue** — use the existing bug issue, or create one (`github-issue-create`, label `type: bug`). One issue per bug.
2. **Reproduce and scope** — find where it breaks: route, service, component, data. If it's unclear whether it's backend or frontend, return a `⏸️ Gate` and ask.
3. **Branch** — `fix/issue-{n}-{short-description}` from `release/vX.Y` (or from `master` if the user wants it shipped straight to production).
4. **Fix** — spawn only the relevant builder(s) in plan mode with: the bug, the expected behavior, how to reproduce, the suspected file. ⏸️ **Gate: plan.** Then continue via `SendMessage`.
   - Fix the cause, not the symptom. Keep the diff small — no refactors riding along.
   - If the bug shows a missing requirement, flag it for PM instead of inventing behavior.
5. **Review** — Code Reviewer on the diff when logic changed (skip for copy/style-only fixes). Security Reviewer when the bug touches auth, ownership, secrets, or rendering of user content.
6. **Test** — Tester adds or updates tests for the fixed behavior only (a test that fails before the fix and passes after), runs headed, updates `qa-coverage.md`.
7. ⏸️ **Gate: regression** — the user runs `npm run cy:regression` + `! npm run cy:summary`.
8. The user merges and closes the issue.

## Skip PM and UI/UX unless

- The "bug" is really a missing or unclear requirement → PM.
- The fix changes what the user sees in a way that needs a design decision → UI/UX.
