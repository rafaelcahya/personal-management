---
name: ownership-idor-check
description: Security check for authorization in this repo — every route and service that takes an ID must scope it to the logged-in user (IDOR), admin-client usage without RLS, bulk operations, list/search scoping, middleware public paths, and the Cypress auth bypass. Use in security reviews and when building any endpoint that reads or writes by ID.
---

# Ownership / IDOR Check

The question for every endpoint: **can logged-in user A read or change user B's data by sending B's ID?**

## Route → service trace

For each new or changed route that takes an ID (path `[id]`, query, or body):

1. The route gets `user.id` from `supabase.auth.getUser()` — never from the body, query, or headers.
2. It passes `user.id` to the service.
3. The service filters **every** query on that ID with `.eq('user_id', userId)` — the read **and** the update/delete.
4. Not found or not owned → `null` → 404 (don't leak that the row exists).

## Admin client

`createAdminClient()` bypasses RLS (9 routes use it today, plus Inngest jobs and webhooks).

- [ ] Used only where RLS bypass is really needed (jobs, webhooks, system writes, cross-table work).
- [ ] Every query still filters by the right `user_id` — there's no safety net.
- [ ] Created inside the function, not at module scope.
- [ ] Never imported from `lib/api/`, components, or anything the browser loads.
- [ ] Webhook routes verify the sender (e.g. Strava's `STRAVA_WEBHOOK_VERIFY_SECRET`) before trusting any user ID in the payload.

## Lists, search, bulk

- [ ] List and search queries filter by `user_id` **before** applying search terms and pagination.
- [ ] Bulk endpoints (`.in('id', ids)`) also filter by `user_id`, and compare the affected count with the requested count.
- [ ] Joins/embeds don't pull another user's rows through a relation.

## RLS (defense in depth)

- [ ] New tables have RLS enabled with an owner policy `(select auth.uid()) = user_id` (see `supabase-schema`).
- [ ] No migration disables RLS or adds a `USING (true)` policy on user data.

## Middleware and bypass

- [ ] No new path added to the public allowlist in `middleware.js` (today: `/auth/v1/callback`, `/login`, `/api/auth`, `/api/inngest`, `/docs`, `/api/docs`, the Strava OAuth callback) unless it does its own verification.
- [ ] The Cypress bypass still requires **both** `NODE_ENV !== 'production'` **and** `CYPRESS_BYPASS_ENABLED === 'true'` plus the `CYPRESS_AUTH_SECRET` match. No new bypass that checks only `NODE_ENV`.
- [ ] Rate limiting isn't skipped for new AI or sync paths (`getRateLimitTier`).

## Finding example

```
[S-1] CRITICAL — lib/services/running/goals/deleteGoal.js:8 — deletes by id only, no user_id filter.
Attack: logged-in user sends DELETE /api/running/v1/goals/{someone else's goal id} → row is deleted.
Fix: add .eq('user_id', userId) and return null when nothing matched.
```

Test it the same way: the Tester's IDOR case (`api-test-writer`) uses another user's ID and expects 404.
