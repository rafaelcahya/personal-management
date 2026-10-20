---
name: db-verification
description: Verify in Cypress tests that the API really wrote what it claims, by querying Supabase through the 4-layer DB task setup (Db.js query function, task wrapper, task registry, custom command). Use only when a test case needs to cross-check persisted data, soft deletes, or seed rows that have no create API.
---

# DB Verification

DB checks **supplement** API assertions — they never replace them. Create the DB layer only when a specific test case needs it.

## When to use

- A POST/PATCH/DELETE must be proven against the stored row.
- Soft delete: the row still exists with `deleted_at` set, but the API hides it (only tables that have the column — e.g. `trd_event_list`, `trd_currency_investments`; `rt_race_log` is a hard delete).
- Seeding data that has no create endpoint (e.g. notifications, IDOR rows owned by another user).

Don't use it for computed endpoints (dashboard, analytics, AI insights, sync, onboarding) or just to check a 200.

## The 4 layers

| #   | File                                                                                                               | Role                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1   | `cypress/support/db/{module}/{resource}/{resource}Db.js`                                                           | Supabase query function — receives the admin client                          |
| 2   | `cypress/plugin/tasks/{resource}Tasks.js` (Running: `cypress/plugin/tasks/running/{Resource}Tasks.js` also exists) | Wraps the query functions as `cy.task` handlers                              |
| 3   | `cypress/plugin/tasks/index.js`                                                                                    | Spread the new tasks into `registerTasks`                                    |
| 4   | `cypress/support/common/{module}/.../db-commands.js`                                                               | Custom command calling `cy.task(...)`; import it in `cypress/support/e2e.ts` |

Check which of these already exist for the module before adding anything (`ls cypress/support/db/{module}`).

## Pattern

```js
// 1. cypress/support/db/running/race-log/raceLogDb.js
export async function getSingleRaceLogFromDb(supabase, raceLogId, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select('id, title, race_date, distance_m')
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

// 2. cypress/plugin/tasks/raceLogTasks.js
import { getSingleRaceLogFromDb } from '../../support/db/running/race-log/raceLogDb.js'

export const raceLogTasks = (supabaseAdmin) => ({
  async getSingleRaceLogFromDb({ raceLogId, userId }) {
    return getSingleRaceLogFromDb(supabaseAdmin, raceLogId, userId)
  },
})

// 3. cypress/plugin/tasks/index.js →  ...raceLogTasks(supabaseAdmin),

// 4. custom command
Cypress.Commands.add('getSingleRaceLogFromDb', (raceLogId) => {
  return cy
    .getTestUserId()
    .then((userId) => cy.task('getSingleRaceLogFromDb', { raceLogId, userId }))
})
```

## Rules

- Every query filters by `user_id` (the test user from `cy.getTestUserId()`), except seed tasks that deliberately create another user's row for IDOR tests.
- `cy.task` must return JSON-serializable data or `null` — never `undefined` (Cypress fails the task).
- Throw with a clear `DB query failed: ...` message so a failing test shows the real reason.
- Task names are global — make them specific (`getSingleRaceLogFromDb`, not `getItem`).
- `getTestUserId` is defined in several `db-commands.js` files; reuse it, don't add another copy.
- Real table names: check with the `supabase-schema` skill or `Grep "from('"` in `lib/services/{module}` — don't guess. Running tables start with `rt_`.
