import { faker } from '@faker-js/faker'

describe('Product Name Detail API', () => {
  let testProductNameId
  let testUserId
  let request
  let responseProductName

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    request = {
      product_name: faker.food.fruit() + '-' + Date.now(),
      note: faker.word.words(25),
      product_name_status: 'active',
    }

    cy.AddProductName(request).then((response) => {
      expect(response.body.success).to.be.true
      expect(response.body.productName).to.exist
      expect(response.status).to.eq(201)

      testUserId = response.body.productName.user_id
      testProductNameId = response.body.productName.id
      responseProductName = response.body.productName
    })
  })

  describe('Authentication & Authorization', () => {
    it('should return 401 for unauthenticated requests', () => {
      cy.clearCookies()

      cy.GetProductNameDetailNoAuth(testProductNameId).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Unauthorized')
        }

        const location = response.headers.location || response.body
        expect(String(location)).to.include('/login')
      })
    })

    it('should return 200 for authenticated user', () => {
      cy.GetProductNameDetail(testProductNameId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.exist
        expect(response.body.data.id).to.eq(testProductNameId)
      })
    })
    it('should return 307 or 401 when not authenticated', () => {
      cy.clearCookies()
      cy.GetProductNameDetailNoAuth(testProductNameId).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 307) {
          const location = response.headers.location || response.body
          expect(String(location)).to.include('/login')
        }

        if (response.status === 401) {
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Unauthorized')
        }
      })
    })
  })

  describe('Parameter Validation', () => {
    it('should return 400 for invalid product name ID (non-numeric)', () => {
      cy.GetProductNameDetail('invalid-id').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('Product Name ID must be a valid number')
      })
    })

    it('should return 400 for empty product name ID', () => {
      cy.GetProductNameDetail().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be a valid number')
      })
    })

    it('should return 400 for non-integer product name ID', () => {
      cy.GetProductNameDetail('123.45').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be an integer')
      })
    })
    it('should return 400 for ID = 0', () => {
      cy.GetProductNameDetail(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be a positive integer')
      })
    })

    it('should return 400 for negative ID', () => {
      cy.GetProductNameDetail(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be a positive integer')
      })
    })

    it('should return 400 for non-numeric string ID', () => {
      cy.GetProductNameDetail('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be a valid number')
      })
    })

    it('should return 400 for float ID', () => {
      cy.GetProductNameDetail('12.5').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name ID must be an integer')
      })
    })
  })

  describe('Valid Product Name Retrieval', () => {
    it('should return correct Product Name data', () => {
      let apiProductName

      cy.GetProductNameDetail(testProductNameId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.exist

        apiProductName = response.body.data

        expect(apiProductName.id).to.eq(testProductNameId)
        expect(apiProductName.product_name).to.eq(responseProductName.product_name)
        expect(apiProductName.product_name_status).to.eq(responseProductName.product_name_status)
        expect(apiProductName.note).to.eq(responseProductName.note)
      })
    })

    it('should return all Product Name fields', () => {
      cy.GetProductNameDetail(testProductNameId).then((response) => {
        const productName = response.body.data
        expect(productName).to.have.property('id')
        expect(productName).to.have.property('product_name')
        expect(productName).to.have.property('product_name_status')
        expect(productName).to.have.property('note')
      })
    })

    it('should return correct response structure', () => {
      cy.GetProductNameDetail(testProductNameId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
        expect(response.body.data.id).to.be.a('number')
      })
    })

    it('should return JSON content-type', () => {
      cy.GetProductNameDetail(testProductNameId).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Product Name Not Found', () => {
    it('should return 404 for non-existent Product Name ID', () => {
      const fakeId = 999999999

      cy.GetProductNameDetail(fakeId).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name not found')
        expect(response.body.data).to.not.exist
      })
    })

    it('should return 404 for Product Name owned by other user', () => {
      const otherUserproductNameId = 72

      cy.GetProductNameDetail(otherUserproductNameId).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product Name not found')
      })
    })
  })

  describe('Data Integrity', () => {
    it('should match database data exactly', () => {
      cy.GetProductNameDetail(testProductNameId)
        .then((response) => {
          expect(response.status).to.eq(200)
          return response.body.data
        })
        .then((apiData) => {
          cy.getSingleProductNameFromDb(testProductNameId).then((dbResult) => {
            const dbData = dbResult[0]

            expect(dbData).to.exist
            expect(apiData.id).to.eq(dbData.id)
            expect(apiData.product_name).to.eq(dbData.product_name)
            expect(apiData.product_name_status).to.eq(dbData.product_name_status)
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

      cy.GetProductNameDetail(testProductNameId).then((response) => {
        const duration = Date.now() - startTime

        expect(response.status).to.eq(200)
        expect(duration).to.be.lessThan(1000)

        cy.log(`⏱️ Response time: ${duration}ms`)
      })
    })

    it('should handle concurrent requests', () => {
      const requests = Array.from({ length: 5 }, () => cy.GetProductNameDetail(testProductNameId))

      requests.forEach((request) => {
        request.then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.id).to.eq(testProductNameId)
        })
      })
    })
  })

  describe('Caching & Consistency', () => {
    it('should return consistent data across multiple requests', () => {
      const productNameIds = Array.from({ length: 3 }, () =>
        cy.GetProductNameDetail(testProductNameId)
      )

      let firstproductName

      productNameIds.forEach((request, index) => {
        request.then((response) => {
          const productName = response.body.data

          if (index === 0) {
            firstproductName = productName
          } else {
            expect(productName.id).to.eq(firstproductName.id)
            expect(productName.product_name).to.eq(firstproductName.product_name)
            expect(productName.product_name_status).to.eq(firstproductName.product_name_status)
            expect(productName.note).to.eq(firstproductName.note)
          }
        })
      })
    })
  })
})
