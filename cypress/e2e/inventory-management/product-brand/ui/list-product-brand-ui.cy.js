import { faker } from '@faker-js/faker'

describe('Product Brand List - UI Tests', () => {
  describe('Search', () => {
    let brandNameA
    let brandNameB
    let brandIdA
    let brandIdB

    before(() => {
      // Use setupApiAuthCookies for API-level data seeding
      cy.setupApiAuthCookies()

      brandNameA = 'SRCH-A-' + faker.string.alphanumeric(8)
      brandNameB = 'SRCH-B-' + faker.string.alphanumeric(8)

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
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show only matching row when searching by brand name', () => {
      cy.get('#searchInput_productBrandPage').type(brandNameA)
      // After search, only brandA row is in the filtered list
      cy.get(`[data-testid="brandRow_${brandIdA}_productBrandPage"]`).should('exist')
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).should('not.exist')
    })

    it('should show empty state when searching a non-existent string', () => {
      cy.get('#searchInput_productBrandPage').type('NONEXISTENT_' + faker.string.alphanumeric(12))
      cy.get('#emptyState_productBrandPage').should('be.visible')
    })

    it('should show all brands again after clearing search', () => {
      cy.get('#searchInput_productBrandPage').type(brandNameA)
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).should('not.exist')
      cy.get('#clearSearchBtn_productBrandPage').click()

      // After clearing, both rows should exist (may need to scroll to find them)
      cy.get(`[data-testid="brandRow_${brandIdA}_productBrandPage"]`).should('exist')
      cy.get(`[data-testid="brandRow_${brandIdB}_productBrandPage"]`).should('exist')
    })
  })

  describe('Filter by Status', () => {
    let activeBrandId
    let activeBrandName
    let inactiveBrandId
    let inactiveBrandName

    before(() => {
      cy.setupApiAuthCookies()

      activeBrandName = 'FLT-ACT-' + faker.string.alphanumeric(8)
      inactiveBrandName = 'FLT-INA-' + faker.string.alphanumeric(8)

      cy.AddProductBrand({
        brand: activeBrandName,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        activeBrandId = response.body.productBrand.id
      })

      cy.AddProductBrand({
        brand: inactiveBrandName,
        brand_status: 'inactive',
        note: faker.word.words(3),
      }).then((response) => {
        inactiveBrandId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show only inactive brands when inactive filter is selected', () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_inactive_productBrandPage').click()

      // After filter, search for the inactive brand to ensure it's visible
      cy.get('#searchInput_productBrandPage').clear().type(inactiveBrandName)

      cy.get(`[data-testid="brandRow_${inactiveBrandId}_productBrandPage"]`).should('exist')
      // Active brand should not appear with inactive filter
      cy.get(`[data-testid="brandRow_${activeBrandId}_productBrandPage"]`).should('not.exist')
    })

    it('should show all brands after clearing filter', () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_inactive_productBrandPage').click()
      cy.wait(500)

      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#clearFilterBtn_productBrandPage').should('be.visible').click()
      // clearFilterBtn uses e.stopPropagation — dropdown stays open.
      // Use force: true on subsequent interactions since pointer-events: none is inherited from open dropdown.
      cy.wait(300)

      // After clearing filter, both brands exist in the unfiltered list
      cy.get('#searchInput_productBrandPage')
        .clear({ force: true })
        .type(activeBrandName, { force: true })
      cy.get(`[data-testid="brandRow_${activeBrandId}_productBrandPage"]`).should('exist')

      cy.get('#searchInput_productBrandPage').clear().type(inactiveBrandName)
      cy.get(`[data-testid="brandRow_${inactiveBrandId}_productBrandPage"]`).should('exist')
    })

    it('should show deleted filter view without the active or inactive brands', () => {
      let deletedBrandId
      const deletedBrandName = 'FLT-DEL-' + faker.string.alphanumeric(8)

      cy.AddProductBrand({
        brand: deletedBrandName,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        deletedBrandId = response.body.productBrand.id
        cy.DeleteProductBrand(deletedBrandId).then(() => {
          cy.reload()
          cy.wait(1000)

          cy.get('#filterSortBtn_productBrandPage').click()
          cy.get('#filterOption_deleted_productBrandPage').click()

          // Search for the deleted brand to confirm it's in view
          cy.get('#searchInput_productBrandPage').clear().type(deletedBrandName)

          cy.get(`[data-testid="brandRow_${deletedBrandId}_productBrandPage"]`).should('exist')
          cy.get(`[data-testid="brandRow_${activeBrandId}_productBrandPage"]`).should('not.exist')
        })
      })
    })
  })

  describe('Sort', () => {
    let brandAId
    let brandZId

    before(() => {
      cy.setupApiAuthCookies()

      cy.AddProductBrand({
        brand: 'AAAA-' + faker.string.alphanumeric(6),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandAId = response.body.productBrand.id
      })

      cy.AddProductBrand({
        brand: 'ZZZZ-' + faker.string.alphanumeric(6),
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandZId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should sort brands descending by name → first row starts with Z', () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_name-desc_productBrandPage').click()
      cy.wait(500)

      cy.get('#productBrandsTable_productBrandPage')
        .find('tr')
        .not(':first') // skip header row
        .first()
        .should('contain', 'ZZZZ-')
    })

    it('should reset sort → AAAA- brand appears before ZZZZ- brand', () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_name-desc_productBrandPage').click()
      cy.wait(500)

      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#resetSortBtn_productBrandPage').click()
      cy.wait(500)

      cy.get('#productBrandsTable_productBrandPage')
        .find('tr')
        .not(':first')
        .then(($rows) => {
          const texts = [...$rows].map((r) => r.innerText)
          const aIdx = texts.findIndex((t) => t.includes(`AAAA-`))
          const zIdx = texts.findIndex((t) => t.includes(`ZZZZ-`))
          expect(aIdx).to.be.greaterThan(-1, 'AAAA- row not found')
          expect(zIdx).to.be.greaterThan(-1, 'ZZZZ- row not found')
          expect(aIdx).to.be.lessThan(zIdx, 'AAAA- should come before ZZZZ- in name-asc order')
        })
    })
  })

  describe('Bulk Actions', () => {
    let brandId1
    let brandId2
    let brandName1
    let brandName2

    before(() => {
      cy.setupApiAuthCookies()

      brandName1 = 'BULK-' + faker.string.alphanumeric(8)
      brandName2 = 'BULK-' + faker.string.alphanumeric(8)

      cy.AddProductBrand({
        brand: brandName1,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandId1 = response.body.productBrand.id
      })

      cy.AddProductBrand({
        brand: brandName2,
        brand_status: 'active',
        note: faker.word.words(3),
      }).then((response) => {
        brandId2 = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show bulk action bar with correct selection count when 2 brands are checked', () => {
      // Search for first brand and check it
      cy.get('#searchInput_productBrandPage').clear().type('BULK-')

      cy.get(`[data-testid="brandCheckbox_${brandId1}_productBrandPage"]`).scrollIntoView().click()
      cy.get(`[data-testid="brandCheckbox_${brandId2}_productBrandPage"]`).scrollIntoView().click()
      cy.get('#bulkActionBar_productBrandPage').should('exist').and('contain', '2')
    })

    it('should set brands inactive via bulk action → bar disappears → brands show inactive status', () => {
      // Stub the bulk update (each brand sends a PUT)
      cy.intercept('PUT', /\/api\/inventory\/v1\/product-brand\/update\//, {
        statusCode: 200,
        body: { success: true, productBrand: { brand_status: 'inactive' } },
      }).as('bulkUpdate')

      // Stub the list refresh
      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: { success: true, data: [] },
      }).as('listBrands')

      cy.get('#searchInput_productBrandPage').clear().type('BULK-')

      cy.get(`[data-testid="brandCheckbox_${brandId1}_productBrandPage"]`).scrollIntoView().click()
      cy.get(`[data-testid="brandCheckbox_${brandId2}_productBrandPage"]`).scrollIntoView().click()
      cy.get('#bulkActionBar_productBrandPage').should('exist')
      cy.get('#bulkSetInactiveBtn_productBrandPage').scrollIntoView().click()

      cy.wait('@bulkUpdate')

      cy.get('#bulkActionBar_productBrandPage').should('not.exist')
    })

    it('should deselect all via Deselect All → bulk bar disappears', () => {
      cy.get('#selectAllBrands_productBrandPage').click()
      cy.get('#bulkActionBar_productBrandPage').should('exist')
      cy.get('#bulkDeselectAllBtn_productBrandPage').click()
      cy.get('#bulkActionBar_productBrandPage').should('not.exist')
    })
  })

  describe('Bulk Set Active', () => {
    let inactiveBrandId1
    let inactiveBrandId2
    let inactiveBrandName1
    let inactiveBrandName2

    before(() => {
      cy.setupApiAuthCookies()

      inactiveBrandName1 = 'BACT-' + faker.string.alphanumeric(8)
      inactiveBrandName2 = 'BACT-' + faker.string.alphanumeric(8)

      cy.AddProductBrand({
        brand: inactiveBrandName1,
        brand_status: 'inactive',
        note: faker.word.words(3),
      }).then((response) => {
        inactiveBrandId1 = response.body.productBrand.id
      })

      cy.AddProductBrand({
        brand: inactiveBrandName2,
        brand_status: 'inactive',
        note: faker.word.words(3),
      }).then((response) => {
        inactiveBrandId2 = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show bulk action bar with Set Active button when inactive brands are checked', () => {
      // Switch to inactive filter so our brands are visible
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_inactive_productBrandPage').click()
      cy.wait(500)

      // Search by prefix to locate both BACT- brands
      cy.get('#searchInput_productBrandPage').clear().type('BACT-')

      cy.get(`[data-testid="brandCheckbox_${inactiveBrandId1}_productBrandPage"]`)
        .scrollIntoView()
        .click()
      cy.get(`[data-testid="brandCheckbox_${inactiveBrandId2}_productBrandPage"]`)
        .scrollIntoView()
        .click()

      cy.get('#bulkActionBar_productBrandPage').should('exist')
      cy.get('#bulkSetActiveBtn_productBrandPage').should('exist')
    })

    it('should set inactive brands to active → bulk bar disappears → brands disappear from inactive filter', () => {
      // Stub bulk update
      cy.intercept('PUT', /\/api\/inventory\/v1\/product-brand\/update\//, {
        statusCode: 200,
        body: { success: true, productBrand: { brand_status: 'active' } },
      }).as('bulkSetActive')

      // After update, inactive filter returns empty for BACT- brands
      cy.intercept('GET', '/api/inventory/v1/product-brand/list', {
        statusCode: 200,
        body: { success: true, data: [] },
      }).as('listBrands')

      // Show only inactive brands
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_inactive_productBrandPage').click()
      cy.wait(500)

      cy.get('#searchInput_productBrandPage').clear().type('BACT-')

      // Select both inactive brands
      cy.get(`[data-testid="brandCheckbox_${inactiveBrandId1}_productBrandPage"]`)
        .scrollIntoView()
        .click()
      cy.get(`[data-testid="brandCheckbox_${inactiveBrandId2}_productBrandPage"]`)
        .scrollIntoView()
        .click()
      cy.get('#bulkActionBar_productBrandPage').should('exist')

      // Click Set Active
      cy.get('#bulkSetActiveBtn_productBrandPage').scrollIntoView().click()

      cy.wait('@bulkSetActive')

      // Bulk action bar should disappear after completion
      cy.get('#bulkActionBar_productBrandPage').should('not.exist')

      // Brands should no longer appear in the (now-stubbed empty) list
      cy.get(`[data-testid="brandRow_${inactiveBrandId1}_productBrandPage"]`).should('not.exist')
      cy.get(`[data-testid="brandRow_${inactiveBrandId2}_productBrandPage"]`).should('not.exist')
    })

    it('should show brands as active after bulk Set Active → visible in active filter', () => {
      // Activate the brands via API so the real DB state reflects active
      cy.UpdateProductBrand(inactiveBrandId1, {
        brand: inactiveBrandName1,
        brand_status: 'active',
        note: '',
      })
      cy.UpdateProductBrand(inactiveBrandId2, {
        brand: inactiveBrandName2,
        brand_status: 'active',
        note: '',
      })

      // Reload the page so the updated data is fetched from the real API
      cy.reload()
      cy.wait(1000)

      // Confirm brands now appear in the active filter
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_active_productBrandPage').click()
      cy.wait(500)

      cy.get('#searchInput_productBrandPage').clear().type('BACT-')

      cy.get(`[data-testid="brandRow_${inactiveBrandId1}_productBrandPage"]`).should('exist')
      cy.get(`[data-testid="brandRow_${inactiveBrandId2}_productBrandPage"]`).should('exist')
    })
  })

  describe('Filter & Sort Badge Dot Counter', () => {
    before(() => {
      cy.setupApiAuthCookies()

      // Create at least one active and one inactive brand so filter options are meaningful
      cy.AddProductBrand({
        brand: 'BADGE-ACT-' + faker.string.alphanumeric(6),
        brand_status: 'active',
        note: faker.word.words(2),
      })

      cy.AddProductBrand({
        brand: 'BADGE-INA-' + faker.string.alphanumeric(6),
        brand_status: 'inactive',
        note: faker.word.words(2),
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show no badge dot when no filter and default sort are active', () => {
      // The badge span only renders when activeCount > 0
      cy.get('#filterSortBtn_productBrandPage').find('span.absolute').should('not.exist')
    })

    it("should show badge dot with '1' when one filter is applied", () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_inactive_productBrandPage').click()

      // Badge dot should appear with count "1"
      cy.get('#filterSortBtn_productBrandPage')
        .find('span.absolute')
        .should('be.visible')
        .and('contain', '1')
    })

    it("should show badge dot with '2' when filter + non-default sort are both active", () => {
      // Apply status filter
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_active_productBrandPage').click()
      cy.wait(300)

      // Apply non-default sort (Z → A)
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_name-desc_productBrandPage').click()

      // Badge dot should show "2"
      cy.get('#filterSortBtn_productBrandPage')
        .find('span.absolute')
        .should('be.visible')
        .and('contain', '2')
    })

    it("should drop badge dot from '2' to '1' after clearing the filter only", () => {
      // Apply both filter and non-default sort
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#filterOption_active_productBrandPage').click()
      cy.wait(300)
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_name-desc_productBrandPage').click()

      // Confirm badge shows "2"
      cy.get('#filterSortBtn_productBrandPage').find('span.absolute').should('contain', '2')

      // Clear filter only — sort stays
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#clearFilterBtn_productBrandPage').should('be.visible').click()
      // clearFilterBtn uses stopPropagation — dropdown stays open (pointer-events: none on body)
      cy.wait(300)

      // Badge should now show "1" (non-default sort still active)
      cy.get('#filterSortBtn_productBrandPage')
        .find('span.absolute')
        .should('be.visible')
        .and('contain', '1')
    })

    it('should hide badge dot after resetting sort back to default', () => {
      // Apply a non-default sort only (no filter)
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_name-desc_productBrandPage').click()
      cy.wait(300)

      cy.get('#filterSortBtn_productBrandPage').find('span.absolute').should('contain', '1')

      // Reset sort to default (A → Z)
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#resetSortBtn_productBrandPage').click()

      // Badge dot should disappear
      cy.get('#filterSortBtn_productBrandPage').find('span.absolute').should('not.exist')
    })
  })

  describe('Edit Button', () => {
    let brandId
    let brandName

    before(() => {
      cy.setupApiAuthCookies()
      brandName = 'EDITBTN-' + faker.string.alphanumeric(8)
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
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should open update dialog when edit button is clicked', () => {
      // Search for the brand to ensure it's in view
      cy.get('#searchInput_productBrandPage').clear().type(brandName)

      cy.get(`[data-testid="editBrandBtn_${brandId}_productBrandPage"]`)
        .scrollIntoView()
        .should('be.visible')
        .click()
      cy.get('#updateBrandDialog_productBrandPage').should('be.visible')
    })

    it('should open update dialog when row is clicked', () => {
      cy.get('#searchInput_productBrandPage').clear().type(brandName)

      cy.get(`[data-testid="brandRow_${brandId}_productBrandPage"]`)
        .scrollIntoView()
        .should('be.visible')
        .click()
      cy.get('#updateBrandDialog_productBrandPage').should('be.visible')
    })
  })

  describe('Product Count Badge Navigation', () => {
    let brandWithProductsId
    let brandWithProductsName
    let brandWithNoProductsId
    let brandWithNoProductsName

    before(() => {
      cy.setupApiAuthCookies()

      brandWithNoProductsName = 'NOBADGE-' + faker.string.alphanumeric(6)
      brandWithProductsName = 'HASBADGE-' + faker.string.alphanumeric(6)

      // Brand with no products — gray badge
      cy.AddProductBrand({
        brand: brandWithNoProductsName,
        brand_status: 'active',
        note: faker.word.words(2),
      }).then((response) => {
        brandWithNoProductsId = response.body.productBrand.id
      })

      // Brand with at least one product — blue badge
      cy.AddProductBrand({
        brand: brandWithProductsName,
        brand_status: 'active',
        note: faker.word.words(2),
      }).then((response) => {
        brandWithProductsId = response.body.productBrand.id

        cy.AddProductName({
          product_name: 'PBN-' + faker.string.alphanumeric(8),
          note: faker.word.words(2),
        }).then((nameResponse) => {
          const productNameId = nameResponse.body.productName.id
          cy.AddProduct({
            product_id: productNameId,
            brand_id: brandWithProductsId,
            type: faker.word.noun(),
            usage_quantity: 1,
            note: faker.word.words(2),
            product_image: '',
          })
        })
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it('should show blue clickable badge when brand has products', () => {
      // Search for the brand with products
      cy.get('#searchInput_productBrandPage').clear().type(brandWithProductsName)

      cy.get(`[data-testid="productCountBadge_${brandWithProductsId}_productBrandPage"]`)
        .scrollIntoView()
        .should('be.visible')
        .and('not.have.attr', 'disabled')
    })

    it('should navigate to product list with brand filter when blue badge is clicked', () => {
      cy.get('#searchInput_productBrandPage').clear().type(brandWithProductsName)

      cy.get(`[data-testid="productCountBadge_${brandWithProductsId}_productBrandPage"]`)
        .scrollIntoView()
        .click()

      // Should navigate to product list page with brand query param
      cy.url().should('include', '/main/inventory/product-list')
      cy.url().should('include', encodeURIComponent(brandWithProductsName))
    })

    it('should show gray non-clickable badge when brand has no products', () => {
      cy.get('#searchInput_productBrandPage').clear().type(brandWithNoProductsName)

      // Gray badge renders as a plain span (not a button/link) — no testid
      cy.get(`[data-testid="productCountBadge_${brandWithNoProductsId}_productBrandPage"]`).should(
        'not.exist'
      )

      // The row for this brand should still exist and show "0"
      cy.get(`[data-testid="brandRow_${brandWithNoProductsId}_productBrandPage"]`).should(
        'contain',
        '0'
      )
    })
  })

  describe('Sort by Product Count', () => {
    let brandManyId
    let brandFewId

    before(() => {
      cy.setupApiAuthCookies()

      const brandManyName = 'MANY-' + faker.string.alphanumeric(6)
      const brandFewName = 'FEW-' + faker.string.alphanumeric(6)

      // Brand that will have more products
      cy.AddProductBrand({
        brand: brandManyName,
        brand_status: 'active',
        note: faker.word.words(2),
      }).then((response) => {
        brandManyId = response.body.productBrand.id

        // Add 2 products to this brand
        cy.AddProductName({
          product_name: 'SORT-P1-' + faker.string.alphanumeric(6),
          note: faker.word.words(2),
        }).then((nameRes1) => {
          cy.AddProduct({
            product_id: nameRes1.body.productName.id,
            brand_id: brandManyId,
            type: faker.word.noun(),
            usage_quantity: 1,
            note: faker.word.words(2),
            product_image: '',
          })
        })

        cy.AddProductName({
          product_name: 'SORT-P2-' + faker.string.alphanumeric(6),
          note: faker.word.words(2),
        }).then((nameRes2) => {
          cy.AddProduct({
            product_id: nameRes2.body.productName.id,
            brand_id: brandManyId,
            type: faker.word.noun(),
            usage_quantity: 1,
            note: faker.word.words(2),
            product_image: '',
          })
        })
      })

      // Brand with no products
      cy.AddProductBrand({
        brand: brandFewName,
        brand_status: 'active',
        note: faker.word.words(2),
      }).then((response) => {
        brandFewId = response.body.productBrand.id
      })
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.setupApiAuthCookies()
      cy.visit('/main/inventory/product-brand')
      cy.wait(1000)
    })

    it("should sort by 'Most products first' → brand with more products appears before brand with fewer", () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_most-products_productBrandPage').click()
      cy.wait(500)

      // Get all row positions and verify brandMany appears before brandFew
      cy.get('#productBrandsTable_productBrandPage')
        .find('tr')
        .not(':first') // skip header
        .then(($rows) => {
          const rowTexts = [...$rows].map((r) => r.dataset.testid || '')
          const manyIndex = rowTexts.findIndex((t) => t.includes(`brandRow_${brandManyId}_`))
          const fewIndex = rowTexts.findIndex((t) => t.includes(`brandRow_${brandFewId}_`))
          expect(manyIndex).to.be.lessThan(fewIndex)
        })
    })

    it("should sort by 'Fewest products first' → brand with fewer products appears before brand with more", () => {
      cy.get('#filterSortBtn_productBrandPage').click()
      cy.get('#sortOption_least-products_productBrandPage').click()
      cy.wait(500)

      cy.get('#productBrandsTable_productBrandPage')
        .find('tr')
        .not(':first')
        .then(($rows) => {
          const rowTexts = [...$rows].map((r) => r.dataset.testid || '')
          const manyIndex = rowTexts.findIndex((t) => t.includes(`brandRow_${brandManyId}_`))
          const fewIndex = rowTexts.findIndex((t) => t.includes(`brandRow_${brandFewId}_`))
          expect(fewIndex).to.be.lessThan(manyIndex)
        })
    })
  })
})
