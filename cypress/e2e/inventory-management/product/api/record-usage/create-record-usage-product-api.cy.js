import { faker } from '@faker-js/faker'

describe('POST Create Product Stock API - /api/inventory/v1/product/stock/create', () => {
  let validProductListId
  let createdProduct

  const buildRequest = (overrides = {}) => ({
    product_list_id: validProductListId,
    quantity_added: faker.number.int({ min: 1, max: 50 }),
    price: faker.number.int({ min: 0, max: 100000 }),
    purchase_date: new Date().toISOString(),
    note: faker.word.words(5),
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: faker.food.fruit(),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((brandRes) => {
      expect(brandRes.status).to.eq(201)

      cy.AddProductName({
        product_name: faker.food.ingredient(),
        product_name_status: 'active',
      }).then((nameRes) => {
        expect(nameRes.status).to.eq(201)

        cy.AddProduct({
          product_id: nameRes.body.productName.id,
          brand_id: brandRes.body.productBrand.id,
          type: faker.word.noun(),
          usage_quantity: 0,
          note: faker.word.words(5),
          product_image: '',
        }).then((productRes) => {
          expect(productRes.status).to.eq(201)
          createdProduct = productRes.body.product
          validProductListId = createdProduct.id
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 201 for authenticated user with valid request', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.CreateProductStockNoAuth(buildRequest()).then((response) => {
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

  describe('Required Field Validation', () => {
    ;['product_list_id', 'quantity_added', 'price', 'purchase_date'].forEach((field) => {
      it(`should return 400 when ${field} is missing`, () => {
        const req = buildRequest({ [field]: undefined })
        cy.CreateProductStock(req).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')

          const label = field.charAt(0).toUpperCase() + field.slice(1).replaceAll('_', ' ')
          expect(response.body.error).to.include(`${label} is required`)
        })
      })

      it(`should return 400 when ${field} is null`, () => {
        cy.CreateProductStock(buildRequest({ [field]: null })).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.error).to.be.an('array')
        })
      })

      it(`should return 400 when ${field} is empty string`, () => {
        cy.CreateProductStock(buildRequest({ [field]: '' })).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.error).to.be.an('array')
        })
      })
    })

    it('should return 400 with all errors when all required fields are missing', () => {
      cy.CreateProductStock({}).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.be.an('array')
        expect(response.body.error.length).to.be.gte(4)
      })
    })
  })

  describe('product_list_id Validation', () => {
    it('should return 400 when product_list_id is non-numeric', () => {
      cy.CreateProductStock(buildRequest({ product_list_id: 'abc' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Product list id must be a positive integer')
      })
    })

    it('should return 400 when product_list_id is float', () => {
      cy.CreateProductStock(buildRequest({ product_list_id: 1.5 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Product list id must be a positive integer')
      })
    })

    it('should return 400 when product_list_id is zero', () => {
      cy.CreateProductStock(buildRequest({ product_list_id: 0 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Product list id must be a positive integer')
      })
    })

    it('should return 400 when product_list_id is negative', () => {
      cy.CreateProductStock(buildRequest({ product_list_id: -1 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Product list id must be a positive integer')
      })
    })

    it('should return 404 when product_list_id does not exist', () => {
      cy.CreateProductStock(buildRequest({ product_list_id: 999999999 })).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })
  })

  describe('quantity_added Validation', () => {
    it('should return 400 when quantity_added is non-numeric', () => {
      cy.CreateProductStock(buildRequest({ quantity_added: 'abc' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Quantity added must be a valid number')
      })
    })

    it('should return 400 when quantity_added is float', () => {
      cy.CreateProductStock(buildRequest({ quantity_added: 1.5 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Quantity added must be a whole number')
      })
    })

    it('should return 400 when quantity_added is zero', () => {
      cy.CreateProductStock(buildRequest({ quantity_added: 0 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Quantity added must be greater than 0')
      })
    })

    it('should return 400 when quantity_added is negative', () => {
      cy.CreateProductStock(buildRequest({ quantity_added: -1 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Quantity added must be greater than 0')
      })
    })
  })

  describe('price Validation', () => {
    it('should return 400 when price is non-numeric', () => {
      cy.CreateProductStock(buildRequest({ price: 'abc' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Price must be a valid number')
      })
    })

    it('should return 400 when price is negative', () => {
      cy.CreateProductStock(buildRequest({ price: -1 })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Price cannot be negative')
      })
    })

    it('should accept price of 0 (free item)', () => {
      cy.CreateProductStock(buildRequest({ price: 0 })).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })

    it('should accept valid decimal price', () => {
      cy.CreateProductStock(buildRequest({ price: 15000.5 })).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('purchase_date Validation', () => {
    it('should return 400 when purchase_date is invalid format', () => {
      cy.CreateProductStock(buildRequest({ purchase_date: 'not-a-date' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Purchase date must be a valid date')
      })
    })

    it('should accept valid ISO date format', () => {
      cy.CreateProductStock(buildRequest({ purchase_date: '2026-03-20T00:00:00.000Z' })).then(
        (response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.be.true
        }
      )
    })

    it('should accept valid date string format', () => {
      cy.CreateProductStock(buildRequest({ purchase_date: '2026-03-20' })).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
      })
    })

    it('should return correct data object keys', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.body.data).to.include.all.keys([
          'id',
          'user_id',
          'product_list_id',
          'quantity_added',
          'price',
          'purchase_date',
          'note',
          'created_at',
        ])
      })
    })

    it('should return application/json content-type', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

    it('should return 201 status code', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
      })
    })
  })

  describe('Create Logic', () => {
    it('should save correct quantity_added in response', () => {
      const qty = 5
      cy.CreateProductStock(buildRequest({ quantity_added: qty })).then((response) => {
        expect(response.body.data.quantity_added).to.eq(qty)
      })
    })

    it('should save correct price in response', () => {
      const price = 25000
      cy.CreateProductStock(buildRequest({ price })).then((response) => {
        expect(Number(response.body.data.price)).to.eq(price)
      })
    })

    it('should save correct purchase_date in response', () => {
      const date = '2026-03-20'

      cy.CreateProductStock(buildRequest({ purchase_date: date })).then((response) => {
        const responseDate = response.body.data.purchase_date.slice(0, 10)
        expect(responseDate).to.eq(date)
      })
    })

    it('should save correct note in response', () => {
      const note = 'Test note for stock'
      cy.CreateProductStock(buildRequest({ note })).then((response) => {
        expect(response.body.data.note).to.eq(note)
      })
    })

    it('should save note as null when not provided', () => {
      const req = {
        product_list_id: validProductListId,
        quantity_added: 1,
        price: 0,
        purchase_date: new Date().toISOString(),
      }
      cy.CreateProductStock(req).then((response) => {
        expect(response.body.data.note).to.be.null
      })
    })

    it('should save correct product_list_id in response', () => {
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.body.data.product_list_id).to.eq(validProductListId)
      })
    })

    it('should save correct user_id in response', () => {
      cy.getTestUserId().then((userId) => {
        cy.CreateProductStock(buildRequest()).then((response) => {
          expect(response.body.data.user_id).to.eq(userId)
        })
      })
    })
  })

  describe('Product Quantity Update Logic', () => {
    it('should increase product quantity by quantity_added', () => {
      const qtyToAdd = 10

      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.CreateProductStock(buildRequest({ quantity_added: qtyToAdd })).then((res) => {
          expect(res.status).to.eq(201)

          cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
            expect(Number(after.quantity)).to.eq(beforeQty + qtyToAdd)
          })
        })
      })
    })

    it('should correctly accumulate quantity after multiple stock additions', () => {
      const firstAdd = 5
      const secondAdd = 3

      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.CreateProductStock(buildRequest({ quantity_added: firstAdd })).then((res) => {
          expect(res.status).to.eq(201)
        })

        cy.CreateProductStock(buildRequest({ quantity_added: secondAdd })).then((res) => {
          expect(res.status).to.eq(201)
        })

        cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
          expect(Number(after.quantity)).to.eq(beforeQty + firstAdd + secondAdd)
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('should create record in product_quantity table', () => {
      cy.CreateProductStock(buildRequest()).then((res) => {
        expect(res.status).to.eq(201)

        cy.getLatestProductQuantityFromDb(validProductListId).then((dbRecord) => {
          expect(dbRecord).to.not.be.null
        })
      })
    })

    it('DB record should match API response data', () => {
      const qty = 7
      const price = 50000

      cy.CreateProductStock(buildRequest({ quantity_added: qty, price })).then((res) => {
        expect(res.status).to.eq(201)
        const apiData = res.body.data

        cy.getLatestProductQuantityFromDb(validProductListId).then((dbRecord) => {
          expect(dbRecord.id).to.eq(apiData.id)
          expect(dbRecord.quantity_added).to.eq(apiData.quantity_added)
          expect(Number(dbRecord.price)).to.eq(Number(apiData.price))
          expect(dbRecord.product_list_id).to.eq(apiData.product_list_id)
          expect(dbRecord.user_id).to.eq(apiData.user_id)
        })
      })
    })

    it('product_list quantity in DB should increase after stock added', () => {
      const qtyToAdd = 4

      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.CreateProductStock(buildRequest({ quantity_added: qtyToAdd })).then((res) => {
          expect(res.status).to.eq(201)

          cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
            expect(Number(after.quantity)).to.eq(beforeQty + qtyToAdd)
          })
        })
      })
    })

    it('should create separate record for each stock addition', () => {
      cy.getProductQuantityCountFromDb(validProductListId).then((beforeCount) => {
        cy.CreateProductStock(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)
        })

        cy.CreateProductStock(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)
        })

        cy.getProductQuantityCountFromDb(validProductListId).then((afterCount) => {
          expect(afterCount).to.eq(beforeCount + 2)
        })
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.CreateProductStock(buildRequest()).then((response) => {
        expect(response.status).to.eq(201)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
