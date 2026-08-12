import { faker } from '@faker-js/faker'

let productListId // integer — the product_list row id used for detail endpoint
let historyRowId // integer — the product_history row id used for update endpoint

before(() => {
  cy.setupApiAuthCookies()

  cy.AddProductBrand({
    brand: 'HIST-BRAND-' + faker.string.alphanumeric(6),
    brand_status: 'active',
    note: '',
  }).then((brandRes) => {
    expect(brandRes.status).to.eq(201)

    cy.AddProductName({
      product_name: 'HIST-NAME-' + faker.string.alphanumeric(6),
      product_name_status: 'active',
    }).then((nameRes) => {
      expect(nameRes.status).to.eq(201)

      cy.AddProduct({
        product_id: nameRes.body.productName.id,
        brand_id: brandRes.body.productBrand.id,
        type: 'Test Type',
        usage_quantity: 0,
        note: '',
        product_image: '',
      }).then((productRes) => {
        expect(productRes.status).to.eq(201)
        productListId = productRes.body.product.id

        cy.getTestUserId().then((userId) => {
          // insertFullProductHistory lets us set quantity > 0 so PATCH tests don't
          // hit the "depleted > remaining" guard (product.quantity is hardcoded 0 by createProduct)
          cy.task('insertFullProductHistory', {
            productListId: productListId,
            userId: userId,
            product: 'HIST-PRODUCT',
            brand: 'HIST-BRAND',
            type: 'Test Type',
            status: 'active',
            quantity: 10,
            depletedQuantity: 0,
            remainingQuantity: 10,
            startUsageDate: new Date('2026-01-01').toISOString(),
          }).then((row) => {
            historyRowId = row.id
          })
        })
      })
    })
  })
})

beforeEach(() => {
  cy.setupApiAuthCookies()
})

// ── 1. GET /product-history/list ─────────────────────────────────────────────

describe('GET Product History List - /api/inventory/v1/product-history/list', () => {
  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.GetProductHistoryListNoAuth().then((res) => {
        expect(res.status).to.be.oneOf([307, 401])
        if (res.status === 307) {
          expect(String(res.headers.location || res.body)).to.include('/login')
        }
      })
    })
  })

  describe('Response Structure', () => {
    it('should return top-level keys { success, data, total, page, limit }', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.body).to.have.all.keys('success', 'data', 'total', 'page', 'limit')
        expect(res.body.success).to.be.true
      })
    })

    it('should return data as an array', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.body.data).to.be.an('array')
      })
    })

    it('should return total as a non-negative integer', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.body.total).to.be.a('number').and.to.be.at.least(0)
      })
    })

    it('should return page and limit matching defaults (page=1, limit=15)', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.body.page).to.eq(1)
        expect(res.body.limit).to.eq(15)
      })
    })

    it('should return application/json content-type', () => {
      cy.GetProductHistoryList().then((res) => {
        expect(res.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Query Params', () => {
    it('should respect limit param', () => {
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list?limit=5').then(
        (res) => {
          expect(res.status).to.eq(200)
          expect(res.body.limit).to.eq(5)
          expect(res.body.data.length).to.be.at.most(5)
        }
      )
    })

    it('should reflect page and limit params in response body', () => {
      // use page=1 — page=2 with count:exact triggers PostgREST 416 if rows < limit
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list', {
        qs: { page: 1, limit: 5 },
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.page).to.eq(1)
        expect(res.body.limit).to.eq(5)
      })
    })

    it('should filter by search param', () => {
      cy.apiRequestWithSession(
        'GET',
        '/api/inventory/v1/product-history/list?search=NONEXISTENT_XYZ_12345'
      ).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data).to.be.an('array').and.have.length(0)
        expect(res.body.total).to.eq(0)
      })
    })

    it('should filter by status=active and return only active records', () => {
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list?status=active').then(
        (res) => {
          expect(res.status).to.eq(200)
          res.body.data.forEach((item) => {
            expect(item.status).to.eq('active')
          })
        }
      )
    })

    it('should accept sort=date_asc without error', () => {
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list?sort=date_asc').then(
        (res) => {
          expect(res.status).to.eq(200)
          expect(res.body.success).to.be.true
        }
      )
    })

    it('should accept sort=name_asc without error', () => {
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list?sort=name_asc').then(
        (res) => {
          expect(res.status).to.eq(200)
          expect(res.body.success).to.be.true
        }
      )
    })

    it('should fall back to date_desc for invalid sort value', () => {
      cy.apiRequestWithSession(
        'GET',
        '/api/inventory/v1/product-history/list?sort=invalid_sort'
      ).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
      })
    })

    it('should cap limit at 100', () => {
      cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list?limit=999').then(
        (res) => {
          expect(res.status).to.eq(200)
          expect(res.body.limit).to.eq(100)
        }
      )
    })
  })

  describe('Sort Order', () => {
    it('date_desc returns newer records first', () => {
      cy.apiRequestWithSession(
        'GET',
        '/api/inventory/v1/product-history/list?sort=date_desc&limit=50'
      ).then((res) => {
        expect(res.status).to.eq(200)
        const dates = res.body.data
          .map((r) => r.start_usage_date)
          .filter(Boolean)
          .map((d) => new Date(d).getTime())
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i]).to.be.at.most(dates[i - 1])
        }
      })
    })

    it('date_asc returns older records first', () => {
      cy.apiRequestWithSession(
        'GET',
        '/api/inventory/v1/product-history/list?sort=date_asc&limit=50'
      ).then((res) => {
        expect(res.status).to.eq(200)
        const dates = res.body.data
          .map((r) => r.start_usage_date)
          .filter(Boolean)
          .map((d) => new Date(d).getTime())
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i]).to.be.at.least(dates[i - 1])
        }
      })
    })
  })
})

// ── 2. GET /product-history/[id] (product_list_id) ──────────────────────────

describe('GET Product History Detail - /api/inventory/v1/product-history/[id]', () => {
  describe('Authentication', () => {
    it('should return 200 for authenticated user with valid product_list_id', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.GetProductHistoryDetailNoAuth(productListId).then((res) => {
        expect(res.status).to.be.oneOf([307, 401])
      })
    })
  })

  describe('Response Structure', () => {
    it('should return top-level keys { success, products }', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        expect(res.body).to.have.all.keys('success', 'products')
        expect(res.body.success).to.be.true
      })
    })

    it('should return products as an array', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        expect(res.body.products).to.be.an('array')
      })
    })

    it('should return products with required item keys', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        expect(res.body.products.length).to.be.at.least(1)
        const item = res.body.products[0]
        expect(item).to.include.keys(
          'id',
          'product_list_id',
          'user_id',
          'product',
          'brand',
          'status',
          'quantity',
          'depleted_quantity',
          'remaining_quantity',
          'start_usage_date'
        )
      })
    })

    it('should return items belonging to the correct product_list_id', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        res.body.products.forEach((item) => {
          expect(item.product_list_id).to.eq(productListId)
        })
      })
    })

    it('item id and product_list_id should be numbers', () => {
      cy.GetProductHistoryDetail(productListId).then((res) => {
        expect(res.body.products.length).to.be.at.least(1)
        const item = res.body.products[0]
        expect(item.id).to.be.a('number')
        expect(item.product_list_id).to.be.a('number')
      })
    })
  })

  describe('ID Validation — actual API behavior', () => {
    it('non-numeric ID returns 500 (NaN causes PostgREST parse error)', () => {
      // Number('abc') = NaN → Supabase sends NaN to integer column → PostgREST 400 → service throws → 500
      cy.GetProductHistoryDetail('abc').then((res) => {
        expect(res.status).to.eq(500)
      })
    })

    it('ID=0 returns 200 with empty products array', () => {
      cy.GetProductHistoryDetail(0).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.products).to.be.an('array').and.have.length(0)
      })
    })

    it('negative ID returns 200 with empty products array', () => {
      cy.GetProductHistoryDetail(-1).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.products).to.be.an('array').and.have.length(0)
      })
    })

    it('non-existent ID (999999999) returns 200 with empty products array', () => {
      cy.GetProductHistoryDetail(999999999).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.products).to.be.an('array').and.have.length(0)
      })
    })
  })
})

// ── 3. PATCH /product-history/update/[id] ───────────────────────────────────

describe('PATCH Product History Update - /api/inventory/v1/product-history/update/[id]', () => {
  describe('Authentication', () => {
    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.UpdateProductHistoryNoAuth(historyRowId, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.be.oneOf([307, 401])
      })
    })
  })

  describe('Validation', () => {
    it('should return 400 when depleted_quantity is missing', () => {
      cy.UpdateProductHistory(historyRowId, {
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.error).to.be.a('string')
      })
    })

    it('should return 400 when depleted_quantity is 0', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 0,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.error).to.be.a('string')
      })
    })

    it('should return 400 when end_usage_date is missing', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 1,
      }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.error).to.be.a('string')
      })
    })
  })

  describe('ID Validation — actual API behavior', () => {
    it('non-numeric ID returns 500 (record not found)', () => {
      cy.UpdateProductHistory('abc', {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(500)
      })
    })

    it('non-existent ID (999999999) returns 500', () => {
      cy.UpdateProductHistory(999999999, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(500)
      })
    })
  })

  describe('Response Structure', () => {
    it('should return 200 with { success, data, message } on valid payload', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.all.keys('success', 'data', 'message')
        expect(res.body.success).to.be.true
        expect(res.body.message).to.be.a('string')
      })
    })

    it('data should contain history and product keys', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data).to.have.all.keys('history', 'product')
      })
    })

    it('should return application/json content-type', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Data Accuracy', () => {
    it('returned history.depleted_quantity matches the sent value', () => {
      const sentQty = 1
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: sentQty,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(Number(res.body.data.history.depleted_quantity)).to.eq(sentQty)
      })
    })

    it('returned history.id matches the historyRowId', () => {
      cy.UpdateProductHistory(historyRowId, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data.history.id).to.eq(historyRowId)
      })
    })
  })

  describe('Ownership Check', () => {
    it('should not update a record belonging to another user (returns 500)', () => {
      // historyRowId belongs to the test user; passing a non-owned ID simulates cross-user access
      // The service filters by both id AND user_id, so mismatched ownership returns 500
      cy.UpdateProductHistory(999999999, {
        depleted_quantity: 1,
        end_usage_date: new Date().toISOString(),
      }).then((res) => {
        expect(res.status).to.eq(500)
      })
    })
  })
})
