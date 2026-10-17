---
name: api-route-builder
description: Build or change a Next.js 15 API route handler in app/api/ for this repo — URL style per module, auth guard, Zod validation, calling the service, response shape per module, status codes, error logging, and registering the endpoint in app-constants. Use when creating or editing any route.js under app/api/.
---

# API Route Builder

A route handler only does: **auth → parse → validate → call service → respond**. No DB queries and no business logic in the route — that goes in `lib/services/` (see the `service-layer` skill).

## Steps for a new endpoint

1. **Pick the URL** — match the module's existing style (table below). Check neighbors with `ls app/api/{module}/v1/`.
2. **Schema** — add or reuse a Zod schema in `schemas/{resource}.js` (see the `zod-schema` skill).
3. **Service** — one function per file in `lib/services/{domain}/{resource}/{verbNoun}.js` (see `service-layer`).
4. **Route** — copy the pattern for the module's response shape: [references/route-patterns.md](references/route-patterns.md).
5. **Register** the endpoint in **both** `cypress/fixtures/app-constants.json` and `.yaml` under `endpoints.{group}.{key}` (Grep for the group first — e.g. `running_goals`, `trading_event`).
6. **Lint** — `npx eslint <changed files> --fix --quiet` → 0 errors.
7. **Handoff** — post an API Contract comment on the issue (`git-workflow` skill).

## URL style — match the module

| Style                     | Modules                                                                      | Example                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| REST (method on resource) | `running`, `notifications`, all new modules                                  | `GET/POST /api/running/v1/activities` · `GET/PATCH/DELETE /api/running/v1/activities/[id]`                              |
| Action path               | `trade`, `inventory`, `watchlist`, `currency-investments`, `investment-flow` | `GET /api/trade/v1/trade/list` · `POST .../trade/create` · `PUT .../trade/update/[id]` · `DELETE .../trade/delete/[id]` |

- Single item ID → dynamic segment `[id]`, read with `const { id } = await params` (params is a Promise in Next.js 15).
- Filters and pagination → query params. Non-CRUD actions → sub-path (`/ai/insights/generate`).
- Never put secrets or tokens in query params.

## Response shape — match the module, never mix inside one

| Modules                  | Success                                                                   | Error                       |
| ------------------------ | ------------------------------------------------------------------------- | --------------------------- |
| Running, Notifications   | `{ data, message }` (lists may return the service result object directly) | `{ error, message }`        |
| Trade, Inventory, others | `{ success: true, <entity> }` or `{ success: true, data }`                | `{ success: false, error }` |

Check one existing route in the same module before writing and copy its shape exactly.

## Status codes

| Code      | When                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| 200 / 201 | OK / created                                                                                                       |
| **400**   | Zod validation failed or invalid JSON body — **always 400 in new code** (some old routes use 422; don't copy that) |
| 401       | No session (`authError \|\| !user`)                                                                                |
| 403       | Logged in but not the owner (only when you can tell; otherwise 404)                                                |
| 404       | Not found — or not owned (service returned `null`)                                                                 |
| 409       | Duplicate / unique constraint                                                                                      |
| 500       | Anything unexpected — generic message only                                                                         |

## Rules

- Server client: `import { createClient } from '@/lib/supabase/server'` → `const supabase = await createClient()`. There is no `createServerClient`.
- Auth check comes first, every time: `const { data: { user }, error: authError } = await supabase.auth.getUser()`.
- Wrap `request.json()` in its own try/catch → 400 `Invalid JSON in request body`.
- Zod 4: read errors from `parsed.error.issues` (not `.errors`).
- Pass `user.id` to the service — never trust a `user_id` from the body or query.
- 500 responses never include `err.message`, DB column names, or stack traces. Log instead: `console.error('[module/resource METHOD]', err)` — never log tokens, passwords, or keys.
- Rate limiting is global in `middleware.js` (`lib/rate-limit.js`, tiers `ai`, `sync`, `valuation`, `standard` picked by path). New AI or sync routes should land under a path that `getRateLimitTier()` maps to the right tier — check it.
- Long or slow work (AI generation, Strava sync) → send an Inngest event and return early (see `background-job`).
- Next.js details when needed: `.claude/skills/next-best-practices/route-handlers.md`, `async-patterns.md`, `runtime-selection.md`.
