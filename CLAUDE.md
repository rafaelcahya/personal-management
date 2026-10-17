# Personal Management App

Personal productivity web app for one user, four domains: **Inventory Management** (stock tracking, usage patterns), **Stock Trading** (trades, portfolio, P&L), **Running Tracker** (activity logging, AI coach), and **Auth + User Settings** (authentication, profile).

## Tech Stack

| Layer           | Technology                       | Location                            |
| --------------- | -------------------------------- | ----------------------------------- |
| Framework       | Next.js 15 App Router, React 19  | `app/`                              |
| Language        | JavaScript/JSX                   | all app code                        |
| Database        | Supabase (PostgreSQL)            | hosted                              |
| Auth            | Supabase SSR + JWT               | `middleware.js`, `lib/supabase/`    |
| Styling         | Tailwind CSS 3.4 + CSS variables | `app/globals.css`, `app/tokens.css` |
| UI Components   | Radix UI + Base Components       | `components/base/`                  |
| Forms           | react-hook-form + Zod 4          | `schemas/`                          |
| API Client      | custom fetch functions           | `lib/api/`                          |
| Charts          | Recharts 3                       | page `components/` folders          |
| AI              | Anthropic Claude SDK             | `lib/services/**/ai/`               |
| Background Jobs | Inngest                          | `lib/inngest/`                      |
| Maps / Motion   | Leaflet / MapLibre GL, GSAP      | `components/`                       |
| Toasts / Theme  | Sonner, next-themes              | `app/`                              |
| Component Docs  | Storybook                        | `.storybook/`                       |
| E2E Testing     | Cypress (API tests)              | `cypress/`                          |

## Key Files

| Path                                                   | Purpose                                                              |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `.claude/prd/README.md`                                | PRD index — one folder per module, **one file per feature**          |
| `.claude/prd/{shared,inventory,trading,auth,running}/` | PRD files; each folder has `index.md` (version + file list)          |
| `.claude/skills/`                                      | How-to skills for agents (routes, services, UI, tests, reviews, git) |
| `.claude/agents/subagents/`                            | Agent definitions                                                    |
| `cypress/fixtures/app-constants.json`                  | Endpoint + test-id registry (Cypress runtime); keep `.yaml` in sync  |
| GitHub Project 3                                       | Planning board — https://github.com/users/rafaelcahya/projects/3     |

## Agent System

| Agent             | `subagent_type`           | Role                                                      | Model · effort      |
| ----------------- | ------------------------- | --------------------------------------------------------- | ------------------- |
| Orchestrator      | `orchestrator-agent`      | Coordinates multi-agent workflows                         | sonnet-5-5 · low    |
| PM                | `pm-agent`                | Requirements, PRD, feature issue                          | sonnet-5-5 · medium |
| Researcher        | `researcher-agent`        | Product, UX, library, security research — peer of PM      | sonnet-5-5 · medium |
| UI/UX             | `uiux-agent`              | Design decisions, component specs                         | sonnet-5-5 · medium |
| Backend           | `backend-agent`           | API routes, services, DB schema                           | sonnet-5-5 · high   |
| Frontend          | `frontend-agent`          | JSX components, UI states, API integration                | sonnet-5-5 · high   |
| Code Reviewer     | `code-reviewer-agent`     | CRITICAL/WARNING/SUGGESTION code review — read-only       | opus-5-5 · high     |
| Security Reviewer | `security-reviewer-agent` | IDOR, ownership, secrets, XSS security review — read-only | opus-5-5 · high     |
| Tester            | `tester-agent`            | Cypress API tests, QA report                              | sonnet-5-5 · high   |

- Each agent preloads its core skills and loads the rest on demand. Memory is built in (`.claude/agent-memory/<agent>/MEMORY.md`); reviewers have none and can only run `git diff`, `gh pr diff`, `gh issue view` (hook: `.claude/hooks/reviewer-bash-guard.mjs`).
- Subagents can't ask the user mid-run: **plan run → user approval → continue the same agent via `SendMessage`**. Never spawn a new agent to continue or fix work an existing agent started.
- Single-agent task → call that agent directly. Full feature → Orchestrator.

## Workflow

```
Phase 1: PM + Researcher + UI/UX → Phase 2: Backend + Frontend → Phase 3: Code Reviewer + Security Reviewer → Phase 4: Tester → Phase 5: Merge
```

Details: `feature-pipeline` skill (features), `hotfix-pipeline` skill (bugs — skips PM and UI/UX).

Hard rules:

- **One GitHub issue per feature** on Project 3, using the template in the `github-issue-create` skill. Every agent works in that issue; handoffs are issue comments (`git-workflow` → handoff formats).
- **Write your task list in the issue's Tasks section before writing code or tests.**
- One shared branch per issue from `release/vX.Y`: `feat/issue-{n}-{desc}` or `fix/issue-{n}-{desc}`.
- Cypress always runs **`--headed`** (`npx cypress run --config-file=cypress.config.js --headed --browser chrome --spec "..."`); done = 100% pass + `cypress/reports/qa-coverage.md` updated.
- Commits follow 50/72: `<type>: <description> (#n)`. PR body has `Closes #n`. Only the user sets an issue to Done.
- PRD version (document revision) ≠ product release (GitHub milestone `vX.Y`). `release/vX.Y` → `master` ships the release.

Full git rules: `git-workflow` skill. PRD rules: `prd-writing` skill.
