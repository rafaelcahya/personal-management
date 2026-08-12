import { faker } from '@faker-js/faker'

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
