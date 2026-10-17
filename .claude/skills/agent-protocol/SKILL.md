---
name: agent-protocol
description: Working rules every project agent follows — the plan-then-continue approval flow, how to read context cheaply (issue first, PRD by section, grep app-constants), memory proposals, the ~15-line final report, comment rules, and the global Definition of Done. Use at the start of every agent task in this repo.
---

# Agent Protocol

These rules apply to every agent in this project (PM, Researcher, UI/UX, Backend, Frontend, Tester). Reviewers and the Orchestrator follow their own report rules but the same context rules.

## 1. Plan, then continue

Subagents can't ask the user anything or wait mid-run — `AskUserQuestion` isn't available to them. So every task runs in two steps:

1. **Plan run** — read only what you need, change no files, create no issues or comments, and end your reply with the Approval Request.
2. **Continue run** — the caller shows your plan to the user. After approval, the caller resumes **you** via `SendMessage`. You still have your context, so don't re-read files you already read.

Fix requests after review arrive the same way: the caller resumes you with finding IDs only (e.g. `CB-1, CF-2`). Fix them on the same branch.

If a brief only says "approved" or "proceed" and there's no plan in your context, ask what the task is. Never guess, and never pick up old work from issues or memory on your own.

```
📋 Approval Request — [Agent Name]
Issue: #n
Files to change / GitHub actions:
- [file path or action] — [what will change and why]

Plan:
[brief summary]

Tasks for the issue (role: [your role]):
- [ ] ...

Proceed? (yes / no / revise)
```

## 2. Context rules

Every spawn already costs ~22K tokens before any work. Don't add to it by reading more than the task needs.

| Source                                        | How to read it                                                                                                                                             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub issue                                  | Your task brief. `gh issue view {n} --comments` (AC, tasks, PRD pointers, handoff comments). No Bash? The caller pastes it into your brief                 |
| PRD files (15–221 KB)                         | Grep the heading the issue points to, then Read with `offset`/`limit`. Never Read a whole PRD file. Never read `PRD_Personal_Management.md` (history only) |
| `cypress/fixtures/app-constants.json` (66 KB) | Grep the key you need. Never Read the whole file                                                                                                           |
| Skills                                        | Load a skill only when the task needs it. Inside a skill, open `references/` files only when the step calls for them                                       |
| Command output                                | Look at errors and summaries only (`... 2>&1 \| tail -40`)                                                                                                 |
| Codebase                                      | Grep/Glob first, then Read the specific file. Don't scan whole modules "for context"                                                                       |

Project layout: [references/project-map.md](references/project-map.md).

## 3. Memory

Your memory file (`.claude/agent-memory/<agent>/MEMORY.md`) is loaded automatically at startup.

- Never write to it on your own. Put proposals in your final report:

  ```
  📝 Memory Proposal — [Agent Name]
  Entry: [the exact line to add]
  Reason: [why it's worth remembering]
  ```

- Write it only when the caller resumes you with the user's approval.
- Save decisions and gotchas (things not obvious from the code). Stable rules belong in skills, not memory.
- Keep it under 200 lines. Merge or delete stale entries instead of growing it.

## 4. Final report (max ~15 lines)

Your final reply goes into the caller's context. Keep it short:

- Status: plan ready / done / blocked (and why)
- Files changed
- Link to the handoff comment, or the comment text if you can't post it
- Blockers or open questions
- Memory proposal (if any)

Full details (contracts, specs, long explanations) go in an issue comment or a file. Reviewers are the only exception: their findings report is the deliverable.

## 5. Code comments

Comments only explain a non-obvious **why**. No section labels, no task or issue references, no restating what the code does.

## 6. Definition of Done (global)

| Agent      | Done when                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| PM         | PRD updated with the final spec and version bumped; feature issue created and the user notified                                  |
| Researcher | Report written to `.claude/research/`; handoff text returned                                                                     |
| UI/UX      | Design spec in `.claude/design/` with all states defined; Design Handoff returned                                                |
| Backend    | Endpoints live, edge cases handled, ESLint clean, endpoints registered in app-constants (`.json` + `.yaml`), API Contract posted |
| Frontend   | UI built with all states, `id`s added and registered, `next build` passes, UI Ready posted                                       |
| Tester     | Specs pass 100% (headed), `cypress/reports/qa-coverage.md` updated, result posted on the issue                                   |

Only the user sets an issue to **Done**, after the Tester confirms 100% pass.
