import { faker } from '@faker-js/faker'

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
      brand: 'DetailBrand-' + Date.now() + '-' + faker.string.alphanumeric(6),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((res) => {
      expect(res.status).to.eq(201)
      validBrandId = res.body.productBrand.id
      testUserId = res.body.productBrand.user_id
    })

    cy.AddProductName({
      product_name: 'DetailName-' + Date.now() + '-' + faker.string.alphanumeric(6),
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

describe('GET Last Purchase Price API - /api/inventory/v1/product/[id]/last-price', () => {
  let validProductListId
  let createdProduct
  let stockEntries = []

  const buildStockRequest = (overrides = {}) => ({
    product_list_id: validProductListId,
    quantity_added: faker.number.int({ min: 1, max: 50 }),
    price: faker.number.int({ min: 5000, max: 100000 }),
    purchase_date: new Date().toISOString(),
    note: faker.word.words(3),
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: 'LastPriceBrand-' + Date.now() + '-' + faker.string.alphanumeric(6),
      brand_status: 'active',
      note: faker.word.words(3),
    }).then((brandRes) => {
      expect(brandRes.status).to.eq(201)

      cy.AddProductName({
        product_name: 'LastPriceName-' + Date.now() + '-' + faker.string.alphanumeric(6),
        product_name_status: 'active',
      }).then((nameRes) => {
        expect(nameRes.status).to.eq(201)

        cy.AddProduct({
          product_id: nameRes.body.productName.id,
          brand_id: brandRes.body.productBrand.id,
          type: faker.word.noun(),
          usage_quantity: 0,
          note: faker.word.words(3),
          product_image: '',
        }).then((productRes) => {
          expect(productRes.status).to.eq(201)
          createdProduct = productRes.body.product
          validProductListId = createdProduct.id

          // Create 2 stock entries with different prices and dates
          cy.CreateProductStock(
            buildStockRequest({
              price: 15000,
              purchase_date: new Date('2026-03-01').toISOString(),
            })
          ).then((res1) => {
            expect(res1.status).to.eq(201)
            stockEntries.push(res1.body.data)

            cy.CreateProductStock(
              buildStockRequest({
                price: 25000,
                purchase_date: new Date('2026-04-15').toISOString(),
              })
            ).then((res2) => {
              expect(res2.status).to.eq(201)
              stockEntries.push(res2.body.data)
            })
          })
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.GetLastPurchasePriceNoAuth(validProductListId).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          expect(response.body).to.exist
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
      cy.GetLastPurchasePrice('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.exist
      })
    })

    it('should return 400 when id is zero', () => {
      cy.GetLastPurchasePrice(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('should return 400 when id is negative', () => {
      cy.GetLastPurchasePrice(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('should return 404 when product does not exist', () => {
      cy.GetLastPurchasePrice(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })

    it('should return correct data keys when history exists', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.body.data).to.include.all.keys([
          'last_purchase_price',
          'last_purchase_date',
        ])
      })
    })

    it('should return null fields when product has no stock history', () => {
      cy.AddProductBrand({
        brand: 'NoStockBrand-' + Date.now() + '-' + faker.string.alphanumeric(6),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((brandRes) => {
        cy.AddProductName({
          product_name: 'NoStockName-' + Date.now() + '-' + faker.string.alphanumeric(6),
          product_name_status: 'active',
        }).then((nameRes) => {
          cy.AddProduct({
            product_id: nameRes.body.productName.id,
            brand_id: brandRes.body.productBrand.id,
            type: faker.word.noun(),
            usage_quantity: 0,
            note: faker.word.words(3),
            product_image: '',
          }).then((productRes) => {
            const productWithoutStock = productRes.body.product.id

            cy.GetLastPurchasePrice(productWithoutStock).then((response) => {
              expect(response.status).to.eq(200)
              expect(response.body.data.last_purchase_price).to.be.null
              expect(response.body.data.last_purchase_date).to.be.null
            })
          })
        })
      })
    })

    it('should return application/json content-type', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Data Accuracy', () => {
    it('should return the most recent purchase price', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.last_purchase_price).to.eq(25000)
      })
    })

    it('should return the most recent purchase date', () => {
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        const returnedDateStr = response.body.data.last_purchase_date
        expect(returnedDateStr).to.include('2026-04-15')
      })
    })

    it('should reflect latest stock entry after new addition', () => {
      const newDate = new Date(Date.UTC(2026, 4, 1)).toISOString()
      cy.CreateProductStock(
        buildStockRequest({
          price: 35000,
          purchase_date: newDate,
        })
      ).then((res) => {
        expect(res.status).to.eq(201)

        cy.GetLastPurchasePrice(validProductListId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.last_purchase_price).to.eq(35000)
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('last_purchase_price should match latest record in product_quantity table', () => {
      cy.GetLastPurchasePrice(validProductListId)
        .then((response) => {
          expect(response.status).to.eq(200)
          return response.body.data.last_purchase_price
        })
        .then((apiPrice) => {
          cy.getLastPurchasePriceFromDb(validProductListId).then((dbRecord) => {
            expect(dbRecord).to.exist
            expect(apiPrice).to.eq(dbRecord.price)
          })
        })
    })

    it('last_purchase_date should match latest purchase_date in DB', () => {
      cy.GetLastPurchasePrice(validProductListId)
        .then((response) => {
          expect(response.status).to.eq(200)
          return response.body.data.last_purchase_date
        })
        .then((apiDate) => {
          cy.getLastPurchasePriceFromDb(validProductListId).then((dbRecord) => {
            expect(dbRecord).to.exist
            expect(apiDate).to.be.a('string')
            expect(new Date(apiDate).toString()).to.not.eq('Invalid Date')
            expect(new Date(dbRecord.purchase_date).toString()).to.not.eq('Invalid Date')
            const apiTime = new Date(apiDate).getTime()
            const dbTime = new Date(dbRecord.purchase_date).getTime()
            const diff = Math.abs(apiTime - dbTime)
            expect(diff).to.be.lte(86400000)
          })
        })
    })

    it('should return null when product_quantity table has no records for this product', () => {
      cy.AddProductBrand({
        brand: 'DbNullBrand-' + Date.now() + '-' + faker.string.alphanumeric(6),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((brandRes) => {
        cy.AddProductName({
          product_name: 'DbNullName-' + Date.now() + '-' + faker.string.alphanumeric(6),
          product_name_status: 'active',
        }).then((nameRes) => {
          cy.AddProduct({
            product_id: nameRes.body.productName.id,
            brand_id: brandRes.body.productBrand.id,
            type: faker.word.noun(),
            usage_quantity: 0,
            note: faker.word.words(3),
            product_image: '',
          }).then((productRes) => {
            const productId = productRes.body.product.id

            cy.getLastPurchasePriceFromDb(productId).then((dbRecord) => {
              expect(dbRecord).to.be.null
            })

            cy.GetLastPurchasePrice(productId).then((response) => {
              expect(response.status).to.eq(200)
              expect(response.body.data.last_purchase_price).to.be.null
              expect(response.body.data.last_purchase_date).to.be.null
            })
          })
        })
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.GetLastPurchasePrice(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})

describe('GET Restock Predictions API - /api/inventory/v1/product/restock-predictions', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      cy.GetRestockPredictions().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
        expect(response.body.message).to.eq('OK')
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.GetRestockPredictionsNoAuth().then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          expect(response.body).to.exist
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
      cy.GetRestockPredictions().then((response) => {
        expect(response.body).to.have.all.keys('data', 'message')
        expect(response.body.message).to.eq('OK')
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should return data as array', () => {
      cy.GetRestockPredictions().then((response) => {
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should return correct item keys when data exists', () => {
      cy.GetRestockPredictions().then((response) => {
        if (response.body.data.length > 0) {
          const item = response.body.data[0]
          expect(item).to.include.all.keys([
            'product_list_id',
            'days_until_empty',
            'predicted_date',
          ])
        }
      })
    })

    it('should return application/json content-type', () => {
      cy.GetRestockPredictions().then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Business Logic', () => {
    it('should return array (may be empty if no products with history)', () => {
      cy.GetRestockPredictions().then((response) => {
        expect(response.body.data).to.be.an('array')
      })
    })

    it('product_list_id should be positive integer when present', () => {
      cy.GetRestockPredictions().then((response) => {
        response.body.data.forEach((item) => {
          expect(item.product_list_id).to.be.a('number')
          expect(item.product_list_id).to.be.gt(0)
        })
      })
    })

    it('predicted_date should be null or valid date when days_until_empty is 0', () => {
      cy.GetRestockPredictions().then((response) => {
        const itemsWithZeroDays = response.body.data.filter((item) => item.days_until_empty === 0)
        itemsWithZeroDays.forEach((item) => {
          if (item.predicted_date !== null) {
            expect(item.predicted_date).to.match(/^\d{4}-\d{2}-\d{2}$/)
          }
        })
      })
    })

    it('predicted_date should be a valid YYYY-MM-DD format when days > 0', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/

      cy.GetRestockPredictions().then((response) => {
        response.body.data.forEach((item) => {
          if (item.days_until_empty > 0 && item.predicted_date) {
            expect(item.predicted_date).to.match(dateRegex)
          }
        })
      })
    })

    it('days_until_empty should be a non-negative number', () => {
      cy.GetRestockPredictions().then((response) => {
        response.body.data.forEach((item) => {
          expect(item.days_until_empty).to.be.a('number')
          expect(item.days_until_empty).to.be.gte(0)
        })
      })
    })

    it('should maintain data integrity: predicted_date consistency', () => {
      cy.GetRestockPredictions().then((response) => {
        response.body.data.forEach((item) => {
          expect(item.days_until_empty).to.be.a('number')
          expect(item.days_until_empty).to.be.gte(0)
          if (item.predicted_date !== null) {
            expect(typeof item.predicted_date).to.eq('string')
          }
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('response data structure should be consistent', () => {
      cy.GetRestockPredictions().then((response) => {
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('data')
        expect(response.body).to.have.property('message')
      })
    })

    it('all items should have required fields', () => {
      cy.GetRestockPredictions().then((response) => {
        response.body.data.forEach((item) => {
          expect(item).to.have.property('product_list_id')
          expect(item).to.have.property('days_until_empty')
          expect(item).to.have.property('predicted_date')
        })
      })
    })

    it('should not return duplicate product_list_id', () => {
      cy.GetRestockPredictions().then((response) => {
        const ids = response.body.data.map((item) => item.product_list_id)
        const uniqueIds = new Set(ids)
        expect(uniqueIds.size).to.eq(ids.length)
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 3000ms', () => {
      const start = Date.now()
      cy.GetRestockPredictions().then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(3000)
      })
    })
  })
})
