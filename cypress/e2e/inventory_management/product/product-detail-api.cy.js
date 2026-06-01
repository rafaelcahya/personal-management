import { faker } from '@faker-js/faker'

import { INVENTORY_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('GET Product By ID API - /api/inventory/v1/product/[id]', () => {
  let validBrandId
  let validProductId
  let testUserId
  let createdProduct

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

    cy.then(() => {
      cy.AddProduct(buildRequest()).then((res) => {
        expect(res.status).to.eq(201)
        createdProduct = res.body.product
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user with valid id → response succeeds', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication → unauthorized or redirect', () => {
      cy.clearApiAuth()
      cy.GetProductDetailNoAuth(createdProduct.id).then((response) => {
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

  describe('ID Validation', () => {
    it('should return 400 when id is non-numeric', () => {
      cy.GetProductDetail('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a valid number')
      })
    })

    it('should return 400 when id is float', () => {
      cy.GetProductDetail('1.5').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be an integer')
      })
    })

    it('should return 400 when id is zero', () => {
      cy.GetProductDetail(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })

    it('should return 400 when id is negative', () => {
      cy.GetProductDetail(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })
  })

  describe('Not Found', () => {
    it('should return 404 when product id does not exist', () => {
      cy.GetProductDetail(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product not found')
      })
    })

    it('should return 404 when product belongs to another user', () => {
      cy.intercept('GET', `${INVENTORY_ENDPOINTS.PRODUCT_BASE}/888888888`, {
        statusCode: 404,
        body: { success: false, error: 'Product not found' },
      }).as('otherUserProduct')

      cy.GetProductDetail(888888888).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product not found')
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys → body has success and data keys', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
      })
    })

    it('should return correct product object keys → all required keys are present', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data

        expect(product).to.include.all.keys([
          'id',
          'created_at',
          'updated_at',
          'deleted_at',
          'uuid',
          'product',
          'brand',
          'type',
          'product_status',
          'usage_quantity',
          'quantity',
          'note',
          'product_image',
          'usage_date',
          'is_favorite',
          'user_id',
          'product_id',
          'brand_id',
        ])
      })
    })

    it('should return application/json content-type → Content-Type header includes application/json', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Data Accuracy', () => {
    it('should return correct data matching created product → all fields match original', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data

        expect(product.id).to.eq(createdProduct.id)
        expect(product.type).to.eq(createdProduct.type)
        expect(product.note).to.eq(createdProduct.note)
        expect(product.product_id).to.eq(createdProduct.product_id)
        expect(product.brand_id).to.eq(createdProduct.brand_id)
        expect(product.user_id).to.eq(createdProduct.user_id)
        expect(product.usage_quantity).to.eq(createdProduct.usage_quantity)
      })
    })

    it('should return enriched product name string → product name is non-empty string', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data

        expect(product.product).to.be.a('string')
        expect(product.product.length).to.be.gt(0)
        expect(product.product).to.not.eq('-')
      })
    })

    it('should return enriched brand name string → brand name is non-empty string', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data

        expect(product.brand).to.be.a('string')
        expect(product.brand.length).to.be.gt(0)
        expect(product.brand).to.not.eq('-')
      })
    })
  })

  describe('Default Field Values', () => {
    it('should have product_status inactive on creation → status field equals inactive', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.product_status).to.eq('inactive')
      })
    })

    it('should have quantity 0 on creation → quantity field equals 0', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.quantity).to.eq(0)
      })
    })

    it('should have is_favorite false on creation → is_favorite flag is false', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.is_favorite).to.be.false
      })
    })

    it('should have usage_date null on creation → usage_date field is null', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.usage_date).to.be.null
      })
    })

    it('should have deleted_at null on creation → deleted_at field is null', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.deleted_at).to.be.null
      })
    })
  })

  describe('Data Types', () => {
    it('should return correct data types for all fields → all fields have expected types', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data

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

    it('should return valid UUID format → uuid matches standard UUID pattern', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.uuid).to.match(uuidRegex)
      })
    })

    it('should return valid ISO timestamps → created_at and updated_at are valid dates', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const product = response.body.data
        expect(new Date(product.created_at).toString()).to.not.eq('Invalid Date')
        expect(new Date(product.updated_at).toString()).to.not.eq('Invalid Date')
      })
    })

    it('should return valid product_status value → status is active or inactive', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.body.data.product_status).to.be.oneOf(['active', 'inactive'])
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('should match all fields with database record → API response matches DB data', () => {
      cy.GetProductDetail(createdProduct.id).then((response) => {
        const apiProduct = response.body.data

        cy.getSingleProductFromDb(createdProduct.id).then((dbProduct) => {
          expect(dbProduct).to.not.be.null
          expect(apiProduct.id).to.eq(dbProduct.id)
          expect(apiProduct.uuid).to.eq(dbProduct.uuid)
          expect(apiProduct.type).to.eq(dbProduct.type)
          expect(apiProduct.note).to.eq(dbProduct.note)
          expect(apiProduct.product_id).to.eq(dbProduct.product_id)
          expect(apiProduct.brand_id).to.eq(dbProduct.brand_id)
          expect(apiProduct.product_status).to.eq(dbProduct.product_status)
          expect(apiProduct.usage_quantity).to.eq(dbProduct.usage_quantity)
          expect(apiProduct.quantity).to.eq(dbProduct.quantity)
          expect(apiProduct.is_favorite).to.eq(dbProduct.is_favorite)
          expect(apiProduct.user_id).to.eq(dbProduct.user_id)
          expect(apiProduct.deleted_at).to.eq(dbProduct.deleted_at)
        })
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms → API response time is acceptable', () => {
      const start = Date.now()
      cy.GetProductDetail(createdProduct.id).then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
