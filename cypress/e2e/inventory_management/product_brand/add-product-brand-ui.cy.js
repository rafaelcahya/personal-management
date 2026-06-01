import { faker } from '@faker-js/faker'

import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'

const IDS = TEST_IDS.product_brand

const stubCreateSuccess = (brandName, brandId) => {
  cy.intercept('POST', '/api/inventory/v1/product-brand/create', {
    statusCode: 201,
    body: {
      success: true,
      productBrand: {
        id: brandId,
        brand: brandName,
        brand_status: 'active',
        note: '',
        user_id: 'test-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        product_count: 0,
      },
    },
  }).as('createBrand')
}

const stubListWithBrand = (brandName, brandId) => {
  cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
    statusCode: 200,
    body: {
      success: true,
      data: [
        {
          id: brandId,
          brand: brandName,
          brand_status: 'active',
          note: '',
          user_id: 'test-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          product_count: 0,
        },
      ],
    },
  }).as('listBrands')
}

describe('Add Product Brand - UI Tests', () => {
  describe('Happy Path - new brand appears in table', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should add a new brand → new row appears in the table', () => {
      const brandId = 9001
      const createdBrandName = 'ADD-' + faker.string.alphanumeric(10)

      stubCreateSuccess(createdBrandName, brandId)
      stubListWithBrand(createdBrandName, brandId)

      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')

      cy.get(`#${IDS.add_brand_field}`).type(createdBrandName)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createBrand')

      cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      cy.get(`#${IDS.table}`).should('contain', createdBrandName)
    })

    it('should add a brand with a note → dialog closes and brand visible', () => {
      const brandId = 9002
      const createdBrandName = 'ADD-NOTE-' + faker.string.alphanumeric(8)
      const note = faker.word.words(4)

      stubCreateSuccess(createdBrandName, brandId)
      stubListWithBrand(createdBrandName, brandId)

      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')

      cy.get(`#${IDS.add_brand_field}`).type(createdBrandName)
      cy.get(`#${IDS.add_note_field}`).type(note)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createBrand')

      cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      cy.get(`#${IDS.table}`).should('contain', createdBrandName)
    })
  })

  describe('Validation - empty brand name', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)

      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
    })

    it('should show validation error when brand name is empty on submit', () => {
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.get(`#${IDS.add_brand_field_error}`)
        .should('be.visible')
        .and('contain', 'Product brand cannot be empty')

      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
    })

    it('should clear validation error after typing a valid name', () => {
      cy.get(`#${IDS.add_submit_btn}`).click()
      cy.get(`#${IDS.add_brand_field_error}`).should('be.visible')

      cy.get(`#${IDS.add_brand_field}`).type('VALID-' + faker.string.alphanumeric(6))
      cy.get(`#${IDS.add_brand_field_error}`).should('not.exist')
    })

    it('whitespace-only input → no Zod error shown, dialog stays open waiting for API response', () => {
      // Zod z.string().min(1) does NOT trim whitespace — whitespace passes client-side validation.
      // The API rejects it server-side with 400.
      cy.intercept('POST', '/api/inventory/v1/product-brand/create', {
        statusCode: 400,
        body: {
          success: false,
          error: ['brand is required'],
        },
      }).as('createWhitespaceBrand')

      cy.get(`#${IDS.add_brand_field}`).type('   ')
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createWhitespaceBrand')

      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
    })
  })

  describe('Duplicate name rejection', () => {
    let existingBrandName

    before(() => {
      cy.setupApiAuthCookies()
      existingBrandName = 'DUP-' + faker.string.alphanumeric(10)
      cy.AddProductBrand({
        brand: existingBrandName,
        brand_status: 'active',
        note: faker.word.words(3),
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)

      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
    })

    it('should show field error when submitting a brand name that already exists', () => {
      cy.intercept('POST', '/api/inventory/v1/product-brand/create', {
        statusCode: 409,
        body: {
          success: false,
          error: 'Brand name already exists',
        },
      }).as('createBrand')

      cy.get(`#${IDS.add_brand_field}`).type(existingBrandName)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createBrand').its('response.statusCode').should('eq', 409)

      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')

      cy.get(`#${IDS.add_brand_field_error}`)
        .should('be.visible')
        .and('contain', 'Brand name already exists')
    })

    it('should keep dialog open after duplicate name rejection so user can correct', () => {
      cy.intercept('POST', '/api/inventory/v1/product-brand/create', {
        statusCode: 409,
        body: {
          success: false,
          error: 'Brand name already exists',
        },
      }).as('createBrand')

      cy.get(`#${IDS.add_brand_field}`).type(existingBrandName)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createBrand')

      cy.get(`#${IDS.add_form_desktop}`, { timeout: 5000 }).should('be.visible')
    })

    it('should succeed after correcting the duplicate name to a unique one', () => {
      const uniqueName = 'FIXED-' + faker.string.alphanumeric(10)
      const brandId = 9003

      cy.intercept('POST', '/api/inventory/v1/product-brand/create', {
        statusCode: 409,
        body: {
          success: false,
          error: 'Brand name already exists',
        },
      }).as('firstCreate')

      cy.get(`#${IDS.add_brand_field}`).type(existingBrandName)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@firstCreate')

      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')

      stubCreateSuccess(uniqueName, brandId)
      stubListWithBrand(uniqueName, brandId)

      cy.get(`#${IDS.add_brand_field}`).clear().type(uniqueName)
      cy.get(`#${IDS.add_submit_btn}`).click()

      cy.wait('@createBrand')

      cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      cy.get(`#${IDS.table}`).should('contain', uniqueName)
    })
  })

  describe('Dialog open and close behavior', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should open dialog when Add Product Brand button is clicked', () => {
      cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
    })

    it('should close dialog when Cancel button is clicked', () => {
      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_form_desktop}`).should('be.visible')

      cy.get(`#${IDS.add_cancel_btn}`).click()
      cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
    })

    it('should reset form fields after dialog is closed via Cancel', () => {
      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()

      cy.get(`#${IDS.add_brand_field}`).type('TEMP-NAME')
      cy.get(`#${IDS.add_cancel_btn}`).click()

      cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
      cy.get(`#${IDS.add_brand_field}`).should('have.value', '')
    })
  })
})

describe('Add Product Brand Form - UI Tests', () => {
  describe('Desktop View', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Brand button is clicked', () => {
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
        cy.get(`#${IDS.add_btn_desktop}`).filter(':visible').click()
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
      })

      it('should show error when brand is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_brand_field_error}`)
          .should('be.visible')
          .should('contain', 'Product brand cannot be empty')
      })
    })
  })

  describe('Tablet View', () => {
    beforeEach(() => {
      cy.viewport(768, 1024)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Brand button is clicked', () => {
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
        cy.get(`#${IDS.add_btn_desktop}`).should('be.visible').click()
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
      })

      it('should show error when brand is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_brand_field_error}`)
          .should('be.visible')
          .should('contain', 'Product brand cannot be empty')
      })
    })
  })

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Brand button is clicked', () => {
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
        cy.get(`#${IDS.add_btn_desktop}`).should('be.visible').click()
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form_desktop}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form_desktop}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn_desktop}`).click()
        cy.wait(1000)
      })

      it('should show error when brand is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_brand_field_error}`)
          .should('be.visible')
          .should('contain', 'Product brand cannot be empty')
      })
    })
  })
})
