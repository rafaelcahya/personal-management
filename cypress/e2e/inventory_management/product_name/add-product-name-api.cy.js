import { faker } from '@faker-js/faker'

describe('Product Name Add API and Database Comparison', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  describe('Product Name Add API', () => {
    describe('Authentication & Authorization', () => {
      it('should return 307 or 401 when user is not authenticated', () => {
        cy.clearApiAuth()

        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductNameNoAuth(request).then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 401) {
            expect(response.body.success).to.be.false
            expect(response.body.error).to.eq('Unauthorized')
          }

          const location = response.headers.location || response.body
          expect(String(location)).to.include('/login')
        })
      })

      it('should return 201 when user is authenticated', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.be.true
          expect(response.body.productName).to.exist
        })
      })
    })

    describe('Request Body Validation', () => {
      it('should return 400 when body is missing', () => {
        cy.AddProductName().then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Invalid JSON in request body')
        })
      })

      it('should return 400 for invalid JSON', () => {
        const request = 'NULL'

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Invalid JSON in request body')
        })
      })

      it('should return 400 for empty body object', () => {
        const request = {}
        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
        })
      })
    })

    describe('Required Fields Validation', () => {
      it('should return 400 when product name is missing', () => {
        const request = {
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('product name is required')
        })
      })

      it('should return 400 when product name is empty string', () => {
        const request = {
          product_name: '',
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('product name is required')
        })
      })

      it('should return 400 when product name is null', () => {
        const request = {
          product_name: null,
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('product name is required')
        })
      })

      it('should return 400 with multiple validation errors', () => {
        const request = {}

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error.length).to.be.greaterThan(0)
          expect(response.body.error.length).to.be.eq(1)
        })
      })
    })

    describe('Product name Object Structure Scenarios', () => {
      it('should create product name with all required fields', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          const productName = response.body.productName
          expect(productName).to.have.property('id')
          expect(productName).to.have.property('product_name')
          expect(productName).to.have.property('product_name_status')
        })
      })

      it('should return correct success response structure', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.all.keys('success', 'productName')
          expect(response.body.success).to.be.true
          expect(response.body.productName).to.be.an('object')
        })
      })

      it('should return correct error response structure', () => {
        cy.AddProductName().then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body).to.have.all.keys('success', 'error')
          expect(response.body.success).to.be.false
          expect(response.body.error).to.exist
        })
      })
    })

    describe('Success Scenarios', () => {
      it('should create product name with all required fields', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.be.true
          expect(response.body.productName).to.exist
        })
      })

      it('should assign user_id from authenticated user', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)

          const productName = response.body.productName
          expect(productName.user_id).to.exist
          expect(productName.user_id).to.be.a('string')
          expect(productName.user_id.length).to.be.greaterThan(0)
        })
      })

      it('should generate timestamps (created_at, updated_at)', () => {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)

          const productName = response.body.productName
          expect(productName.created_at).to.exist
          expect(productName.updated_at).to.exist
          expect(new Date(productName.created_at).toString()).to.not.eq('Invalid Date')
        })
      })
    })
  })

  describe('Data Integrity - API vs Database Comparison', () => {
    let productNameId
    let userId

    beforeEach(() => {
      const request = {
        product_name: faker.food.fruit() + '-' + Date.now(),
        note: faker.word.words(25),
        product_name_status: 'active',
      }

      cy.AddProductName(request).then((response) => {
        expect(response.status).to.eq(201)
        productNameId = response.body.productName.id
        userId = response.body.productName.user_id
      })
    })

    describe('Complete Field Comparison', () => {
      it('should match all fields between API and DB', function () {
        let apiProductName, dbProductName

        cy.GetSingleProductName(productNameId).then((response) => {
          expect(response.status).to.eq(200)
          apiProductName = response.body.data
        })

        cy.getSingleProductNameFromDb(productNameId, userId).then((rows) => {
          dbProductName = rows[0]
        })

        cy.then(() => {
          expect(apiProductName.id).to.eq(dbProductName.id)
          expect(apiProductName.product_name).to.eq(dbProductName.product_name)
          expect(apiProductName.note).to.eq(dbProductName.note)
          expect(apiProductName.user_id).to.eq(dbProductName.user_id)
          expect(apiProductName.product_name_status).to.eq(dbProductName.product_name_status)
          expect(apiProductName.created_at).to.eq(dbProductName.created_at)
          expect(apiProductName.updated_at).to.eq(dbProductName.updated_at)
          expect(apiProductName.deleted_at).to.eq(dbProductName.deleted_at)
        })
      })

      it('should have identical field count', function () {
        let apiProductName, dbProductName

        cy.GetSingleProductName(productNameId).then((response) => {
          apiProductName = response.body.data
        })

        cy.getSingleProductNameFromDb(productNameId, userId).then((rows) => {
          dbProductName = rows[0]
        })

        cy.then(() => {
          const apiFieldCount = Object.keys(apiProductName).length
          const dbFieldCount = Object.keys(dbProductName).length
          expect(apiFieldCount, 'Field Count').to.eq(dbFieldCount)
        })
      })

      it('should have valid ISO timestamp formats', function () {
        let apiProductName, dbProductName

        cy.GetSingleProductName(productNameId).then((response) => {
          apiProductName = response.body.data
        })

        cy.getSingleProductNameFromDb(productNameId, userId).then((rows) => {
          dbProductName = rows[0]
        })

        cy.then(() => {
          const apiCreatedDate = new Date(apiProductName.created_at)
          const dbCreatedDate = new Date(dbProductName.created_at)

          expect(apiCreatedDate.toString()).to.not.eq('Invalid Date')
          expect(dbCreatedDate.toString()).to.not.eq('Invalid Date')
          expect(apiProductName.created_at).to.eq(dbProductName.created_at)
        })
      })
    })
  })

  describe('Product Name Creation - Summary Impact Tests', () => {
    describe('Total Active Product Names Impact', () => {
      it('should increment totalProductNames after creating a new product name', () => {
        cy.GetProductNameSummary().then((response) => {
          expect(response.status).to.eq(200)
          cy.wrap(response.body.data.totalProductNames).as('initialCount')
        })

        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request).then((response) => {
          expect(response.status).to.eq(201)
        })

        cy.GetProductNameSummary().then(function (response) {
          const newCount = response.body.data.totalProductNames
          expect(newCount).to.eq(this.initialCount + 1)
        })
      })

      it('should match totalProductNames with database count', function () {
        const request = {
          product_name: faker.food.fruit() + '-' + Date.now(),
          note: faker.word.words(25),
          product_name_status: 'active',
        }

        cy.AddProductName(request)
          .then((response) => {
            expect(response.status).to.eq(201)
          })
          .then(() => cy.GetProductNameSummary())
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
  })
})

describe('Product Name Add — Uniqueness Check (409 Conflict)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  it('should return 409 when product name already exists (exact match)', () => {
    const name = `UniqueName-${Date.now()}`
    const request = {
      product_name: name,
      product_name_status: 'active',
    }

    cy.AddProductName(request).then((res) => {
      expect(res.status).to.eq(201)
    })

    cy.AddProductName(request).then((res) => {
      expect(res.status).to.eq(409)
      expect(res.body.success).to.be.false
      expect(res.body.error).to.eq('Product name already exists')
    })
  })

  it('should return 409 when duplicate name differs only in case (case-insensitive)', () => {
    const baseName = `CaseTest-${Date.now()}`

    cy.AddProductName({
      product_name: baseName.toLowerCase(),
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(201)
    })

    cy.AddProductName({
      product_name: baseName.toUpperCase(),
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(409)
      expect(res.body.error).to.eq('Product name already exists')
    })
  })

  it('should allow creating the same name after it has been soft-deleted', () => {
    const name = `SoftDeleted-${Date.now()}`

    cy.AddProductName({ product_name: name, product_name_status: 'active' }).then((res) => {
      expect(res.status).to.eq(201)
      const id = res.body.productName.id

      cy.DeleteProductName(id).then((delRes) => {
        expect(delRes.status).to.eq(200)
      })
    })

    // Deleted records are excluded from the uniqueness check
    cy.AddProductName({ product_name: name, product_name_status: 'active' }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.success).to.be.true
    })
  })
})
