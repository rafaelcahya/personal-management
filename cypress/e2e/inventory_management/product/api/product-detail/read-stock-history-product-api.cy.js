import { faker } from '@faker-js/faker'

describe('GET Product Stock History API - /api/inventory/v1/product/stock/history/[id]', () => {
  let validProductListId
  let createdProduct

  const buildStockRequest = (overrides = {}) => ({
    product_list_id: validProductListId,
    quantity_added: faker.number.int({ min: 1, max: 50 }),
    price: faker.number.int({ min: 1000, max: 100000 }),
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

          // Seed 3 stock records untuk test
          cy.CreateProductStock(buildStockRequest({ quantity_added: 5, price: 10000 }))
          cy.CreateProductStock(buildStockRequest({ quantity_added: 3, price: 20000 }))
          cy.CreateProductStock(buildStockRequest({ quantity_added: 2, price: 15000 }))
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.GetProductStockHistoryNoAuth(validProductListId).then((response) => {
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
      cy.GetProductStockHistory('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product list ID must be a valid number')
      })
    })

    it('should return 400 when id is float', () => {
      cy.GetProductStockHistory('1.5').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product list ID must be an integer')
      })
    })

    it('should return 400 when id is zero', () => {
      cy.GetProductStockHistory(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product list ID must be a positive integer')
      })
    })

    it('should return 400 when id is negative', () => {
      cy.GetProductStockHistory(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product list ID must be a positive integer')
      })
    })
  })

  describe('Not Found', () => {
    it('should return 404 when product_list_id does not exist', () => {
      cy.GetProductStockHistory(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })

    it('should return 404 for soft-deleted product', () => {
      cy.AddProduct({
        product_id: createdProduct.product_id,
        brand_id: createdProduct.brand_id,
        type: faker.word.noun(),
        usage_quantity: 0,
        note: faker.word.words(5),
        product_image: '',
      }).then((res) => {
        expect(res.status).to.eq(201)
        const product = res.body.product

        cy.DeleteProduct(product.id).then((deleteRes) => {
          expect(deleteRes.status).to.eq(200)
        })

        cy.GetProductStockHistory(product.id).then((response) => {
          expect(response.status).to.eq(404)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.include('not found')
        })
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body).to.have.all.keys('success', 'history')
        expect(response.body.success).to.be.true
        expect(response.body.history).to.be.an('array')
      })
    })

    it('should return array for history field', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body.history).to.be.an('array')
      })
    })

    it('should return correct keys for each history item', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body.history.length).to.be.gt(0)

        const item = response.body.history[0]
        expect(item).to.include.all.keys([
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
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Data Accuracy', () => {
    it('should return history only for requested product_list_id', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        response.body.history.forEach((item) => {
          expect(item.product_list_id).to.eq(validProductListId)
        })
      })
    })

    it('should return history only for authenticated user', () => {
      cy.getTestUserId().then((userId) => {
        cy.GetProductStockHistory(validProductListId).then((response) => {
          response.body.history.forEach((item) => {
            expect(item.user_id).to.eq(userId)
          })
        })
      })
    })

    it('should return history sorted by purchase_date descending', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        const history = response.body.history
        expect(history.length).to.be.gt(1)

        for (let i = 0; i < history.length - 1; i++) {
          const current = new Date(history[i].purchase_date).getTime()
          const next = new Date(history[i + 1].purchase_date).getTime()
          expect(current).to.be.gte(next)
        }
      })
    })

    it('should return empty array for product with no stock records', () => {
      cy.AddProduct({
        product_id: createdProduct.product_id,
        brand_id: createdProduct.brand_id,
        type: faker.word.noun(),
        usage_quantity: 0,
        note: faker.word.words(5),
        product_image: '',
      }).then((res) => {
        expect(res.status).to.eq(201)
        const newProduct = res.body.product

        cy.GetProductStockHistory(newProduct.id).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.history).to.be.an('array')
          expect(response.body.history.length).to.eq(0)
        })
      })
    })

    it('newly created stock should appear in history', () => {
      const qty = 8
      const price = 30000

      cy.CreateProductStock(buildStockRequest({ quantity_added: qty, price })).then((createRes) => {
        expect(createRes.status).to.eq(201)
        const stockId = createRes.body.data.id

        cy.GetProductStockHistory(validProductListId).then((response) => {
          const found = response.body.history.find((h) => h.id === stockId)
          expect(found).to.not.be.undefined
          expect(found.quantity_added).to.eq(qty)
          expect(Number(found.price)).to.eq(price)
        })
      })
    })
  })

  describe('Data Types', () => {
    it('should return correct data types for history item fields', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body.history.length).to.be.gt(0)
        const item = response.body.history[0]

        expect(item.id).to.be.a('number')
        expect(item.user_id).to.be.a('string')
        expect(item.product_list_id).to.be.a('number')
        expect(item.quantity_added).to.be.a('number')
        expect(item.created_at).to.be.a('string')
      })
    })

    it('should return valid ISO timestamps for created_at', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body.history.length).to.be.gt(0)
        const item = response.body.history[0]

        expect(new Date(item.created_at).toString()).to.not.eq('Invalid Date')
      })
    })

    it('should return valid date for purchase_date', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.body.history.length).to.be.gt(0)
        const item = response.body.history[0]

        expect(new Date(item.purchase_date).toString()).to.not.eq('Invalid Date')
      })
    })

    it('quantity_added should be a positive integer', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        response.body.history.forEach((item) => {
          expect(item.quantity_added).to.be.a('number')
          expect(item.quantity_added).to.be.gt(0)
          expect(Number.isInteger(item.quantity_added)).to.be.true
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('history count should match DB count', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        const apiCount = response.body.history.length

        cy.getProductQuantityCountFromDb(validProductListId).then((dbCount) => {
          expect(apiCount).to.eq(dbCount)
        })
      })
    })

    it('history items should match DB records', () => {
      cy.GetProductStockHistory(validProductListId).then((response) => {
        const apiHistory = response.body.history

        cy.getProductQuantityHistoryFromDb(validProductListId).then((dbHistory) => {
          expect(apiHistory.length).to.eq(dbHistory.length)

          apiHistory.forEach((apiItem) => {
            const dbItem = dbHistory.find((d) => d.id === apiItem.id)
            expect(dbItem).to.not.be.undefined
            expect(apiItem.quantity_added).to.eq(dbItem.quantity_added)
            expect(Number(apiItem.price)).to.eq(Number(dbItem.price))
            expect(apiItem.product_list_id).to.eq(dbItem.product_list_id)
          })
        })
      })
    })

    it('history count should increase by 1 after adding stock', () => {
      cy.GetProductStockHistory(validProductListId).then((beforeResponse) => {
        const beforeCount = beforeResponse.body.history.length

        cy.CreateProductStock(buildStockRequest()).then((res) => {
          expect(res.status).to.eq(201)
        })

        cy.GetProductStockHistory(validProductListId).then((afterResponse) => {
          expect(afterResponse.body.history.length).to.eq(beforeCount + 1)
        })
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.GetProductStockHistory(validProductListId).then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
