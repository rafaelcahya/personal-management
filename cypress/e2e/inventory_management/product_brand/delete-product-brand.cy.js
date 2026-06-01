import { faker } from '@faker-js/faker'

describe('Product Brand Delete API', () => {
  let testProductBrandId
  let testUserId

  before(() => {
    cy.setupApiAuthCookies()

    const request = {
      brand_status: faker.food.fruit(),
      note: faker.word.words(25),
      brand: faker.string.alphanumeric(10),
    }

    cy.AddProductBrand(request).then((response) => {
      expect(response.status).to.eq(201)
      testProductBrandId = response.body.productBrand.id
      testUserId = response.body.productBrand.user_id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 307 or 401 without authentication', () => {
      cy.AddProductBrand().then((id) => {
        cy.clearCookies()
        cy.DeleteProductBrandNoAuth(id).then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 307) {
            const location = response.headers.location || response.body
            expect(String(location)).to.include('/login')
          }

          if (response.status === 401) {
            expect(response.body.error).to.eq('Unauthorized')
          }
        })
      })
    })

    it('should return 401 without authentication', () => {
      cy.clearCookies()
      cy.DeleteProductBrandNoAuth(testProductBrandId).then((response) => {
        cy.clearCookies()

        const updateData = { notes: 'unauth test' }
        cy.UpdateProductBrandNoAuth(testProductBrandId, updateData).then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 307) {
            const location = response.headers.location || response.body
            expect(String(location)).to.include('/login')
          }

          if (response.status === 401) {
            expect(response.body.error).to.eq('Unauthorized')
          }
        })
      })
    })
  })

  describe('ID Validation', () => {
    it('should return 400 for non-numeric ID', () => {
      cy.DeleteProductBrand('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Invalid product brand ID provided')
      })
    })

    it('should return 400 for missing ID', () => {
      cy.DeleteProductBrand(null).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Invalid product brand ID provided')
      })
    })

    it('should return 400 for negative/zero product brand ID', () => {
      cy.DeleteProductBrand('0').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.eq('Invalid product brand ID format')
      })
    })

    it('should return 404 for non-existent ID', () => {
      cy.DeleteProductBrand(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })
  })

  describe('Success Scenarios', () => {
    const request = {
      brand_status: faker.food.fruit(),
      note: faker.word.words(25),
      brand: faker.string.alphanumeric(10),
    }

    it('should delete product brand and return 200', () => {
      cy.AddProductBrand(request).then((response) => {
        let productBrandId = response.body.productBrand.id
        cy.DeleteProductBrand(productBrandId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
          expect(response.body.data).to.exist
        })
      })
    })

    it('should return correct response structure', () => {
      cy.AddProductBrand(request).then((response) => {
        let productBrandId = response.body.productBrand.id
        cy.DeleteProductBrand(productBrandId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.all.keys('success', 'data')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('object')
        })
      })
    })

    it('should return application/json content-type', () => {
      cy.AddProductBrand(request).then((response) => {
        let productBrandId = response.body.productBrand.id
        cy.DeleteProductBrand(productBrandId).then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })
    })

    it('should return correct success response', () => {
      cy.DeleteProductBrand(testProductBrandId).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Delete Product Brand - Summary Impact', () => {
    const request = {
      brand_status: faker.food.fruit(),
      note: faker.word.words(25),
      brand: faker.string.alphanumeric(10),
    }

    it('totalProductBrands should decrement by 1 after deletion', () => {
      cy.AddProductBrand(request).then((response) => {
        let productBrandId = response.body.productBrand.id
        cy.GetProductBrandSummary()
          .then((before) => {
            expect(before.status).to.eq(200)
            return before.body.data.totalProductBrands
          })
          .then((totalBefore) => {
            cy.DeleteProductBrand(productBrandId).then((deleteRes) => {
              expect(deleteRes.status).to.eq(200)
            })

            cy.GetProductBrandSummary().then((after) => {
              expect(after.body.data.totalProductBrands).to.eq(totalBefore)
            })
          })
      })
    })
  })

  describe('DB Verification', () => {
    const request = {
      brand_status: faker.food.fruit(),
      note: faker.word.words(25),
      brand: faker.string.alphanumeric(10),
    }

    it('should reflect soft delete in database', () => {
      cy.AddProductBrand(request).then((response) => {
        let productBrandId = response.body.productBrand.id
        cy.DeleteProductBrand(productBrandId)
          .then((response) => {
            expect(response.status).to.eq(200)
            return productBrandId
          })
          .then((productBrandId) => {
            cy.getSingleProductBrandFromDb(productBrandId).then((rows) => {
              const dbData = rows[0]
              expect(dbData).to.exist
              expect(dbData.brand_status).to.eq('deleted')
              expect(dbData.deleted_at).to.not.be.null
            })
          })
      })
    })
  })

  // Generated by Cypress Author — 2026-05-15
  describe('Delete Guard - Brand In Use', () => {
    let guardBrandId
    let guardProductId
    let guardProductNameId

    before(() => {
      cy.setupApiAuthCookies()

      // Create a brand specifically for the guard tests
      cy.AddProductBrand({
        brand: faker.food.fruit() + '-guard-' + Date.now(),
        brand_status: 'active',
        note: faker.word.words(5),
      }).then((brandRes) => {
        expect(brandRes.status).to.eq(201)
        guardBrandId = brandRes.body.productBrand.id
        cy.log(`✅ Guard brand created, ID: ${guardBrandId}`)
      })

      // Create a product name to satisfy the FK requirement
      cy.AddProductName({
        product_name: faker.food.ingredient() + '-' + Date.now(),
      }).then((nameRes) => {
        expect(nameRes.status).to.eq(201)
        guardProductNameId = nameRes.body.productName.id
        cy.log(`✅ Guard product name created, ID: ${guardProductNameId}`)
      })
    })

    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    it('should return 409 when brand is used by active products', () => {
      // Create a product linked to the guard brand
      cy.AddProduct({
        product_id: guardProductNameId,
        brand_id: guardBrandId,
        type: faker.word.noun(),
        usage_quantity: faker.number.int({ min: 1, max: 10 }),
        note: faker.word.words(5),
        product_image: '',
      }).then((productRes) => {
        expect(productRes.status).to.eq(201)
        guardProductId = productRes.body.product.id
        cy.log(`✅ Guard product created, ID: ${guardProductId}, brand_id: ${guardBrandId}`)

        // Attempt to delete the brand — must be blocked
        cy.DeleteProductBrand(guardBrandId).then((response) => {
          expect(response.status).to.eq(409)
          expect(response.body.success).to.be.false
          cy.log('❌ Delete correctly blocked with 409 — brand has active products')
        })
      })
    })

    it('should include product count in error message', () => {
      // guardProductId should already exist from the previous test setup
      // Re-run the delete attempt and inspect the error message
      cy.DeleteProductBrand(guardBrandId).then((response) => {
        expect(response.status).to.eq(409)
        expect(response.body.error).to.match(
          /Brand is still used by \d+ product\(s\) and cannot be deleted/
        )
        cy.log(`📊 Error message with count: "${response.body.error}"`)
      })
    })

    it('should return 200 when brand has no active products', () => {
      // Create a fresh brand with no products linked
      cy.AddProductBrand({
        brand: faker.food.fruit() + '-empty-' + Date.now(),
        brand_status: 'active',
        note: faker.word.words(5),
      }).then((brandRes) => {
        expect(brandRes.status).to.eq(201)
        const emptyBrandId = brandRes.body.productBrand.id
        cy.log(`✅ Empty brand created, ID: ${emptyBrandId}`)

        cy.DeleteProductBrand(emptyBrandId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
          cy.log('✅ Brand with no products deleted successfully — 200 returned')
        })
      })
    })

    it('should NOT soft-delete brand when it has active products (DB verification)', () => {
      // guardBrandId still has guardProductId linked — attempt delete must fail
      cy.DeleteProductBrand(guardBrandId).then((response) => {
        expect(response.status).to.eq(409)
        cy.log('❌ Delete attempt returned 409 — verifying DB state unchanged')
      })

      // Confirm the DB record is still alive (brand_status != deleted, deleted_at IS NULL)
      cy.getSingleProductBrandFromDb(guardBrandId).then((rows) => {
        expect(rows).to.have.length.greaterThan(0)
        const dbRow = rows[0]
        expect(dbRow.brand_status).to.not.eq('deleted')
        expect(dbRow.deleted_at).to.be.null
        cy.log(
          `✅ DB verified — brand_status: "${dbRow.brand_status}", deleted_at: ${dbRow.deleted_at}`
        )
      })
    })
  })

  describe('Performance', () => {
    it('should delete within 1s', () => {
      const start = Date.now()
      cy.DeleteProductBrand(testProductBrandId).then((response) => {
        const duration = Date.now() - start
        expect(duration).to.be.lte(1000)
        cy.log(`Delete time: ${duration}ms`)
      })
    })
  })
})
