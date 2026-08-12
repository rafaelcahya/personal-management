import { faker } from '@faker-js/faker'

describe('PATCH Edit Product API - /api/inventory/v1/product/[id]', () => {
  let validBrandId
  let validProductId
  let createdProduct

  const buildEditRequest = (overrides = {}) => ({
    brand_id: validBrandId,
    product_id: validProductId,
    type: faker.word.noun(),
    product_status: 'active',
    ...overrides,
  })

  before(() => {
    cy.setupApiAuthCookies()

    cy.AddProductBrand({
      brand: 'EditBrand-' + Date.now() + '-' + faker.string.alphanumeric(6),
      brand_status: 'active',
      note: faker.word.words(3),
    }).then((res) => {
      expect(res.status).to.eq(201)
      validBrandId = res.body.productBrand.id
    })

    cy.AddProductName({
      product_name: 'EditName-' + Date.now() + '-' + faker.string.alphanumeric(6),
      product_name_status: 'active',
    }).then((res) => {
      expect(res.status).to.eq(201)
      validProductId = res.body.productName.id
    })

    cy.then(() => {
      cy.AddProduct({
        product_id: validProductId,
        brand_id: validBrandId,
        type: faker.word.noun(),
        usage_quantity: 0,
        note: faker.word.words(3),
        product_image: '',
      }).then((res) => {
        expect(res.status).to.eq(201)
        createdProduct = res.body.product
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication', () => {
    it('returns 401 when unauthenticated', () => {
      cy.clearApiAuth()
      cy.EditProductNoAuth(createdProduct.id, buildEditRequest()).then((response) => {
        expect(response.status).to.be.oneOf([401, 307])
      })
    })
  })

  describe('Success', () => {
    it('returns 200 with success, data, and message on valid request', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest()).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('object')
        expect(response.body.message).to.eq('Product updated successfully')
      })
    })

    it('response data contains the correct product fields', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest()).then((response) => {
        const data = response.body.data
        expect(data).to.include.all.keys([
          'id',
          'uuid',
          'user_id',
          'product_id',
          'brand_id',
          'type',
          'product_status',
          'usage_quantity',
          'quantity',
          'note',
          'product_image',
          'is_favorite',
          'created_at',
          'updated_at',
        ])
      })
    })

    it('updated type is reflected in response data', () => {
      const newType = 'UpdatedType-' + faker.string.alphanumeric(6)
      cy.EditProduct(createdProduct.id, buildEditRequest({ type: newType })).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.type).to.eq(newType)
      })
    })

    it('updated product_status is reflected in response data', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest({ product_status: 'inactive' })).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.product_status).to.eq('inactive')
        }
      )
    })
  })

  describe('Validation — missing required fields', () => {
    it('returns 400 when brand_id is missing', () => {
      const body = buildEditRequest()
      delete body.brand_id
      cy.EditProduct(createdProduct.id, body).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('returns 400 when product_id is missing', () => {
      const body = buildEditRequest()
      delete body.product_id
      cy.EditProduct(createdProduct.id, body).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('returns 400 when type is missing', () => {
      const body = buildEditRequest()
      delete body.type
      cy.EditProduct(createdProduct.id, body).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('returns 400 when product_status is missing', () => {
      const body = buildEditRequest()
      delete body.product_status
      cy.EditProduct(createdProduct.id, body).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })
  })

  describe('Validation — invalid field values', () => {
    it('returns 400 when brand_id is non-numeric', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest({ brand_id: 'abc' })).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('returns 400 when product_id is non-numeric', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest({ product_id: 'abc' })).then(
        (response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        }
      )
    })

    it('returns 400 when product_status is not active or inactive', () => {
      cy.EditProduct(createdProduct.id, buildEditRequest({ product_status: 'unknown' })).then(
        (response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        }
      )
    })
  })

  describe('Not Found', () => {
    it('returns 404 when product ID does not exist', () => {
      cy.EditProduct(999999999, buildEditRequest()).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
    })
  })
})
