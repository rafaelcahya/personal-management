# Tester Knowledge

## Custom Commands Structure

All API requests must be wrapped as Cypress custom commands. Never write raw requests in test files.

```
cypress/support/common/running/api/
├── activities/
│   └── commands.js    ← already created
├── ai/
│   └── commands.js
├── dashboard/
│   └── commands.js
└── ...
```

Every new `commands.js` must be imported in `cypress/support/e2e.ts`.

## Command Template

```js
import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.{key}.{subkey}

Cypress.Commands.add('{commandName}', (params) => {
  return cy.apiRequestWithSession('METHOD', BASE, { body/qs: params })
})

Cypress.Commands.add('{commandName}NoAuth', (params) => {
  return cy.apiRequestNoAuth('METHOD', BASE, { body/qs: params })
})
```

## Command Naming Convention

| Pattern                      | Usage                           |
| ---------------------------- | ------------------------------- |
| `cy.getActivities(qs)`       | GET list — authenticated        |
| `cy.getActivitiesNoAuth(qs)` | GET list — unauthenticated      |
| `cy.getActivityDetail(id)`   | GET single item — authenticated |
| `cy.patchActivity(id, body)` | PATCH — authenticated           |
| `cy.postActivity(body)`      | POST — authenticated            |
| `cy.deleteActivity(id)`      | DELETE — authenticated          |
| `cy.{command}NoAuth(...)`    | Same but unauthenticated        |

## `app-constants.json` Endpoint Keys (Running Module)

| Key                        | Subkeys                                                                                                                                                                                | Endpoint                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `running_manual`           | `activities`                                                                                                                                                                           | `/api/running/v1/activities`        |
| `running_manual`           | `subjective_health`                                                                                                                                                                    | `/api/running/v1/health/subjective` |
| `running_manual`           | `weight_log`                                                                                                                                                                           | `/api/running/v1/health/weight`     |
| `running_dashboard`        | `dashboard`                                                                                                                                                                            | `/api/running/v1/dashboard`         |
| `running_gear`             | `list` / `update`                                                                                                                                                                      | `/api/running/v1/gear`              |
| `running_race_log`         | `list` / `create` / `detail` / `update` / `delete`                                                                                                                                     | `/api/running/v1/race-log`          |
| `running_goals`            | `update`                                                                                                                                                                               | `/api/running/v1/goals`             |
| `running_activity_streams` | `get`                                                                                                                                                                                  | `/api/running/v1/activities`        |
| `running_ai_insights`      | `list` / `generate`                                                                                                                                                                    | `/api/running/v1/ai/insights`       |
| `running_analytics`        | `target_effort` / `personal_bests` / `calorie_trend` / `zones` / `zones_reference` / `gear` / `fitness_age` / `endurance_score` / `pmc` / `session_profile` / `temperature_efficiency` | `/api/running/v1/analytics/...`     |
| `running_user_profile`     | `get` / `patch`                                                                                                                                                                        | `/api/running/v1/user/profile`      |
| `running_user`             | `settings` / `activities` / `push_subscription`                                                                                                                                        | `/api/running/v1/user/...`          |
| `running_upcoming_races`   | `list` / `create` / `detail` / `update` / `delete`                                                                                                                                     | `/api/running/v1/upcoming-races`    |
| `running_ai`               | `symptoms` / `injury_coach` / `injury_coach_history`                                                                                                                                   | `/api/running/v1/...`               |
| `running_analytics_ai`     | `insights` / `generate` / `staleness` / `daily` / `followup`                                                                                                                           | `/api/running/v1/ai/insights/...`   |
| `running_sync`             | `sync_strava` / `sync_status`                                                                                                                                                          | `/api/running/v1/sync/...`          |

> For path params (e.g. `/api/running/v1/symptoms/:id`), append the ID manually: `` `${BASE}/${id}` ``

## DB Custom Commands Structure

DB commands verify API responses against the actual Supabase database. Only created when a specific testcase requires it — not upfront.

```
cypress/support/common/running/db/
├── activities/commands.js
├── race-log/commands.js
├── upcoming-races/commands.js
├── goals/commands.js
├── gear/commands.js
├── user/commands.js
└── injury-ai/commands.js
```

Every new `db/{module}/commands.js` must be imported in `cypress/support/e2e.ts`.

## DB 4-Layer Structure

```
cypress/support/db/running/{module}/{module}Db.js        ← Supabase query function
cypress/plugin/tasks/running/{Module}Tasks.js             ← wraps Db.js as cy.task()
cypress/plugin/tasks/index.js                             ← registers tasks
cypress/support/common/running/db/{module}/commands.js   ← Cypress custom command
```

## DB Command Template

```js
// cypress/support/common/running/db/{module}/commands.js
Cypress.Commands.add('{commandName}FromDb', (id) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('{commandName}FromDb', { id, userId })
  })
})
```

## DB Query Function Template

```js
// cypress/support/db/running/{module}/{module}Db.js
export async function {commandName}FromDb(supabase, id, userId) {
  const { data, error } = await supabase
    .from('{table_name}')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}
```

## Supabase Table Names (Running Module)

| Module         | Table               |
| -------------- | ------------------- |
| activities     | `rt_activities`     |
| race-log       | `rt_race_log`       |
| upcoming-races | `rt_upcoming_races` |
| goals          | `rt_goals`          |
| gear           | `rt_gear`           |
| user profile   | `rt_users`          |
| user settings  | `rt_user_settings`  |
| injury-ai      | `rt_symptom_logs`   |

Modules with NO DB commands (aggregated/computed): `dashboard`, `analytics`, `ai-insights`, `sync`, `onboarding`.

## What Each Test File Should Contain

Refer to `tester-agent.md` for full checklist per HTTP method. Summary:

| Method | Key checks                                                             |
| ------ | ---------------------------------------------------------------------- |
| GET    | auth guard, response shape, field types, query params                  |
| POST   | auth guard, success status, validation (422), required fields          |
| PATCH  | auth guard, updated field in response, validation (422), 404 on bad ID |
| PUT    | auth guard, full replace behavior, validation (422), 404 on bad ID     |
| DELETE | auth guard, success confirmation, 404 on bad ID                        |

## UI Testing

UI tests are **temporarily out of scope**. Do not write, run, or review UI test files. Focus only on API testing and DB verification. UI tests will be rebuilt from scratch in a future session.

## QA Report

Single report: `cypress/reports/qa-coverage.md`
