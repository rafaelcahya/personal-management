import constants from '../../../../fixtures/app-constants.json'

const PRODUCT = constants.endpoints.product

Cypress.Commands.add('AddProduct', (request) => {
  return cy.apiRequestWithSession('POST', PRODUCT.create, { body: request })
})

Cypress.Commands.add('AddProductNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', PRODUCT.create, { body: request })
})

Cypress.Commands.add('GetProductList', (qs = {}) => {
  return cy.apiRequestWithSession('GET', PRODUCT.list, { qs })
})

Cypress.Commands.add('GetProductListNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', PRODUCT.list, { qs })
})

Cypress.Commands.add('GetProductSummary', () => {
  return cy.apiRequestWithSession('GET', PRODUCT.summary)
})

Cypress.Commands.add('GetProductSummaryNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PRODUCT.summary)
})

Cypress.Commands.add('GetProductDetail', (id) => {
  return cy.apiRequestWithSession('GET', `${PRODUCT.detail}/${id}`)
})

Cypress.Commands.add('GetProductDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${PRODUCT.detail}/${id}`)
})

Cypress.Commands.add('EditProduct', (id, body) => {
  return cy.apiRequestWithSession('PATCH', `${PRODUCT.edit}/${id}`, { body })
})

Cypress.Commands.add('EditProductNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${PRODUCT.edit}/${id}`, { body })
})

Cypress.Commands.add('DeleteProduct', (id) => {
  return cy.apiRequestWithSession('DELETE', `${PRODUCT.delete}/${id}`)
})

Cypress.Commands.add('DeleteProductNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${PRODUCT.delete}/${id}`)
})

Cypress.Commands.add('UpdateProduct', (id, request) => {
  return cy.apiRequestWithSession('PATCH', `${PRODUCT.adjust}/${id}`, { body: request })
})

Cypress.Commands.add('UpdateProductNoAuth', (id, request) => {
  return cy.apiRequestNoAuth('PATCH', `${PRODUCT.adjust}/${id}`, { body: request })
})

Cypress.Commands.add('FavoriteProduct', (id, isFavorite) => {
  return cy.apiRequestWithSession('PATCH', `${PRODUCT.favorite}/${id}/favorite`, {
    body: { isFavorite },
  })
})

Cypress.Commands.add('FavoriteProductNoAuth', (id, isFavorite) => {
  return cy.apiRequestNoAuth('PATCH', `${PRODUCT.favorite}/${id}/favorite`, {
    body: { isFavorite },
  })
})

Cypress.Commands.add('GetLastPurchasePrice', (id) => {
  return cy.apiRequestWithSession('GET', `${PRODUCT.last_price}/${id}/last-price`)
})

Cypress.Commands.add('GetLastPurchasePriceNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${PRODUCT.last_price}/${id}/last-price`)
})

Cypress.Commands.add('GetRestockPredictions', () => {
  return cy.apiRequestWithSession('GET', PRODUCT.restock_predictions)
})

Cypress.Commands.add('GetRestockPredictionsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PRODUCT.restock_predictions)
})

// ── Product History ──────────────────────────────────────────────────────────

Cypress.Commands.add('GetProductHistoryList', () => {
  return cy.apiRequestWithSession('GET', `${PRODUCT.product_history}/list`)
})

Cypress.Commands.add('GetProductHistoryListNoAuth', () => {
  return cy.apiRequestNoAuth('GET', `${PRODUCT.product_history}/list`)
})

Cypress.Commands.add('GetProductHistoryDetail', (productListId) => {
  return cy.apiRequestWithSession('GET', `${PRODUCT.product_history}/${productListId}`)
})

Cypress.Commands.add('GetProductHistoryDetailNoAuth', (productListId) => {
  return cy.apiRequestNoAuth('GET', `${PRODUCT.product_history}/${productListId}`)
})

Cypress.Commands.add('UpdateProductHistory', (historyId, body) => {
  return cy.apiRequestWithSession('PATCH', `${PRODUCT.product_history}/update/${historyId}`, {
    body,
  })
})

Cypress.Commands.add('UpdateProductHistoryNoAuth', (historyId, body) => {
  return cy.apiRequestNoAuth('PATCH', `${PRODUCT.product_history}/update/${historyId}`, { body })
})
