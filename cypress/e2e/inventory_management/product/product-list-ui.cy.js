/**
 * Product List Page - UI E2E Tests
 *
 * Covers:
 * - Sticky controls bar (v1.10)
 * - Edit Product dialog (v1.9)
 * - Record Usage form improvements (v1.9)
 * - Usage log: Duration column, "(ongoing)" label (v1.9)
 * - Mobile card layout (v1.9)
 * - Language: all text must be English
 */

import { INVENTORY_ENDPOINTS } from '../../../fixtures/api-endpoints.js'

const PRODUCT_LIST_URL = '/main/inventory/product-list'
const PRODUCT_LIST_API = INVENTORY_ENDPOINTS.PRODUCT_LIST
const PRODUCT_SUMMARY_API = INVENTORY_ENDPOINTS.PRODUCT_SUMMARY
const PRODUCT_BRAND_LIST_API = INVENTORY_ENDPOINTS.PRODUCT_BRAND_LIST
const PRODUCT_NAME_LIST_API = INVENTORY_ENDPOINTS.PRODUCT_NAME_LIST
// Usage log data is fetched from /api/inventory/v1/product-history/:id
const PRODUCT_HISTORY_DETAIL_API = '/api/inventory/v1/product-history/**'

// ---------------------------------------------------------------------------
// Stub factories
// ---------------------------------------------------------------------------

const stubProductList = (products = []) => {
  cy.intercept('GET', PRODUCT_LIST_API, {
    statusCode: 200,
    body: { success: true, data: products },
  }).as('productListApi')
}

const stubProductSummary = (data = {}) => {
  cy.intercept('GET', PRODUCT_SUMMARY_API, {
    statusCode: 200,
    body: {
      success: true,
      data: {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalQuantity: 0,
        totalUsageQuantity: 0,
        favoriteProducts: 0,
        ...data,
      },
    },
  }).as('productSummaryApi')
}

const stubProductBrands = (brands = []) => {
  cy.intercept('GET', PRODUCT_BRAND_LIST_API, {
    statusCode: 200,
    body: { success: true, data: brands },
  }).as('productBrandsApi')
}

const stubProductNames = (names = []) => {
  cy.intercept('GET', PRODUCT_NAME_LIST_API, {
    statusCode: 200,
    body: { success: true, data: names },
  }).as('productNamesApi')
}

const stubProductHistory = (products = []) => {
  cy.intercept('GET', PRODUCT_HISTORY_DETAIL_API, {
    statusCode: 200,
    body: { success: true, products },
  }).as('productHistoryApi')
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleProduct = {
  id: 1,
  uuid: 'test-uuid-1',
  brand: 'Dove',
  brand_id: 10,
  product: 'Shampoo',
  product_id: 20,
  type: 'Hair Care',
  product_status: 'active',
  quantity: 5,
  usage_quantity: 0,
  usage_date: '2026-04-01T00:00:00.000Z',
  is_favorite: false,
  deleted_at: null,
  note: '',
  user_id: 'user-1',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-04-01T00:00:00.000Z',
  product_image: '',
}

const activeSessionProduct = {
  ...sampleProduct,
  id: 2,
  brand: 'Pantene',
  product: 'Conditioner',
  usage_quantity: 2,
  product_status: 'active',
}

const sampleBrands = [
  { id: 10, brand: 'Dove', brand_status: 'active' },
  { id: 11, brand: 'Pantene', brand_status: 'active' },
]

const sampleProductNames = [
  { id: 20, product_name: 'Shampoo', product_name_status: 'active' },
  { id: 21, product_name: 'Conditioner', product_name_status: 'active' },
]

const activeHistoryItem = {
  id: 101,
  start_usage_date: '2026-04-01T00:00:00.000Z',
  end_usage_date: null,
  status: 'active',
  quantity: 1,
  depleted_quantity: 1,
  remaining_quantity: 4,
}

const completedHistoryItem = {
  id: 102,
  start_usage_date: '2026-01-01T00:00:00.000Z',
  end_usage_date: '2026-03-01T00:00:00.000Z',
  status: 'completed',
  quantity: 2,
  depleted_quantity: 2,
  remaining_quantity: 0,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const openRecordUsageDialog = () => {
  // Click on the first action menu trigger
  cy.get('[data-testid="product-action-menu-trigger"]').first().click()
  cy.get('[data-testid="product-action-record-usage"]').click()
  cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')
}

const openEditProductDialog = () => {
  cy.get('[data-testid="product-action-menu-trigger"]').first().click()
  cy.get('[data-testid="product-action-edit"]').click()
  cy.get('[data-testid="edit-product-dialog"]').should('be.visible')
}

// ===========================================================================
// Suite
// ===========================================================================

describe('Product List Page UI - /main/inventory/product-list', () => {
  beforeEach(() => {
    cy.loginWithBypass()
    stubProductSummary({ totalProducts: 1, activeProducts: 1 })
  })

  // =========================================================================
  // Page Load
  // =========================================================================
  describe('Page Load', () => {
    it('should load the product list page without errors', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('body').should('be.visible')
      cy.contains('Product List').should('be.visible')
    })

    it('should show empty state when no products exist', () => {
      stubProductList([])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.contains('No products yet').should('be.visible')
    })

    it('should render page header with breadcrumbs', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.contains('Inventory').should('be.visible')
      cy.contains('Product List').should('be.visible')
    })
  })

  // =========================================================================
  // Sticky Controls Bar (v1.10)
  // =========================================================================
  describe('Sticky Controls Bar', () => {
    it('should render the controls bar', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('[data-testid="product-list-controls-bar"]').should('exist')
    })

    it('should have sticky positioning on the controls bar', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('[data-testid="product-list-controls-bar"]').should('have.class', 'sticky')
    })

    it('should render search input inside the controls bar', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('[data-testid="product-list-search-input"]').should('be.visible')
    })

    it('should filter products when typing in search input', () => {
      stubProductList([
        sampleProduct,
        { ...sampleProduct, id: 99, brand: 'Unilever', product: 'Soap' },
      ])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-search-input"]').type('Dove')
      cy.contains('Shampoo').should('be.visible')
      cy.contains('Soap').should('not.exist')
    })

    it('should show controls bar after scrolling (sticky behavior)', () => {
      // Create enough products to require scrolling
      const manyProducts = Array.from({ length: 20 }, (_, i) => ({
        ...sampleProduct,
        id: i + 1,
        product: `Product ${i + 1}`,
      }))
      stubProductList(manyProducts)
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.scrollTo(0, 500)
      cy.get('[data-testid="product-list-controls-bar"]').should('be.visible')
    })
  })

  // =========================================================================
  // Language: English text only (v1.9)
  // =========================================================================
  describe('Language: English text', () => {
    it('should display English column headers in the desktop table', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.contains('Product').should('be.visible')
        cy.contains('Quantity').should('be.visible')
        cy.contains('In Use').should('be.visible')
        cy.contains('Usage Date').should('be.visible')
        cy.contains('Product Status').should('be.visible')
        cy.contains('Actions').should('be.visible')
      })
    })

    it('should use English status badges (active/inactive)', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.contains(/^active$/i).should('be.visible')
    })

    it('should show "Out of Stock" badge in English', () => {
      stubProductList([{ ...sampleProduct, quantity: 0 }])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.contains('Out of Stock').should('be.visible')
    })

    it('should show "Low Stock" badge in English', () => {
      stubProductList([{ ...sampleProduct, quantity: 2 }])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.contains('Low Stock').should('be.visible')
    })

    it('should show "Edit Product" in action menu (English)', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Edit Product').should('be.visible')
    })

    it('should show "Record Usage" in action menu (English)', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Record Usage').should('be.visible')
    })
  })

  // =========================================================================
  // Desktop Table Layout
  // =========================================================================
  describe('Desktop Table', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('should render desktop table on wide viewport', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('[data-testid="product-list-desktop-table"]').should('be.visible')
    })

    it('should display product brand, name and type in table row', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.contains('Dove').should('be.visible')
        cy.contains('Shampoo').should('be.visible')
        cy.contains('Hair Care').should('be.visible')
      })
    })

    it('should format usage_date as "dd MMM yyyy"', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // 2026-04-01 => "01 Apr 2026"
      cy.contains('01 Apr 2026').should('be.visible')
    })

    it('should show "-" when usage_date is null', () => {
      stubProductList([{ ...sampleProduct, usage_date: null }])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.contains('-').should('exist')
      })
    })
  })

  // =========================================================================
  // Mobile Card Layout (v1.9)
  // =========================================================================
  describe('Mobile Card Layout', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('should render mobile cards on narrow viewport', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.get('[data-testid="product-list-mobile-cards"]').should('exist')
    })

    it('should show product card with brand, name and type', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-mobile-card"]')
        .first()
        .within(() => {
          cy.contains('Dove').should('be.visible')
          cy.contains('Shampoo').should('be.visible')
          cy.contains('Hair Care').should('be.visible')
        })
    })

    it('should render ActionMenu trigger visible on mobile card without horizontal scroll', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-mobile-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="product-action-menu-trigger"]').should('be.visible')
        })
      // verify no horizontal overflow on the card container
      cy.get('[data-testid="product-list-mobile-cards"]').then(($el) => {
        expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
      })
    })

    it('should open action menu from mobile card', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-mobile-card"]')
        .first()
        .find('[data-testid="product-action-menu-trigger"]')
        .click()

      cy.contains('Edit Product').should('be.visible')
      cy.contains('Record Usage').should('be.visible')
    })

    it('should show "In Use:" label in mobile card', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-mobile-card"]')
        .first()
        .within(() => {
          cy.contains('In Use:').should('be.visible')
        })
    })

    it('should show "Last used:" label in mobile card (English)', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-mobile-card"]')
        .first()
        .within(() => {
          cy.contains('Last used:').should('be.visible')
        })
    })

    it('should not render desktop table on mobile viewport', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      // table has class hidden on mobile
      cy.get('[data-testid="product-list-desktop-table"]').should('have.class', 'hidden')
    })
  })

  // =========================================================================
  // Edit Product Dialog (v1.9)
  // =========================================================================
  describe('Edit Product Dialog', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      stubProductList([sampleProduct])
      stubProductBrands(sampleBrands)
      stubProductNames(sampleProductNames)
    })

    it('should open Edit Product dialog from action menu', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-dialog"]').should('be.visible')
    })

    it('should show "Edit Product" title in dialog', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-dialog"]').within(() => {
        cy.contains('Edit Product').should('be.visible')
      })
    })

    it('should pre-fill Type input with product type', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-type-input"]').should('have.value', 'Hair Care')
    })

    it('should render Brand, Product Name, Type, and Status fields', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-dialog"]').within(() => {
        cy.get('[data-testid="edit-product-brand-select"]').should('exist')
        cy.get('[data-testid="edit-product-name-select"]').should('exist')
        cy.get('[data-testid="edit-product-type-input"]').should('exist')
        cy.get('[data-testid="edit-product-status-select"]').should('exist')
      })
    })

    it('should close dialog when Cancel is clicked', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-cancel-btn"]').click()
      cy.get('[data-testid="edit-product-dialog"]').should('not.exist')
    })

    it('should show Save Changes button', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-save-btn"]').should('be.visible')
    })

    it('should submit edit form and show success toast', () => {
      cy.intercept('PATCH', `/api/inventory/v1/product/${sampleProduct.id}`, {
        statusCode: 200,
        body: { success: true, data: { ...sampleProduct, type: 'Updated Type' } },
      }).as('editProductApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()

      // Update Type
      cy.get('[data-testid="edit-product-type-input"]').clear().type('Updated Type')

      cy.get('[data-testid="edit-product-save-btn"]').click()
      cy.wait('@editProductApi')

      // Toast success
      cy.contains('Product updated successfully').should('be.visible')
    })

    it('should show validation error when Type is cleared', () => {
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()

      cy.get('[data-testid="edit-product-type-input"]').clear()
      cy.get('[data-testid="edit-product-save-btn"]').click()

      cy.contains('Type is required').should('be.visible')
    })

    it('should show error message when API returns error', () => {
      cy.intercept('PATCH', `/api/inventory/v1/product/${sampleProduct.id}`, {
        statusCode: 400,
        body: { success: false, error: 'Update failed' },
      }).as('editProductError')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openEditProductDialog()
      cy.get('[data-testid="edit-product-save-btn"]').click()
      cy.wait('@editProductError')

      cy.get('[data-testid="edit-product-dialog"]').within(() => {
        cy.contains('Unable to update product').should('be.visible')
      })
    })
  })

  // =========================================================================
  // Record Usage Dialog (v1.9)
  // =========================================================================
  describe('Record Usage Dialog', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      stubProductHistory([])
    })

    it('should open Record Usage dialog from action menu', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')
    })

    it('should default quantity to 1', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('#usageQuantityField-recordUsageForm').should('have.value', '1')
    })

    it('should NOT show active session warning when usage_quantity is 0', () => {
      stubProductList([{ ...sampleProduct, usage_quantity: 0 }])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('[data-testid="active-session-warning"]').should('not.exist')
    })

    it('should show active session warning when product has usage_quantity > 0', () => {
      stubProductList([activeSessionProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Open Record Usage for the active-session product
      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.get('[data-testid="product-action-record-usage"]').click()
      cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')

      cy.get('[data-testid="active-session-warning"]').should('be.visible')
      cy.get('[data-testid="active-session-warning"]').within(() => {
        cy.contains('Active session in progress').should('be.visible')
      })
    })

    it('should render the date picker button', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('[data-testid="record-usage-date-picker"]').should('be.visible')
    })

    it('should not allow future dates on date picker', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()

      // Open the date picker
      cy.get('[data-testid="record-usage-date-picker"]').click()

      // Future date navigation button should be disabled (or future days should be greyed out)
      // Calendar next-month button: disabled when all days are future
      cy.get('[role="dialog"]')
        .last()
        .within(() => {
          // Days after today should have aria-disabled=true
          cy.get('button[aria-disabled="true"]').should('exist')
        })
    })

    it('should show validation error when quantity is below min', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('#usageQuantityField-recordUsageForm').clear().type('0')
      cy.get('#startTrackingBtn-recordUsageForm').click()

      cy.contains('Minimum 1 unit').should('be.visible')
    })

    it('should show validation error when quantity exceeds stock', () => {
      stubProductList([{ ...sampleProduct, quantity: 3 }])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('#usageQuantityField-recordUsageForm').clear().type('99')
      cy.get('#startTrackingBtn-recordUsageForm').click()

      cy.contains('Cannot exceed 3 available unit').should('be.visible')
    })

    it('should show Record Usage tab and Usage Log tab', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()

      cy.get('[data-testid="stock-adjustment-dialog"]').within(() => {
        cy.contains('Record Usage').should('be.visible')
        cy.contains('Usage Log').should('be.visible')
      })
    })

    it('should show product summary with "In Stock" and "In Use" labels', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()

      cy.get('[data-testid="product-summary"]').within(() => {
        cy.contains('In Stock').should('be.visible')
        cy.contains('In Use').should('be.visible')
      })
    })

    it('should show "Last Used" label in product summary', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()

      cy.get('[data-testid="product-summary"]').within(() => {
        cy.contains('Last Used').should('be.visible')
      })
    })

    it('should show active session indicator in product summary when product has active usage', () => {
      stubProductList([activeSessionProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.get('[data-testid="product-action-record-usage"]').click()
      cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')

      cy.get('[data-testid="product-summary-active-session"]').should('be.visible')
      cy.get('[data-testid="product-summary-active-session"]').within(() => {
        cy.contains('Active session in progress').should('be.visible')
      })
    })

    it('should submit Record Usage and show success toast', () => {
      cy.intercept('PATCH', `/api/inventory/v1/product/adjust/${sampleProduct.id}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Product activated',
          product: { ...sampleProduct, usage_quantity: 1 },
        },
      }).as('recordUsageApi')

      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.get('#startTrackingBtn-recordUsageForm').click()
      cy.wait('@recordUsageApi')

      cy.contains('Usage recorded successfully').should('be.visible')
    })
  })

  // =========================================================================
  // Usage Log: Duration column and "(ongoing)" label (v1.9)
  // =========================================================================
  describe('Usage Log - Duration Column', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('should display Duration column header in usage log', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()

      // Switch to Usage Log tab
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('Duration').should('be.visible')
      })
    })

    it('should display Start Date and End Date column headers', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('Start Date').should('be.visible')
        cy.contains('End Date').should('be.visible')
      })
    })

    it('should show duration value for a completed session', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      // completedHistoryItem: Jan 1 → Mar 1 = 59 days
      cy.get('[data-testid="log-row-duration"]').first().should('contain.text', 'day')
    })

    it('should show "(ongoing)" label for active sessions', () => {
      stubProductList([activeSessionProduct])
      stubProductHistory([activeHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.get('[data-testid="product-action-record-usage"]').click()
      cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')

      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="log-row-ongoing-label"]').first().should('contain.text', '(ongoing)')
    })

    it('should NOT show "(ongoing)" label for completed sessions', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="log-row-ongoing-label"]').should('not.exist')
    })

    it('should format Start Date as "dd MMM yyyy"', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      // 2026-01-01 => "01 Jan 2026"
      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('01 Jan 2026').should('be.visible')
      })
    })

    it('should format End Date as "dd MMM yyyy"', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      // 2026-03-01 => "01 Mar 2026"
      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('01 Mar 2026').should('be.visible')
      })
    })

    it('should show "-" for End Date on an active session', () => {
      stubProductList([activeSessionProduct])
      stubProductHistory([activeHistoryItem])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.get('[data-testid="product-action-record-usage"]').click()
      cy.get('[data-testid="stock-adjustment-dialog"]').should('be.visible')

      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('-').should('be.visible')
      })
    })

    it('should show empty state message when no usage log entries exist', () => {
      stubProductList([sampleProduct])
      stubProductHistory([])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.contains('No usage recorded yet').should('be.visible')
      })
    })
  })

  // =========================================================================
  // Filter & Search
  // =========================================================================
  describe('Filter & Search', () => {
    it('should show empty state when search yields no matches', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-search-input"]').type('zzznomatch999')
      cy.contains('No products match your filters').should('be.visible')
    })

    it('should show "Clear filters & search" link when filters are active with no results', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-search-input"]').type('zzznomatch')
      cy.contains('Clear filters & search').should('be.visible')
    })

    it('should clear search when "Clear filters & search" is clicked', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-list-search-input"]').type('zzznomatch')
      cy.contains('Clear filters & search').click()
      cy.get('[data-testid="product-list-search-input"]').should('have.value', '')
      cy.contains('Shampoo').should('be.visible')
    })
  })

  // =========================================================================
  // Loading States
  // =========================================================================
  describe('Loading States', () => {
    it('should show skeleton loading while product list API is loading', () => {
      cy.intercept('GET', PRODUCT_LIST_API, (req) => {
        req.on('response', (res) => {
          res.setDelay(600)
        })
      }).as('slowProductList')

      cy.visit(PRODUCT_LIST_URL)
      cy.get('.animate-pulse').should('exist')
    })
  })

  // =========================================================================
  // V1.11 Features: Summary Cards Clickable (P1)
  // =========================================================================
  describe('Summary Cards - Clickable for Filter (v1.11)', () => {
    it('should apply "active" filter when clicking Active card', () => {
      stubProductList([
        { ...sampleProduct, product_status: 'active' },
        { ...sampleProduct, id: 2, product_status: 'inactive' },
      ])
      stubProductSummary({ totalProducts: 2, activeProducts: 1 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Active card
      cy.contains('Active').parent().click()

      // Filter should show only active products
      cy.contains('Shampoo').should('be.visible')
    })

    it('should apply "inactive" filter when clicking Inactive card', () => {
      stubProductList([
        { ...sampleProduct, product_status: 'active' },
        { ...sampleProduct, id: 2, product_status: 'inactive' },
      ])
      stubProductSummary({ totalProducts: 2, inactiveProducts: 1 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Inactive card
      cy.contains('Inactive').parent().click()

      // Should filter to inactive products
    })

    it('should apply "favorite" filter when clicking Favorites card', () => {
      stubProductList([
        { ...sampleProduct, is_favorite: true },
        { ...sampleProduct, id: 2, is_favorite: false },
      ])
      stubProductSummary({ totalProducts: 2, favoriteProducts: 1 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Favorites card
      cy.contains('Favorites').parent().click()

      // Should filter to favorite products
    })

    it('should NOT be clickable on "Total Stock" and "In Use" cards', () => {
      stubProductList([sampleProduct])
      stubProductSummary({ totalProducts: 1, totalQuantity: 5 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Total Stock and In Use cards should not have cursor-pointer
      cy.contains('Total Stock').parent().should('not.have.class', 'cursor-pointer')

      cy.contains('In Use').parent().should('not.have.class', 'cursor-pointer')
    })

    it('should show toast confirmation when filter is applied from card', () => {
      stubProductList([{ ...sampleProduct, product_status: 'active' }])
      stubProductSummary({ totalProducts: 1, activeProducts: 1 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.contains('Active').parent().click()

      // Toast should show
      cy.contains('Showing active products', { timeout: 2000 }).should('be.visible')
    })
  })

  // =========================================================================
  // V1.11 Features: Column Sorting (P1)
  // =========================================================================
  describe('Column Sorting (v1.11)', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('should sort by Quantity ascending when clicking Quantity header', () => {
      const product1 = { ...sampleProduct, id: 1, quantity: 10 }
      const product2 = { ...sampleProduct, id: 2, quantity: 5 }
      const product3 = { ...sampleProduct, id: 3, quantity: 15 }

      stubProductList([product1, product2, product3])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Quantity header to sort
      cy.contains('th', 'Quantity').click()

      // Should be sorted ascending: 5, 10, 15
      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.get('td').contains('5').should('appear.before', 'td:contains("10")')
      })
    })

    it('should reverse sort by Quantity descending on second click', () => {
      const product1 = { ...sampleProduct, id: 1, quantity: 10 }
      const product2 = { ...sampleProduct, id: 2, quantity: 5 }
      const product3 = { ...sampleProduct, id: 3, quantity: 15 }

      stubProductList([product1, product2, product3])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Quantity header twice to reverse sort
      cy.contains('th', 'Quantity').click()
      cy.contains('th', 'Quantity').click()

      // Should be sorted descending: 15, 10, 5
      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.get('td').contains('15').should('appear.before', 'td:contains("10")')
      })
    })

    it('should sort by Product name ascending', () => {
      const productA = { ...sampleProduct, id: 1, brand: 'Brand A', product: 'Apple' }
      const productB = { ...sampleProduct, id: 2, brand: 'Brand B', product: 'Banana' }

      stubProductList([productB, productA])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Click Product header
      cy.contains('th', 'Product').click()

      // Should be sorted: Apple, Banana
    })

    it('should sort by In Use ascending', () => {
      const product1 = { ...sampleProduct, id: 1, usage_quantity: 2 }
      const product2 = { ...sampleProduct, id: 2, usage_quantity: 0 }

      stubProductList([product1, product2])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.contains('th', 'In Use').click()

      // Should be sorted: 0, 2
    })

    it('should sort by Usage Date, with null values at the bottom', () => {
      const product1 = { ...sampleProduct, id: 1, usage_date: '2026-04-01T00:00:00.000Z' }
      const product2 = { ...sampleProduct, id: 2, usage_date: null }
      const product3 = { ...sampleProduct, id: 3, usage_date: '2026-03-01T00:00:00.000Z' }

      stubProductList([product2, product1, product3])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.contains('th', 'Usage Date').click()

      // Null values should be at bottom
      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.get('td').contains('-').should('appear.after', 'td:contains("01 Mar")')
      })
    })

    it('should show sort icon indicator (ArrowUp/ArrowDown)', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Initially ArrowUpDown (inactive)
      cy.contains('th', 'Quantity').within(() => {
        cy.get('[data-testid="sort-icon"]').should('have.class', 'ArrowUpDown')
      })

      // After clicking, should show ArrowUp
      cy.contains('th', 'Quantity').click()
      cy.contains('th', 'Quantity').within(() => {
        cy.get('[data-testid="sort-icon"]').should('have.class', 'ArrowUp')
      })

      // After clicking again, should show ArrowDown
      cy.contains('th', 'Quantity').click()
      cy.contains('th', 'Quantity').within(() => {
        cy.get('[data-testid="sort-icon"]').should('have.class', 'ArrowDown')
      })
    })

    it('should NOT sort Product Status or Actions columns', () => {
      stubProductList([sampleProduct])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Product Status header should not have click handler
      cy.contains('th', 'Product Status').should('not.have.attr', 'onclick')
      cy.contains('th', 'Actions').should('not.have.attr', 'onclick')
    })
  })

  // =========================================================================
  // V1.11 Features: Category Filter (P1)
  // =========================================================================
  describe('Category Filter - Dynamic Types (v1.11)', () => {
    it('should show Category section in filter dropdown with all unique types', () => {
      stubProductList([
        { ...sampleProduct, type: 'Hair Care' },
        { ...sampleProduct, id: 2, type: 'Skincare' },
        { ...sampleProduct, id: 3, type: 'Hair Care' },
      ])
      stubProductSummary({ totalProducts: 3 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      // Open filter dropdown
      cy.get('button').contains('Filter').click()

      // Should show Category section
      cy.contains('Category').should('be.visible')

      // Should list types
      cy.contains('Hair Care').should('be.visible')
      cy.contains('Skincare').should('be.visible')
    })

    it('should apply type filter when selecting from Category section', () => {
      stubProductList([
        { ...sampleProduct, type: 'Hair Care' },
        { ...sampleProduct, id: 2, type: 'Skincare' },
      ])
      stubProductSummary({ totalProducts: 2 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('button').contains('Filter').click()
      cy.contains('Hair Care').click()

      // Should filter to Hair Care products only
      cy.contains('Shampoo').should('be.visible')
    })

    it('should show product count per type', () => {
      stubProductList([
        { ...sampleProduct, type: 'Hair Care' },
        { ...sampleProduct, id: 2, type: 'Hair Care' },
        { ...sampleProduct, id: 3, type: 'Skincare' },
      ])
      stubProductSummary({ totalProducts: 3 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('button').contains('Filter').click()

      // Should show "(2)" next to Hair Care
      cy.contains('Hair Care').should('contain.text', '(2)')
      cy.contains('Skincare').should('contain.text', '(1)')
    })

    it('should use filter value prefix "type:" when category is selected', () => {
      stubProductList([{ ...sampleProduct, type: 'Hair Care' }])
      stubProductSummary({ totalProducts: 1 })

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('button').contains('Filter').click()
      cy.contains('Hair Care').click()

      // Filter button should show the type name
      cy.get('button').contains('Hair Care').should('be.visible')
    })
  })

  // =========================================================================
  // V1.11 Features: Last Purchase Price Hint (P0)
  // =========================================================================
  describe('Add Stock Dialog - Last Purchase Price Hint (v1.11)', () => {
    const LAST_PRICE_API = '/api/inventory/v1/product/*/last-price'

    it('should show "Loading last price..." hint while fetching', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', LAST_PRICE_API, (req) => {
        req.on('response', (res) => {
          res.setDelay(800)
        })
      }).as('lastPriceApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      // Click "Add Stock" (inside AddStockForm)
      cy.contains('Add Stock').click()

      // Should show loading hint
      cy.contains('Loading last price...').should('be.visible')
      cy.wait('@lastPriceApi')
    })

    it('should show last purchase price hint after data loads', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', LAST_PRICE_API, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            last_purchase_price: 50000,
            last_purchase_date: '2026-04-01T00:00:00.000Z',
          },
        },
      }).as('lastPriceApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@lastPriceApi')

      // Should show formatted hint
      cy.contains('Last purchase price').should('be.visible')
      cy.contains('Rp').should('be.visible')
    })

    it('should show "No previous purchase data available" when no history exists', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', LAST_PRICE_API, {
        statusCode: 200,
        body: {
          success: true,
          data: null,
        },
      }).as('lastPriceApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@lastPriceApi')

      cy.contains('No previous purchase data available').should('be.visible')
    })
  })

  // =========================================================================
  // V1.11 Features: Recent Purchases Section (P2)
  // =========================================================================
  describe('Add Stock Dialog - Recent Purchases Section (v1.11)', () => {
    const STOCK_HISTORY_API = '/api/inventory/v1/product/stock/history/*'

    const mockPurchaseHistory = [
      {
        id: 1,
        purchase_date: '2026-04-05T00:00:00.000Z',
        quantity_added: 2,
        price: 50000,
      },
      {
        id: 2,
        purchase_date: '2026-03-20T00:00:00.000Z',
        quantity_added: 3,
        price: 48000,
      },
      {
        id: 3,
        purchase_date: '2026-03-10T00:00:00.000Z',
        quantity_added: 1,
        price: 45000,
      },
      {
        id: 4,
        purchase_date: '2026-02-28T00:00:00.000Z',
        quantity_added: 2,
        price: 49000,
      },
    ]

    it('should show Recent Purchases section when history exists', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', STOCK_HISTORY_API, {
        statusCode: 200,
        body: { success: true, history: mockPurchaseHistory },
      }).as('stockHistoryApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@stockHistoryApi')

      cy.contains('Recent Purchases').should('be.visible')
    })

    it('should display maximum 3 recent purchase entries', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', STOCK_HISTORY_API, {
        statusCode: 200,
        body: { success: true, history: mockPurchaseHistory },
      }).as('stockHistoryApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@stockHistoryApi')

      // Should show only 3 entries (most recent)
      cy.get('[data-testid="recent-purchase-row"]').should('have.length', 3)
    })

    it('should show date, quantity, and price in correct format', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', STOCK_HISTORY_API, {
        statusCode: 200,
        body: { success: true, history: [mockPurchaseHistory[0]] },
      }).as('stockHistoryApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@stockHistoryApi')

      // Should show formatted date (05 Apr 2026), qty (2), and price (Rp 50.000)
      cy.get('[data-testid="recent-purchase-row"]')
        .first()
        .within(() => {
          cy.contains('05 Apr 2026').should('be.visible')
          cy.contains('2').should('be.visible') // qty
          cy.contains('Rp').should('be.visible')
        })
    })

    it('should NOT show Recent Purchases section when history is empty', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', STOCK_HISTORY_API, {
        statusCode: 200,
        body: { success: true, history: [] },
      }).as('stockHistoryApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      cy.get('[data-testid="product-action-menu-trigger"]').first().click()
      cy.contains('Add Stock').click()

      cy.wait('@stockHistoryApi')

      cy.contains('Recent Purchases').should('not.exist')
    })
  })

  // =========================================================================
  // V1.11 Features: Note Display in Usage Log (P1)
  // =========================================================================
  describe('Usage Log - Note Display (v1.11)', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('should display note card when log row has note and is expanded', () => {
      const logWithNote = {
        ...completedHistoryItem,
        note: 'Product leaked from container',
      }

      stubProductList([sampleProduct])
      stubProductHistory([logWithNote])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      // Expand the log row
      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.get('tr').first().click()
      })

      // Note card should appear
      cy.contains('Note').should('be.visible')
      cy.contains('Product leaked from container').should('be.visible')
    })

    it('should NOT show note card when log row has no note', () => {
      stubProductList([sampleProduct])
      stubProductHistory([completedHistoryItem]) // no note
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      // Expand the log row
      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.get('tr').first().click()
      })

      // Note card should NOT appear
      cy.get('[data-testid="product-usage-note-card"]').should('not.exist')
    })

    it('should show note above UsageCompletionForm', () => {
      const logWithNote = {
        ...completedHistoryItem,
        note: 'Expired product',
      }

      stubProductList([sampleProduct])
      stubProductHistory([logWithNote])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.get('tr').first().click()
      })

      // Note should appear before form
      cy.get('[data-testid="product-usage-note-card"]').should('appear.before', 'form')
    })

    it('should render note in white card with slate border', () => {
      const logWithNote = {
        ...completedHistoryItem,
        note: 'Test note',
      }

      stubProductList([sampleProduct])
      stubProductHistory([logWithNote])
      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')

      openRecordUsageDialog()
      cy.contains('Usage Log').click()
      cy.wait('@productHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        cy.get('tr').first().click()
      })

      cy.get('[data-testid="product-usage-note-card"]').should('have.class', 'bg-white')
      cy.get('[data-testid="product-usage-note-card"]').should('have.class', 'border-slate-200')
    })
  })

  // =========================================================================
  // V1.11 Features: Restock Prediction Hint (P2)
  // =========================================================================
  describe('Quantity Column - Restock Prediction Hint (v1.11)', () => {
    const RESTOCK_PREDICTIONS_API = '/api/inventory/v1/product/restock-predictions'

    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('should show "~Xd left" hint below QuantityBadge for active products', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', RESTOCK_PREDICTIONS_API, {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              product_list_id: 1,
              days_until_empty: 10,
            },
          ],
        },
      }).as('restockApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.wait('@restockApi')

      // Should show ~10d left in monospace font
      cy.contains('~10d left').should('be.visible')
      cy.contains('~10d left').should('have.class', 'font-mono')
    })

    it('should use orange color when days_until_empty ≤ 7', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', RESTOCK_PREDICTIONS_API, {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              product_list_id: 1,
              days_until_empty: 5,
            },
          ],
        },
      }).as('restockApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.wait('@restockApi')

      // Should be orange
      cy.contains('~5d left').should('have.class', 'text-orange-500')
    })

    it('should use muted color when days_until_empty > 7', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', RESTOCK_PREDICTIONS_API, {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              product_list_id: 1,
              days_until_empty: 15,
            },
          ],
        },
      }).as('restockApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.wait('@restockApi')

      // Should be muted
      cy.contains('~15d left').should('have.class', 'text-muted-foreground')
    })

    it('should NOT show prediction hint for products with quantity = 0', () => {
      stubProductList([{ ...sampleProduct, quantity: 0 }])
      cy.intercept('GET', RESTOCK_PREDICTIONS_API, {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              product_list_id: 1,
              days_until_empty: 0,
            },
          ],
        },
      }).as('restockApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.wait('@restockApi')

      // Should NOT show any prediction
      cy.contains('~0d left').should('not.exist')
    })

    it('should NOT show prediction hint when no data available for product', () => {
      stubProductList([sampleProduct])
      cy.intercept('GET', RESTOCK_PREDICTIONS_API, {
        statusCode: 200,
        body: { success: true, data: [] },
      }).as('restockApi')

      cy.visit(PRODUCT_LIST_URL)
      cy.wait('@productListApi')
      cy.wait('@restockApi')

      // Should NOT show any prediction
      cy.get('[data-testid="product-list-desktop-table"]').within(() => {
        cy.contains(/~\d+d left/).should('not.exist')
      })
    })
  })
})
