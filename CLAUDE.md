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

| File                                        | Purpose                                         |
| ------------------------------------------- | ----------------------------------------------- |
| `.claude/PRD.md`                            | Product requirements — PM Agent owns this       |
| `.claude/agents/signals/pending-signals.md` | Cross-agent inbox — all agents check at kickoff |
| `cypress/fixtures/app-constants.json`       | Test IDs + endpoint registry (Cypress runtime)  |
| `cypress/fixtures/app-constants.yaml`       | Same data, human-readable source of truth       |

## Agent System

This project uses 5 specialized agents + 1 orchestrator. Each agent has isolated tools, its own memory, and a defined output scope.

| Agent        | File                    | Role                                       | Model      |
| ------------ | ----------------------- | ------------------------------------------ | ---------- |
| Orchestrator | `orchestrator-agent.md` | Coordinates multi-agent workflows          | sonnet-4-6 |
| PM           | `pm-agent.md`           | Requirements, PRD, prioritization          | sonnet-4-6 |
| UI/UX        | `uiux-agent.md`         | Design decisions, component specs          | haiku-4-5  |
| Backend      | `backend-agent.md`      | API routes, services, DB schema            | sonnet-4-6 |
| Frontend     | `frontend-agent.md`     | JSX components, UI states, API integration | sonnet-4-6 |
| Tester       | `tester-agent.md`       | Cypress tests, code review, QA reports     | haiku-4-5  |

All agent files are in `.claude/agents/subagents/`.

## Standard Feature Workflow

```
PM → UI/UX + Backend (parallel) → Frontend → Tester
```

1. **PM** — analyze requirements, update PRD, write user stories + acceptance criteria
2. **UI/UX** — produce design decision doc with all states + component mapping
3. **Backend** — build API endpoints, send API contract to Frontend
4. **Frontend** — build UI using design spec + API contract, add `data-testid`
5. **Tester** — review output, write Cypress E2E tests, update coverage report

For single-agent tasks (bug fix, quick UI change), invoke that agent directly — skip the full pipeline.
Use the **Orchestrator** when delivering a complete feature end-to-end.

## Cross-Agent Communication

All signals between agents go through one central file:
`.claude/agents/signals/pending-signals.md`

Each agent checks this file at kickoff and resolves `[PENDING]` signals before starting new work.
