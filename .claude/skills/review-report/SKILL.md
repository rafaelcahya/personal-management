---
name: review-report
description: How Code Reviewer and Security Reviewer review a change in this repo — reading only the diff, the project checklists for backend and frontend code, severity levels, finding IDs, and the report format the caller posts on the PR or issue. Use for any code or security review of a branch or PR.
---

# Review Report

## Read the diff, not the repo

```bash
gh issue view {n} --json title,body,comments          # AC + API Contract + UI Ready + earlier review reports
gh pr diff {pr}                        # or: git diff release/vX.Y...HEAD
git diff --stat release/vX.Y...HEAD    # list of changed files
```

Reviewers can only run `git diff`, `gh pr diff`, and `gh issue view` (a hook blocks everything else, including pipes). Read a full file only when the diff doesn't give enough context for a finding.

## Code Reviewer checklist

The builder skills are the standard — a change that breaks a rule in them is a finding:

| Area      | Standard                                                                                                                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routes    | `api-route-builder` — auth first, Zod `safeParse`, 400 for validation, module response shape, no DB queries in the route, generic 500, endpoint registered in app-constants |
| Services  | `service-layer` — `user_id` on every query by ID, no `select('*')`, `maybeSingle` + null → 404, safe pagination, no cross-domain imports, admin client rules                |
| Schemas   | `zod-schema` — schema in `schemas/`, Zod 4 messages (`{ error }`, not `invalid_type_error`), `.issues`                                                                      |
| Jobs / AI | `background-job`, `ai-integration` — `step.run` around side effects, idempotent, function registered in the serve route; cached system prompt, validated output             |
| UI        | `ui-builder` — base components, all 4 async states, section card, `components/` folder, ids `{element}_{page}` registered, real tokens                                      |
| Forms     | `form-builder` — Controller + Field, field classes, inline errors, no double submit                                                                                         |
| Data      | `api-consumption` — no `fetch` in components, right envelope fields                                                                                                         |
| Charts    | `chart-builder` — ResponsiveContainer, empty state under the minimum, CSS vars                                                                                              |
| A11y      | `a11y-review`                                                                                                                                                               |
| General   | No dead code or unused imports, no magic numbers, comments only explain a non-obvious _why_                                                                                 |

Load a skill only when the diff touches its area.

## Security Reviewer checklist

`ownership-idor-check` and `secrets-env-check`. Read the Code Reviewer's report first and don't repeat its findings.

## Severity

| Level      | Meaning                                                                                         | Examples                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| CRITICAL   | Bug, security hole, data loss, or something that will fail tests — fix before the Tester starts | Missing auth or ownership check, broken response shape, unhandled error state, `NEXT_PUBLIC_` secret |
| WARNING    | Real risk of a future bug or regression — should fix                                            | Missing pagination, magic number, missing empty state, `err.message` in a 500                        |
| SUGGESTION | Optional improvement                                                                            | Extract a helper, rename, defense-in-depth filter                                                    |

When unsure between two levels, pick the lower one and say why.

## Report format

```markdown
## [Code | Security] Review — #n [feature]

**Date:** YYYY-MM-DD · **Diff:** PR #pr (N files)

### CRITICAL

- [CB-1] `app/api/running/v1/goals/[id]/route.js:31` — no `user_id` filter on delete — any user can delete any goal by id → add `.eq('user_id', userId)` in `deleteGoal`

### WARNING

- [WF-1] `.../GoalsSection.jsx:12` — no empty state → add EmptyState

### SUGGESTION

- [SB-1] ...

| Level      | Backend | Frontend |
| ---------- | ------- | -------- |
| CRITICAL   | 1       | 0        |
| WARNING    | 0       | 1        |
| SUGGESTION | 1       | 0        |

**Verdict:** ❌ CRITICAL found — fix before Tester · ✅ No CRITICAL — ready for [Security Reviewer | Tester]
```

- IDs: `C`/`W`/`S` + `B`(backend) / `F`(frontend), numbered — e.g. `CB-1`, `WF-2`. Security uses `S-1`, `S-2`… with the level in the heading.
- Every finding: `file:line` — what's wrong — why it matters / how to fix. Security CRITICALs add the attack scenario.
- Findings only — no praise, no summary of what the code does.
- Re-check runs: review only the listed finding IDs and anything the fix touched; mark each `FIXED` / `NOT FIXED`.
- The caller posts the report and decides on fixes; reviewers never spawn or message other agents.
