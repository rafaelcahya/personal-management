import { faker } from '@faker-js/faker'

// ─── Product Name List API ────────────────────────────────────────────────────

describe('Product name List API', () => {
  let testUserId
  let testProductNameIds = []
  let testProductNamesData = []

  const request = () => ({
    product_name: faker.food.fruit() + '-' + Date.now() + '-' + faker.string.alphanumeric(6),
    note: faker.word.words(25),
    product_name_status: 'active',
  })

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    Cypress._.times(3, () => {
      cy.AddProductName(request()).then((response) => {
        expect(response.body.success).to.be.true
        expect(response.body.productName).to.exist
        expect(response.status).to.eq(201)
        const productName = response.body.productName
        testUserId = productName.user_id
        testProductNameIds.push(productName.id)
        testProductNamesData.push(productName)
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('should return 200 with product name list for authenticated user', () => {
    cy.GetListProductName().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.be.true
      expect(response.body.data).to.be.an('array')
      expect(response.body.total).to.be.a('number')
      expect(response.body.total).to.be.gte(testProductNameIds.length)
    })
  })

  it("should return only authenticated user's product name", () => {
    cy.GetListProductName().then((response) => {
      response.body.data.forEach((productName) => {
        expect(productName.user_id).to.eq(testUserId)
      })
    })
  })

  it('should sort product name by name ASC by default', () => {
    cy.GetListProductName().then((response) => {
      const productNames = response.body.data
      for (let i = 0; i < productNames.length - 1; i++) {
        const name1 = productNames[i].product_name.toLowerCase()
        const name2 = productNames[i + 1].product_name.toLowerCase()
        expect(name1.localeCompare(name2)).to.be.lte(0)
      }
    })
  })

  it('should include all product names created in before() when searched by name', () => {
    testProductNamesData.forEach((created) => {
      cy.GetListProductName({ search: created.product_name }).then((response) => {
        expect(response.body.total).to.be.gte(1)
        expect(response.body.data.some((t) => t.id === created.id)).to.be.true
      })
    })
  })

  it('should return created product name with correct field values', () => {
    testProductNamesData.forEach((created) => {
      cy.GetListProductName({ search: created.product_name }).then((response) => {
        const found = response.body.data.find((t) => t.id === created.id)
        expect(found).to.exist
        expect(found.product_name).to.eq(created.product_name)
        expect(found.product_name_status).to.eq(created.product_name_status)
        expect(found.note).to.eq(created.note)
        expect(found.user_id).to.eq(created.user_id)
      })
    })
  })

  it('should return 401 Unauthorized without auth', () => {
    cy.clearCookies()
    cy.GetListProductNameNoAuth().then((response) => {
      expect(response.status).to.be.oneOf([401, 307])
      if (response.status === 401) {
        expect(response.body.error).to.exist
      }
    })
  })

  it('should return correct response structure', () => {
    cy.GetListProductName().then((response) => {
      expect(response.body).to.have.all.keys('success', 'data', 'total', 'page', 'limit')
      expect(response.body.success).to.be.a('boolean')
      expect(response.body.data).to.be.an('array')
      expect(response.body.total).to.be.a('number')
      expect(response.body.page).to.be.a('number')
      expect(response.body.limit).to.be.a('number')

      if (response.body.data.length > 0) {
        const productName = response.body.data[0]
        expect(productName).to.have.all.keys([
          'created_at',
          'deleted_at',
          'id',
          'product_name',
          'product_name_status',
          'note',
          'updated_at',
          'product_count',
        ])
      }
    })
  })

  it('should include product_count as a non-negative integer on every item', () => {
    cy.GetListProductName().then((response) => {
      expect(response.status).to.eq(200)
      response.body.data.forEach((item) => {
        expect(item).to.have.property('product_count')
        expect(item.product_count).to.be.a('number')
        expect(item.product_count).to.be.gte(0)
      })
    })
  })

  it('should return data as array even when no product name exist', () => {
    cy.GetListProductName().then((response) => {
      expect(response.body.data).to.be.an('array')
    })
  })

  it('should return valid timestamps for each product name', () => {
    cy.GetListProductName().then((response) => {
      response.body.data.forEach((item) => {
        expect(Date.parse(item.created_at)).to.not.be.NaN
        expect(Date.parse(item.updated_at)).to.not.be.NaN
      })
    })
  })

  it('should respond within 1000ms', () => {
    const start = Date.now()
    cy.GetListProductName().then(() => {
      const duration = Date.now() - start
      expect(duration).to.be.lte(1000)
      cy.log(`Response time: ${duration}ms`)
    })
  })
})

// ─── Pagination, Search, and Filter ──────────────────────────────────────────

describe('Product Name API — Pagination, Search, and Filter', () => {
  let searchableName

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    const uniqueName = 'CypressSearch-' + Date.now()
    searchableName = uniqueName

    cy.AddProductName({
      product_name: uniqueName,
      note: 'unique search test entry',
      product_name_status: 'active',
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('response includes total, page, and limit fields', () => {
    cy.GetListProductName().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('total').that.is.a('number')
      expect(response.body).to.have.property('page').that.is.a('number')
      expect(response.body).to.have.property('limit').that.is.a('number')
    })
  })

  it('page 1 and page 2 return different entries when total > limit', () => {
    cy.GetListProductName({ page: 1, limit: 5 }).then((resPage1) => {
      if (resPage1.body.total <= 5) {
        cy.log('Total entries ≤ limit — skipping page comparison')
        return
      }

      cy.GetListProductName({ page: 2, limit: 5 }).then((resPage2) => {
        const ids1 = resPage1.body.data.map((d) => d.id)
        const ids2 = resPage2.body.data.map((d) => d.id)
        const overlap = ids1.filter((id) => ids2.includes(id))
        expect(overlap.length).to.eq(0)
      })
    })
  })

  it('search param filters results to matching names', () => {
    cy.GetListProductName({ search: searchableName }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.total).to.be.gte(1)
      expect(response.body.data.some((d) => d.product_name === searchableName)).to.be.true
    })
  })

  it('search with no match returns empty data and total 0', () => {
    cy.GetListProductName({ search: 'ZZZNOMATCH_' + Date.now() }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.total).to.eq(0)
      expect(response.body.data).to.be.an('array').that.is.empty
    })
  })

  it('status filter returns only entries with that status', () => {
    cy.GetListProductName({ status: 'active' }).then((response) => {
      expect(response.status).to.eq(200)
      response.body.data.forEach((item) => {
        expect(item.product_name_status).to.eq('active')
      })
    })
  })

  it('invalid sort value is ignored and returns 200', () => {
    cy.GetListProductName({ sort: 'invalid_sort_value' }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.be.an('array')
    })
  })

  it('limit param is respected — data.length does not exceed limit', () => {
    cy.GetListProductName({ limit: 3 }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.length).to.be.lte(3)
    })
  })
})

// ─── Bulk Update Status ───────────────────────────────────────────────────────

describe('Product Name API — Bulk Update Status', () => {
  let bulkTestIds = []

  before(() => {
    cy.setupApiAuthCookies()
    cy.AddProductName({
      product_name: 'BulkTest-A-' + faker.string.alphanumeric(8),
      note: 'bulk status test',
      product_name_status: 'active',
    }).then((response) => {
      expect(response.status).to.eq(201)
      bulkTestIds.push(response.body.productName.id)
    })
    cy.AddProductName({
      product_name: 'BulkTest-B-' + faker.string.alphanumeric(8),
      note: 'bulk status test',
      product_name_status: 'active',
    }).then((response) => {
      expect(response.status).to.eq(201)
      bulkTestIds.push(response.body.productName.id)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with valid ids and status active returns 200 with success true and updated count', () => {
    cy.wrap(null).then(() => {
      cy.BulkUpdateProductNameStatus({ ids: bulkTestIds, status: 'active' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.updated).to.be.a('number')
        expect(response.body.updated).to.be.gte(1)
      })
    })
  })

  it('POST with valid ids and status inactive returns 200', () => {
    cy.wrap(null).then(() => {
      cy.BulkUpdateProductNameStatus({ ids: bulkTestIds, status: 'inactive' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.updated).to.be.gte(1)
      })
    })
  })

  it('POST with empty ids array returns 400', () => {
    cy.BulkUpdateProductNameStatus({ ids: [], status: 'active' }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('POST with invalid status returns 400', () => {
    cy.BulkUpdateProductNameStatus({ ids: bulkTestIds, status: 'unknown' }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('POST unauthenticated returns 401', () => {
    cy.clearCookies()
    cy.BulkUpdateProductNameStatusNoAuth({ ids: bulkTestIds, status: 'active' }).then(
      (response) => {
        expect(response.status).to.be.oneOf([401, 307])
      }
    )
  })

  it('after bulk update to inactive the affected names reflect the new status', () => {
    cy.wrap(null).then(() => {
      cy.BulkUpdateProductNameStatus({ ids: bulkTestIds, status: 'inactive' }).then((bulkRes) => {
        expect(bulkRes.status).to.eq(200)
        expect(bulkRes.body.success).to.be.true

        bulkTestIds.forEach((id) => {
          cy.GetSingleProductName(id).then((detailRes) => {
            expect(detailRes.status).to.eq(200)
            expect(detailRes.body.data.product_name_status).to.eq('inactive')
          })
        })
      })
    })
  })
})
