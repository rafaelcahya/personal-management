import { ROUTES } from '../../../fixtures/routes.js'
import { INVENTORY_ENDPOINTS } from '../../../fixtures/endpoints.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'

const IDS = TEST_IDS.product_name

describe('Add Product Name Form - UI Tests', () => {
  describe('Desktop View', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_name)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Name button is clicked', () => {
        cy.get(`#${IDS.add_form}`).should('not.exist')
        cy.get(`#${IDS.add_btn}`).should('be.visible').click()
        cy.get(`#${IDS.add_form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
      })

      it('should show error when product name is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_name_error}`)
          .should('be.visible')
          .should('contain', 'Product name cannot be empty')
      })
    })
  })

  describe('Tablet View', () => {
    beforeEach(() => {
      cy.viewport(768, 1024)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_name)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Name button is clicked', () => {
        cy.get(`#${IDS.add_form}`).should('not.exist')
        cy.get(`#${IDS.add_btn}`).should('be.visible').click()
        cy.get(`#${IDS.add_form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
      })

      it('should show error when product name is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_name_error}`)
          .should('be.visible')
          .should('contain', 'Product name cannot be empty')
      })
    })
  })

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_name)
      cy.wait(1000)
    })

    describe('Dialog Behavior', () => {
      it('should open dialog when Add Product Name button is clicked', () => {
        cy.get(`#${IDS.add_form}`).should('not.exist')
        cy.get(`#${IDS.add_btn}`).should('be.visible').click()
        cy.get(`#${IDS.add_form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get(`#${IDS.add_cancel_btn}`).click()
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })

      it('should close dialog when clicking outside', () => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get('body').click(0, 0, { force: true })
        cy.get(`#${IDS.add_form}`).should('not.exist')
      })
    })

    describe('Required Fields Validation', () => {
      beforeEach(() => {
        cy.get(`#${IDS.add_btn}`).click()
        cy.wait(1000)
      })

      it('should show error when product name is empty', () => {
        cy.get(`#${IDS.add_submit_btn}`).click()
        cy.get(`#${IDS.add_name_error}`)
          .should('be.visible')
          .should('contain', 'Product name cannot be empty')
      })
    })

    describe('Duplicate Name — 409 Inline Error (UI)', () => {
      it('should show inline field error when server returns 409 duplicate name', () => {
        const duplicateName = `UIConflict-${Date.now()}`

        cy.setupApiAuthCookies()
        cy.AddProductName({
          product_name: duplicateName,
          product_name_status: 'active',
        }).then((res) => {
          expect(res.status).to.eq(201)
        })

        // 409 error must render inline in the form field — not as a toast
        cy.intercept('POST', INVENTORY_ENDPOINTS.PRODUCT_NAME_CREATE, {
          statusCode: 409,
          body: { success: false, error: 'Product name already exists' },
        }).as('createConflict')

        cy.get(`#${IDS.add_btn}`).click()
        cy.get(`#${IDS.add_form}`).should('be.visible')
        cy.get('#productNameField').type(duplicateName)
        cy.get(`#${IDS.add_submit_btn}`).click()

        cy.wait('@createConflict')

        cy.get(`#${IDS.add_name_error}`)
          .should('be.visible')
          .and('contain', 'Product name already exists')
      })
    })
  })
})
