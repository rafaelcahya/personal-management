---
name: feature-pipeline
description: Run a full feature through this repo's agents — Phase 1 PM + Researcher + UI/UX, Phase 2 Backend + Frontend, Phase 3 Code + Security review, Phase 4 Tester, Phase 5 merge — with gates for user approval, spawn-once/continue-via-SendMessage, brief format, when to use Opus, and when Security Review is needed. Use when orchestrating a feature end-to-end.
---

# Feature Pipeline

```
Phase 1: PM + Researcher + UI/UX → Phase 2: Backend + Frontend → Phase 3: Code Reviewer + Security Reviewer → Phase 4: Tester → Phase 5: Merge
```

## Agents

| Phase | `subagent_type`                                  | Model · effort                                                                           |
| ----- | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1     | `pm-agent`, `researcher-agent`, `uiux-agent`     | Sonnet 5.5 · medium                                                                      |
| 2     | `backend-agent`, `frontend-agent`                | Sonnet 5.5 · high (Backend → `model: "opus"` for migrations, RLS, or complex data logic) |
| 3     | `code-reviewer-agent`, `security-reviewer-agent` | Opus 5.5 · high                                                                          |
| 4     | `tester-agent`                                   | Sonnet 5.5 · high                                                                        |

## Golden rules

1. **Gates go to the user.** Subagents (including the Orchestrator) can't ask the user anything. At every gate, stop and return a `⏸️ Gate` message; the user's answer comes back via `SendMessage`.
2. **Spawn once, continue many times.** Each agent: plan run → user approves → `SendMessage` the same agent ID to continue. Fix loops also `SendMessage` the same agent. A fresh spawn costs ~22K tokens and throws away what the agent already read.
3. **Short briefs, details in the issue.** Agents read the issue themselves (except UI/UX and Researcher, which have no Bash — paste the issue content into their brief).

## Brief format

```
Issue: #n
Goal: [one sentence]
In scope: [files, folders, endpoints]
Out of scope: [what not to touch]
Inputs: [handoff comments on the issue / spec path]
Output: [what to return]
Mode: plan run — return the Approval Request
```

## Phases

**Phase 1 — Discovery**

1. Researcher first for open-ended ideas; PM first when requirements are already clear. UI/UX after the PRD exists.
2. PM writes the PRD and creates **one** issue with PRD section pointers (`github-issue-create`).
3. Post the Researcher and UI/UX handoff text on the issue.
4. ⏸️ **Gate: PRD + issue approval.**

**Phase 2 — Development**

1. Shared branch `feat/issue-{n}-{desc}` from `release/vX.Y` (create only if the user asked).
2. Spawn Backend and Frontend in plan mode. ⏸️ **Gate: plans** — both add their tasks to the issue before coding.
3. Continue both. Frontend can build in parallel once the API Contract is on the issue; otherwise Backend first.
4. Done = lint + build clean, handoffs posted. Push / PR only when the user asks.

**Phase 3 — Review**

1. Code Reviewer on the PR diff.
2. Security Reviewer **only if** the change: adds a route taking an ID, touches auth/session/middleware/permissions, uses or adds the admin client, adds env vars that could be secrets, or renders user/AI content.
3. ⏸️ **Gate: CRITICALs** — the user decides fix now or skip. Fix loop: `SendMessage` the same builder with finding IDs → `SendMessage` the same reviewer to re-check those IDs.

**Phase 4 — Test**

1. Tester plan run with both review reports as context. ⏸️ **Gate: plan.**
2. Continue → specs pass 100% headed → `qa-coverage.md` updated → result posted.
3. ⏸️ **Gate: regression** — the user runs `npm run cy:regression` and pastes `! npm run cy:summary`. Wait for the real output.

**Phase 5 — Merge**
The user merges the PR into `release/vX.Y` and closes the issue (`Closes #n` doesn't auto-close on a release branch). Optionally run `post-delivery-validation` first.

## Gate message

```
⏸️ Gate — [name]
Issue: #n
Waiting on: [decision or command]
Agent waiting: [agent type + agent ID]
Options: yes / no / revise
```

## Final summary (≤ 15 lines)

```
## Feature Delivery — #n [name]
- Phase 1: PRD + issue ✅
- Phase 2: [N] endpoints, UI ✅
- Phase 3: Code [C/W/S] · Security [C/W/S or skipped — reason]
- Phase 4: [N] tests 100% · regression [result]
- Open: [anything flagged but not fixed]
```
