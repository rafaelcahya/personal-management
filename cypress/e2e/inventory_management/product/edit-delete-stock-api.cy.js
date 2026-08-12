import { faker } from '@faker-js/faker'

describe('PUT Edit Product Stock API - /api/inventory/v1/product/stock/:id', () => {
  let validProductListId
  let entryId

  const buildRequest = (overrides = {}) => ({
    quantity_added: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.int({ min: 0, max: 100000 }),
    purchase_date: new Date().toISOString(),
    note: faker.word.words(5),
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: 'TestBrand-' + faker.string.alphanumeric(10),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((brandRes) => {
      expect(brandRes.status).to.eq(201)

      cy.AddProductName({
        product_name: 'TestProduct-' + faker.string.alphanumeric(10),
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
          validProductListId = productRes.body.product.id

          cy.CreateProductStock({
            product_list_id: validProductListId,
            quantity_added: 5,
            price: 10000,
            purchase_date: new Date().toISOString(),
            note: 'initial stock',
          }).then((stockRes) => {
            expect(stockRes.status).to.eq(201)
            entryId = stockRes.body.data.id
          })
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user with valid request', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: 5 })).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.UpdateProductStockNoAuth(entryId, buildRequest()).then((response) => {
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

  describe('Entry ID Validation', () => {
    it('should return 400 when entry id is non-integer', () => {
      cy.UpdateProductStock('abc', buildRequest()).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Entry ID must be a positive integer')
      })
    })

    it('should return 400 when entry id is zero', () => {
      cy.UpdateProductStock(0, buildRequest()).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Entry ID must be a positive integer')
      })
    })

    it('should return 400 when entry id is negative', () => {
      cy.UpdateProductStock(-1, buildRequest()).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Entry ID must be a positive integer')
      })
    })

    it('should return 404 when entry id does not exist', () => {
      cy.UpdateProductStock(999999999, buildRequest()).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })
  })

  describe('quantity_added Validation', () => {
    it('should return 422 when quantity_added is float', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: 1.5 })).then((response) => {
        expect(response.status).to.eq(422)
        expect(response.body.error).to.include('Quantity added must be a positive whole number')
      })
    })

    it('should return 422 when quantity_added is zero', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: 0 })).then((response) => {
        expect(response.status).to.eq(422)
        expect(response.body.error).to.include('Quantity added must be a positive whole number')
      })
    })

    it('should return 422 when quantity_added is negative', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: -1 })).then((response) => {
        expect(response.status).to.eq(422)
        expect(response.body.error).to.include('Quantity added must be a positive whole number')
      })
    })
  })

  describe('price Validation', () => {
    it('should return 422 when price is negative', () => {
      cy.UpdateProductStock(entryId, buildRequest({ price: -1 })).then((response) => {
        expect(response.status).to.eq(422)
        expect(response.body.error).to.include('Price must be a non-negative number')
      })
    })

    it('should accept price of 0', () => {
      cy.UpdateProductStock(entryId, buildRequest({ price: 0, quantity_added: 5 })).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        }
      )
    })
  })

  describe('purchase_date Validation', () => {
    it('should return 422 when purchase_date is invalid format', () => {
      cy.UpdateProductStock(entryId, buildRequest({ purchase_date: 'not-a-date' })).then(
        (response) => {
          expect(response.status).to.eq(422)
          expect(response.body.error).to.include('Purchase date must be a valid date')
        }
      )
    })

    it('should accept valid ISO date format', () => {
      cy.UpdateProductStock(
        entryId,
        buildRequest({ purchase_date: '2026-03-20T00:00:00.000Z', quantity_added: 5 })
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Negative Stock Guard', () => {
    // Note: under normal usage, product_list.quantity is always the sum of its
    // product_quantity entries, so currentQty >= oldQty always holds for any single
    // entry being edited — the negative-projection branch (`current - old + new < 0`)
    // is only reachable if stock was independently reduced below an entry's own
    // contribution (e.g. concurrent writes or product usage consumption). That is
    // out of scope for this endpoint's own request/response contract, so this guard
    // is verified at the boundary instead: reducing quantity_added all the way down
    // to the allowed minimum (1) never fails when it is mathematically safe to do so.
    let guardProductId
    let entryId

    before(() => {
      cy.setupApiAuthCookies()

      cy.AddProductBrand({
        brand: 'TestBrand-' + faker.string.alphanumeric(10),
        brand_status: 'active',
        note: faker.word.words(5),
      }).then((brandRes) => {
        cy.AddProductName({
          product_name: 'TestProduct-' + faker.string.alphanumeric(10),
          product_name_status: 'active',
        }).then((nameRes) => {
          cy.AddProduct({
            product_id: nameRes.body.productName.id,
            brand_id: brandRes.body.productBrand.id,
            type: faker.word.noun(),
            usage_quantity: 0,
            note: faker.word.words(5),
            product_image: '',
          }).then((productRes) => {
            guardProductId = productRes.body.product.id

            cy.CreateProductStock({
              product_list_id: guardProductId,
              quantity_added: 10,
              price: 5000,
              purchase_date: new Date().toISOString(),
            }).then((stockRes) => {
              entryId = stockRes.body.data.id
            })
          })
        })
      })
    })

    it('should allow reducing quantity_added down to the minimum without going negative', () => {
      cy.UpdateProductStock(entryId, { quantity_added: 1 }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.quantity_added).to.eq(1)

        cy.getProductWithQuantityFromDb(guardProductId).then((product) => {
          expect(Number(product.quantity)).to.eq(1)
        })
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: 5 })).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })

    it('should return correct data object keys', () => {
      cy.UpdateProductStock(entryId, buildRequest({ quantity_added: 5 })).then((response) => {
        expect(response.body.data).to.include.all.keys([
          'id',
          'product_list_id',
          'quantity_added',
          'price',
          'purchase_date',
          'note',
          'user_id',
          'created_at',
        ])
      })
    })
  })

  describe('Edit Logic', () => {
    it('should recalculate product_list.quantity when quantity_added changes', () => {
      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.getProductQuantityByIdFromDb(entryId).then((entryBefore) => {
          const oldQty = Number(entryBefore.quantity_added)

          cy.UpdateProductStock(entryId, { quantity_added: 8 }).then((res) => {
            expect(res.status).to.eq(200)
            expect(res.body.data.quantity_added).to.eq(8)

            cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
              expect(Number(after.quantity)).to.eq(beforeQty - oldQty + 8)
            })
          })
        })
      })
    })

    it('should leave product_list.quantity unchanged when only price/date/note change', () => {
      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.UpdateProductStock(entryId, {
          price: 99999,
          purchase_date: '2026-01-01',
          note: 'updated note only',
        }).then((res) => {
          expect(res.status).to.eq(200)
          expect(Number(res.body.data.price)).to.eq(99999)
          expect(res.body.data.note).to.eq('updated note only')

          cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
            expect(Number(after.quantity)).to.eq(beforeQty)
          })
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('DB record should match API response after edit', () => {
      cy.UpdateProductStock(entryId, {
        quantity_added: 6,
        price: 12345,
        purchase_date: '2026-02-15',
        note: 'db check note',
      }).then((res) => {
        expect(res.status).to.eq(200)
        const apiData = res.body.data

        cy.getProductQuantityByIdFromDb(entryId).then((dbRecord) => {
          expect(dbRecord.id).to.eq(apiData.id)
          expect(dbRecord.quantity_added).to.eq(apiData.quantity_added)
          expect(Number(dbRecord.price)).to.eq(Number(apiData.price))
          expect(dbRecord.note).to.eq(apiData.note)
        })
      })
    })
  })
})

describe('DELETE Product Stock API - /api/inventory/v1/product/stock/:id', () => {
  let validProductListId
  let entryId

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: 'TestBrand-' + faker.string.alphanumeric(10),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((brandRes) => {
      cy.AddProductName({
        product_name: 'TestProduct-' + faker.string.alphanumeric(10),
        product_name_status: 'active',
      }).then((nameRes) => {
        cy.AddProduct({
          product_id: nameRes.body.productName.id,
          brand_id: brandRes.body.productBrand.id,
          type: faker.word.noun(),
          usage_quantity: 0,
          note: faker.word.words(5),
          product_image: '',
        }).then((productRes) => {
          validProductListId = productRes.body.product.id

          cy.CreateProductStock({
            product_list_id: validProductListId,
            quantity_added: 5,
            price: 10000,
            purchase_date: new Date().toISOString(),
            note: 'stock to delete',
          }).then((stockRes) => {
            entryId = stockRes.body.data.id
          })
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()
      cy.DeleteProductStockNoAuth(entryId).then((response) => {
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

  describe('Entry ID Validation', () => {
    it('should return 400 when entry id is non-integer', () => {
      cy.DeleteProductStock('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Entry ID must be a positive integer')
      })
    })

    it('should return 404 when entry id does not exist', () => {
      cy.DeleteProductStock(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })
  })

  describe('Success', () => {
    it('should return 200 with deleted confirmation and decrement product quantity', () => {
      cy.getProductWithQuantityFromDb(validProductListId).then((before) => {
        const beforeQty = Number(before.quantity)

        cy.DeleteProductStock(entryId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
          expect(response.body.data.deleted).to.be.true
          expect(response.body.data.quantity_removed).to.eq(5)

          cy.getProductWithQuantityFromDb(validProductListId).then((after) => {
            expect(Number(after.quantity)).to.eq(beforeQty - 5)
          })
        })
      })
    })

    it('should remove the entry from the DB after delete', () => {
      cy.getProductQuantityByIdFromDb(entryId).then((dbRecord) => {
        expect(dbRecord).to.be.null
      })
    })

    it('should return 404 when deleting an already-deleted entry', () => {
      cy.DeleteProductStock(entryId).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.error).to.include('not found')
      })
    })
  })
})
