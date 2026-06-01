import { faker } from '@faker-js/faker'

import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'

const IDS = TEST_IDS.product_brand

const searchAndOpenRow = (brandName, brandId) => {
  cy.get(`#${IDS.search_input}`).clear().type(brandName)
  cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`)
    .should('exist')
    .scrollIntoView()
    .should('be.visible')
}

describe('Update Brand Dialog - UI Tests', () => {
  describe('Update Dialog - Open & Close', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'UPD-OC-' + faker.string.alphanumeric(8)
      cy.AddProductBrand({
        brand: brandName,
        brand_status: 'active',
        note: faker.word.words(5),
      }).then((response) => {
        brandId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should open update dialog when clicking a table row', () => {
      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
    })

    it('should open update dialog when clicking the edit button', () => {
      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="editBrandBtn_${brandId}_productBrandPage"]`)
        .should('be.visible')
        .click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
    })

    it('should close update dialog when Cancel button is clicked', () => {
      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.update_cancel_btn}`).click()
      cy.get(`#${IDS.update_dialog}`).should('not.exist')
    })

    it('should pre-fill brand name, status, and note from the selected brand', () => {
      const prefillName = 'PREFILL-' + faker.string.alphanumeric(8)
      const prefillNote = faker.word.words(5)
      let prefillId

      cy.AddProductBrand({
        brand: prefillName,
        brand_status: 'inactive',
        note: prefillNote,
      }).then((response) => {
        prefillId = response.body.productBrand.id

        cy.reload()
        cy.wait(1000)

        searchAndOpenRow(prefillName, prefillId)

        cy.get(`[data-testid="brandRow_${prefillId}_productBrandPage"]`).click()
        cy.get(`#${IDS.update_dialog}`).should('be.visible')
        cy.get(`#${IDS.update_brand_name_input}`).should('have.value', prefillName)
        cy.get(`#${IDS.update_status_select}`).should('exist')
        cy.get(`#${IDS.update_note_input}`).should('have.value', prefillNote)
      })
    })
  })

  describe('Update Dialog - Success Flow', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'UPD-SF-' + faker.string.alphanumeric(8)
      cy.AddProductBrand({
        brand: brandName,
        brand_status: 'active',
        note: faker.word.words(4),
      }).then((response) => {
        brandId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should update brand name and close dialog → updated name appears in table', () => {
      const updatedName = 'UPD-' + faker.string.alphanumeric(8)

      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandId}`, {
        statusCode: 200,
        body: {
          success: true,
          productBrand: {
            id: brandId,
            brand: updatedName,
            brand_status: 'active',
            note: '',
            updated_at: new Date().toISOString(),
          },
        },
      }).as('updateBrand')

      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              id: brandId,
              brand: updatedName,
              brand_status: 'active',
              note: '',
              product_count: 0,
            },
          ],
        },
      }).as('listBrands')

      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.update_brand_name_input}`).clear().type(updatedName)
      cy.get(`#${IDS.update_submit_btn}`).click()

      cy.wait('@updateBrand')

      cy.get(`#${IDS.update_dialog}`).should('not.exist')
      cy.get(`#${IDS.search_input}`).clear()
      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).should('contain', updatedName)
    })

    it('should update note and close dialog', () => {
      const updatedNote = faker.word.words(6)

      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandId}`, {
        statusCode: 200,
        body: {
          success: true,
          productBrand: {
            id: brandId,
            brand: brandName,
            brand_status: 'active',
            note: updatedNote,
            updated_at: new Date().toISOString(),
          },
        },
      }).as('updateBrand')

      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.update_note_input}`).clear().type(updatedNote)
      cy.get(`#${IDS.update_submit_btn}`).click()

      cy.wait('@updateBrand')

      cy.get(`#${IDS.update_dialog}`).should('not.exist')
    })
  })

  describe('Delete Flow', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'UPD-DEL-' + faker.string.alphanumeric(8)
      cy.AddProductBrand({
        brand: brandName,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should show confirm dialog when Delete trigger is clicked → brand shows deleted status after confirm', () => {
      cy.intercept('DELETE', `/api/inventory/v1/product-brand/delete/${brandId}`, {
        statusCode: 200,
        body: { success: true },
      }).as('deleteBrand')

      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: { success: true, data: [] },
      }).as('listBrands')

      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.delete_trigger_btn}`).click()
      cy.get(`#${IDS.delete_confirm_dialog}`).should('be.visible')
      cy.get(`#${IDS.delete_confirm_btn}`).click()

      cy.wait('@deleteBrand')

      cy.get(`#${IDS.delete_confirm_dialog}`).should('not.exist')
      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).should('not.exist')
    })
  })

  describe('Delete Guard - brand in use', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'UPD-INUSE-' + faker.string.alphanumeric(6)

      cy.AddProductBrand({
        brand: brandName,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((brandResponse) => {
        brandId = brandResponse.body.productBrand.id

        cy.AddProductName({
          product_name: faker.string.alphanumeric(10),
          note: faker.word.words(3),
        }).then((nameResponse) => {
          const productNameId = nameResponse.body.productName.id

          cy.AddProduct({
            product_id: productNameId,
            brand_id: brandId,
            type: faker.word.noun(),
            usage_quantity: 1,
            note: faker.word.words(3),
            product_image: '',
          })
        })
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should disable Delete button when brand has linked products', () => {
      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.delete_trigger_btn}`).should('be.disabled')
    })

    it('should show in-use warning when brand has linked products', () => {
      searchAndOpenRow(brandName, brandId)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.update_in_use_warning}`).should('be.visible')
    })
  })

  describe('Duplicate Name Conflict', () => {
    let brandIdA
    let brandNameA
    let brandIdB
    let brandNameB

    before(() => {
      cy.setupApiAuthCookies()

      brandNameA = 'DUP-A-' + faker.string.alphanumeric(8)
      brandNameB = 'DUP-B-' + faker.string.alphanumeric(8)

      cy.AddProductBrand({
        brand: brandNameA,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandIdA = response.body.productBrand.id
      })

      cy.AddProductBrand({
        brand: brandNameB,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandIdB = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should show error when updating brand name to one already taken → dialog stays open', () => {
      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandIdB}`, {
        statusCode: 409,
        body: {
          success: false,
          error: 'Brand name already exists',
        },
      }).as('updateBrand')

      searchAndOpenRow(brandNameB, brandIdB)
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')

      cy.get(`#${IDS.update_brand_name_input}`).clear().type(brandNameA)
      cy.get(`#${IDS.update_submit_btn}`).click()

      cy.wait('@updateBrand').its('response.statusCode').should('eq', 409)

      cy.get(`#${IDS.update_dialog}`).should('be.visible')
    })

    it('should succeed after correcting the duplicate name to a unique one', () => {
      const uniqueName = 'UPD-FIXED-' + faker.string.alphanumeric(8)

      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandIdB}`, {
        statusCode: 409,
        body: {
          success: false,
          error: 'Brand name already exists',
        },
      }).as('conflictUpdate')

      searchAndOpenRow(brandNameB, brandIdB)
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')

      cy.get(`#${IDS.update_brand_name_input}`).clear().type(brandNameA)
      cy.get(`#${IDS.update_submit_btn}`).click()

      cy.wait('@conflictUpdate')

      cy.get(`#${IDS.update_dialog}`).should('be.visible')

      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandIdB}`, {
        statusCode: 200,
        body: {
          success: true,
          productBrand: {
            id: brandIdB,
            brand: uniqueName,
            brand_status: 'active',
            note: '',
            updated_at: new Date().toISOString(),
          },
        },
      }).as('successUpdate')

      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              id: brandIdA,
              brand: brandNameA,
              brand_status: 'active',
              note: '',
              product_count: 0,
            },
            {
              id: brandIdB,
              brand: uniqueName,
              brand_status: 'active',
              note: '',
              product_count: 0,
            },
          ],
        },
      }).as('listBrands')

      cy.get(`#${IDS.update_brand_name_input}`).clear().type(uniqueName)
      cy.get(`#${IDS.update_submit_btn}`).click()

      cy.wait('@successUpdate')

      cy.get(`#${IDS.update_dialog}`).should('not.exist')
      cy.get(`#${IDS.search_input}`).clear()
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).should('contain', uniqueName)
    })
  })

  describe('Restore Flow', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'UPD-RST-' + faker.string.alphanumeric(8)
      cy.AddProductBrand({
        brand: brandName,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandId = response.body.productBrand.id
        cy.DeleteProductBrand(brandId)
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit(ROUTES.inventory_product_brand)
      cy.wait(1000)
    })

    it('should show Restore button and disabled Update button when brand is deleted', () => {
      cy.get(`#${IDS.filter_sort_btn}`).click()
      cy.get(`#${IDS.filter_option_deleted}`).click()
      cy.wait(500)

      cy.get(`#${IDS.search_input}`).clear().type(brandName)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`)
        .should('exist')
        .scrollIntoView()
        .click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.restore_btn}`).should('be.visible')
      cy.get(`#${IDS.update_submit_btn}`).should('be.disabled')
    })

    it('should restore brand and remove it from deleted filter view', () => {
      cy.intercept('PUT', `/api/inventory/v1/product-brand/update/${brandId}`, {
        statusCode: 200,
        body: {
          success: true,
          productBrand: {
            id: brandId,
            brand: brandName,
            brand_status: 'active',
            note: '',
            deleted_at: null,
            updated_at: new Date().toISOString(),
          },
        },
      }).as('restoreBrand')

      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: { success: true, data: [] },
      }).as('listBrands')

      cy.get(`#${IDS.filter_sort_btn}`).click()
      cy.get(`#${IDS.filter_option_deleted}`).click()
      cy.wait(500)

      cy.get(`#${IDS.search_input}`).clear().type(brandName)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`)
        .should('exist')
        .scrollIntoView()
        .click()
      cy.get(`#${IDS.update_dialog}`).should('be.visible')
      cy.get(`#${IDS.restore_btn}`).click()

      cy.wait('@restoreBrand')

      cy.get(`#${IDS.update_dialog}`).should('not.exist')
      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`).should('not.exist')
    })
  })
})
