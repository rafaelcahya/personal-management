---
name: api-test-writer
description: Write or update Cypress API tests for this repo — spec file per menu, custom commands with WithSession/NoAuth variants, endpoint URLs from app-constants, auth setup with beforeEach, what to assert per HTTP method, IDOR checks, and what not to test. Use for any new or changed endpoint that needs test coverage.
---

# API Test Writer

API tests only send HTTP requests through custom commands — no `cy.visit`, no DOM. UI tests are out of scope for now.

## Files

| What                                                          | Where                                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Spec — **one file per menu/page**, all its endpoints together | `cypress/e2e/{module}/{menu}/{menu}-api.cy.js` (e.g. `running/race-log/race-log-api.cy.js`)                                     |
| Commands                                                      | `cypress/support/common/{module}/api/commands.js` or `.../{module}/api/{menu}/commands.js` — match the module's existing folder |
| Register commands                                             | add `import './common/...'` to `cypress/support/e2e.ts`                                                                         |
| Endpoint URLs                                                 | `cypress/fixtures/app-constants.json` → `endpoints.{group}.{key}` (Grep the group)                                              |

## Command pattern

```js
import constants from '../../../../fixtures/app-constants.json'

const LIST_BASE = constants.endpoints.currency_investments.list
const DELETE_BASE = constants.endpoints.currency_investments.delete

Cypress.Commands.add('getCurrencyInvestments', (qs = {}) => {
  return cy.apiRequestWithSession('GET', LIST_BASE, { qs })
})

Cypress.Commands.add('getCurrencyInvestmentsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', LIST_BASE, { qs })
})

Cypress.Commands.add('deleteCurrencyInvestment', (id) => {
  return cy.apiRequestWithSession('DELETE', `${DELETE_BASE}/${id}`)
})
```

- Every endpoint gets **both** a session command and a `...NoAuth` command.
- Names: `get…`, `create…`/`post…`, `update…`/`patch…`/`put…`, `delete…` + the resource.
- Never hardcode `/api/...` in commands or specs; never call `cy.request` directly in a spec.
- Check the import depth (`../../../../fixtures/...`) against the folder you're in.

## Spec structure

```js
describe('Race Log API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when unauthenticated', () => {
    cy.getRaceLogsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Race Log API — create', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 when title is missing', () => {
    cy.createRaceLog({ race_date: '2026-01-01', distance_m: 5000 }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})
```

- **Always `beforeEach(() => cy.setupApiAuthCookies())`, never `before()`.** `testIsolation` clears cookies between tests and the session helper caches its "already set" flag — with `before()` only the first test is authenticated.
- Separate `describe` blocks per concern (auth guard, list, create, update, delete, validation, IDOR). Keep them lean — no 8-block specs for one endpoint.
- Clean up rows you create (delete via API, or a DB task) so tests can re-run.

## What to assert

Checklist per method: [references/method-checklist.md](references/method-checklist.md). The short version:

| Method      | Must cover                                                                           |
| ----------- | ------------------------------------------------------------------------------------ |
| All         | 401 without session                                                                  |
| GET         | 200 shape + field types, query params (filter, page, limit, sort), empty-array guard |
| POST        | 201 + created fields in response, 400 for missing / wrong-type / out-of-range fields |
| PATCH / PUT | 200 with the new value, 400 for bad input, 404 for an unknown ID                     |
| DELETE      | 200 confirmation, 404 for unknown or already-deleted ID                              |
| ID routes   | **IDOR**: another user's ID → 404 (or 403), never 200                                |

- Validation status is **400**. Some older routes return 422 — assert what the route really returns and list those routes in your result comment. Never change route code.
- Response shape differs by module (`{ data, message }` for Running, `{ success, ... }` for Trade/Inventory) — assert the real one.

## Don't test

- Exact values from real data, array order (unless the endpoint promises a sort), timestamps, auto IDs.
- CSS, DOM, or UI behavior.
- The same thing twice in one file.
- Side effects in other tables (that's DB verification — see `db-verification`).
