import { faker } from '@faker-js/faker'

import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'
const ids = TEST_IDS.add_product

describe('Add Product Form - UI', () => {
  describe('Desktop View', () => {
    const typeValue = faker.word.noun()

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_list)
    })

    describe('Dialog Open & Close', () => {
      it('should show Add Product button on page', () => {
        cy.get(`#${ids.add_btn}`).should('be.visible')
      })

      it('should open dialog when Add Product button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.form}`).should('not.exist')
      })

      it('should reset form fields after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).type('Test Type')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).should('have.value', '')
      })

      it('should clear server error after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')

        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Fields Visibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should render all form fields', () => {
        cy.get(`#${ids.image_field}`).should('exist')
        cy.get(`#${ids.brand_field}`).should('be.visible')
        cy.get(`#${ids.name_field}`).should('be.visible')
        cy.get(`#${ids.type_field}`).should('be.visible')
        cy.get(`#${ids.note_field}`).should('be.visible')
      })

      it('should render Cancel and Submit buttons', () => {
        cy.get(`#${ids.cancel_btn}`).should('be.visible')
        cy.get(`#${ids.submit_btn}`).should('be.visible').and('contain.text', 'Add Product')
      })

      it('should not show image preview initially', () => {
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })

      it('should not show server error initially', () => {
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Validation', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show all validation errors when submitted empty', () => {
        cy.get(`#${ids.submit_btn}`).click()

        cy.get(`#${ids.brand_error}`).should('be.visible')
        cy.get(`#${ids.name_error}`).should('be.visible')
        cy.get(`#${ids.type_error}`).should('be.visible')
      })

      it('should show error when type is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).should('be.visible')
      })

      it('should show error when product brand is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.brand_error}`).should('be.visible')
      })

      it('should show error when product name is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.name_error}`).should('be.visible')
      })

      it('should clear type validation error after filling the field', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).should('be.visible')

        cy.get(`#${ids.type_field}`).type(typeValue)
        cy.get(`#${ids.type_error}`).should('not.exist')
      })
    })

    describe('Image Upload', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show image preview after file is selected', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`)
          .should('be.visible')
          .and('have.attr', 'src')
          .and('include', 'data:image')
      })

      it('should only accept image file types', () => {
        cy.get(`#${ids.image_field}`).should('have.attr', 'accept', 'image/*')
      })

      it('should remove image preview after dialog is closed and reopened', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`).should('be.visible')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })
    })

    describe('Accessibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('type input should have correct placeholder', () => {
        cy.get(`#${ids.type_field}`).should(
          'have.attr',
          'placeholder',
          'e.g. Whitening, Hydrating, SPF 50'
        )
      })

      it('note input should have correct placeholder', () => {
        cy.get(`#${ids.note_field}`).should(
          'have.attr',
          'placeholder',
          'Additional details or reminders...'
        )
      })

      it('submit button should be enabled before interaction', () => {
        cy.get(`#${ids.submit_btn}`).should('not.be.disabled')
      })
    })
  })

  describe('Tablet View', () => {
    const typeValue = faker.word.noun()

    beforeEach(() => {
      cy.setupApiAuthCookies()
      cy.viewport(768, 1024)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_list)
    })

    describe('Dialog Open & Close', () => {
      it('should show Add Product button on page', () => {
        cy.get(`#${ids.add_btn}`).should('be.visible')
      })

      it('should open dialog when Add Product button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.form}`).should('not.exist')
      })

      it('should reset form fields after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).type('Test Type')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).should('have.value', '')
      })

      it('should clear server error after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')

        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Fields Visibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should render all form fields', () => {
        cy.get(`#${ids.image_field}`).should('exist')
        cy.get(`#${ids.brand_field}`).should('be.visible')
        cy.get(`#${ids.name_field}`).should('be.visible')
        cy.get(`#${ids.type_field}`).should('be.visible')
        cy.get(`#${ids.note_field}`).should('be.visible')
      })

      it('should render Cancel and Submit buttons', () => {
        cy.get(`#${ids.cancel_btn}`).should('be.visible')
        cy.get(`#${ids.submit_btn}`).should('be.visible').and('contain.text', 'Add Product')
      })

      it('should not show image preview initially', () => {
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })

      it('should not show server error initially', () => {
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Validation', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show all validation errors when submitted empty', () => {
        cy.get(`#${ids.submit_btn}`).click()

        cy.get(`#${ids.brand_error}`).should('be.visible')
        cy.get(`#${ids.name_error}`).should('be.visible')
        cy.get(`#${ids.type_error}`).should('be.visible')
      })

      it('should show error when type is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).should('be.visible')
      })

      it('should show error when product brand is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.brand_error}`).should('be.visible')
      })

      it('should show error when product name is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.name_error}`).should('be.visible')
      })

      it('should clear type validation error after filling the field', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).should('be.visible')

        cy.get(`#${ids.type_field}`).type(typeValue)
        cy.get(`#${ids.type_error}`).should('not.exist')
      })
    })

    describe('Image Upload', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show image preview after file is selected', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`)
          .should('be.visible')
          .and('have.attr', 'src')
          .and('include', 'data:image')
      })

      it('should only accept image file types', () => {
        cy.get(`#${ids.image_field}`).should('have.attr', 'accept', 'image/*')
      })

      it('should remove image preview after dialog is closed and reopened', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`).should('be.visible')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })
    })

    describe('Accessibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('type input should have correct placeholder', () => {
        cy.get(`#${ids.type_field}`).should(
          'have.attr',
          'placeholder',
          'e.g. Whitening, Hydrating, SPF 50'
        )
      })

      it('note input should have correct placeholder', () => {
        cy.get(`#${ids.note_field}`).should(
          'have.attr',
          'placeholder',
          'Additional details or reminders...'
        )
      })

      it('submit button should be enabled before interaction', () => {
        cy.get(`#${ids.submit_btn}`).should('not.be.disabled')
      })
    })
  })

  describe('Mobile View', () => {
    const typeValue = faker.word.noun()

    beforeEach(() => {
      cy.viewport(375, 667)
      cy.loginWithBypass()
      cy.visit(ROUTES.inventory_product_list)
    })

    describe('Dialog Open & Close', () => {
      it('should show Add Product button on page', () => {
        cy.get(`#${ids.add_btn}`).should('be.visible')
      })

      it('should open dialog when Add Product button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.form}`).should('be.visible')
      })

      it('should close dialog when Cancel button is clicked', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.form}`).should('not.exist')
      })

      it('should reset form fields after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).type('Test Type')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.type_field}`).should('have.value', '')
      })

      it('should clear server error after dialog is closed and reopened', () => {
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')

        cy.get(`#${ids.cancel_btn}`).click()
        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Fields Visibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should render all form fields', () => {
        cy.get(`#${ids.image_field}`).should('exist')
        cy.get(`#${ids.brand_field}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.name_field}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.type_field}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.note_field}`).scrollIntoView().should('be.visible')
      })

      it('should render Cancel and Submit buttons', () => {
        cy.get(`#${ids.cancel_btn}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.submit_btn}`)
          .scrollIntoView()
          .should('be.visible')
          .and('contain.text', 'Add Product')
      })

      it('should not show image preview initially', () => {
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })

      it('should not show server error initially', () => {
        cy.get(`#${ids.server_error}`).should('not.exist')
      })
    })

    describe('Form Validation', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show all validation errors when submitted empty', () => {
        cy.get(`#${ids.submit_btn}`).click()

        cy.get(`#${ids.brand_error}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.name_error}`).scrollIntoView().should('be.visible')
        cy.get(`#${ids.type_error}`).scrollIntoView().should('be.visible')
      })

      it('should show error when type is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).scrollIntoView().should('be.visible')
      })

      it('should show error when product brand is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.brand_error}`).scrollIntoView().should('be.visible')
      })

      it('should show error when product name is missing', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.name_error}`).scrollIntoView().should('be.visible')
      })

      it('should clear type validation error after filling the field', () => {
        cy.get(`#${ids.submit_btn}`).click()
        cy.get(`#${ids.type_error}`).scrollIntoView().should('be.visible')

        cy.get(`#${ids.type_field}`).type(typeValue)
        cy.get(`#${ids.type_error}`).should('not.exist')
      })
    })

    describe('Image Upload', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('should show image preview after file is selected', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`)
          .should('be.visible')
          .and('have.attr', 'src')
          .and('include', 'data:image')
      })

      it('should only accept image file types', () => {
        cy.get(`#${ids.image_field}`).should('have.attr', 'accept', 'image/*')
      })

      it('should remove image preview after dialog is closed and reopened', () => {
        cy.get(`#${ids.image_field}`).selectFile('cypress/fixtures/test-image.png', { force: true })
        cy.get(`#${ids.image_preview}`).should('be.visible')
        cy.get(`#${ids.cancel_btn}`).click()

        cy.get(`#${ids.add_btn}`).click()
        cy.get(`#${ids.image_preview}`).should('not.exist')
      })
    })

    describe('Accessibility', () => {
      beforeEach(() => {
        cy.get(`#${ids.add_btn}`).click()
      })

      it('type input should have correct placeholder', () => {
        cy.get(`#${ids.type_field}`).should(
          'have.attr',
          'placeholder',
          'e.g. Whitening, Hydrating, SPF 50'
        )
      })

      it('note input should have correct placeholder', () => {
        cy.get(`#${ids.note_field}`).should(
          'have.attr',
          'placeholder',
          'Additional details or reminders...'
        )
      })

      it('submit button should be enabled before interaction', () => {
        cy.get(`#${ids.submit_btn}`).should('not.be.disabled')
      })
    })
  })
})
