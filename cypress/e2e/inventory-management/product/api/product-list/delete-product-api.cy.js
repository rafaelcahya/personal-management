import { faker } from '@faker-js/faker'

describe('DELETE Product API - /api/inventory/v1/product/delete/[id]', () => {
  let validBrandId
  let validProductId

  const buildRequest = (overrides = {}) => ({
    product_id: validProductId,
    brand_id: validBrandId,
    type: faker.word.noun(),
    usage_quantity: faker.number.int({ min: 1, max: 50 }),
    note: faker.word.words(5),
    product_image: '',
    ...overrides,
  })

  const createFreshProduct = () => {
    return cy.AddProduct(buildRequest()).then((res) => {
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
    it('should return 200 for authenticated user with valid id', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        })
      })
    })

    it('should return 307 or 401 without authentication', () => {
      createFreshProduct().then((product) => {
        cy.clearApiAuth()
        cy.DeleteProductNoAuth(product.id).then((response) => {
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
      cy.DeleteProduct('abc').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a valid number')
      })
    })

    it('should return 400 when id is float', () => {
      cy.DeleteProduct('1.5').then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be an integer')
      })
    })

    it('should return 400 when id is zero', () => {
      cy.DeleteProduct(0).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })

    it('should return 400 when id is negative', () => {
      cy.DeleteProduct(-1).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Product ID must be a positive integer')
      })
    })
  })

  describe('Not Found', () => {
    it('should return 404 when product id does not exist', () => {
      cy.DeleteProduct(999999999).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.include('not found')
      })
    })

    it('should return 404 when trying to delete already deleted product', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.DeleteProduct(product.id).then((response) => {
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
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.body).to.have.all.keys('success', 'data', 'message')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('object')
          expect(response.body.message).to.be.a('string')
        })
      })
    })

    it('should return correct success message', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.body.message).to.eq('Product deleted successfully')
        })
      })
    })

    it('should return deleted product data keys', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          const data = response.body.data

          expect(data).to.include.all.keys([
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
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })
    })
  })

  describe('Soft Delete Behavior', () => {
    it('should set deleted_at to a valid ISO timestamp after delete', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          const deletedAt = response.body.data.deleted_at

          expect(deletedAt).to.not.be.null
          expect(new Date(deletedAt).toString()).to.not.eq('Invalid Date')
        })
      })
    })

    it('should set product_status to deleted after delete', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.body.data.product_status).to.eq('deleted')
        })
      })
    })

    it('should update updated_at after delete', () => {
      createFreshProduct().then((product) => {
        const originalUpdatedAt = product.updated_at

        cy.DeleteProduct(product.id).then((response) => {
          const newUpdatedAt = response.body.data.updated_at

          expect(new Date(newUpdatedAt).getTime()).to.be.gte(new Date(originalUpdatedAt).getTime())
        })
      })
    })

    it('deleted product should not appear in product list', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.GetProductList().then((response) => {
          const found = response.body.data.some((p) => p.id === product.id)
          expect(found).to.be.false
        })
      })
    })

    it('deleted product should not appear in product detail', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.GetProductDetail(product.id).then((response) => {
          expect(response.status).to.eq(404)
        })
      })
    })
  })

  describe('Data Accuracy', () => {
    it('should return the correct product id in response', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.body.data.id).to.eq(product.id)
        })
      })
    })

    it('should preserve all original product fields after soft delete', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((response) => {
          const data = response.body.data

          expect(data.type).to.eq(product.type)
          expect(data.note).to.eq(product.note)
          expect(data.product_id).to.eq(product.product_id)
          expect(data.brand_id).to.eq(product.brand_id)
          expect(data.user_id).to.eq(product.user_id)
          expect(data.usage_quantity).to.eq(product.usage_quantity)
        })
      })
    })
  })

  describe('API vs Database Comparison', () => {
    it('deleted_at in DB should match response deleted_at', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id)
          .then((response) => {
            return response.body.data
          })
          .then((apiData) => {
            cy.getSingleProductIncludeDeletedFromDb(product.id).then((dbProduct) => {
              expect(dbProduct).to.not.be.null
              expect(dbProduct.deleted_at).to.not.be.null
              expect(dbProduct.product_status).to.eq('deleted')
              expect(new Date(dbProduct.deleted_at).getTime()).to.eq(
                new Date(apiData.deleted_at).getTime()
              )
            })
          })
      })
    })

    it('product_status in DB should be deleted after API call', () => {
      createFreshProduct().then((product) => {
        cy.DeleteProduct(product.id).then((res) => {
          expect(res.status).to.eq(200)
        })

        cy.getSingleProductIncludeDeletedFromDb(product.id).then((dbProduct) => {
          expect(dbProduct).to.not.be.null
          expect(dbProduct.product_status).to.eq('deleted')
        })
      })
    })

    it('totalProducts in summary should decrease by 1 after delete', () => {
      cy.GetProductSummary()
        .then((response) => response.body.data.totalProducts)
        .then((beforeCount) => {
          createFreshProduct().then((product) => {
            cy.DeleteProduct(product.id).then((res) => {
              expect(res.status).to.eq(200)
            })

            cy.GetProductSummary().then((response) => {
              expect(response.body.data.totalProducts).to.eq(beforeCount)
            })
          })
        })
    })
  })

  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      createFreshProduct().then((product) => {
        const start = Date.now()
        cy.DeleteProduct(product.id).then((response) => {
          expect(response.status).to.eq(200)
          expect(Date.now() - start).to.be.lte(2000)
        })
      })
    })
  })
})
