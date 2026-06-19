import constants from '../../../../fixtures/app-constants.json'

const PRODUCT_LIST = constants.endpoints.product.list

Cypress.Commands.add('AddProduct', (request) => {
  return cy.apiRequestWithSession('POST', '/api/inventory/v1/product/create', { body: request })
})

Cypress.Commands.add('AddProductNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', '/api/inventory/v1/product/create', {
    body: request,
  })
})

Cypress.Commands.add('GetProductList', (qs = {}) => {
  return cy.apiRequestWithSession('GET', PRODUCT_LIST, { qs })
})

Cypress.Commands.add('GetProductListNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', PRODUCT_LIST, { qs })
})

Cypress.Commands.add('GetProductSummary', () => {
  return cy.apiRequestWithSession('GET', '/api/inventory/v1/product/summary')
})

Cypress.Commands.add('GetProductSummaryNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/inventory/v1/product/summary')
})

Cypress.Commands.add('GetProductDetail', (id) => {
  return cy.apiRequestWithSession('GET', `/api/inventory/v1/product/${id}`)
})

Cypress.Commands.add('GetProductDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/inventory/v1/product/${id}`)
})

Cypress.Commands.add('DeleteProduct', (id) => {
  return cy.apiRequestWithSession('DELETE', `/api/inventory/v1/product/delete/${id}`)
})

Cypress.Commands.add('DeleteProductNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `/api/inventory/v1/product/delete/${id}`)
})

Cypress.Commands.add('UpdateProduct', (id, request) => {
  return cy.apiRequestWithSession('PATCH', `/api/inventory/v1/product/adjust/${id}`, {
    body: request,
  })
})

Cypress.Commands.add('UpdateProductNoAuth', (id, request) => {
  return cy.apiRequestNoAuth('PATCH', `/api/inventory/v1/product/adjust/${id}`, { body: request })
})

Cypress.Commands.add('FavoriteProduct', (id, isFavorite) => {
  return cy.apiRequestWithSession('PATCH', `/api/inventory/v1/product/${id}/favorite`, {
    body: { isFavorite },
  })
})

Cypress.Commands.add('FavoriteProductNoAuth', (id, isFavorite) => {
  return cy.apiRequestNoAuth('PATCH', `/api/inventory/v1/product/${id}/favorite`, {
    body: { isFavorite },
  })
})

Cypress.Commands.add('GetLastPurchasePrice', (id) => {
  return cy.apiRequestWithSession('GET', `/api/inventory/v1/product/${id}/last-price`)
})

Cypress.Commands.add('GetLastPurchasePriceNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/inventory/v1/product/${id}/last-price`)
})

Cypress.Commands.add('GetRestockPredictions', () => {
  return cy.apiRequestWithSession('GET', '/api/inventory/v1/product/restock-predictions')
})

Cypress.Commands.add('GetRestockPredictionsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/inventory/v1/product/restock-predictions')
})

// ── Product History ──────────────────────────────────────────────────────────

Cypress.Commands.add('GetProductHistoryList', () => {
  return cy.apiRequestWithSession('GET', '/api/inventory/v1/product-history/list')
})

Cypress.Commands.add('GetProductHistoryListNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/inventory/v1/product-history/list')
})

Cypress.Commands.add('GetProductHistoryDetail', (productListId) => {
  return cy.apiRequestWithSession('GET', `/api/inventory/v1/product-history/${productListId}`)
})

Cypress.Commands.add('GetProductHistoryDetailNoAuth', (productListId) => {
  return cy.apiRequestNoAuth('GET', `/api/inventory/v1/product-history/${productListId}`)
})

Cypress.Commands.add('UpdateProductHistory', (historyId, body) => {
  return cy.apiRequestWithSession(
    'PATCH',
    `/api/inventory/v1/product-history/update/${historyId}`,
    { body }
  )
})

Cypress.Commands.add('UpdateProductHistoryNoAuth', (historyId, body) => {
  return cy.apiRequestNoAuth('PATCH', `/api/inventory/v1/product-history/update/${historyId}`, {
    body,
  })
})
