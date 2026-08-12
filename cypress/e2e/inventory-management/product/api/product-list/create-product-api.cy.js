import { faker } from '@faker-js/faker'

describe('Create Product API - POST /api/inventory/v1/product/create', () => {
  let validProductId
  let validBrandId
  let testUserId

  const buildRequest = (overrides = {}) => ({
    product_id: validProductId,
    brand_id: validBrandId,
    type: faker.word.noun(),
    usage_quantity: faker.number.int({ min: 1, max: 100 }),
    note: faker.word.words(10),
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
    }).then((res) => {
      expect(res.status).to.eq(201)
      validProductId = res.body.productName.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 401 or 307 without authentication', () => {
      cy.clearApiAuth()

      cy.AddProductNoAuth(buildRequest()).then((response) => {
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

    it('should return 201 when authenticated', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Required Field Validation', () => {
    it('should return 400 when product_id is missing', () => {
      cy.AddProduct(buildRequest({ product_id: undefined })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.be.an('array')
        expect(response.body.error).to.include('product id is required')
      })
    })

    it('should return 400 when product_id is empty string', () => {
      cy.AddProduct(buildRequest({ product_id: '    ' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.be.an('array')
        expect(response.body.error).to.include('product id is required')
      })
    })

    it('should return 400 when product_id is null', () => {
      cy.AddProduct(buildRequest({ product_id: null })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.be.an('array')
        expect(response.body.error).to.include('product id is required')
      })
    })

    it('should return 400 when brand_id is empty string', () => {
      cy.AddProduct(buildRequest({ brand_id: '    ' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('brand id is required')
      })
    })

    it('should return 400 when brand_id is missing', () => {
      cy.AddProduct(buildRequest({ brand_id: undefined })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('brand id is required')
      })
    })

    it('should return 400 when brand_id is null', () => {
      cy.AddProduct(buildRequest({ brand_id: null })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('brand id is required')
      })
    })

    it('should return 400 when type is missing', () => {
      cy.AddProduct(buildRequest({ type: undefined })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('type is required')
      })
    })

    it('should return 400 when type is empty string', () => {
      cy.AddProduct(buildRequest({ type: '    ' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('type is required')
      })
    })

    it('should return 400 when type is null', () => {
      cy.AddProduct(buildRequest({ type: null })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('type is required')
      })
    })

    it('should return 400 when all required fields are missing', () => {
      cy.AddProduct({
        usage_quantity: 5,
        note: 'only optional fields',
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.be.an('array')
        expect(response.body.error).to.have.length(3)
      })
    })
  })

  describe('ID Field Validation', () => {
    it('should return 400 when product_id is non-numeric', () => {
      cy.AddProduct(buildRequest({ product_id: 'abc' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('product id must be a valid number')
      })
    })

    it('should return 400 when brand_id is non-numeric', () => {
      cy.AddProduct(buildRequest({ brand_id: 'xyz' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('brand id must be a valid number')
      })
    })

    it('should return 400 when product_id is float', () => {
      cy.AddProduct(buildRequest({ product_id: '1.5' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('product id must be an integer')
      })
    })

    it('should return 400 when product_id is zero', () => {
      cy.AddProduct(buildRequest({ product_id: 0 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('product id must be a positive integer')
      })
    })

    it('should return 400 when brand_id is negative', () => {
      cy.AddProduct(buildRequest({ brand_id: -1 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('brand id must be a positive integer')
      })
    })
  })

  describe('Optional Field Validation', () => {
    it('should return 400 when usage_quantity is negative', () => {
      cy.AddProduct(buildRequest({ usage_quantity: -1 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('usage quantity must be non-negative')
      })
    })

    it('should succeed when usage_quantity is 0', () => {
      cy.AddProduct(buildRequest({ usage_quantity: 0 })).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.product.usage_quantity).to.eq(0)
      })
    })

    it('should succeed without optional fields', () => {
      cy.AddProduct({
        product_id: validProductId,
        brand_id: validBrandId,
        type: faker.word.noun(),
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Request Body Validation', () => {
    it('should return 400 for invalid JSON', () => {
      cy.AddProduct('INVALID_JSON').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Invalid JSON in request body')
      })
    })

    it('should return 400 for missing body', () => {
      cy.AddProduct(undefined).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })
  })

  describe('Business Logic Validation', () => {
    it('should return 404 when product_id does not exist', () => {
      cy.AddProduct(buildRequest({ product_id: 999999999 })).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })

    it('should return 404 when brand_id does not exist', () => {
      cy.AddProduct(buildRequest({ brand_id: 999999999 })).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })

    it("should return 404 when using another user's product_id", () => {
      const otherUserProductId = 1
      cy.AddProduct(buildRequest({ product_id: otherUserProductId })).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
    })

    it("should return 404 when using another user's brand_id", () => {
      const otherUserBrandId = 1
      cy.AddProduct(buildRequest({ brand_id: otherUserBrandId })).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
    })
  })

  describe('Success Scenarios', () => {
    it('should create product and return 201 with correct fields', () => {
      const req = buildRequest()

      cy.AddProduct(req).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
        expect(response.body.product).to.exist

        const product = response.body.product
        expect(product.type).to.eq(req.type)
        expect(product.usage_quantity).to.eq(req.usage_quantity)
        expect(product.note).to.eq(req.note)
        expect(product.product_id).to.eq(req.product_id)
        expect(product.brand_id).to.eq(req.brand_id)
      })
    })

    it('should set default values correctly', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const product = response.body.product

        expect(product.product_status).to.eq('inactive')
        expect(product.quantity).to.eq(0)
        expect(product.is_favorite == false || product.is_favorite == null).to.be.true
        expect(product.usage_date).to.be.null
      })
    })

    it('should assign user_id from authenticated user', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.product.user_id).to.eq(testUserId)
      })
    })

    it('should generate valid timestamps', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const { created_at, updated_at } = response.body.product

        expect(new Date(created_at).toString()).to.not.eq('Invalid Date')
        expect(new Date(updated_at).toString()).to.not.eq('Invalid Date')
      })
    })

    it('should resolve and store product_name string from product_id', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const product = response.body.product

        expect(product.product).to.be.a('string')
        expect(product.product.length).to.be.gt(0)
        expect(product.product).to.not.eq('-')
      })
    })

    it('should resolve and store brand string from brand_id', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const product = response.body.product

        expect(product.brand).to.be.a('string')
        expect(product.brand.length).to.be.gt(0)
        expect(product.brand).to.not.eq('-')
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level structure', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.all.keys('success', 'product')
        expect(response.body.success).to.be.a('boolean')
        expect(response.body.product).to.be.an('object')
      })
    })

    it('should return correct product object keys', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const product = response.body.product

        expect(product).to.have.all.keys([
          'id',
          'user_id',
          'product',
          'brand',
          'type',
          'product_id',
          'product_list_id',
          'brand_id',
          'product_status',
          'usage_quantity',
          'quantity',
          'product_image',
          'note',
          'usage_date',
          'is_favorite',
          'created_at',
          'updated_at',
          'deleted_at',
          'uuid',
        ])
      })
    })

    it('should return application/json content-type', () => {
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Summary Impact', () => {
    it('totalProducts should increment by 1 after creation', () => {
      cy.GetProductSummary().then((before) => {
        expect(before.status).to.eq(200)
        const totalBefore = before.body.data.totalProducts

        cy.AddProduct(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)

          cy.GetProductSummary().then((after) => {
            expect(after.body.data.totalProducts).to.eq(totalBefore + 1)
          })
        })
      })
    })

    it('inactiveProducts should increment by 1 (default status is inactive)', () => {
      cy.GetProductSummary().then((before) => {
        const inactiveBefore = before.body.data.inactiveProducts

        cy.AddProduct(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.product.product_status).to.eq('inactive')

          cy.GetProductSummary().then((after) => {
            expect(after.body.data.inactiveProducts).to.eq(inactiveBefore + 1)
          })
        })
      })
    })
  })

  describe('Data Integrity - API vs Database', () => {
    it('should persist all fields correctly in database', () => {
      const req = buildRequest()

      cy.AddProduct(req)
        .then((response) => {
          expect(response.status).to.eq(201)
          return response.body.product
        })
        .then((apiProduct) => {
          cy.getSingleProductFromDb(apiProduct.id).then((dbData) => {
            expect(dbData).to.exist
            expect(apiProduct.id).to.eq(dbData.id)
            expect(apiProduct.type).to.eq(dbData.type)
            expect(apiProduct.product_id).to.eq(dbData.product_id)
            expect(apiProduct.brand_id).to.eq(dbData.brand_id)
            expect(apiProduct.usage_quantity).to.eq(dbData.usage_quantity)
            expect(apiProduct.note).to.eq(dbData.note)
            expect(apiProduct.product_status).to.eq(dbData.product_status)
            expect(apiProduct.user_id).to.eq(dbData.user_id)
            expect(apiProduct.quantity).to.eq(dbData.quantity)
          })
        })
    })

    it('totalProducts from DB should match after creation', () => {
      cy.AddProduct(buildRequest())
        .then((response) => {
          expect(response.status).to.eq(201)
        })
        .then(() => {
          cy.GetProductSummary()
            .then((res) => res.body.data.totalProducts)
            .then((apiTotal) => {
              cy.getTotalProductsFromDb().then((dbTotal) => {
                expect(apiTotal).to.eq(dbTotal)
              })
            })
        })
    })
  })

  describe('Performance', () => {
    it('should create product within 2000ms', () => {
      const start = Date.now()
      cy.AddProduct(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
