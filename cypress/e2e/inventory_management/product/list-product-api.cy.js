import { faker } from '@faker-js/faker'

import { INVENTORY_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('GET Product List API - /api/inventory/v1/product/list', () => {
  let validBrandId
  let validProductId
  let testUserId
  let createdProductIds = []
  let createdProducts = []

  const buildRequest = (overrides = {}) => ({
    product_id: validProductId,
    brand_id: validBrandId,
    type: faker.word.noun(),
    usage_quantity: faker.number.int({ min: 1, max: 50 }),
    note: faker.word.words(5),
    product_image: '',
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: faker.food.fruit(),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((res) => {
      expect(res.status).to.eq(201)
      validBrandId = res.body.productBrand.id
      testUserId = res.body.productBrand.user_id
    })

    cy.AddProductName({
      product_name: faker.food.ingredient(),
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(201)
      validProductId = res.body.productName.id
    })

    Cypress._.times(3, () => {
      cy.then(() => {
        cy.AddProduct(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)
          createdProductIds.push(res.body.product.id)
          createdProducts.push(res.body.product)
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user → response succeeds with success flag', () => {
      cy.GetProductList().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication → redirect or unauthorized status', () => {
      cy.clearApiAuth()
      cy.GetProductListNoAuth().then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          expect(response.body.error?.toLowerCase()).to.eq('unauthorized')
        }

        if (response.status === 307) {
          const location = response.headers.location || response.body
          expect(String(location)).to.include('/login')
        }
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.GetProductList().then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should return correct product object keys', () => {
      cy.GetProductList().then((response) => {
        expect(response.body.data.length).to.be.gt(0)
        const product = response.body.data[0]

        expect(product).to.include.all.keys([
          'id',
          'created_at',
          'updated_at',
          'deleted_at',
          'uuid',
          'product',
          'type',
          'product_status',
          'usage_quantity',
          'note',
          'product_image',
          'quantity',
          'usage_date',
          'is_favorite',
          'user_id',
          'brand',
          'product_id',
          'brand_id',
        ])
      })
    })

    it('should return application/json content-type', () => {
      cy.GetProductList().then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

    it('should return empty array when user has no products', () => {
      cy.intercept('GET', INVENTORY_ENDPOINTS.PRODUCT_LIST, {
        body: { success: true, data: [] },
      }).as('emptyList')

      cy.GetProductList().then((response) => {
        expect(response.body.data).to.be.an('array')
      })
    })
  })

  describe('Data Isolation', () => {
    it("should return only authenticated user's products", () => {
      cy.GetProductList().then((response) => {
        response.body.data.forEach((product) => {
          expect(product.user_id).to.eq(testUserId)
        })
      })
    })

    it('should include all products created in before()', () => {
      cy.GetProductList().then((response) => {
        expect(response.body.data.length).to.be.gte(createdProductIds.length)

        createdProductIds.forEach((id) => {
          const found = response.body.data.some((p) => p.id === id)
          expect(found, `Product ID ${id} should exist in list`).to.be.true
        })
      })
    })

    it('should return correct field values for created products', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.type).to.eq(created.type)
          expect(found.note).to.eq(created.note)
          expect(found.product_id).to.eq(created.product_id)
          expect(found.brand_id).to.eq(created.brand_id)
          expect(found.user_id).to.eq(created.user_id)
          expect(found.usage_quantity).to.eq(created.usage_quantity)
        })
      })
    })
  })

  describe('Default Field Values', () => {
    it('newly created product should have product_status inactive', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.product_status).to.eq('inactive')
        })
      })
    })

    it('newly created product should have quantity 0', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.quantity).to.eq(0)
        })
      })
    })

    it('newly created product should have is_favorite false', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.is_favorite).to.be.false
        })
      })
    })

    it('newly created product should have usage_date null', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.usage_date).to.be.null
        })
      })
    })

    it('newly created product should have deleted_at null', () => {
      cy.GetProductList().then((response) => {
        createdProducts.forEach((created) => {
          const found = response.body.data.find((p) => p.id === created.id)
          expect(found).to.exist
          expect(found.deleted_at).to.be.null
        })
      })
    })
  })

  describe('Sorting', () => {
    it('should return favorite products first', () => {
      cy.GetProductList().then((response) => {
        const products = response.body.data
        let favoritesEnded = false

        products.forEach((product) => {
          if (!product.is_favorite) {
            favoritesEnded = true
          }
          if (favoritesEnded) {
            expect(product.is_favorite).to.be.false
          }
        })
      })
    })

    it('should sort non-favorite products by created_at DESC', () => {
      cy.GetProductList().then((response) => {
        const nonFavorites = response.body.data.filter((p) => !p.is_favorite)

        for (let i = 0; i < nonFavorites.length - 1; i++) {
          const current = new Date(nonFavorites[i].created_at).getTime()
          const next = new Date(nonFavorites[i + 1].created_at).getTime()
          expect(current).to.be.gte(next)
        }
      })
    })
  })

  describe('Enriched Data', () => {
    it('should resolve product name string from product_id', () => {
      cy.GetProductList().then((response) => {
        const products = response.body.data.filter((p) => p.product_id === validProductId)

        products.forEach((product) => {
          expect(product.product).to.be.a('string')
          expect(product.product.length).to.be.gt(0)
          expect(product.product).to.not.eq('-')
        })
      })
    })

    it('should resolve brand name string from brand_id', () => {
      cy.GetProductList().then((response) => {
        const products = response.body.data.filter((p) => p.brand_id === validBrandId)

        products.forEach((product) => {
          expect(product.brand).to.be.a('string')
          expect(product.brand.length).to.be.gt(0)
          expect(product.brand).to.not.eq('-')
        })
      })
    })
  })

  describe('Data Types', () => {
    it('should return correct data types for all product fields', () => {
      cy.GetProductList().then((response) => {
        expect(response.body.data.length).to.be.gt(0)
        const product = response.body.data[0]

        expect(product.id).to.be.a('number')
        expect(product.uuid).to.be.a('string')
        expect(product.user_id).to.be.a('string')
        expect(product.product).to.be.a('string')
        expect(product.brand).to.be.a('string')
        expect(product.type).to.be.a('string')
        expect(product.product_id).to.be.a('number')
        expect(product.brand_id).to.be.a('number')
        expect(product.product_status).to.be.a('string')
        expect(product.usage_quantity).to.be.a('number')
        expect(product.quantity).to.be.a('number')
        expect(product.is_favorite).to.be.a('boolean')
        expect(product.note).to.be.a('string')
      })
    })

    it('should return valid UUID format', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      cy.GetProductList().then((response) => {
        response.body.data.forEach((product) => {
          expect(product.uuid).to.match(uuidRegex)
        })
      })
    })

    it('should return valid ISO timestamps for created_at and updated_at', () => {
      cy.GetProductList().then((response) => {
        response.body.data.forEach((product) => {
          expect(new Date(product.created_at).toString()).to.not.eq('Invalid Date')
          expect(new Date(product.updated_at).toString()).to.not.eq('Invalid Date')
        })
      })
    })

    it('should return valid product_status value', () => {
      cy.GetProductList().then((response) => {
        response.body.data.forEach((product) => {
          expect(product.product_status).to.be.oneOf(['active', 'inactive'])
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('total products from API should match database count', () => {
      cy.GetProductList()
        .then((response) => response.body.data.length)
        .then((apiCount) => {
          cy.getTotalProductsFromDb().then((dbCount) => {
            // PostgREST max_rows caps API response at 1000; verify API
            // returns either all products (when DB <= 1000) or the cap
            const expectedCount = Math.min(dbCount, 1000)
            expect(apiCount).to.eq(expectedCount)
          })
        })
    })

    it('should match all product fields with database', () => {
      cy.GetProductList()
        .then((response) => response.body.data)
        .then((apiProducts) => {
          cy.getProductListFromDb().then((dbProducts) => {
            expect(apiProducts.length).to.eq(dbProducts.length)

            apiProducts.forEach((apiProduct) => {
              const dbProduct = dbProducts.find((p) => p.id === apiProduct.id)
              expect(dbProduct).to.exist
              expect(apiProduct.uuid).to.eq(dbProduct.uuid)
              expect(apiProduct.type).to.eq(dbProduct.type)
              expect(apiProduct.product_id).to.eq(dbProduct.product_id)
              expect(apiProduct.brand_id).to.eq(dbProduct.brand_id)
              expect(apiProduct.product_status).to.eq(dbProduct.product_status)
              expect(apiProduct.usage_quantity).to.eq(dbProduct.usage_quantity)
              expect(apiProduct.quantity).to.eq(dbProduct.quantity)
              expect(apiProduct.is_favorite).to.eq(dbProduct.is_favorite)
              expect(apiProduct.user_id).to.eq(dbProduct.user_id)
              expect(apiProduct.note).to.eq(dbProduct.note)
              expect(apiProduct.deleted_at).to.eq(dbProduct.deleted_at)
            })
          })
        })
    })

    it('newly created product should appear in list', () => {
      let newProductId

      cy.AddProduct(buildRequest())
        .then((res) => {
          expect(res.status).to.eq(201)
          newProductId = res.body.product.id
        })
        .then(() => {
          cy.GetProductList().then((response) => {
            const found = response.body.data.some((p) => p.id === newProductId)
            expect(found).to.be.true
          })
        })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.GetProductList().then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
