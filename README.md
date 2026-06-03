# Personal Management

A personal productivity web app with three modules: **Inventory Management**, **Stock Trading**, and **Running Tracker**. Built as a single-user app — one auth session, one database, no multi-tenancy.

---

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 15 (App Router)                        |
| Language        | JavaScript / JSX                               |
| Database        | Supabase (PostgreSQL)                          |
| Auth            | Supabase SSR + JWT (cookie-based)              |
| Styling         | Tailwind CSS v4 + CSS variables                |
| UI Components   | shadcn/ui (Radix UI primitives)                |
| Forms           | react-hook-form + Zod                          |
| Background Jobs | Inngest (event-driven functions)               |
| External API    | Strava API (OAuth 2.0 + webhook)               |
| AI              | Anthropic Claude API (via `@anthropic-ai/sdk`) |
| Testing         | Cypress E2E                                    |

---

## Architecture

### API Layer

All API routes follow the pattern `app/api/{module}/v1/{resource}/route.js`. Each route:

1. Creates a Supabase SSR client and validates the session
2. Delegates business logic to a service in `lib/services/`
3. Returns JSON with consistent shape: `{ data, error, message }`

Route handlers never contain database queries directly — all SQL lives in service files.

### Service Layer

`lib/services/` is the only place that talks to the database. Services use either the SSR client (for user-scoped RLS queries) or the admin client (for operations that bypass RLS, e.g. webhook handlers, Inngest functions).

### Client API Layer

`lib/api/` contains thin fetch wrappers used by React components. Each function maps to one API endpoint, handles `401` by throwing `'UNAUTHORIZED'`, and throws on `!res.ok`.

### Auth

Supabase SSR cookie-based auth. `middleware.js` intercepts all `/main/**` and `/api/**` routes to refresh the session token. Protected API routes call `supabase.auth.getUser()` and return `401` if the session is invalid.

### Background Jobs (Inngest)

Strava sync, activity enrichment, and AI insight generation run as Inngest functions. The webhook at `/api/running/v1/sync/webhook` receives Strava events and emits Inngest events. Functions run outside the request cycle with retry support.

### AI Insights

Post-activity insights and analytics summaries are generated via Claude API. The service at `lib/services/running/ai/` builds context from activity data and sends a structured prompt. Insights are stored in `rt_insights` and served via the insights API.

---

## Agent System

Development uses 8 specialized AI agents (PM, Researcher, UI/UX, Backend, Frontend, Code Reviewer, Security Reviewer, Tester) coordinated via GitHub Issues and a project board. Agent definitions live in `.claude/agents/subagents/`. See `CLAUDE.md` for the full workflow.
