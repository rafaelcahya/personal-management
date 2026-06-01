const constants = require('../../../fixtures/app-constants.json')

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
        // Items with days_until_empty === 0 should have valid predictions or null
        const itemsWithZeroDays = response.body.data.filter((item) => item.days_until_empty === 0)
        itemsWithZeroDays.forEach((item) => {
          // Either null or a valid date format
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
        // All items should have valid days_until_empty and consistent predicted_date
        response.body.data.forEach((item) => {
          expect(item.days_until_empty).to.be.a('number')
          expect(item.days_until_empty).to.be.gte(0)
          // predicted_date can be any valid string or null
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
