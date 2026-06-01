# Personal Management App

Personal productivity web app for one user, two domains: **Inventory Management** (stock tracking, usage patterns) and **Stock Trading** (trades, portfolio, P&L).

## Tech Stack

| Layer         | Technology                   | Location                         |
| ------------- | ---------------------------- | -------------------------------- |
| Framework     | Next.js 15 App Router        | `app/`                           |
| Language      | JavaScript/JSX               | all files                        |
| Database      | Supabase (PostgreSQL)        | hosted                           |
| Auth          | Supabase SSR + JWT           | `middleware.js`, `lib/supabase/` |
| Styling       | Tailwind CSS + CSS variables | `app/globals.css`                |
| UI Components | shadcn/ui (Radix UI)         | `components/ui/`                 |
| Forms         | react-hook-form + Zod        | `schemas/`                       |
| API Client    | custom fetch functions       | `lib/api/`                       |
| E2E Testing   | Cypress                      | `cypress/`                       |

## Key Files

| File                                     | Purpose                                                          |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `.claude/prd/PRD_Shared.md`              | PRD header, overview, API standards, UI/UX standards, DB tables  |
| `.claude/prd/PRD_Inventory.md`           | PRD for Inventory Management module (section 3.1)                |
| `.claude/prd/PRD_Trading.md`             | PRD for Trading Management module (section 3.2)                  |
| `.claude/prd/PRD_Auth.md`               | PRD for Auth + User Settings (sections 3.3–3.4)                  |
| `.claude/prd/PRD_Running_Tracker.md`     | PRD for Running Tracker + AI Coach                               |
| `.claude/prd/PRD_Personal_Management.md` | Legacy monolith — history only, do not update                    |
| `cypress/fixtures/app-constants.json`    | Test IDs + endpoint registry (Cypress runtime)                   |
| `cypress/fixtures/app-constants.yaml`    | Same data, human-readable source of truth                        |
| GitHub Project #3                        | Planning board — https://github.com/users/rafaelcahya/projects/3 |

## Agent System

This project uses 8 specialized agents + 1 orchestrator. Each agent has isolated tools, its own memory, and a defined output scope.

| Agent             | File                         | Role                                                      | Model      |
| ----------------- | ---------------------------- | --------------------------------------------------------- | ---------- |
| Orchestrator      | `orchestrator-agent.md`      | Coordinates multi-agent workflows                         | sonnet-4-6 |
| PM                | `pm-agent.md`                | Requirements, PRD, prioritization                         | sonnet-4-6 |
| Researcher        | `researcher-agent.md`        | Product, UX, library, security research — peer of PM      | opus-4-7   |
| UI/UX             | `uiux-agent.md`              | Design decisions, component specs                         | sonnet-4-6 |
| Backend           | `backend-agent.md`           | API routes, services, DB schema                           | sonnet-4-6 |
| Frontend          | `frontend-agent.md`          | JSX components, UI states, API integration                | sonnet-4-6 |
| Code Reviewer     | `code-reviewer-agent.md`     | CRITICAL/WARNING/SUGGESTION code review — read-only       | sonnet-4-6 |
| Security Reviewer | `security-reviewer-agent.md` | IDOR, ownership, secrets, XSS security review — read-only | sonnet-4-6 |
| Tester            | `tester-agent.md`            | Cypress tests, QA reports                                 | sonnet-4-6 |

All agent files are in `.claude/agents/subagents/`.

## Standard Feature Workflow

```
Phase 1: PM + Researcher → Phase 2: UI/UX + Frontend + Backend → Phase 3: Code Reviewer + Security Reviewer → Phase 4: Tester → Phase 5: Merge to master
```

### Phase 1 — PM + Researcher (Feature Discovery & PRD)

1. PM and Researcher discuss features to develop — both create a **GitHub Issue** to track the discussion
   - Status **TODO** = actively discussing what to build
   - Status **IN PROGRESS** = writing PRD from the discussion output
   - Status **DONE** = user manually sets after PRD is approved
2. PM creates the milestone integration branch: `release/vX.Y`
3. PM writes PRD; Researcher validates requirements, benchmarks UX/tech
4. User reviews and approves PRD → manually sets issue status to **DONE**

### Phase 2 — UI/UX + Frontend + Backend (Planning & Development)

After PRD is approved:

1. UI/UX, Frontend, and Backend do planning together based on the PRD
2. After planning, each agent creates a **GitHub Issue** for their own work:
   - Status **TODO** = planning done, ready to start
   - Status **IN PROGRESS** = actively developing
   - Status **DONE** = user manually sets after Tester confirms 100% pass
3. **UI/UX** — produces design decision doc; no branch needed (design spec output only)
4. **Backend** — builds API endpoints; creates branch `feat/issue-{n}-{desc}`
5. **Frontend** — builds UI using design spec + API contract; creates branch `feat/issue-{n}-{desc}`
6. After development done: push branch to remote and create PR targeting `release/vX.Y`

### Phase 3 — Code Reviewer + Security Reviewer

After Frontend and Backend PRs are open:

1. Code Reviewer reviews both PRs — no GitHub issue needed
2. Security Reviewer reviews both PRs (conditional\*) — no GitHub issue needed
3. If CRITICAL issues found → Frontend/Backend fix on the **same branch**, push again → Reviewer re-checks
4. After all CRITICAL issues resolved → Frontend and Backend merge their branches into `release/vX.Y`

\*Security Reviewer is conditional — triggered when new API routes, auth/session/permissions, admin client, new env vars, or user-generated content is involved.

### Phase 4 — Tester

After Frontend and Backend branches are merged into `release/vX.Y`:

1. Tester does planning, then creates a **GitHub Issue**:
   - Status **TODO** = planning done, ready to write tests
   - Status **IN PROGRESS** = writing Cypress test automation
   - Status **DONE** = user manually sets after Tester notifies 100% pass
2. Tester creates branch: `test/issue-{n}-{desc}`
3. Tester writes tests until 100% passing
4. After 100% pass: push branch, create PR targeting `release/vX.Y`, update all 3 reports
5. Tester notifies user of 100% pass — user then manually sets Frontend and Backend issue statuses to **DONE**
6. Tester branch is merged into `release/vX.Y`

### Phase 5 — Merge to master

After all branches (Frontend, Backend, Tester) are merged into `release/vX.Y`:

1. Create PR from `release/vX.Y` → `master`
2. Merge → product release shipped

## Hotfix Workflow

```
Backend/Frontend (targeted fix) → Tester (scope-limited) → merge to master
```

For bugs and regressions — skips PM and UI/UX. Use the **Orchestrator** and it will detect the hotfix path automatically.

For single-agent tasks (isolated fix, quick UI change), invoke that agent directly — skip the full pipeline.
Use the **Orchestrator** when delivering a complete feature end-to-end.

## Cross-Agent Communication

All cross-agent signals are tracked via **GitHub Issues + Project board** (Project #3: Personal Management — Planning).

- Each agent creates a GitHub Issue for their work with the appropriate **Role**, **Module**, **Priority**, and **Release** fields set
- Status flow: **Todo** → **In Progress** → **Done** (user sets Done manually after Tester confirms 100% pass)
- Agents reference issue numbers in branches, commits, and PRs so GitHub auto-links everything

`.claude/agents/signals/pending-signals.md` is kept as historical record only — no longer active.

## Git Workflow

Every feature is tied to a GitHub Issue. Branches, commits, and PRs must reference the issue number so GitHub auto-links them to the project board.

### Branch naming

```
feat/issue-{n}-{short-description}    # Frontend or Backend new feature
fix/issue-{n}-{short-description}     # Frontend or Backend bug fix
test/issue-{n}-{short-description}    # Tester branch
release/vX.Y                          # PM creates — milestone integration branch
```

Examples:

```
feat/issue-15-ef-trend-arrow          # Frontend
feat/issue-12-ef-30d-avg              # Backend
test/issue-19-analytics-cypress       # Tester
release/v1.2                          # PM
```

### Commit message format

Follow the **50/72 rule**:

- **Subject line**: max 50 characters — `<type>: <description> (#n)`
- **Body lines**: max 72 characters per line — explains what and why
- Blank line between subject and body

```
<type>: <description> (#n)

Optional body explaining what changed and why.
Wrap at 72 characters per line.
```

Examples:

```
feat: add analytics page (#4)

Extract chart components into components/ subfolder.
Reduces page.jsx from 1015 lines to ~120 lines.

fix: sidebar tooltip tests (#8)

Use native PointerEvent dispatch — CDP realHover() does
not fire Radix onPointerMove in headless Electron.
```

### PR body — closing keyword

Always include `Closes #n` in the PR body so GitHub auto-closes the issue on merge, which updates the milestone progress and project board status automatically.

```
## Summary
- ...

Closes #4
```

### Versioning convention

- **PRD version** (e.g. v1.19, v2.6) — document revision, tracks requirement changes
- **Product release** (e.g. v1.0, v1.1) — what ships to production, tracked via GitHub milestone

Release plan lives in each PRD under **Product Release Plan**. GitHub milestones are at:
`https://github.com/rafaelcahya/personal-management/milestones`
