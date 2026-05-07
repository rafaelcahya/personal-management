# Tester Agent — Knowledge Layer

> Reference cookbook for this project's testing stack.
> These are the canonical patterns. Always follow these exactly unless a memory entry overrides them.

---

## Stack Identity

- **E2E Framework**: Cypress
- **Test location**: `cypress/e2e/`
- **Config**: `cypress.config.js`
- **Auth bypass**: via `CYPRESS_AUTH_SECRET`
- **Reports**: `cypress/reports/`
- **Constants**: `cypress/fixtures/app-constants.json` ← single source of truth for all URLs, endpoints, testIds
- **Project**: Next.js 15, Supabase SSR auth, React, Tailwind

---

## RULE: Never Hardcode Values in Tests

All URLs, API endpoints, and `data-testid` strings must be loaded from `cypress/fixtures/app-constants.json`.

```js
// Always do this
cy.fixture('app-constants').then((C) => {
  cy.visit(C.routes.inventory)
  cy.get(`[data-testid="${C.test_ids.inventory.table}"]`).should('exist')
  cy.intercept('GET', `${C.endpoints.inventory.list}*`, { ... })
})

// Never do this
cy.visit('/main/inventory')
cy.get('[data-testid="inventory-table"]')
cy.intercept('GET', '/api/inventory/v1/list*', { ... })
```

If a value is missing from `app-constants.json`, add it there first — then reference it. Keep `app-constants.yaml` in sync manually — YAML is for human readability only, JSON is what Cypress loads.

---

## RULE: Reports — Ask First, Then Generate

After every test run or code review cycle, **always ask the user before generating reports**:

> "Apakah kamu ingin saya buat regression report dan coverage report untuk task ini?"

Only generate if user confirms. If user says no, skip both.

### Regression Report (`cypress/reports/regression-report.md`)

- Overwrite each run — reflects the latest run only
- Always include `**App Version:**` — read from `.claude/PRD.md` → `Version:` field in the header

### Coverage Report (`cypress/reports/coverage-report.md`)

- **Cumulative — never overwrite from scratch**
- Read the existing file first, then:
  - Add new modules/features that didn't exist before
  - Update existing rows if coverage status changed (e.g. `Not Tested` → `Automated`)
  - Never delete existing rows — mark removed features as `[DEPRECATED]`
  - Append new entries to Automated Test Cases table
  - Recalculate Coverage Summary totals to reflect cumulative state
- Always include `**App Version:**` — read from `.claude/PRD.md`

---

## Workflow 1: Component Audit (data-testid Check)

**Before writing any test**, audit the target component for missing `data-testid` attributes.

### Step 1 — List testable elements in the component

Read the component file and identify every element that needs to be:

- Clicked (buttons, links, dropdowns)
- Typed into (inputs, textareas)
- Asserted (tables, error messages, empty states, skeletons, toasts)
- Navigated via keyboard

### Step 2 — Check against app-constants.yaml

Cross-reference each element against `cypress/fixtures/app-constants.yaml`.

### Step 3 — If data-testid is missing, request it from Frontend Agent

Do NOT write the test yet. Send this request first:

```
🔖 data-testid Request — Tester → Frontend
Component: [ComponentName] ([path/to/Component.jsx])
Missing IDs:
  - [testid-name] → [which element: e.g., "the main <table> element"]
  - [testid-name] → [which element: e.g., "the row-level actions dropdown"]
Needed for: [test file name, e.g., cypress/e2e/inventory/create-item.cy.js]
Action: Please add these data-testid attributes and register them in cypress/fixtures/app-constants.yaml
        under test_ids.[module].[key]
```

Wait for Frontend Agent to confirm before writing the test.

### Step 4 — After Frontend adds the IDs

Verify the IDs are added in both the component file and `app-constants.yaml`, then proceed.

---

## Workflow 2: Endpoint Audit (Backend Coverage Check)

**For every backend endpoint**, run through this checklist before writing the API test.

### Endpoint Test Matrix

For each endpoint, write test cases for ALL applicable rows:

| Scenario                      | Method         | Expected Status | What to Assert                                                        |
| ----------------------------- | -------------- | --------------- | --------------------------------------------------------------------- |
| Happy path                    | any            | 200 / 201       | Response shape `{ data, message }`, correct data returned             |
| Missing auth                  | any            | 401             | `{ error: 'Unauthorized' }`                                           |
| Valid auth, wrong user's data | GET/PUT/DELETE | 403 or 404      | Cannot access other user's resource                                   |
| Missing required field        | POST/PUT       | 400             | `{ error: 'Validation failed', message: '<field> ...' }`              |
| Invalid field type/format     | POST/PUT       | 400             | Zod validation error message                                          |
| Boundary: empty string        | POST/PUT       | 400             | Field required error                                                  |
| Boundary: negative number     | POST/PUT       | 400             | Min value error                                                       |
| Boundary: exceeds max length  | POST/PUT       | 400             | Max length error                                                      |
| Resource not found            | GET/PUT/DELETE | 404             | `{ error: 'Not found' }`                                              |
| Duplicate / conflict          | POST           | 409             | `{ error: 'Conflict' }`                                               |
| Simulated server error        | any            | 500             | `{ error: 'Internal server error', message: 'Something went wrong' }` |
| Pagination: page=1            | GET list       | 200             | Returns first N items, `total` count present                          |
| Pagination: page beyond range | GET list       | 200             | Returns empty array, not error                                        |

### Endpoint Audit Request to Backend Agent

If an endpoint is missing error handling for any row above, send this before writing the test:

```
⚠️ Endpoint Gap — Tester → Backend
Endpoint: [METHOD] [path, e.g., POST /api/inventory/v1/create]
Missing edge case handling:
  - [e.g., "Returns 200 instead of 400 when 'name' is empty string"]
  - [e.g., "No 404 when itemId does not belong to current user"]
Action: Please add handling for these cases so tests can assert the correct behavior.
```

---

## 1. Test File Structure

```js
// cypress/e2e/inventory/create-item.cy.js
import { recurse } from 'cypress-recurse' // if needed for retries

describe('Inventory — Create Item', () => {
  let C // app-constants

  before(() => {
    cy.fixture('app-constants').then((constants) => {
      C = constants
    })
  })

  beforeEach(() => {
    cy.loginBypass()
    cy.visit(C.routes.inventory)
  })

  afterEach(() => {
    cy.cleanupInventory()
  })

  it('should create an item successfully', () => {
    /* happy path */
  })
  it('should show validation error when name is empty', () => {
    /* validation */
  })
  it('should show validation error when stock is negative', () => {
    /* boundary */
  })
  it('should block unauthenticated access', () => {
    /* auth */
  })
  it('should handle API 500 error gracefully', () => {
    /* error state */
  })
  it('should show empty state when no items exist', () => {
    /* empty state */
  })
  it('should show skeleton while loading', () => {
    /* loading state */
  })
})
```

---

## 2. Auth Bypass Command

```js
// cypress/support/commands.js
Cypress.Commands.add('loginBypass', () => {
  cy.fixture('app-constants').then((C) => {
    cy.request({
      method: 'POST',
      url: C.endpoints.auth.cypress_login,
      body: { secret: Cypress.env('CYPRESS_AUTH_SECRET') },
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})
```

---

## 3. Happy Path Test

```js
it('should create an item successfully', () => {
  cy.get(`[data-testid="${C.test_ids.inventory.add_btn}"]`).click()
  cy.get(`[data-testid="${C.test_ids.inventory.name_input}"]`).type(C.seed.inventory_item.name)
  cy.get(`[data-testid="${C.test_ids.inventory.stock_input}"]`).type(
    String(C.seed.inventory_item.stock)
  )
  cy.get(`[data-testid="${C.test_ids.inventory.price_input}"]`).type(
    String(C.seed.inventory_item.price)
  )
  cy.get(`[data-testid="${C.test_ids.shared.submit_btn}"]`).click()

  cy.get(`[data-testid="${C.test_ids.shared.toast_success}"]`).should('be.visible')
  cy.get(`[data-testid="${C.test_ids.inventory.table}"]`)
    .contains(C.seed.inventory_item.name)
    .should('exist')
})
```

---

## 4. Validation Error Test

```js
it('should show validation error when name is empty', () => {
  cy.get(`[data-testid="${C.test_ids.inventory.add_btn}"]`).click()
  cy.get(`[data-testid="${C.test_ids.shared.submit_btn}"]`).click()

  cy.get(`[data-testid="${C.test_ids.inventory.name_error}"]`)
    .should('be.visible')
    .and('contain', 'Name is required')
})

it('should show validation error when stock is negative', () => {
  cy.get(`[data-testid="${C.test_ids.inventory.add_btn}"]`).click()
  cy.get(`[data-testid="${C.test_ids.inventory.name_input}"]`).type('Widget')
  cy.get(`[data-testid="${C.test_ids.inventory.stock_input}"]`).type('-1')
  cy.get(`[data-testid="${C.test_ids.shared.submit_btn}"]`).click()

  cy.get(`[data-testid="${C.test_ids.inventory.stock_error}"]`)
    .should('be.visible')
    .and('contain', 'Stock cannot be negative')
})
```

---

## 5. Auth Guard Test

```js
it('should block unauthenticated access', () => {
  cy.clearCookies()
  cy.visit(C.routes.inventory, { failOnStatusCode: false })
  cy.url().should('include', C.routes.login)
})
```

---

## 6. API Error Handling Test

```js
it('should show error state when API fails', () => {
  cy.intercept('POST', C.endpoints.inventory.create, {
    statusCode: 500,
    body: { error: 'Internal server error', message: 'Something went wrong' },
  }).as('createFail')

  cy.get(`[data-testid="${C.test_ids.inventory.add_btn}"]`).click()
  cy.get(`[data-testid="${C.test_ids.inventory.name_input}"]`).type('Widget A')
  cy.get(`[data-testid="${C.test_ids.shared.submit_btn}"]`).click()

  cy.wait('@createFail')
  cy.get(`[data-testid="${C.test_ids.shared.toast_error}"]`).should('be.visible')
})
```

---

## 7. Empty State Test

```js
it('should show empty state when no items exist', () => {
  cy.intercept('GET', `${C.endpoints.inventory.list}*`, {
    statusCode: 200,
    body: { data: { items: [], total: 0, page: 1, limit: 20 }, message: 'OK' },
  }).as('emptyList')

  cy.visit(C.routes.inventory)
  cy.wait('@emptyList')

  cy.get(`[data-testid="${C.test_ids.inventory.empty_state}"]`).should('be.visible')
  cy.get(`[data-testid="${C.test_ids.inventory.empty_state_cta}"]`).should('be.visible')
})
```

---

## 8. Loading State Test

```js
it('should show skeleton while loading', () => {
  cy.intercept('GET', `${C.endpoints.inventory.list}*`, (req) => {
    req.reply((res) => {
      res.setDelay(500)
    })
  }).as('slowList')

  cy.visit(C.routes.inventory)
  cy.get(`[data-testid="${C.test_ids.inventory.skeleton}"]`).should('be.visible')
  cy.wait('@slowList')
  cy.get(`[data-testid="${C.test_ids.inventory.skeleton}"]`).should('not.exist')
})
```

---

## 9. Keyboard Accessibility Test

```js
it('should be keyboard accessible', () => {
  cy.get(`[data-testid="${C.test_ids.inventory.add_btn}"]`).focus().type('{enter}')
  cy.get(`[data-testid="${C.test_ids.inventory.name_input}"]`).should('be.focused')

  cy.focused().type('Widget B').tab()
  cy.focused().should('have.attr', 'data-testid', C.test_ids.inventory.stock_input)

  cy.get('body').type('{esc}')
  cy.get(`[data-testid="${C.test_ids.inventory.dialog}"]`).should('not.exist')
})
```

---

## 10. Custom Commands Reference

```js
// cypress/support/commands.js — all reusable flows go here, never inline

cy.loginBypass()              // Auth: bypass Supabase SSR auth using CYPRESS_AUTH_SECRET
cy.seedInventory(items?)      // DB: insert test inventory items (uses seed defaults from app-constants)
cy.cleanupInventory()         // DB: delete all test data created in this test run
cy.seedTrades(trades?)        // DB: insert test trades
cy.cleanupTrades()            // DB: delete test trades
cy.visitInventory()           // Shorthand: loginBypass + visit inventory route
cy.visitTrading()             // Shorthand: loginBypass + visit trading route
```

When a flow is used in 2+ test files, extract it into a custom command — never repeat it inline.

---

## 11. DB Verification Test (Data Integrity)

Verifikasi bahwa data yang API kembalikan benar-benar tersimpan di database — bukan hanya response-nya saja.

### Cara kerja

Project sudah punya dua layer task untuk DB access:

**Layer 1 — Domain-specific tasks** (selalu gunakan ini lebih dulu):

```js
// cypress/plugin/tasks/ → domain-specific queries, lebih ekspresif
cy.task('getSingleProductFromDb', { productId, userId })
cy.task('getProductListFromDb', { userId })
cy.task('getTotalProductsFromDb', { userId })
cy.task('getProductWithQuantityFromDb', { productId, userId })
cy.task('getLatestProductHistoryFromDb', { productId, userId })
cy.task('getProductFavoriteStatusFromDb', { productId, userId })
cy.task('getSingleProductIncludeDeletedFromDb', { productId, userId })
```

**Layer 2 — Generic task** (untuk kasus yang belum punya domain task):

```js
// cypress/plugin/tasks/dbTasks.js → supabaseRawQuery
cy.task('supabaseRawQuery', {
  table: 'product_list',
  select: 'id, name, quantity',
  filters: { id: productId, user_id: userId },
  single: true,
})
```

### Pattern: API response vs DB

```js
it('should persist data correctly to database', () => {
  // 1. Panggil endpoint
  cy.request({
    method: 'POST',
    url: C.endpoints.inventory.create,
    body: { name: C.seed.inventory_item.name, stock: C.seed.inventory_item.stock },
  }).then((res) => {
    expect(res.status).to.eq(201)

    const { id, name, stock } = res.body.data

    // 2. Query DB langsung
    cy.task('getSingleProductFromDb', {
      productId: id,
      userId: res.body.data.user_id,
    }).then((dbRecord) => {
      // 3. Compare API response vs DB
      expect(dbRecord).to.not.be.null
      expect(dbRecord.name).to.eq(name)
      expect(dbRecord.quantity).to.eq(stock)
      expect(dbRecord.deleted_at).to.be.null
    })
  })
})
```

### Pattern: verify data NOT in DB after delete

```js
it('should remove data from database after delete', () => {
  const productId = '<seeded-id>'

  cy.request('DELETE', `${C.endpoints.inventory.delete}/${productId}`).then((res) => {
    expect(res.status).to.eq(200)

    // Verify soft delete — deleted_at harus terisi
    cy.task('getSingleProductIncludeDeletedFromDb', {
      productId,
      userId: '<test-user-id>',
    }).then((dbRecord) => {
      expect(dbRecord.deleted_at).to.not.be.null
    })
  })
})
```

### Pattern: verify count setelah bulk operation

```js
it('should reflect correct count in DB after bulk delete', () => {
  const userId = '<test-user-id>'

  // Ambil jumlah sebelum
  cy.task('getTotalProductsFromDb', { userId }).then((countBefore) => {
    cy.request('DELETE', C.endpoints.inventory.bulkDelete, {
      body: { ids: ['id-1', 'id-2'] },
    }).then(() => {
      // Ambil jumlah setelah
      cy.task('getTotalProductsFromDb', { userId }).then((countAfter) => {
        expect(countAfter).to.eq(countBefore - 2)
      })
    })
  })
})
```

### Kapan tambah domain-specific task baru

Jika `supabaseRawQuery` dipakai lebih dari 2x untuk query yang sama, buat domain task baru:

```
cypress/support/db/[module]/[entity]Db.js  ← tambah fungsi query di sini
cypress/plugin/tasks/[entity]Tasks.js      ← register sebagai cy.task()
cypress/plugin/tasks/index.js              ← import dan spread ke registerTasks
```

---

## 12. Network Intercept Cheatsheet

```js
// Stub with fixture file
cy.intercept('GET', `${C.endpoints.inventory.list}*`, { fixture: 'inventory/list.json' }).as(
  'getList'
)

// Stub inline with delay
cy.intercept('POST', C.endpoints.inventory.create, (req) => {
  req.reply({
    delay: 300,
    statusCode: 201,
    body: { data: { id: '123', name: 'Widget A' }, message: 'Created' },
  })
}).as('create')

// Assert on response
cy.wait('@create').its('response.statusCode').should('eq', 201)
cy.wait('@getList').its('response.body.data.items').should('have.length.gt', 0)
```

---

## 12. Run Commands Reference

```bash
# Run a single spec headless
npx cypress run --headless --spec "cypress/e2e/inventory/create-item.cy.js"

# Run all specs for a module
npx cypress run --headless --spec "cypress/e2e/inventory/*.cy.js"

# Check if dev server is up first
npx is-port-free 3000
```

---

## 13. CI — GitHub Actions

Workflow: `.github/workflows/cypress.yml`
Trigger: setiap **push** dan **pull request** ke branch `master`

**Apa yang dijalankan CI:**

1. Build Next.js
2. Start server (`npm run start`)
3. Wait until `http://localhost:3000` ready
4. Run semua Cypress tests headless
5. Upload `cypress/reports/` sebagai artifact (selalu)
6. Upload `cypress/screenshots/` sebagai artifact (hanya saat failure)

**GitHub Secrets yang harus dikonfigurasi:**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
CYPRESS_AUTH_SECRET
CYPRESS_TEST_EMAIL
CYPRESS_TEST_PASSWORD
ENCRYPTION_SECRET_KEY
ANTHROPIC_API_KEY
```

Tambahkan via: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

**Rules untuk Tester Agent:**

- Setiap test yang ditulis harus bisa berjalan headless (tidak bergantung browser window)
- Jika test butuh env var yang tidak ada di secrets list di atas, tambahkan ke list ini dan inform user untuk setup di GitHub
- Test yang BLOCKED karena missing env var harus tetap ditulis tapi di-skip dengan `it.skip()` + comment alasan
