import { faker } from '@faker-js/faker'

describe('GET Product Name Summary API', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 when authenticated', () => {
      cy.GetProductNameSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 when not authenticated', () => {
      cy.clearCookies()
      cy.GetProductNameSummaryNoAuth().then((response) => {
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

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.GetProductNameSummary().then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })

    it('should return correct data keys', () => {
      cy.GetProductNameSummary().then((response) => {
        expect(response.body.data).to.have.all.keys('totalProductNames', 'totalStatus')
      })
    })

    it('should return correct data types', () => {
      cy.GetProductNameSummary().then((response) => {
        const { data } = response.body
        expect(data.totalProductNames).to.be.a('number')
        expect(data.totalStatus).to.be.an('object')
      })
    })

    it('should return application/json content-type', () => {
      cy.GetProductNameSummary().then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Business Logic', () => {
    it('totalProductNames should be non-negative integer', () => {
      cy.GetProductNameSummary().then((response) => {
        const total = response.body.data.totalProductNames
        expect(total).to.be.a('number')
        expect(total).to.be.gte(0)
        expect(Number.isInteger(total)).to.be.true
      })
    })

    it('totalStatus values should all be positive integers', () => {
      cy.GetProductNameSummary().then((response) => {
        const { totalStatus } = response.body.data
        Object.values(totalStatus).forEach((count) => {
          expect(count).to.be.a('number')
          expect(count).to.be.gte(1)
          expect(Number.isInteger(count)).to.be.true
        })
      })
    })

    it('sum of totalStatus values should equal totalProductNames', () => {
      cy.GetProductNameSummary().then((response) => {
        const { totalProductNames, totalStatus } = response.body.data
        const sumOfStatus = Object.values(totalStatus).reduce((acc, val) => acc + val, 0)
        expect(sumOfStatus).to.eq(totalProductNames)
      })
    })

    it('totalStatus should reflect newly added product name status', () => {
      let statusBefore

      cy.GetProductNameSummary().then((response) => {
        statusBefore = { ...response.body.data.totalStatus }
      })

      const newName = {
        product_name: faker.food.fruit() + '-' + Date.now(),
        note: faker.word.words(25),
        product_name_status: 'active',
      }

      cy.AddProductName(newName).then((response) => {
        expect(response.status).to.eq(201)
      })

      cy.GetProductNameSummary().then((response) => {
        const statusAfter = response.body.data.totalStatus
        const prevActive = statusBefore['active'] || 0
        expect(statusAfter['active']).to.eq(prevActive + 1)
      })
    })

    it('totalProductNames should increment after adding a new name', () => {
      let totalBefore

      cy.GetProductNameSummary().then((response) => {
        totalBefore = response.body.data.totalProductNames
      })

      cy.AddProductName({
        product_name: faker.food.fruit() + '-' + Date.now(),
        note: faker.word.words(25),
        product_name_status: 'active',
      }).then((response) => {
        expect(response.status).to.eq(201)
      })

      cy.GetProductNameSummary().then((response) => {
        expect(response.body.data.totalProductNames).to.eq(totalBefore + 1)
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('totalProductNames should match database count', () => {
      cy.AddProductName({
        product_name: faker.food.fruit() + '-' + Date.now(),
        note: faker.word.words(25),
        product_name_status: 'active',
      }).then((response) => {
        expect(response.status).to.eq(201)
      })

      cy.GetProductNameSummary()
        .then((response) => {
          expect(response.status).to.eq(200)
          return response.body.data.totalProductNames
        })
        .then((apiCount) => {
          cy.getTotalProductNamesFromDb().then((dbCount) => {
            expect(apiCount).to.eq(dbCount)
          })
        })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.GetProductNameSummary().then((response) => {
        expect(Date.now() - start).to.be.lte(2000)
        expect(response.status).to.eq(200)
      })
    })
  })
})
