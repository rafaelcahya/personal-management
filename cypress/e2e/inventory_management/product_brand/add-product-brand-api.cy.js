import { faker } from '@faker-js/faker'

describe('Product Brand Add API and Database Comparison', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  describe('Product Brand Add API', () => {
    describe('Authentication & Authorization', () => {
      it('should return 307 or 401 when user is not authenticated', () => {
        cy.clearApiAuth()

        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrandNoAuth(request).then((response) => {
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

      it('should return 201 when user is authenticated', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.be.true
          expect(response.body.productBrand).to.exist
        })
      })
    })

    describe('Request Body Validation', () => {
      it('should return 400 when body is missing', () => {
        cy.AddProductBrand().then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Invalid JSON in request body')
        })
      })

      it('should return 400 for invalid JSON', () => {
        const request = 'NULL'

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Invalid JSON in request body')
        })
      })

      it('should return 400 for empty body object', () => {
        const request = {}
        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
        })
      })
    })

    describe('Required Fields Validation', () => {
      it('should return 400 when brand is missing', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('brand is required')
        })
      })

      it('should return 400 when brand is empty string', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: '',
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('brand is required')
        })
      })

      it('should return 400 when brand is null', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: null,
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error).to.include('brand is required')
        })
      })

      it('should return 400 with multiple validation errors', () => {
        const request = {}

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array')
          expect(response.body.error.length).to.be.greaterThan(0)
          expect(response.body.error.length).to.be.eq(1)
        })
      })
    })

    describe('Product Brand Object Structure Scenarios', () => {
      it('should create product brand with all required fields', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          const productBrand = response.body.productBrand
          expect(productBrand).to.have.property('id')
          expect(productBrand).to.have.property('brand_status')
          expect(productBrand).to.have.property('brand')
        })
      })

      it('should return correct success response structure', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.all.keys('success', 'productBrand')
          expect(response.body.success).to.be.true
          expect(response.body.productBrand).to.be.an('object')
        })
      })

      it('should return correct error response structure', () => {
        cy.AddProductBrand().then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body).to.have.all.keys('success', 'error')
          expect(response.body.success).to.be.false
          expect(response.body.error).to.exist
        })
      })
    })

    describe('Uniqueness Validation', () => {
      it('should return 409 when brand name already exists (exact match)', () => {
        const brandName = faker.food.fruit() + '-' + Date.now()

        cy.AddProductBrand({
          brand: brandName,
          brand_status: 'active',
          note: faker.word.words(5),
        }).then((res) => {
          expect(res.status).to.eq(201)

          cy.AddProductBrand({
            brand: brandName,
            brand_status: 'active',
            note: faker.word.words(5),
          }).then((response) => {
            expect(response.status).to.eq(409)
            expect(response.body.success).to.be.false
            expect(response.body.error).to.eq('Brand name already exists')
          })
        })
      })

      it('should return 409 when brand name already exists (case-insensitive)', () => {
        const baseName = faker.food.fruit() + '-ci-' + Date.now()

        cy.AddProductBrand({
          brand: baseName.toLowerCase(),
          brand_status: 'active',
          note: faker.word.words(5),
        }).then((res) => {
          expect(res.status).to.eq(201)

          cy.AddProductBrand({
            brand: baseName.toUpperCase(),
            brand_status: 'active',
            note: faker.word.words(5),
          }).then((response) => {
            expect(response.status).to.eq(409)
            expect(response.body.success).to.be.false
            expect(response.body.error).to.eq('Brand name already exists')
          })
        })
      })

      it('should return 201 when brand name is same as a deleted brand', () => {
        const brandName = faker.food.fruit() + '-del-' + Date.now()

        cy.AddProductBrand({
          brand: brandName,
          brand_status: 'active',
          note: faker.word.words(5),
        }).then((res) => {
          expect(res.status).to.eq(201)
          const brandId = res.body.productBrand.id

          cy.DeleteProductBrand(brandId).then((delRes) => {
            expect(delRes.status).to.eq(200)

            cy.AddProductBrand({
              brand: brandName,
              brand_status: 'active',
              note: faker.word.words(5),
            }).then((response) => {
              expect(response.status).to.eq(201)
              expect(response.body.success).to.be.true
            })
          })
        })
      })

      it('should return correct 409 response structure', () => {
        const brandName = faker.food.fruit() + '-struct-' + Date.now()

        cy.AddProductBrand({
          brand: brandName,
          brand_status: 'active',
          note: faker.word.words(5),
        }).then((res) => {
          expect(res.status).to.eq(201)

          cy.AddProductBrand({
            brand: brandName,
            brand_status: 'active',
            note: faker.word.words(5),
          }).then((response) => {
            expect(response.status).to.eq(409)
            expect(response.body).to.have.all.keys('success', 'error')
            expect(response.body.success).to.be.false
            expect(response.body.error).to.be.a('string')
          })
        })
      })
    })

    describe('Success Scenarios', () => {
      it('should create product brand with all required fields', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.be.true
          expect(response.body.productBrand).to.exist
        })
      })

      it('should assign user_id from authenticated user', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)

          const productBrand = response.body.productBrand
          expect(productBrand.user_id).to.exist
          expect(productBrand.user_id).to.be.a('string')
          expect(productBrand.user_id.length).to.be.greaterThan(0)
        })
      })

      it('should generate timestamps (created_at, updated_at)', () => {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)

          const productBrand = response.body.productBrand
          expect(productBrand.created_at).to.exist
          expect(productBrand.updated_at).to.exist
          expect(new Date(productBrand.created_at).toString()).to.not.eq('Invalid Date')
        })
      })
    })
  })

  describe('Data Integrity - API vs Database Comparison', () => {
    let productBrandId
    let userId

    beforeEach(() => {
      const request = {
        brand_status: faker.food.fruit(),
        note: faker.word.words(25),
        brand: faker.string.alphanumeric(10),
      }

      cy.AddProductBrand(request).then((response) => {
        expect(response.status).to.eq(201)
        productBrandId = response.body.productBrand.id
        userId = response.body.productBrand.user_id
      })
    })

    describe('Complete Field Comparison', () => {
      it('should match all fields between API and DB', function () {
        let apiProductBrand, dbProductBrand

        cy.GetSingleProductBrand(productBrandId).then((response) => {
          expect(response.status).to.eq(200)
          apiProductBrand = response.body.data
        })

        cy.getSingleProductBrandFromDb(productBrandId, userId).then((rows) => {
          dbProductBrand = rows[0]
        })

        cy.then(() => {
          expect(apiProductBrand.id).to.eq(dbProductBrand.id)
          expect(apiProductBrand.brand).to.eq(dbProductBrand.brand)
          expect(apiProductBrand.note).to.eq(dbProductBrand.note)
          expect(apiProductBrand.user_id).to.eq(dbProductBrand.user_id)
          expect(apiProductBrand.brand_status).to.eq(dbProductBrand.brand_status)
          expect(apiProductBrand.created_at).to.eq(dbProductBrand.created_at)
          expect(apiProductBrand.updated_at).to.eq(dbProductBrand.updated_at)
          expect(apiProductBrand.deleted_at).to.eq(dbProductBrand.deleted_at)
        })
      })

      it('should have identical field count', function () {
        let apiProductBrand, dbProductBrand

        cy.GetSingleProductBrand(productBrandId).then((response) => {
          apiProductBrand = response.body.data
        })

        cy.getSingleProductBrandFromDb(productBrandId, userId).then((rows) => {
          dbProductBrand = rows[0]
        })

        cy.then(() => {
          const apiFieldCount = Object.keys(apiProductBrand).length
          const dbFieldCount = Object.keys(dbProductBrand).length
          expect(apiFieldCount, 'Field Count').to.eq(dbFieldCount)
        })
      })

      it('should have valid ISO timestamp formats', function () {
        let apiProductBrand, dbProductBrand

        cy.GetSingleProductBrand(productBrandId).then((response) => {
          apiProductBrand = response.body.data
        })

        cy.getSingleProductBrandFromDb(productBrandId, userId).then((rows) => {
          dbProductBrand = rows[0]
        })

        cy.then(() => {
          const apiCreatedDate = new Date(apiProductBrand.created_at)
          const dbCreatedDate = new Date(dbProductBrand.created_at)

          expect(apiCreatedDate.toString()).to.not.eq('Invalid Date')
          expect(dbCreatedDate.toString()).to.not.eq('Invalid Date')
          expect(apiProductBrand.created_at).to.eq(dbProductBrand.created_at)
        })
      })
    })
  })

  describe('Product Brand Creation - Summary Impact Tests', () => {
    describe('Total Active Product Brands Impact', () => {
      it('should increment totalProductBrands after creating a new product brand', () => {
        cy.GetProductBrandSummary().then((response) => {
          expect(response.status).to.eq(200)
          cy.wrap(response.body.data.totalProductBrands).as('initialCount')
        })

        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request).then((response) => {
          expect(response.status).to.eq(201)
        })

        cy.GetProductBrandSummary().then(function (response) {
          const newCount = response.body.data.totalProductBrands
          expect(newCount).to.eq(this.initialCount + 1)
        })
      })

      it('should match totalProductBrands with database count', function () {
        const request = {
          brand_status: faker.food.fruit(),
          note: faker.word.words(25),
          brand: faker.string.alphanumeric(10),
        }

        cy.AddProductBrand(request)
          .then((response) => {
            expect(response.status).to.eq(201)
          })
          .then(() => cy.GetProductBrandSummary())
          .then((response) => {
            expect(response.status).to.eq(200)
            return response.body.data.totalProductBrands
          })
          .then((apiCount) => {
            cy.getTotalProductBrandsFromDb().then((dbCount) => {
              expect(apiCount).to.eq(dbCount)
            })
          })
      })
    })
  })
})
