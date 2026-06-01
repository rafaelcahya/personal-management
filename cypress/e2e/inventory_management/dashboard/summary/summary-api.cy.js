describe('GET Product Summary API - /api/inventory/v1/product/summary', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // Authentication
  describe('Authentication', () => {
    it('Product Summary API (authenticated) → returns 200 with success', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('Product Summary API (unauthenticated) → returns 307 redirect or 401 unauthorized', () => {
      cy.clearApiAuth()
      cy.GetProductSummaryNoAuth().then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          // Middleware returns { error: "Unauthorized", message: "..." }
          // Route handler returns { success: false, error: "Unauthorized" }
          const body = response.body
          const isUnauth = body?.success === false || body?.error === 'UNAUTHORIZED'
          expect(isUnauth).to.be.true
        }

        if (response.status === 307) {
          const location = response.headers.location || ''
          expect(String(location)).to.include('/login')
        }
      })
    })
  })

  // Response Structure
  describe('Response Structure', () => {
    it('Product Summary API response → has top-level keys: success, data', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })

    it('Product Summary API data → contains all 6 required keys', () => {
      cy.GetProductSummary().then((response) => {
        const data = response.body.data
        expect(data).to.have.all.keys(
          'totalProducts',
          'activeProducts',
          'inactiveProducts',
          'totalQuantity',
          'totalUsageQuantity',
          'favoriteProducts'
        )
      })
    })

    it('Product Summary API response → content-type is application/json', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  // Data Types
  describe('Data Types', () => {
    it('Product Summary data.totalProducts → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.totalProducts).to.be.a('number')
        expect(response.body.data.totalProducts).to.be.gte(0)
      })
    })

    it('Product Summary data.activeProducts → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.activeProducts).to.be.a('number')
        expect(response.body.data.activeProducts).to.be.gte(0)
      })
    })

    it('Product Summary data.inactiveProducts → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.inactiveProducts).to.be.a('number')
        expect(response.body.data.inactiveProducts).to.be.gte(0)
      })
    })

    it('Product Summary data.totalQuantity → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.totalQuantity).to.be.a('number')
        expect(response.body.data.totalQuantity).to.be.gte(0)
      })
    })

    it('Product Summary data.totalUsageQuantity → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.totalUsageQuantity).to.be.a('number')
        expect(response.body.data.totalUsageQuantity).to.be.gte(0)
      })
    })

    it('Product Summary data.favoriteProducts → is a non-negative number', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.favoriteProducts).to.be.a('number')
        expect(response.body.data.favoriteProducts).to.be.gte(0)
      })
    })

    it('Product Summary data → all values are non-negative numbers', () => {
      cy.GetProductSummary().then((response) => {
        const data = response.body.data
        Object.values(data).forEach((value) => {
          expect(value).to.be.a('number')
          expect(value).to.be.gte(0)
        })
      })
    })
  })

  // Data Consistency
  describe('Data Consistency', () => {
    it('Product Summary data consistency → totalProducts >= activeProducts + inactiveProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, activeProducts, inactiveProducts } = response.body.data
        expect(totalProducts).to.be.gte(activeProducts + inactiveProducts)
      })
    })

    it('Product Summary data consistency → activeProducts + inactiveProducts <= totalProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, activeProducts, inactiveProducts } = response.body.data
        expect(activeProducts + inactiveProducts).to.be.lte(totalProducts)
      })
    })

    it('Product Summary data consistency → favoriteProducts <= totalProducts', () => {
      cy.GetProductSummary().then((response) => {
        const { totalProducts, favoriteProducts } = response.body.data
        expect(favoriteProducts).to.be.lte(totalProducts)
      })
    })

    it('Product Summary data consistency → totalQuantity is always >= 0', () => {
      cy.GetProductSummary().then((response) => {
        expect(response.body.data.totalQuantity).to.be.gte(0)
      })
    })
  })

  // Performance
  describe('Performance', () => {
    it('Product Summary API performance → responds within 2000ms', () => {
      const start = Date.now()
      cy.GetProductSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})
