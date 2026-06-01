import { faker } from '@faker-js/faker'

const constants = require('../../../fixtures/app-constants.json')

describe('GET Product Summary API - /api/inventory/v1/product/summary', () => {
  let validBrandId
  let validProductId
  let createdProducts = []

  const buildRequest = (overrides = {}) => ({
    product_id: validProductId,
    brand_id: validBrandId,
    type: faker.word.noun(),
    usage_quantity: faker.number.int({ min: 1, max: 50 }),
    note: faker.word.words(5),
    product_image: '',
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: faker.food.fruit(),
      brand_status: 'active',
      note: faker.word.words(5),
    }).then((res) => {
      expect(res.status).to.eq(201)
      validBrandId = res.body.productBrand.id
    })

    cy.AddProductName({
      product_name: faker.food.ingredient(),
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(201)
      validProductId = res.body.productName.id
    })

    Cypress._.times(3, () => {
      cy.then(() => {
        cy.AddProduct(buildRequest()).then((res) => {
          expect(res.status).to.eq(201)
          createdProducts.push(res.body.product)
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should return 307 or 401 without authentication', () => {
      cy.clearApiAuth()

      cy.GetProductSummaryNoAuth().then((response) => {
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

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
      })
    })

    it('should return all required summary keys', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data).to.have.all.keys([
          'totalProducts',
          'activeProducts',
          'inactiveProducts',
          'totalQuantity',
          'totalUsageQuantity',
          'favoriteProducts',
        ])
      })
    })

    it('should return application/json content-type', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  describe('Data Types', () => {
    it('should return all summary values as numbers', () => {
      cy.GetProductSummary().then((response) => {
        const data = response.body.data

        expect(data.totalProducts).to.be.a('number')
        expect(data.activeProducts).to.be.a('number')
        expect(data.inactiveProducts).to.be.a('number')
        expect(data.totalQuantity).to.be.a('number')
        expect(data.totalUsageQuantity).to.be.a('number')
        expect(data.favoriteProducts).to.be.a('number')
      })
    })

    it('should return all summary values as non-negative numbers', () => {
      cy.GetProductSummary().then((response) => {
        const data = response.body.data

        expect(data.totalProducts).to.be.gte(0)
        expect(data.activeProducts).to.be.gte(0)
        expect(data.inactiveProducts).to.be.gte(0)
        expect(data.totalQuantity).to.be.gte(0)
        expect(data.totalUsageQuantity).to.be.gte(0)
        expect(data.favoriteProducts).to.be.gte(0)
      })
    })
  })

  describe('Summary Calculation Logic', () => {
    it('totalProducts should equal activeProducts + inactiveProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, activeProducts, inactiveProducts } = response.body.data

        expect(totalProducts).to.eq(activeProducts + inactiveProducts)
      })
    })

    it('activeProducts should not exceed totalProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, activeProducts } = response.body.data
        expect(activeProducts).to.be.lte(totalProducts)
      })
    })

    it('inactiveProducts should not exceed totalProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, inactiveProducts } = response.body.data
        expect(inactiveProducts).to.be.lte(totalProducts)
      })
    })

    it('favoriteProducts should not exceed totalProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, favoriteProducts } = response.body.data
        expect(favoriteProducts).to.be.lte(totalProducts)
      })
    })

    it('totalProducts should increase by 1 after adding a new product', () => {
      cy.GetProductSummary()
        .then((response) => {
          return response.body.data.totalProducts
        })
        .then((beforeCount) => {
          cy.AddProduct(buildRequest()).then((res) => {
            expect(res.status).to.eq(201)
          })

          cy.GetProductSummary().then((response) => {
            expect(response.body.data.totalProducts).to.eq(beforeCount + 1)
          })
        })
    })

    it('inactiveProducts should increase by 1 after adding a new product (default inactive)', () => {
      cy.GetProductSummary()
        .then((response) => {
          return response.body.data.inactiveProducts
        })
        .then((beforeCount) => {
          cy.AddProduct(buildRequest()).then((res) => {
            expect(res.status).to.eq(201)
          })

          cy.GetProductSummary().then((response) => {
            expect(response.body.data.inactiveProducts).to.eq(beforeCount + 1)
          })
        })
    })
  })

  describe('API vs Database Comparison', () => {
    it('totalProducts should match database count', () => {
      cy.GetProductSummary()
        .then((response) => response.body.data.totalProducts)
        .then((apiTotal) => {
          cy.getTotalProductsFromDb().then((dbTotal) => {
            expect(apiTotal).to.eq(dbTotal)
          })
        })
    })

    it('all summary values should match computed DB values', () => {
      cy.GetProductSummary()
        .then((response) => response.body.data)
        .then((apiSummary) => {
          cy.getProductSummaryFromDb().then((dbSummary) => {
            expect(apiSummary.totalProducts).to.eq(dbSummary.totalProducts)
            expect(apiSummary.activeProducts).to.eq(dbSummary.activeProducts)
            expect(apiSummary.inactiveProducts).to.eq(dbSummary.inactiveProducts)
            expect(apiSummary.totalQuantity).to.eq(dbSummary.totalQuantity)
            expect(apiSummary.totalUsageQuantity).to.eq(dbSummary.totalUsageQuantity)
            expect(apiSummary.favoriteProducts).to.eq(dbSummary.favoriteProducts)
          })
        })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.GetProductSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
