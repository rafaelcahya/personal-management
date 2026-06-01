import { INVENTORY_ENDPOINTS } from '../../../fixtures/endpoints.js'
import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'

const PRODUCT_LIST_URL = ROUTES.inventory_product_list
const PRODUCT_LIST_API = INVENTORY_ENDPOINTS.PRODUCT_LIST
const PRODUCT_SUMMARY_API = INVENTORY_ENDPOINTS.PRODUCT_SUMMARY
const RESTOCK_API = INVENTORY_ENDPOINTS.PRODUCT_RESTOCK_PREDICTIONS

const IDS = TEST_IDS.product_list

const stubProductSummary = (data = {}) => {
  cy.intercept('GET', PRODUCT_SUMMARY_API, {
    statusCode: 200,
    body: {
      success: true,
      data: {
        totalProducts: 2,
        activeProducts: 2,
        inactiveProducts: 0,
        totalQuantity: 10,
        totalUsageQuantity: 0,
        favoriteProducts: 1,
        ...data,
      },
    },
  }).as('productSummaryApi')
}

const stubRestock = () => {
  cy.intercept('GET', '**/restock-predictions*', {
    statusCode: 200,
    body: { success: true, data: [] },
  }).as('restockApi')
}

const favoriteProduct = {
  id: 1,
  uuid: 'uuid-fav',
  brand: 'Dove',
  brand_id: 10,
  product: 'Shampoo',
  product_id: 20,
  type: 'Hair Care',
  product_status: 'active',
  quantity: 5,
  usage_quantity: 0,
  usage_date: '2026-04-01T00:00:00.000Z',
  is_favorite: true,
  deleted_at: null,
  note: '',
  product_image: null,
}

const nonFavoriteProduct = {
  id: 2,
  uuid: 'uuid-nonfav',
  brand: 'Cetaphil',
  brand_id: 11,
  product: 'Moisturizer',
  product_id: 21,
  type: 'Skincare',
  product_status: 'active',
  quantity: 3,
  usage_quantity: 0,
  usage_date: '2026-03-01T00:00:00.000Z',
  is_favorite: false,
  deleted_at: null,
  note: '',
  product_image: null,
}

const productWithImage = {
  id: 3,
  uuid: 'uuid-img',
  brand: 'Nivea',
  brand_id: 12,
  product: 'Body Lotion',
  product_id: 22,
  type: 'Body Care',
  product_status: 'active',
  quantity: 2,
  usage_quantity: 0,
  usage_date: null,
  is_favorite: false,
  deleted_at: null,
  note: '',
  product_image: 'https://placehold.co/200x200/png',
}

const stubProductList = (products) => {
  cy.intercept('GET', PRODUCT_LIST_API, {
    statusCode: 200,
    body: { success: true, data: products },
  }).as('productListApi')
}

describe('Product List — Non-favorite star shows grey (#33)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubProductList([favoriteProduct, nonFavoriteProduct])
    stubProductSummary()
    stubRestock()
    cy.viewport(1280, 800)
    cy.visit(PRODUCT_LIST_URL)
    cy.wait('@productListApi')
  })

  it('favorite product star has fill-yellow-400 class on desktop', () => {
    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Shampoo')
      .find('svg')
      .first()
      .should('have.class', 'fill-yellow-400')
  })

  it('non-favorite product star has text-slate-300 class on desktop', () => {
    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Moisturizer')
      .find('svg')
      .first()
      .should('have.class', 'text-slate-300')
  })

  it('non-favorite product star does NOT have invisible class on desktop', () => {
    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Moisturizer')
      .find('svg')
      .first()
      .should('not.have.class', 'invisible')
  })
})

describe('Product List — Non-favorite star shows grey on mobile (#33)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubProductList([favoriteProduct, nonFavoriteProduct])
    stubProductSummary()
    stubRestock()
    cy.viewport(375, 812)
    cy.visit(PRODUCT_LIST_URL)
    cy.wait('@productListApi')
  })

  it('non-favorite product star has text-slate-300 class on mobile card', () => {
    cy.get('[id^="mobileCard_"][id$="productListPage"]')
      .contains('Moisturizer')
      .closest('[id^="mobileCard_"]')
      .find('svg')
      .first()
      .should('have.class', 'text-slate-300')
  })

  it('non-favorite product star does NOT have invisible class on mobile card', () => {
    cy.get('[id^="mobileCard_"][id$="productListPage"]')
      .contains('Moisturizer')
      .closest('[id^="mobileCard_"]')
      .find('svg')
      .first()
      .should('not.have.class', 'invisible')
  })
})

describe('Product List — Image preview dialog opens on thumbnail click (#34)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubProductList([productWithImage])
    stubProductSummary({ totalProducts: 1, activeProducts: 1, favoriteProducts: 0 })
    stubRestock()
    cy.viewport(1280, 800)
    cy.visit(PRODUCT_LIST_URL)
    cy.wait('@productListApi')
  })

  it('image thumbnail is visible for product with product_image', () => {
    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Body Lotion')
      .find('img')
      .should('exist')
      .and('have.attr', 'alt', 'Body Lotion')
  })

  it('clicking image thumbnail opens the preview dialog', () => {
    cy.get(`#${IDS.image_preview_dialog}`).should('not.exist')

    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Body Lotion')
      .find('img')
      .parent('button')
      .click()

    cy.get(`#${IDS.image_preview_dialog}`).should('be.visible')
  })

  it('preview dialog contains the product image', () => {
    cy.get(`#${IDS.desktop_table}`)
      .contains('tr', 'Body Lotion')
      .find('img')
      .parent('button')
      .click()

    cy.get(`#${IDS.image_preview_dialog}`).find('img').should('exist')
  })

  it('product without image does not show a thumbnail', () => {
    // nonFavoriteProduct has no product_image — re-stub with it
    cy.intercept('GET', PRODUCT_LIST_API, {
      statusCode: 200,
      body: { success: true, data: [nonFavoriteProduct] },
    }).as('productListNoImg')

    cy.visit(PRODUCT_LIST_URL)
    cy.wait('@productListNoImg')

    cy.get(`#${IDS.desktop_table}`).contains('tr', 'Moisturizer').find('img').should('not.exist')
  })
})
