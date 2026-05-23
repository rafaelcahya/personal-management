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

| File                                        | Purpose                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `.claude/prd/PRD_Personal_Management.md`    | PRD for Inventory + Stock Trading — PM Agent owns this |
| `.claude/prd/PRD_Running_Tracker.md`        | PRD for Running Tracker + AI Coach                     |
| `.claude/agents/signals/pending-signals.md` | Cross-agent inbox — all agents check at kickoff        |
| `cypress/fixtures/app-constants.json`       | Test IDs + endpoint registry (Cypress runtime)         |
| `cypress/fixtures/app-constants.yaml`       | Same data, human-readable source of truth              |

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
[Researcher ↔ PM] (flexible order or parallel) → UI/UX + Backend (parallel) → Frontend → Code Reviewer → Security Reviewer* → Tester → Regression Gate → PM Validation
```

\*Security Reviewer is conditional — triggered when new API routes, auth/session/permissions, admin client, new env vars, or user-generated content is involved.

**Researcher ↔ PM** are peers — either can run first or both can run in parallel:

- Researcher before PM: product discovery, idea generation, surfacing unknowns
- PM before Researcher: Researcher validates requirements, benchmarks UX/tech for defined features
- Parallel: when topics are non-overlapping

1. **Researcher / PM** — research product, UX, library, security landscape; PM writes user stories + acceptance criteria; both inform each other
2. **UI/UX** — produce design decision doc with all states + component mapping
3. **Backend** — build API endpoints, send API contract to Frontend
4. **Frontend** — build UI using design spec + API contract, add `data-testid`
5. **Code Reviewer** — review Backend + Frontend output; CRITICAL issues must be fixed before proceeding
6. **Security Reviewer** — review ownership, IDOR, secrets, XSS; CRITICAL issues must be fixed before Tester starts
7. **Tester** — write Cypress E2E tests using Code Reviewer + Security Reviewer findings as context
8. **Regression Gate** — user runs `npm run cy:regression` and confirms pass before proceeding
9. **PM Validation** — PM verifies every acceptance criterion is implemented and tested

## Hotfix Workflow

```
Backend/Frontend (targeted fix) → Tester (scope-limited) → Regression Gate
```

For bugs and regressions — skips PM and UI/UX. Use the **Orchestrator** and it will detect the hotfix path automatically.

For single-agent tasks (isolated fix, quick UI change), invoke that agent directly — skip the full pipeline.
Use the **Orchestrator** when delivering a complete feature end-to-end.

## Cross-Agent Communication

All signals between agents go through one central file:
`.claude/agents/signals/pending-signals.md`

Each agent checks this file at kickoff and resolves `[PENDING]` signals before starting new work.
