import { faker } from '@faker-js/faker'

const SEARCH_PREFIX = 'SRCH-' + Math.random().toString(36).slice(2, 8).toUpperCase()

let testUserId
let validBrandId
let validProductId
let createdProducts = []

// product created with known brand + name for search/filter/sort tests
let activeProd
let inactiveProd
let favoriteProd
let outStockProd
let neverUsedProd
let lowStockProd

describe('Product List API', () => {
  before(() => {
    cy.setupApiAuthCookies()

    // create brand
    cy.AddProductBrand({
      brand: SEARCH_PREFIX + '-Brand',
      brand_status: 'active',
      note: faker.word.words(3),
    }).then((res) => {
      expect(res.status).to.eq(201)
      validBrandId = res.body.productBrand.id
      testUserId = res.body.productBrand.user_id
    })

    // create product name
    cy.AddProductName({
      product_name: SEARCH_PREFIX + '-Name',
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(201)
      validProductId = res.body.productName.id
    })

    // create 6 base products for test coverage
    Cypress._.times(6, (i) => {
      cy.then(() => {
        cy.AddProduct({
          product_id: validProductId,
          brand_id: validBrandId,
          type: `${SEARCH_PREFIX}-type-${i}`,
          usage_quantity: 1,
          note: faker.word.words(3),
          product_image: '',
        }).then((res) => {
          expect(res.status).to.eq(201)
          createdProducts.push(res.body.product)
        })
      })
    })

    // set up specific products for filter/sort tests after all 6 are created
    cy.then(() => {
      // product[0] + [1] stay inactive (default)
      activeProd = createdProducts[0]
      inactiveProd = createdProducts[1]

      // product[2] → set favorite
      favoriteProd = createdProducts[2]
      cy.FavoriteProduct(favoriteProd.id, true).then((res) => {
        expect(res.status).to.eq(200)
      })

      // product[3] → out-of-stock (quantity 0 by default, never-used)
      outStockProd = createdProducts[3]
      neverUsedProd = createdProducts[3]

      // product[4] → low-stock: add 3 units (quantity > 0, < 5)
      lowStockProd = createdProducts[4]
      cy.CreateProductStock({
        product_list_id: lowStockProd.id,
        quantity_added: 3,
        price: 10000,
        purchase_date: new Date().toISOString().split('T')[0],
      }).then((res) => {
        expect(res.status).to.eq(201)
      })

      // product[5] → add stock so it is not out-of-stock (used for sort coverage)
      cy.CreateProductStock({
        product_list_id: createdProducts[5].id,
        quantity_added: 10,
        price: 5000,
        purchase_date: new Date().toISOString().split('T')[0],
      }).then((res) => {
        expect(res.status).to.eq(201)
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── auth guard ──────────────────────────────────────────────────────────────

  it('returns 200 with valid session', () => {
    cy.GetProductList().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.success).to.be.true
    })
  })

  it('returns 307 or 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetProductListNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([307, 401])
    })
  })

  // ─── response shape ──────────────────────────────────────────────────────────

  it('response has top-level keys: success, data, total, page, limit', () => {
    cy.GetProductList().then((res) => {
      expect(res.body).to.have.all.keys('success', 'data', 'total', 'page', 'limit')
    })
  })

  it('data is an array', () => {
    cy.GetProductList().then((res) => {
      expect(res.body.data).to.be.an('array')
    })
  })

  it('total is a number', () => {
    cy.GetProductList().then((res) => {
      expect(res.body.total).to.be.a('number')
    })
  })

  it('page is a number', () => {
    cy.GetProductList().then((res) => {
      expect(res.body.page).to.be.a('number')
    })
  })

  it('limit is a number', () => {
    cy.GetProductList().then((res) => {
      expect(res.body.limit).to.be.a('number')
    })
  })

  it('product object contains required keys', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      const product = res.body.data[0]
      expect(product).to.include.all.keys(
        'id',
        'uuid',
        'user_id',
        'product',
        'brand',
        'type',
        'product_id',
        'brand_id',
        'product_status',
        'quantity',
        'usage_quantity',
        'usage_date',
        'product_image',
        'note',
        'is_favorite',
        'created_at',
        'updated_at',
        'deleted_at'
      )
    })
  })

  // ─── pagination ──────────────────────────────────────────────────────────────

  it('default limit is 15', () => {
    cy.GetProductList().then((res) => {
      expect(res.body.limit).to.eq(15)
    })
  })

  it('?page=1&limit=5 returns at most 5 items in data', () => {
    cy.GetProductList({ page: 1, limit: 5 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.lte(5)
      expect(res.body.limit).to.eq(5)
    })
  })

  it('?limit=200 is capped at 100', () => {
    cy.GetProductList({ limit: 200 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.limit).to.eq(100)
    })
  })

  it('?page=99999 returns empty data array with status 200', () => {
    cy.GetProductList({ page: 99999 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array').and.have.length(0)
    })
  })

  it('total is always >= data.length', () => {
    cy.GetProductList({ limit: 5 }).then((res) => {
      expect(res.body.total).to.be.gte(res.body.data.length)
    })
  })

  // ─── search ──────────────────────────────────────────────────────────────────

  it('?search=<SRCH_PREFIX> returns products matching the prefix', () => {
    cy.GetProductList({ search: SEARCH_PREFIX }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.gt(0)
    })
  })

  it('?search=<nonexistent> returns empty data array', () => {
    cy.GetProductList({ search: 'NONEXISTENT_XYZ_999' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array').and.have.length(0)
    })
  })

  it('search is case-insensitive', () => {
    cy.GetProductList({ search: SEARCH_PREFIX.toLowerCase() }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.gt(0)
    })
  })

  // ─── filter ──────────────────────────────────────────────────────────────────

  it('?filter=active returns only active products', () => {
    cy.GetProductList({ filter: 'active', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.product_status).to.eq('active')
        })
      }
    })
  })

  it('?filter=inactive returns only inactive products', () => {
    cy.GetProductList({ filter: 'inactive', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.product_status).to.eq('inactive')
        })
      }
    })
  })

  it('?filter=favorite returns only favorited products', () => {
    cy.GetProductList({ filter: 'favorite', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.is_favorite).to.be.true
        })
      }
    })
  })

  it('?filter=out-stock returns only products with quantity 0', () => {
    cy.GetProductList({ filter: 'out-stock', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.quantity).to.eq(0)
        })
      }
    })
  })

  it('?filter=low-stock returns only products with quantity > 0 and < 5', () => {
    cy.GetProductList({ filter: 'low-stock', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.quantity).to.be.gt(0)
          expect(p.quantity).to.be.lt(5)
        })
      }
    })
  })

  it('?filter=never-used returns only products with usage_date null', () => {
    cy.GetProductList({ filter: 'never-used', limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        res.body.data.forEach((p) => {
          expect(p.usage_date).to.be.null
        })
      }
    })
  })

  // ─── sort ────────────────────────────────────────────────────────────────────

  it('?sort=product_asc returns products sorted by name ascending', () => {
    cy.GetProductList({ sort: 'product_asc', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 1) {
        for (let i = 0; i < res.body.data.length - 1; i++) {
          const a = res.body.data[i].product.toLowerCase()
          const b = res.body.data[i + 1].product.toLowerCase()
          expect(a.localeCompare(b)).to.be.lte(0)
        }
      }
    })
  })

  it('?sort=product_desc returns products sorted by name descending', () => {
    cy.GetProductList({ sort: 'product_desc', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 1) {
        for (let i = 0; i < res.body.data.length - 1; i++) {
          const a = res.body.data[i].product.toLowerCase()
          const b = res.body.data[i + 1].product.toLowerCase()
          expect(a.localeCompare(b)).to.be.gte(0)
        }
      }
    })
  })

  it('?sort=quantity_asc returns products sorted by quantity ascending', () => {
    cy.GetProductList({ sort: 'quantity_asc', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 1) {
        for (let i = 0; i < res.body.data.length - 1; i++) {
          expect(res.body.data[i].quantity).to.be.lte(res.body.data[i + 1].quantity)
        }
      }
    })
  })

  it('?sort=favorites_first returns favorited products before non-favorited', () => {
    cy.GetProductList({ sort: 'favorites_first', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 1) {
        let favoritesEnded = false
        res.body.data.forEach((p) => {
          if (!p.is_favorite) favoritesEnded = true
          if (favoritesEnded) expect(p.is_favorite).to.be.false
        })
      }
    })
  })

  // ─── data isolation ──────────────────────────────────────────────────────────

  it('all products in data belong to the authenticated user', () => {
    cy.GetProductList({ limit: 100 }).then((res) => {
      res.body.data.forEach((p) => {
        expect(p.user_id).to.eq(testUserId)
      })
    })
  })

  // ─── field types ─────────────────────────────────────────────────────────────

  it('id is a number', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].id).to.be.a('number')
    })
  })

  it('uuid is a string in UUID format', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].uuid).to.match(uuidRegex)
    })
  })

  it('user_id is a string', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].user_id).to.be.a('string')
    })
  })

  it('product is a string', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].product).to.be.a('string')
    })
  })

  it('brand is a string', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].brand).to.be.a('string')
    })
  })

  it('product_status is one of active or inactive', () => {
    cy.GetProductList().then((res) => {
      res.body.data.forEach((p) => {
        expect(p.product_status).to.be.oneOf(['active', 'inactive'])
      })
    })
  })

  it('quantity is a number', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].quantity).to.be.a('number')
    })
  })

  it('usage_quantity is a number', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].usage_quantity).to.be.a('number')
    })
  })

  it('is_favorite is a boolean', () => {
    cy.GetProductList().then((res) => {
      if (res.body.data.length === 0) return
      expect(res.body.data[0].is_favorite).to.be.a('boolean')
    })
  })

  // ─── default field values ────────────────────────────────────────────────────

  it('newly created product has product_status inactive', () => {
    cy.GetProductList({ search: SEARCH_PREFIX, limit: 100 }).then((res) => {
      const prod = res.body.data.find((p) => p.id === inactiveProd.id)
      if (!prod) return
      expect(prod.product_status).to.eq('inactive')
    })
  })

  it('newly created product has quantity 0', () => {
    cy.GetProductList({ search: SEARCH_PREFIX, limit: 100 }).then((res) => {
      const prod = res.body.data.find((p) => p.id === outStockProd.id)
      if (!prod) return
      expect(prod.quantity).to.eq(0)
    })
  })

  it('newly created product has is_favorite false', () => {
    cy.GetProductList({ search: SEARCH_PREFIX, limit: 100 }).then((res) => {
      const prod = res.body.data.find((p) => p.id === inactiveProd.id)
      if (!prod) return
      expect(prod.is_favorite).to.be.false
    })
  })

  it('newly created product has usage_date null', () => {
    cy.GetProductList({ search: SEARCH_PREFIX, limit: 100 }).then((res) => {
      const prod = res.body.data.find((p) => p.id === neverUsedProd.id)
      if (!prod) return
      expect(prod.usage_date).to.be.null
    })
  })

  it('newly created product has deleted_at null', () => {
    cy.GetProductList({ search: SEARCH_PREFIX, limit: 100 }).then((res) => {
      res.body.data.forEach((p) => {
        expect(p.deleted_at).to.be.null
      })
    })
  })
})
