# Shared Knowledge — All Agents

> This file is the common ground for every agent in this project.
> Read this alongside your own knowledge file at the start of every session.

---

## Project Overview

**Personal Management App** — a web app for individual users to manage two domains:

- **Inventory Management**: track items, stock levels, prices
- **Stock Trading**: execute trades, monitor portfolio, track P&L

Single-user app (no multi-tenant). Every data record is scoped to `user_id`.

---

## Full Tech Stack

| Layer            | Technology                        | Location                                              |
| ---------------- | --------------------------------- | ----------------------------------------------------- |
| Framework        | Next.js 15 App Router             | `app/`                                                |
| Language         | JavaScript/JSX                    | all files (no TypeScript in app code)                 |
| Database         | Supabase (PostgreSQL)             | hosted                                                |
| Auth             | Supabase SSR + JWT                | `middleware.js`, `lib/supabase/`                      |
| Styling          | Tailwind CSS + CSS variables      | `app/globals.css`                                     |
| UI Components    | shadcn/ui (Radix UI)              | `components/ui/`                                      |
| Forms            | react-hook-form + Zod             | `schemas/`                                            |
| API Client       | custom fetch functions            | `lib/api/`                                            |
| AI Integration   | Claude Sonnet 4.6 (Anthropic SDK) | `lib/ai/` or `app/api/chat/`                          |
| E2E Testing      | Cypress                           | `cypress/`                                            |
| Test Constants   | YAML fixture                      | `cypress/fixtures/app-constants.yaml`                 |
| DB Direct Access | Supabase MCP (`mcp__supabase__*`) | Backend Agent only — debug, migration, schema inspect |

---

## Project File Map

```
app/
├── api/[resource]/v1/[action]/route.js   ← API route handlers
├── main/
│   ├── landing/page.jsx
│   ├── inventory/page.jsx
│   └── trading/page.jsx
├── globals.css                           ← CSS variables / tokens
└── layout.jsx

components/
├── ui/                                   ← shadcn/ui primitives (do not modify)
└── [feature]/                            ← feature-specific components

lib/
├── api/                                  ← frontend API client functions
├── services/                             ← backend business logic
├── supabase/
│   ├── server.ts                         ← authenticated server client
│   ├── admin.js                          ← admin client (bypasses RLS)
│   └── client.js                         ← browser-only client
└── utils/                                ← shared utilities

schemas/                                  ← Zod validation schemas (shared frontend/backend)
cypress/
├── e2e/                                  ← test specs
├── fixtures/app-constants.yaml           ← URLs, endpoints, testIds, seed data
├── support/commands.js                   ← custom Cypress commands
├── support/db/[module]/[entity]Db.js     ← Supabase query functions per domain
└── plugin/tasks/                         ← cy.task() registrations (domain tasks + supabaseRawQuery)
.claude/
├── PRD.md                                ← product requirements (PM owns)
├── agents/subagents/                     ← agent identity files
├── agents/memory/                        ← per-agent persistent memory
└── agents/knowledge/                     ← per-agent reference cookbook
```

---

## Environment Variables

| Variable                        | Used By              | Purpose                                |
| ------------------------------- | -------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Frontend, Backend    | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend             | Public anon key for browser client     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Backend (admin only) | Bypasses RLS — never expose to browser |
| `ENCRYPTION_SECRET_KEY`         | Backend              | Encrypt/decrypt sensitive fields       |
| `ANTHROPIC_API_KEY`             | Backend (AI routes)  | Claude API access                      |
| `CYPRESS_AUTH_SECRET`           | Tester               | Auth bypass for Cypress tests          |
| `TEST_EMAIL`                    | Tester               | Test user email                        |
| `TEST_PASSWORD`                 | Tester               | Test user password                     |

---

## Agent Collaboration Map

```
         ┌─────────────┐
         │  PM Agent   │  ← Owns PRD.md, defines requirements
         └──────┬──────┘
                │ requirements
        ┌───────┴────────┐
        ▼                ▼
 ┌────────────┐   ┌─────────────┐
 │ UI/UX Agent│   │Backend Agent│
 └──────┬─────┘   └──────┬──────┘
        │ design spec     │ API contract
        ▼                ▼
 ┌──────────────────────────┐
 │      Frontend Agent      │
 └──────────────┬───────────┘
                │ components + endpoints
                ▼
        ┌───────────────┐
        │  Tester Agent │  ← Reviews all output, writes E2E tests
        └───────────────┘
```

**Collaboration rules:**

- PM Agent is the only one who writes to `PRD.md`
- UI/UX Agent hands design specs to Frontend before Frontend builds
- Backend Agent defines API contract (endpoint + response shape) before Frontend integrates
- Backend Agent uses Supabase MCP to inspect DB state before writing code on schema/debug tasks
- Tester Agent reviews output from Frontend AND Backend — not just UI
- Tester Agent uses `cy.task()` with domain-specific DB tasks (`cypress/plugin/tasks/`) to verify data persisted correctly after API calls; use `supabaseRawQuery` only if no domain task exists
- Any agent can send a cross-agent signal via the formats below

---

## Cross-Agent Signal Formats

Use these exact formats when one agent needs action from another.

### 1. data-testid Request (Tester → Frontend)

```
🔖 data-testid Request — Tester → Frontend
Component: [ComponentName] ([path/to/Component.jsx])
Missing IDs:
  - [testid-name] → [which element]
Needed for: [cypress/e2e/...]
Action: Add data-testid attributes + register in cypress/fixtures/app-constants.yaml
```

### 2. Endpoint Gap (Tester → Backend)

```
⚠️ Endpoint Gap — Tester → Backend
Endpoint: [METHOD] [/api/...]
Missing edge case:
  - [e.g., "Returns 200 instead of 400 when field X is empty string"]
Action: Add handling so tests can assert the correct behavior
```

### 3. UX Gap (UI/UX → PM)

```
🎨 UX Gap — UI/UX → PM
PRD Section: [section]
Gap: [what the spec would produce that creates poor UX]
Proposed Alternative: [UX recommendation]
Action: Review and update PRD before Frontend builds
```

### 4. API Contract (Backend → Frontend)

```
📡 API Contract — Backend → Frontend
Endpoint: [METHOD] [/api/...]
Request: [body or query shape]
Response: { data: [shape], message: string }
Error cases: [list of status codes and when they occur]
Ready to integrate: [yes / pending migration]
```

### 5. PRD Change Impact (PM → any agent)

```
📋 PRD Update — PM → [Agent]
Section: [section name]
Change: [what changed]
Impact on you: [what the agent needs to do differently]
```

---

## Handoff Format

When an agent completes work and passes it to the next agent, use this format:

```
✅ Handoff — [From Agent] → [To Agent]
Task: [what was built/designed/analyzed]
Files changed:
  - [file path] — [what changed]
What to do next:
  - [specific action for the receiving agent]
Blocking issues (if any):
  - [anything that must be resolved before proceeding]
```

Example:

```
✅ Handoff — Backend → Frontend
Task: Inventory CRUD endpoints complete
Files changed:
  - app/api/inventory/v1/create/route.js — new
  - app/api/inventory/v1/list/route.js — new
  - lib/services/inventory.js — createInventoryItem, getInventoryItems
  - schemas/inventory.js — createInventoryItemSchema, listInventoryQuerySchema
What to do next:
  - Integrate via lib/api/inventory.js
  - Expected response shape: { data: { items, total, page, limit }, message }
Blocking issues: none
```

---

## Definition of Done (Global)

A feature is only done when ALL agents sign off:

| Agent    | Done When                                                                                    |
| -------- | -------------------------------------------------------------------------------------------- |
| PM       | PRD updated with final spec, version bumped                                                  |
| UI/UX    | Design decision doc complete, all states defined, handed off to Frontend                     |
| Backend  | All endpoints live, edge cases handled, API contract sent to Frontend                        |
| Frontend | UI built, all states implemented, all `data-testid` added + registered in app-constants.yaml |
| Tester   | Component audit done, endpoint audit done, E2E tests written and passing, reports updated    |
