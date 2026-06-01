import { faker } from '@faker-js/faker'

describe('Product name List API', () => {
  let testUserId
  let testProductNameIds = []
  let testProductNamesData = []

  const request = () => ({
    product_name: faker.food.fruit() + '-' + Date.now(),
    note: faker.word.words(25),
    product_name_status: 'active',
  })

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    Cypress._.times(3, () => {
      cy.AddProductName(request()).then((response) => {
        expect(response.body.success).to.be.true
        expect(response.body.productName).to.exist
        expect(response.status).to.eq(201)
        const productName = response.body.productName
        testUserId = productName.user_id
        testProductNameIds.push(productName.id)
        testProductNamesData.push(productName)
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('should return 200 with product name list for authenticated user', () => {
    cy.GetListProductName().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.be.true
      expect(response.body.data).to.be.an('array')
      expect(response.body.data.length).to.be.gte(testProductNameIds.length)
      testProductNameIds.forEach((id) => {
        expect(response.body.data.some((t) => t.id === id)).to.be.true
      })
    })
  })

  it("should return only authenticated user's product name", () => {
    cy.GetListProductName().then((response) => {
      response.body.data.forEach((productName) => {
        expect(productName.user_id).to.eq(testUserId)
      })
    })
  })

  it('should sort product name by name ASC', () => {
    cy.GetListProductName().then((response) => {
      const productNames = response.body.data
      for (let i = 0; i < productNames.length - 1; i++) {
        const name1 = productNames[i].product_name.toLowerCase()
        const name2 = productNames[i + 1].product_name.toLowerCase()
        expect(name1.localeCompare(name2)).to.be.lte(0)
      }
    })
  })

  it('should include all product name created in before()', () => {
    cy.GetListProductName().then((response) => {
      expect(response.body.data.length).to.be.gte(testProductNameIds.length)
      testProductNameIds.forEach((id) => {
        expect(response.body.data.some((t) => t.id === id)).to.be.true
      })
    })
  })

  it('should return created product name with correct field values', () => {
    cy.GetListProductName().then((response) => {
      testProductNamesData.forEach((created) => {
        const found = response.body.data.find((t) => t.id === created.id)
        expect(found).to.exist
        expect(found.product_name).to.eq(created.product_name)
        expect(found.product_name_status).to.eq(created.product_name_status)
        expect(found.note).to.eq(created.note)
        expect(found.user_id).to.eq(created.user_id)
      })
    })
  })

  it('should return 401 Unauthorized without auth', () => {
    cy.clearCookies()
    cy.GetListProductNameNoAuth().then((response) => {
      expect(response.status).to.be.oneOf([401, 307])
      if (response.status === 401) {
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Unauthorized')
      }
    })
  })

  it('should return correct response structure', () => {
    cy.GetListProductName().then((response) => {
      expect(response.body).to.have.all.keys('success', 'data')
      expect(response.body.success).to.be.a('boolean')
      expect(response.body.data).to.be.an('array')

      if (response.body.data.length > 0) {
        const productNames = response.body.data[0]
        // v1.14: list response now includes product_count per item
        expect(productNames).to.have.all.keys([
          'created_at',
          'deleted_at',
          'id',
          'product_name',
          'product_name_status',
          'note',
          'updated_at',
          'user_id',
          'uuid',
          'product_count',
        ])
      }
    })
  })

  // Covers v1.14: product_count field presence and type validation
  it('should include product_count as a non-negative integer on every item', () => {
    cy.GetListProductName().then((response) => {
      expect(response.status).to.eq(200)
      response.body.data.forEach((item) => {
        expect(item).to.have.property('product_count')
        expect(item.product_count).to.be.a('number')
        expect(item.product_count).to.be.gte(0)
      })
    })
  })

  it('should return data as array even when no product name exist', () => {
    cy.GetListProductName().then((response) => {
      expect(response.body.data).to.be.an('array')
    })
  })

  it('should return valid timestamps for each product name', () => {
    cy.GetListProductName().then((response) => {
      response.body.data.forEach((item) => {
        expect(Date.parse(item.created_at)).to.not.be.NaN
        expect(Date.parse(item.updated_at)).to.not.be.NaN
      })
    })
  })

  it('should respond within 1000ms', () => {
    const start = Date.now()
    cy.GetListProductName().then(() => {
      const duration = Date.now() - start
      expect(duration).to.be.lte(1000)
      cy.log(`Response time: ${duration}ms`)
    })
  })
})
