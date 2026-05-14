import { faker } from '@faker-js/faker'

const constants = require('../../../fixtures/app-constants.json')

describe('PATCH Favorite Product API - /api/inventory/v1/product/[id]/favorite', () => {
  let validBrandId
  let validProductId

  const buildProductRequest = (overrides = {}) => ({
    product_id: validProductId,
    brand_id: validBrandId,
    type: faker.word.noun(),
    usage_quantity: 0,
    note: faker.word.words(5),
    product_image: '',
    ...overrides,
  })

  const createFreshProduct = () => {
    return cy.AddProduct(buildProductRequest()).then((res) => {
      expect(res.status).to.eq(201)
      return res.body.product
    })
  }

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
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('should return 200 for authenticated user', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        })
      })
    })

    it('should return 307 or 401 without authentication', () => {
      createFreshProduct().then((product) => {
        cy.clearApiAuth()
        cy.FavoriteProductNoAuth(product.id, true).then((response) => {
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
  })

  describe('ID Validation', () => {
    it('should return 400 when id is non-numeric', () => {
      cy.FavoriteProduct('abc', true).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a valid number')
      })
    })

    it('should return 400 when id is float', () => {
      cy.FavoriteProduct('1.5', true).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be an integer')
      })
    })

    it('should return 400 when id is zero', () => {
      cy.FavoriteProduct(0, true).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })

    it('should return 400 when id is negative', () => {
      cy.FavoriteProduct(-1, true).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })
  })

  describe('Body Validation', () => {
    it('should return 400 when isFavorite is missing', () => {
      createFreshProduct().then((product) => {
        cy.apiRequestWithSession(
          'PATCH',
          `${constants.endpoints.product.favorite}/${product.id}/favorite`,
          { body: {} }
        ).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('isFavorite is required')
        })
      })
    })

    it('should return 400 when isFavorite is string', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, 'true').then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('isFavorite must be a boolean')
        })
      })
    })

    it('should return 400 when isFavorite is number', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, 1).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('isFavorite must be a boolean')
        })
      })
    })

    it('should return 400 when body is invalid JSON', () => {
      createFreshProduct().then((product) => {
        cy.request({
          method: 'PATCH',
          url: `${constants.endpoints.product.favorite}/${product.id}/favorite`,
          body: 'invalid-json',
          headers: { 'Content-Type': 'application/json' },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Invalid JSON in request body')
        })
      })
    })
  })

  describe('Not Found', () => {
    it('should return 404 when product id does not exist', () => {
      cy.FavoriteProduct(999999999, true).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })

    it('should return 404 when product is already deleted', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.status).to.eq(404)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.include('not found')
        })
      })
    })
  })

  describe('Response Structure', () => {
    it('should return correct top-level keys', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.body).to.have.all.keys('success', 'data')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('object')
        })
      })
    })

    it('should return correct product object keys', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.body.data).to.include.all.keys([
            'id',
            'uuid',
            'created_at',
            'updated_at',
            'deleted_at',
            'product',
            'brand',
            'type',
            'product_status',
            'usage_quantity',
            'quantity',
            'note',
            'product_image',
            'usage_date',
            'is_favorite',
            'user_id',
            'product_id',
            'brand_id',
          ])
        })
      })
    })

    it('should return application/json content-type', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })
    })
  })

  describe('Favorite Toggle Logic', () => {
    it('should set is_favorite to true when isFavorite is true', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.is_favorite).to.be.true
        })
      })
    })

    it('should set is_favorite to false when isFavorite is false', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.FavoriteProduct(product.id, false).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.is_favorite).to.be.false
        })
      })
    })

    it('should toggle from false to true to false correctly', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.body.data.is_favorite).to.be.true
        })

        cy.FavoriteProduct(product.id, false).then((res) => {
          expect(res.body.data.is_favorite).to.be.false
        })

        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.body.data.is_favorite).to.be.true
        })
      })
    })

    it('should update updated_at after favorite change', () => {
      createFreshProduct().then((product) => {
        const originalUpdatedAt = product.updated_at

        cy.FavoriteProduct(product.id, true).then((response) => {
          const newUpdatedAt = response.body.data.updated_at

          expect(new Date(newUpdatedAt).getTime()).to.be.gte(new Date(originalUpdatedAt).getTime())
        })
      })
    })

    it('should not change other fields when toggling favorite', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((response) => {
          const data = response.body.data

          expect(data.id).to.eq(product.id)
          expect(data.type).to.eq(product.type)
          expect(data.note).to.eq(product.note)
          expect(data.product_id).to.eq(product.product_id)
          expect(data.brand_id).to.eq(product.brand_id)
          expect(data.user_id).to.eq(product.user_id)
          expect(data.product_status).to.eq(product.product_status)
          expect(data.quantity).to.eq(product.quantity)
        })
      })
    })
  })

  describe('Product List Ordering', () => {
    it('favorited product should appear first in product list', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.GetProductList().then((response) => {
          expect(response.body.data.length).to.be.gt(0)
          expect(response.body.data[0].is_favorite).to.be.true
        })
      })
    })

    it('unfavorited product should not appear first when other favorites exist', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.FavoriteProduct(product.id, false).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.GetProductList().then((response) => {
          const firstProduct = response.body.data[0]
          if (response.body.data.some((p) => p.is_favorite)) {
            expect(firstProduct.is_favorite).to.be.true
          }
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('is_favorite in DB should be true after API call with true', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.getProductFavoriteStatusFromDb(product.id).then((dbProduct) => {
          expect(dbProduct).to.not.be.null
          expect(dbProduct.is_favorite).to.be.true
        })
      })
    })

    it('is_favorite in DB should be false after API call with false', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.FavoriteProduct(product.id, false).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.getProductFavoriteStatusFromDb(product.id).then((dbProduct) => {
          expect(dbProduct).to.not.be.null
          expect(dbProduct.is_favorite).to.be.false
        })
      })
    })

    it('favoriteProducts count in summary should increase after favoriting', () => {
      cy.GetProductSummary()
        .then((response) => response.body.data.favoriteProducts)
        .then((beforeCount) => {
          createFreshProduct().then((product) => {
            cy.FavoriteProduct(product.id, true).then((res) => {
              expect(res.status).to.eq(200)
            })

            cy.GetProductSummary().then((response) => {
              expect(response.body.data.favoriteProducts).to.eq(beforeCount + 1)
            })
          })
        })
    })

    it('favoriteProducts count in summary should decrease after unfavoriting', () => {
      createFreshProduct().then((product) => {
        cy.FavoriteProduct(product.id, true).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.GetProductSummary()
          .then((response) => response.body.data.favoriteProducts)
          .then((beforeCount) => {
            cy.FavoriteProduct(product.id, false).then((res) => {
              expect(res.status).to.eq(200)
            })

            cy.GetProductSummary().then((response) => {
              expect(response.body.data.favoriteProducts).to.eq(beforeCount - 1)
            })
          })
      })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      createFreshProduct().then((product) => {
        const start = Date.now()
        cy.FavoriteProduct(product.id, true).then((response) => {
          expect(response.status).to.eq(200)
          expect(Date.now() - start).to.be.lte(2000)
        })
      })
    })
  })
})
