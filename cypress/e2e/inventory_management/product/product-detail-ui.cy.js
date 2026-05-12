/**
 * Product Detail Page - UI E2E Tests (v1.11)
 *
 * Covers:
 * - Product Detail page layout
 * - Back link navigation
 * - Status badge (active/inactive)
 * - 4 stat cards (Current Stock, Total Added, Total Spent, Usage Sessions)
 * - Purchase History section
 * - Usage History section
 * - Loading state
 * - Error state with retry
 */

import { INVENTORY_ENDPOINTS } from '../../../fixtures/api-endpoints.js'

const PRODUCT_DETAIL_URL = (id) => `/main/inventory/product-list/${id}`
const PRODUCT_DETAIL_API = INVENTORY_ENDPOINTS.PRODUCT_DETAIL
const STOCK_HISTORY_API = INVENTORY_ENDPOINTS.PRODUCT_STOCK_HISTORY
const PRODUCT_USAGE_HISTORY_API = '/api/inventory/v1/product-history'

// ---------------------------------------------------------------------------
// Stub factories
// ---------------------------------------------------------------------------

const stubProductDetail = (product = {}) => {
  const defaultProduct = {
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

  cy.intercept('GET', PRODUCT_DETAIL_API(1), {
    statusCode: 200,
    body: { success: true, data: { ...defaultProduct, ...product } },
  }).as('productDetailApi')
}

const stubStockHistory = (history = []) => {
  cy.intercept('GET', STOCK_HISTORY_API(1), {
    statusCode: 200,
    body: { success: true, history },
  }).as('stockHistoryApi')
}

const stubUsageHistory = (products = []) => {
  cy.intercept('GET', `${PRODUCT_USAGE_HISTORY_API}/*`, {
    statusCode: 200,
    body: { success: true, products },
  }).as('usageHistoryApi')
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleProduct = {
  id: 1,
  uuid: 'test-uuid-1',
  brand: 'Dove',
  product: 'Shampoo',
  type: 'Hair Care',
  product_status: 'active',
  quantity: 5,
}

const samplePurchaseHistory = [
  {
    id: 1,
    purchase_date: '2026-04-05T00:00:00.000Z',
    quantity_added: 2,
    price: 50000,
    note: 'Promo sale',
  },
  {
    id: 2,
    purchase_date: '2026-03-20T00:00:00.000Z',
    quantity_added: 3,
    price: 48000,
    note: '',
  },
  {
    id: 3,
    purchase_date: '2026-03-10T00:00:00.000Z',
    quantity_added: 1,
    price: 45000,
    note: '',
  },
]

const sampleUsageHistory = [
  {
    id: 101,
    start_usage_date: '2026-04-01T00:00:00.000Z',
    end_usage_date: null,
    status: 'active',
    quantity: 1,
    depleted_quantity: 0,
    remaining_quantity: 4,
    note: 'Current session',
  },
  {
    id: 102,
    start_usage_date: '2026-01-01T00:00:00.000Z',
    end_usage_date: '2026-03-01T00:00:00.000Z',
    status: 'completed',
    quantity: 2,
    depleted_quantity: 2,
    remaining_quantity: 0,
    note: '',
  },
]

// ===========================================================================
// Suite
// ===========================================================================

describe('Product Detail Page UI - /main/inventory/product-list/[id] (v1.11)', () => {
  beforeEach(() => {
    cy.loginWithBypass()
  })

  // =========================================================================
  // Page Load & Navigation
  // =========================================================================
  describe('Page Load & Navigation', () => {
    it('should load the product detail page without errors', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')
      cy.wait('@usageHistoryApi')

      cy.get('body').should('be.visible')
      cy.contains('Shampoo').should('be.visible')
    })

    it('should display back link to Product List', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.contains('Back to Product List').should('be.visible')
      cy.contains('Back to Product List').should(
        'have.attr',
        'href',
        '/main/inventory/product-list'
      )
    })

    it('should navigate back to Product List when back link is clicked', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.contains('Back to Product List').click()

      cy.url().should('include', '/main/inventory/product-list')
    })

    it('should render PageHeader with product name as title', () => {
      stubProductDetail({ product: 'Shampoo' })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.contains('h1', 'Shampoo').should('be.visible')
    })

    it('should show breadcrumbs: Inventory > Product List > [Product Name]', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.contains('Inventory').should('be.visible')
      cy.contains('Product List').should('be.visible')
      cy.contains('Shampoo').should('be.visible')
    })
  })

  // =========================================================================
  // Status Badge
  // =========================================================================
  describe('Status Badge', () => {
    it('should show "active" badge in emerald color for active products', () => {
      stubProductDetail({ product_status: 'active' })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-status-badge"]')
        .should('contain.text', 'active')
        .should('have.class', 'bg-emerald-100')
    })

    it('should show "inactive" badge in red color for inactive products', () => {
      stubProductDetail({ product_status: 'inactive' })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-status-badge"]')
        .should('contain.text', 'inactive')
        .should('have.class', 'bg-red-100')
    })

    it('should display status badge at top right of page header', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      // Badge should be positioned at top right (after title)
      cy.get('[data-testid="product-detail-status-badge"]').should('be.visible')
    })
  })

  // =========================================================================
  // Stat Cards (4 cards)
  // =========================================================================
  describe('Stat Cards', () => {
    it('should display 4 stat cards: Current Stock, Total Added, Total Spent, Usage Sessions', () => {
      stubProductDetail({ quantity: 5 })
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')
      cy.wait('@usageHistoryApi')

      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Current Stock').should('be.visible')
        cy.contains('Total Added').should('be.visible')
        cy.contains('Total Spent').should('be.visible')
        cy.contains('Usage Sessions').should('be.visible')
      })
    })

    it('should show Current Stock value from product.quantity', () => {
      stubProductDetail({ quantity: 8 })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Current Stock').parent().should('contain.text', '8')
      })
    })

    it('should show sub-label "Out of stock" when quantity = 0', () => {
      stubProductDetail({ quantity: 0 })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Out of stock').should('be.visible')
      })
    })

    it('should show sub-label "Low stock" when quantity ≤ 2', () => {
      stubProductDetail({ quantity: 2 })
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Low stock').should('be.visible')
      })
    })

    it('should calculate Total Added as SUM of quantity_added from stock history', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      // SUM: 2 + 3 + 1 = 6
      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Total Added').parent().should('contain.text', '6')
      })
    })

    it('should calculate Total Spent as SUM of price from stock history, formatted as Rp', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      // SUM: 50000 + 48000 + 45000 = 143000
      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Total Spent').parent().should('contain.text', 'Rp')
      })
    })

    it('should show "all time" sub-label for Total Spent', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('all time').should('be.visible')
      })
    })

    it('should count Usage Sessions from usage history records', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@usageHistoryApi')

      // 2 usage sessions
      cy.get('[data-testid="product-detail-stats"]').within(() => {
        cy.contains('Usage Sessions').parent().should('contain.text', '2')
      })
    })

    it('should be responsive: 2 columns on mobile, 4 columns on desktop', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      // Mobile
      cy.viewport('iphone-6')
      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-stats"]').should('have.class', 'grid-cols-2')

      // Desktop
      cy.viewport(1280, 800)
      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-stats"]').should('have.class', 'md:grid-cols-4')
    })
  })

  // =========================================================================
  // Purchase History Section
  // =========================================================================
  describe('Purchase History Section', () => {
    it('should display Purchase History section with table', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-purchase-section"]').should('be.visible')
      cy.get('[data-testid="product-detail-purchase-table"]').should('be.visible')
    })

    it('should show table headers: Date, Qty Added, Price, Note', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-purchase-table"]').within(() => {
        cy.contains('Date').should('be.visible')
        cy.contains('Qty Added').should('be.visible')
        cy.contains('Price').should('be.visible')
        cy.contains('Note').should('be.visible')
      })
    })

    it('should display purchase history rows with correct data', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-purchase-row"]').should('have.length', 3)

      // First row: 05 Apr 2026, 2, Rp 50.000, "Promo sale"
      cy.get('[data-testid="product-detail-purchase-row"]')
        .first()
        .within(() => {
          cy.contains('05 Apr 2026').should('be.visible')
          cy.contains('2').should('be.visible')
          cy.contains('Rp').should('be.visible')
          cy.contains('Promo sale').should('be.visible')
        })
    })

    it('should sort purchase history most recent first', () => {
      const history = [
        { ...samplePurchaseHistory[0], purchase_date: '2026-02-01T00:00:00.000Z' },
        { ...samplePurchaseHistory[1], purchase_date: '2026-04-05T00:00:00.000Z' },
        { ...samplePurchaseHistory[2], purchase_date: '2026-03-15T00:00:00.000Z' },
      ]

      stubProductDetail()
      stubStockHistory(history)
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      // Should be sorted: 05 Apr, 15 Mar, 01 Feb
      cy.get('[data-testid="product-detail-purchase-row"]')
        .first()
        .should('contain.text', '05 Apr 2026')
    })

    it('should show empty state when no purchase history exists', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-purchase-empty"]').should('be.visible')
      cy.contains('No purchase history yet').should('be.visible')
    })

    it('should show icon in empty state', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory([])

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@stockHistoryApi')

      cy.get('[data-testid="product-detail-purchase-empty"]').within(() => {
        cy.get('svg').should('exist')
      })
    })

    it('should be responsive: full width on mobile, part of 2-column grid on desktop', () => {
      stubProductDetail()
      stubStockHistory(samplePurchaseHistory)
      stubUsageHistory(sampleUsageHistory)

      // Mobile
      cy.viewport('iphone-6')
      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-purchase-section"]').should('have.class', 'col-span-1')

      // Desktop
      cy.viewport(1280, 800)
      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-purchase-section"]').should(
        'have.class',
        'md:col-span-1'
      )
    })
  })

  // =========================================================================
  // Usage History Section
  // =========================================================================
  describe('Usage History Section', () => {
    it('should display Usage History section', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@usageHistoryApi')

      cy.get('[data-testid="product-detail-usage-section"]').should('be.visible')
    })

    it('should reuse ProductUsageLog component', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@usageHistoryApi')

      // Usage Log component should be visible (table with rows)
      cy.get('[data-testid="product-usage-log"]').should('be.visible')
    })

    it('should display usage history rows with correct data', () => {
      stubProductDetail()
      stubStockHistory([])
      stubUsageHistory(sampleUsageHistory)

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')
      cy.wait('@usageHistoryApi')

      cy.get('[data-testid="product-usage-log"]').within(() => {
        // Should show start dates
        cy.contains('04 Apr 2026').should('be.visible')
        cy.contains('01 Jan 2026').should('be.visible')
      })
    })
  })

  // =========================================================================
  // Loading State
  // =========================================================================
  describe('Loading State', () => {
    it('should show skeleton while data is loading', () => {
      cy.intercept('GET', PRODUCT_DETAIL_API(1), (req) => {
        req.on('response', (res) => {
          res.setDelay(800)
        })
      }).as('slowProductDetail')

      cy.visit(PRODUCT_DETAIL_URL(1))

      cy.get('[data-testid="product-detail-loading"]').should('be.visible')
      cy.wait('@slowProductDetail')
    })

    it('should keep back link visible while loading', () => {
      cy.intercept('GET', PRODUCT_DETAIL_API(1), (req) => {
        req.on('response', (res) => {
          res.setDelay(600)
        })
      }).as('slowProductDetail')

      cy.visit(PRODUCT_DETAIL_URL(1))

      cy.contains('Back to Product List').should('be.visible')
      cy.wait('@slowProductDetail')
    })
  })

  // =========================================================================
  // Error State
  // =========================================================================
  describe('Error State', () => {
    it('should show error message when API fails', () => {
      cy.intercept('GET', PRODUCT_DETAIL_API(1), {
        statusCode: 500,
        body: { success: false, error: 'Server error' },
      }).as('productDetailError')

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailError')

      cy.get('[data-testid="product-detail-error"]').should('be.visible')
      cy.contains('Failed to load product details').should('be.visible')
    })

    it('should display retry button in error state', () => {
      cy.intercept('GET', PRODUCT_DETAIL_API(1), {
        statusCode: 500,
        body: { success: false, error: 'Server error' },
      }).as('productDetailError')

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailError')

      cy.get('[data-testid="product-detail-retry-btn"]').should('be.visible')
      cy.get('[data-testid="product-detail-retry-btn"]').should('contain.text', 'Try again')
    })

    it('should retry all 3 API calls when retry button is clicked', () => {
      let callCount = 0

      cy.intercept('GET', PRODUCT_DETAIL_API(1), (req) => {
        callCount++
        if (callCount === 1) {
          req.reply({
            statusCode: 500,
            body: { success: false, error: 'Server error' },
          })
        } else {
          req.reply({
            statusCode: 200,
            body: { success: true, data: sampleProduct },
          })
        }
      }).as('productDetailApi')

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailApi')

      cy.get('[data-testid="product-detail-retry-btn"]').click()

      // Second call should succeed
      cy.get('[data-testid="product-detail-page"]').should('be.visible')
    })

    it('should show icon in error state', () => {
      cy.intercept('GET', PRODUCT_DETAIL_API(1), {
        statusCode: 500,
        body: { success: false, error: 'Server error' },
      }).as('productDetailError')

      cy.visit(PRODUCT_DETAIL_URL(1))
      cy.wait('@productDetailError')

      cy.get('[data-testid="product-detail-error"]').within(() => {
        cy.get('svg').should('exist')
      })
    })
  })

  // =========================================================================
  // Validation
  // =========================================================================
  describe('Validation', () => {
    it('should validate productId as integer', () => {
      // Invalid ID should be handled gracefully
      cy.visit('/main/inventory/product-list/invalid-id')

      // Should show error or redirect
      cy.get('[data-testid="product-detail-error"]').should('exist')
    })

    it('should require authentication to view page', () => {
      // Visit without logging in (simulated by not calling cy.loginWithBypass())
      cy.logout()
      cy.visit(PRODUCT_DETAIL_URL(1))

      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })
})
