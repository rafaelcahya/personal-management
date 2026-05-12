import { faker } from '@faker-js/faker'

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
      brand: faker.food.fruit(),
      brand_status: 'active',
      note: faker.word.words(3),
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
          note: faker.word.words(3),
          product_image: '',
        }).then((productRes) => {
          expect(productRes.status).to.eq(201)
          createdProduct = productRes.body.product
          validProductListId = createdProduct.id
          testUserId = productRes.body.product.user_id

          // Create 2 stock entries with different prices and dates
          cy.CreateProductStock(
            buildStockRequest({
              price: 15000,
              purchase_date: new Date('2026-03-01').toISOString(),
            })
          ).then((res1) => {
            expect(res1.status).to.eq(201)
            stockEntries.push(res1.body.productQuantity)

            cy.CreateProductStock(
              buildStockRequest({
                price: 25000,
                purchase_date: new Date('2026-04-15').toISOString(),
              })
            ).then((res2) => {
              expect(res2.status).to.eq(201)
              stockEntries.push(res2.body.productQuantity)
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
          // 401 responses may have different structure (error/message)
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
        brand: faker.food.fruit(),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((brandRes) => {
        cy.AddProductName({
          product_name: faker.food.ingredient(),
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
        // Store the ISO string that was sent to API (2026-04-15T00:00:00.000Z)
        // and compare the date part only
        const returnedDateStr = response.body.data.last_purchase_date
        expect(returnedDateStr).to.include('2026-04-15')
      })
    })

    it('should reflect latest stock entry after new addition', () => {
      // Use ISO string to ensure UTC date is used
      const newDate = new Date(Date.UTC(2026, 4, 1)).toISOString() // May 1, 2026 UTC
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
            // Verify both dates are valid ISO strings
            expect(apiDate).to.be.a('string')
            expect(new Date(apiDate).toString()).to.not.eq('Invalid Date')
            expect(new Date(dbRecord.purchase_date).toString()).to.not.eq('Invalid Date')
            // Compare timestamps (within tolerance for timezone)
            const apiTime = new Date(apiDate).getTime()
            const dbTime = new Date(dbRecord.purchase_date).getTime()
            const diff = Math.abs(apiTime - dbTime)
            expect(diff).to.be.lte(86400000) // Within 1 day tolerance for timezone
          })
        })
    })

    it('should return null when product_quantity table has no records for this product', () => {
      cy.AddProductBrand({
        brand: faker.food.fruit(),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((brandRes) => {
        cy.AddProductName({
          product_name: faker.food.ingredient(),
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
