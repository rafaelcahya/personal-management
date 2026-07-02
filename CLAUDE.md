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
| `.claude/prd/PRD_Auth.md`                | PRD for Auth + User Settings (sections 3.3–3.4)                  |
| `.claude/prd/PRD_Running_Tracker.md`     | PRD for Running Tracker + AI Coach                               |
| `.claude/prd/PRD_Personal_Management.md` | Legacy monolith — history only, do not update                    |
| `cypress/fixtures/app-constants.json`    | Test IDs + endpoint registry (Cypress runtime)                   |
| `cypress/fixtures/app-constants.yaml`    | Same data, human-readable source of truth                        |
| GitHub Project #3                        | Planning board — https://github.com/users/rafaelcahya/projects/3 |

## Agent System

This project uses 8 specialized agents + 1 orchestrator. Each agent has isolated tools, its own memory, and a defined output scope.

| Agent             | File                         | Role                                                      | Model    |
| ----------------- | ---------------------------- | --------------------------------------------------------- | -------- |
| Orchestrator      | `orchestrator-agent.md`      | Coordinates multi-agent workflows                         | sonnet-5 |
| PM                | `pm-agent.md`                | Requirements, PRD, prioritization                         | sonnet-5 |
| Researcher        | `researcher-agent.md`        | Product, UX, library, security research — peer of PM      | sonnet-5 |
| UI/UX             | `uiux-agent.md`              | Design decisions, component specs                         | sonnet-5 |
| Backend           | `backend-agent.md`           | API routes, services, DB schema                           | sonnet-5 |
| Frontend          | `frontend-agent.md`          | JSX components, UI states, API integration                | sonnet-5 |
| Code Reviewer     | `code-reviewer-agent.md`     | CRITICAL/WARNING/SUGGESTION code review — read-only       | sonnet-5 |
| Security Reviewer | `security-reviewer-agent.md` | IDOR, ownership, secrets, XSS security review — read-only | sonnet-5 |
| Tester            | `tester-agent.md`            | Cypress tests, QA reports                                 | sonnet-5 |

All agent files are in `.claude/agents/subagents/`.

## Standard Feature Workflow

```
Phase 1: PM + Researcher + UI/UX → Phase 2: Backend + Frontend (1 branch, 1 issue) → Phase 3: Code Reviewer + Security Reviewer → Phase 4: Tester → Phase 5: Merge to master
```

### Phase 1 — Discovery (PM + Researcher + UI/UX)

1. Orchestrator triggers PM, Researcher, and UI/UX to elaborate the task together
2. PM writes PRD; Researcher validates requirements and benchmarks UX/tech; UI/UX produces design spec
3. PM **creates a single GitHub Issue** for the feature using the standard issue format (see below)
4. PM **notifies the user** that the issue is ready — user reviews and forwards the issue to developers
5. User reviews and approves PRD before development starts

### Phase 2 — Development (Backend + Frontend)

After user shares the issue:

1. Backend and Frontend each **analyze what needs to be done** based on the issue
2. **[MANDATORY GATE]** Backend and Frontend **must write their task list in the GitHub issue** (Tasks section) before writing any code — coding cannot start until this is done
3. All development happens on **one shared branch** created from `release/vX.Y`:
   - Branch name: `feat/issue-{n}-{short-description}`
4. Backend builds API endpoints; Frontend builds UI — both push to the same branch
5. After development is done: push branch, create PR targeting `release/vX.Y`

### Phase 3 — Code Reviewer + Security Reviewer

After the PR is open:

1. Code Reviewer reviews the PR — no GitHub issue needed
2. Security Reviewer reviews the PR (conditional\*) — no GitHub issue needed
3. If CRITICAL issues found → Backend/Frontend fix on the **same branch**, push again → Reviewer re-checks

\*Security Reviewer is conditional — triggered when new API routes, auth/session/permissions, admin client, new env vars, or user-generated content is involved.

### Phase 4 — Tester

After all CRITICAL issues are resolved:

1. Tester analyzes the issue and **writes their task plan in the same GitHub issue** (Tasks section)
2. Tester writes Cypress tests on the **same branch**
3. **[MANDATORY]** Tester must run all tests **with `--headed` flag** (never headless):
   ```
   npx cypress run --config-file=cypress.config.js --headed --browser chrome --spec "..."
   ```
4. Tester runs tests until 100% passing, then updates all 3 QA reports
5. Tester notifies user of 100% pass
6. User sets issue status to **DONE** and merges the PR

### Phase 5 — Release → Master

1. PR from `feat/issue-{n}-{desc}` → `release/vX.Y` is merged
2. After all features for the milestone are in `release/vX.Y`:
3. Create PR from `release/vX.Y` → `master`
4. Merge → product release shipped

## GitHub Issue Format

Every feature issue must use this template:

```markdown
## 👤 User Story

As a [persona], I want [goal] so that [reason].

## 📋 Description

[Context and explanation of the feature]

## ✅ Acceptance Criteria

- [ ] ...
- [ ] ...

## 🛠️ Tasks

### PM / UI/UX

- [ ] ...

### Backend

- [ ] ...

### Frontend

- [ ] ...

### Tester

- [ ] ...

## 📝 Notes

[Technical decisions, edge cases, design constraints, etc.]
```

**Rules:**

- PM fills in User Story, Description, Acceptance Criteria, and initial Notes when creating the issue
- Backend and Frontend fill in their Tasks section after analysis, before coding
- Tester fills in their Tasks section after development is done
- All agents work in the same issue — no separate issues per agent

## Hotfix Workflow

```
Backend/Frontend (targeted fix) → Tester (scope-limited) → merge to release/vX.Y or master
```

For bugs and regressions — skips PM and UI/UX. Use the **Orchestrator** and it will detect the hotfix path automatically.

For single-agent tasks (isolated fix, quick UI change), invoke that agent directly — skip the full pipeline.
Use the **Orchestrator** when delivering a complete feature end-to-end.

## Cross-Agent Communication

All cross-agent signals are tracked via **GitHub Issues + Project board** (Project #3: Personal Management — Planning).

- One issue per feature — all agents update the same issue
- Status flow: **Todo** → **In Progress** → **Done** (user sets Done manually after Tester confirms 100% pass)
- Agents reference the issue number in branch names, commits, and PRs so GitHub auto-links everything

`.claude/agents/signals/pending-signals.md` is kept as historical record only — no longer active.

## Git Workflow

Every feature is tied to a GitHub Issue. Branches, commits, and PRs must reference the issue number so GitHub auto-links them to the project board.

### Branch naming

```
feat/issue-{n}-{short-description}    # shared branch — all agents (Backend, Frontend, Tester)
fix/issue-{n}-{short-description}     # hotfix branch — all agents
release/vX.Y                          # PM creates — milestone integration branch
```

Examples:

```
feat/issue-115-race-detail-page       # shared branch for all agents on this feature
fix/issue-120-activity-sync-bug       # hotfix — all agents work here
release/v1.4                          # PM — milestone branch
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
