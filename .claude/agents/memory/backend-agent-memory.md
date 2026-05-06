# Backend Agent Memory

> This file is the persistent memory for the Senior Backend Engineer Agent.
> Update after every significant API design decision, schema change, or service pattern discovery.
> Format: newest entries at the top of each section.

---

## Architecture

<!-- Record structural decisions about how the backend is organized — layer boundaries, module ownership, infra choices -->

### Layer Map

| Layer           | Location                                  | Responsibility                                                   |
| --------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| Route Handler   | `app/api/[resource]/v1/[action]/route.js` | Parse request, call service, return response — no business logic |
| Service         | `lib/services/`                           | All business logic, domain rules, DB queries                     |
| Supabase Client | `lib/supabase/server.ts`                  | Authenticated server-side operations (cookie-based)              |
| Supabase Admin  | `lib/supabase/admin.js`                   | Admin ops that bypass RLS — use with extreme care                |
| Validation      | `schemas/`                                | Zod schemas — single source of truth for all input shapes        |
| Utilities       | `lib/utils/`                              | Shared helpers with no domain dependency                         |

### Domain Boundaries

<!-- Which service owns which data — update when a new domain is added or a boundary is redrawn -->

| Domain    | Service File                | Tables Owned                          | Notes                          |
| --------- | --------------------------- | ------------------------------------- | ------------------------------ |
| Inventory | `lib/services/inventory.js` | <!-- e.g., items, stock_movements --> | <!-- any cross-domain note --> |
| Trading   | `lib/services/trade.js`     | <!-- e.g., trades, portfolio -->      | <!-- any cross-domain note --> |
| User      | `lib/services/user.js`      | <!-- e.g., profiles -->               | <!-- any cross-domain note --> |
| Fee       | `lib/services/fee.js`       | <!-- e.g., fee_rules -->              | <!-- any cross-domain note --> |
| Event     | `lib/services/event.js`     | <!-- e.g., events -->                 | <!-- any cross-domain note --> |

### Architecture Decisions

<!-- Non-obvious structural choices that shaped how the backend is built -->

| Date                | Decision                                                        | Rationale    | Alternatives Rejected             |
| ------------------- | --------------------------------------------------------------- | ------------ | --------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- e.g., "services never cross-call — use events instead" --> | <!-- why --> | <!-- what else was considered --> |

---

## API Design Decisions

<!-- Record non-obvious choices in route/response design and why they were made -->

| Date                | Endpoint               | Decision                  | Rationale    |
| ------------------- | ---------------------- | ------------------------- | ------------ |
| <!-- YYYY-MM-DD --> | <!-- POST /api/... --> | <!-- what was decided --> | <!-- why --> |

---

## Schema & Migration Notes

<!-- Track schema changes that required careful handling — backfills, nullable columns, index additions -->

| Date                | Table               | Change                                     | Risk Note                     |
| ------------------- | ------------------- | ------------------------------------------ | ----------------------------- |
| <!-- YYYY-MM-DD --> | <!-- table_name --> | <!-- added column / index / constraint --> | <!-- any migration caveat --> |

---

## Service Layer Patterns

<!-- Patterns established in lib/services/ that should be followed for consistency -->

- <!-- YYYY-MM-DD: pattern + which service it's in -->

---

## Security Decisions

<!-- Auth, encryption, or RLS decisions that are non-obvious from reading the code -->

| Date                | Area                      | Decision               | Why             |
| ------------------- | ------------------------- | ---------------------- | --------------- |
| <!-- YYYY-MM-DD --> | <!-- Auth/RLS/Encrypt --> | <!-- what was done --> | <!-- reason --> |

---

## Supabase Gotchas

<!-- Quirks discovered in Supabase/PostgreSQL behavior specific to this project -->

- <!-- YYYY-MM-DD: what happened + workaround -->

---

## Performance Findings

<!-- Slow queries, N+1 issues, or missing indexes found and fixed -->

| Date                | Query / Service           | Issue                  | Fix Applied                            |
| ------------------- | ------------------------- | ---------------------- | -------------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- service.function --> | <!-- what was slow --> | <!-- index / query rewrite / cache --> |

---

## Lessons Learned

<!-- Non-obvious discoveries — avoid re-learning the same thing -->

- <!-- YYYY-MM-DD: lesson -->

---

## Cross-Agent Signals

<!-- Issues raised by Frontend or QA that require backend changes -->

| Date                | From Agent              | Signal           | Action Taken                      |
| ------------------- | ----------------------- | ---------------- | --------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- Frontend/QA/PM --> | <!-- finding --> | <!-- API change / service fix --> |
