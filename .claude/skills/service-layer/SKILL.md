---
name: service-layer
description: Write or change backend business logic in lib/services/ for this repo — one function per file, injected Supabase client, user_id ownership filters, column selection, pagination, error handling, admin client rules, encryption, and common Supabase query patterns. Use whenever a route needs a DB query or a business rule.
---

# Service Layer

## Layout

```
lib/services/{domain}/{resource}/{verbNoun}.js     e.g. lib/services/running/goals/updateGoal.js
lib/services/{domain}/{verbNoun}.js                e.g. lib/services/trade/createTrade.js
```

- **One exported function per file**, named `verbNoun` (`getActivities`, `updateGoal`).
- Domains: `running`, `trade`, `inventory`, `user`, `event`, `fee`, `forex`, `investmentFlow`, `currencyInvestment`, `watchlist`, `valuation`, `home`, plus `notification.js`.
- Never import across domains (e.g. inventory ↔ trade). Shared helpers go in `lib/utils/` or `lib/services/{domain}/utils/`.

## Function shape

Preferred for new code (Running style) — the route passes in the client it already created:

```js
/**
 * Returns null if the goal doesn't exist or isn't owned by the user.
 */
export async function updateGoal(supabase, userId, goalId, payload) {
  const { data, error } = await supabase
    .from('rt_goals')
    .update(payload)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select('id, goal_type, title, target_date, status, created_at')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ?? null
}
```

Older modules (Trade, Inventory) create the client inside the service (`const supabase = await createClient()`) and take `(userId, payload)`. When you edit those files, keep their style; don't mix both in one module.

## Rules

1. **Ownership on every query** — every select, update, and delete by ID also has `.eq('user_id', userId)`. Return `null` when nothing matched; the route turns that into 404.
2. **Select columns** — never `.select('*')` in new code. List the columns the caller needs.
3. **`.maybeSingle()`** when a row may not exist; `.single()` only when it must (e.g. right after insert).
4. **Throw on Supabase errors** — the route's catch returns a generic 500. Don't return raw `error.message` to callers that pass it to the client.
5. **Pagination** — offset `page` + `limit` (max 100). Run a `{ count: 'exact', head: true }` query first and short-circuit to an empty page when `from >= total` — `.range()` past the last row throws `PGRST103`.
6. **No magic values** — named constants (`MAX_LIMIT`, `VALID_SORTS`, thresholds).
7. **Keep functions small** — over ~40 lines, split into helpers in the same file or a `utils/` file.
8. **Cache invalidation** — Running analytics are cached; after a write that changes activity data, call `invalidateRunningAnalytics` (`lib/services/running/analyticsCache.js`), like the activities POST route does.

## Admin client

`import { createAdminClient } from '@/lib/supabase/admin'` bypasses RLS. Use it only for background jobs, webhooks, and cross-user system work — never because a normal query "didn't work".

- Create it inside the function, never at module scope.
- Every query still filters by `user_id` — there's no RLS safety net.
- Never import it from `lib/api/` or any file the browser can load.

## Encryption

Two helpers exist — use the one the domain already uses:

| Helper                                | Key env var                    | Algorithm   | Used for                                          |
| ------------------------------------- | ------------------------------ | ----------- | ------------------------------------------------- |
| `lib/utils/running/encrypt.js`        | `ENCRYPTION_KEY` (64-char hex) | aes-256-gcm | Running (Strava tokens) — **prefer for new code** |
| `lib/utils/encrypt.js` / `decrypt.js` | `ENCRYPTION_SECRET_KEY`        | aes-256-ctr | older modules                                     |

Never log plaintext or keys.

More query patterns: [references/query-patterns.md](references/query-patterns.md).
