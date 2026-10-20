---
name: supabase-schema
description: Inspect, debug, or change the Supabase (Postgres) schema for this repo through the Supabase MCP tools — checking real tables before coding, applying migrations with the project's naming, RLS policies, indexes, advisors, and logs. Use for any new table/column/index/policy, or when debugging data or DB errors.
---

# Supabase Schema

Project ref: `kreuvyttowiwztojuvtk` (Postgres 17). Migrations are tracked **in Supabase's migration history**, applied through MCP `apply_migration` — the local `supabase/migrations/` folder only has one old file. Check history with `mcp__supabase__list_migrations`.

## Always inspect first

Before writing code that depends on a table, look at the real thing — don't trust PRD or memory for column names.

| Need                           | Tool                                       |
| ------------------------------ | ------------------------------------------ |
| Tables and columns             | `list_tables`                              |
| Ad-hoc read query / debug data | `execute_sql` (SELECT only)                |
| Schema change                  | `apply_migration` — never `execute_sql`    |
| Missing indexes, RLS gaps      | `get_advisors` (run after every migration) |
| DB / auth errors               | `get_logs` (`postgres`, `auth`, `api`)     |

## Making a change

1. Inspect the current table (`list_tables`, or `execute_sql` on `information_schema.columns`).
2. Write the migration SQL — idempotent where possible (`IF NOT EXISTS`).
3. Name it in snake_case, verb first, describing the change: `add_target_time_sec_to_rt_upcoming_races`, `create_rt_symptom_logs`, `enable_rls_forex_rate_cache`.
4. Put the SQL in your plan — **schema changes need explicit user approval** in the plan run. Only apply in the continue run.
5. `apply_migration`, then `get_advisors` (security + performance) and fix anything new.
6. Record non-obvious decisions in your memory proposal (backfills, nullable choices, risky changes).

## Table conventions

- Running tables use the `rt_` prefix (`rt_activities`, `rt_goals`) and Inventory tables use `inv_` (`inv_product_list`, `inv_budget`). Trading and shared tables still use plain names (`trade_list`, `event_list`) until their rename phases.
- Every user-owned table has `user_id uuid not null` referencing the user, plus `created_at timestamptz default now()`.
- Soft delete via `deleted_at timestamptz` where the module already uses it (`event_list`, `currency_investments`).
- Enum-like text columns get a `CHECK` constraint (see `notifications_type_check`) — adding a value needs a migration that drops and recreates the constraint.

## RLS — required on every new table

```sql
ALTER TABLE rt_example ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rt_example_owner_all" ON rt_example
  FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
```

Wrap `auth.uid()` in `(select ...)` so Postgres evaluates it once per query, not per row (the project fixed this across tables in `rls_perf_initplan_and_policy_consolidation`). One consolidated policy per table is preferred over several overlapping ones.

## Indexes

- Index every foreign key and every column you filter or sort by in a hot query (`user_id`, `user_id + date`).
- Partial indexes for soft-deleted tables: `... WHERE deleted_at IS NULL`.

## Don'ts

- Never run `INSERT/UPDATE/DELETE/ALTER` through `execute_sql` on real data without the user approving the exact SQL.
- Never disable RLS to "make it work". If a query fails under RLS, the service is probably missing `user_id` or using the wrong client.
- Never drop a column or table without a plan approval that names it.
