---
name: post-delivery-validation
description: Check a delivered feature in this repo against its acceptance criteria — implementation and test coverage per criterion — and produce the validation report, opening follow-ups for gaps instead of rewriting the criteria. Use after the Tester confirms 100% pass and before the user closes the issue.
---

# Post-Delivery Validation

## Steps

1. List every acceptance criterion from the issue (and the PRD section it points to).
2. For each one, find the implementation: Grep the route, service, or component — cite `file:line`.
3. For each one, find the test that covers it in `cypress/e2e/...` — cite the `it(...)` title.
4. Write the report (below) as a comment on the issue.
5. Gaps → propose a follow-up (new AC or a new issue) in your final report. **Never edit the acceptance criteria to match what was built.**

## Report

```markdown
## Post-Delivery Validation — #n [Feature]

**Date:** YYYY-MM-DD

| #   | Criterion | Implemented                  | Tested                                 | Status |
| --- | --------- | ---------------------------- | -------------------------------------- | ------ |
| 1   | ...       | ✅ `app/api/.../route.js:42` | ✅ "returns 400 when title is missing" | PASS   |
| 2   | ...       | ✅                           | ❌ no test                             | GAP    |

### Gaps

- [GAP] ...

### Verdict

✅ Meets the PRD — ready to close
❌ Gaps found — [what's missing]
```

## Notes

- UI-only criteria can't have API tests right now (UI tests are out of scope) — mark them "manual check needed" rather than failing them.
- If the implementation went beyond the AC, note it; the PRD may need an update (`prd-writing`).
