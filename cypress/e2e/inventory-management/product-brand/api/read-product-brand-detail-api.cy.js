import { faker } from '@faker-js/faker'

describe('Product Brand Detail API', () => {
  let testProductBrandId
  let testUserId
  let request
  let responseProductBrand

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    request = {
      brand_status: faker.food.fruit(),
      note: faker.word.words(25),
      brand: faker.string.alphanumeric(10),
    }

    cy.AddProductBrand(request).then((response) => {
      expect(response.body.success).to.be.true
      expect(response.body.productBrand).to.exist
      expect(response.status).to.eq(201)

      testUserId = response.body.productBrand.user_id
      testProductBrandId = response.body.productBrand.id
      responseProductBrand = response.body.productBrand
    })
  })

  describe('Authentication & Authorization', () => {
    it('should return 401 for unauthenticated requests', () => {
      cy.clearCookies()

      cy.GetProductBrandDetailNoAuth(testProductBrandId).then((response) => {
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

    it('should return 200 for authenticated user', () => {
      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.exist
        expect(response.body.data.id).to.eq(testProductBrandId)
      })
    })
    it('should return 307 or 401 when not authenticated', () => {
      cy.clearCookies()
      cy.GetProductBrandDetailNoAuth(testProductBrandId).then((response) => {
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

  describe('Parameter Validation', () => {
    it('should return 400 for invalid product brand ID (non-numeric)', () => {
      cy.GetProductBrandDetail('invalid-id').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('Product Brand ID must be a valid number')
      })
    })

    it('should return 400 for empty product brand ID', () => {
      cy.GetProductBrandDetail().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be a valid number')
      })
    })

    it('should return 400 for non-integer product brand ID', () => {
      cy.GetProductBrandDetail('123.45').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be an integer')
      })
    })
    it('should return 400 for ID = 0', () => {
      cy.GetProductBrandDetail(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be a positive integer')
      })
    })

    it('should return 400 for negative ID', () => {
      cy.GetProductBrandDetail(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be a positive integer')
      })
    })

    it('should return 400 for non-numeric string ID', () => {
      cy.GetProductBrandDetail('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be a valid number')
      })
    })

    it('should return 400 for float ID', () => {
      cy.GetProductBrandDetail('12.5').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand ID must be an integer')
      })
    })
  })

  describe('Valid Product Brand Retrieval', () => {
    it('should return correct Product Brand data', () => {
      let apiProductBrand

      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.exist

        apiProductBrand = response.body.data

        expect(apiProductBrand.id).to.eq(testProductBrandId)
        expect(apiProductBrand.brand).to.eq(responseProductBrand.brand)
        expect(apiProductBrand.brand_status).to.eq(responseProductBrand.brand_status)
        expect(apiProductBrand.note).to.eq(responseProductBrand.note)
      })
    })

    it('should return all Product Brand fields', () => {
      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        const productBrand = response.body.data
        expect(productBrand).to.have.property('id')
        expect(productBrand).to.have.property('brand')
        expect(productBrand).to.have.property('brand_status')
        expect(productBrand).to.have.property('note')
      })
    })

    it('should return correct response structure', () => {
      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
        expect(response.body.data.id).to.be.a('number')
      })
    })

    it('should return JSON content-type', () => {
      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Product Brand Not Found', () => {
    it('should return 404 for non-existent Product Brand ID', () => {
      const fakeId = 999999999

      cy.GetProductBrandDetail(fakeId).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand not found')
        expect(response.body.data).to.not.exist
      })
    })

    it('should return 404 for Product Brand owned by other user', () => {
      const otherUserProductBrandId = 72

      cy.GetProductBrandDetail(otherUserProductBrandId).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Brand not found')
      })
    })
  })

  describe('Data Integrity', () => {
    it('should match database data exactly', () => {
      cy.GetProductBrandDetail(testProductBrandId)
        .then((response) => {
          expect(response.status).to.eq(200)
          return response.body.data
        })
        .then((apiData) => {
          cy.getSingleProductBrandFromDb(testProductBrandId).then((dbResult) => {
            const dbData = dbResult[0]

            expect(dbData).to.exist
            expect(apiData.id).to.eq(dbData.id)
            expect(apiData.brand).to.eq(dbData.brand)
            expect(apiData.brand_status).to.eq(dbData.brand_status)
            expect(apiData.note).to.eq(dbData.note)
            expect(apiData.user_id).to.eq(dbData.user_id)
            expect(apiData.created_at).to.eq(dbData.created_at)
          })
        })
    })
  })

  describe('Performance', () => {
    it('should respond within 1 second', () => {
      const startTime = Date.now()

      cy.GetProductBrandDetail(testProductBrandId).then((response) => {
        const duration = Date.now() - startTime

        expect(response.status).to.eq(200)
        expect(duration).to.be.lessThan(1000)

        cy.log(`⏱️ Response time: ${duration}ms`)
      })
    })

    it('should handle concurrent requests', () => {
      const requests = Array.from({ length: 5 }, () => cy.GetProductBrandDetail(testProductBrandId))

      requests.forEach((request) => {
        request.then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.id).to.eq(testProductBrandId)
        })
      })
    })
  })

  describe('Caching & Consistency', () => {
    it('should return consistent data across multiple requests', () => {
      const productBrandIds = Array.from({ length: 3 }, () =>
        cy.GetProductBrandDetail(testProductBrandId)
      )

      let firstProductBrand

      productBrandIds.forEach((request, index) => {
        request.then((response) => {
          const productBrand = response.body.data

          if (index === 0) {
            firstProductBrand = productBrand
          } else {
            expect(productBrand.id).to.eq(firstProductBrand.id)
            expect(productBrand.brand).to.eq(firstProductBrand.brand)
            expect(productBrand.brand_status).to.eq(firstProductBrand.brand_status)
            expect(productBrand.note).to.eq(firstProductBrand.note)
          }
        })
      })
    })
  })
})
