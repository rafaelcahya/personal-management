Cypress.Commands.add('AddProduct', (request) => {
  return cy.apiRequestWithSession('POST', '/api/inventory/v1/product/create', { body: request })
})

Cypress.Commands.add('AddProductNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', '/api/inventory/v1/product/create', {
    body: request,
  })
})

Cypress.Commands.add('GetProductList', () => {
  return cy.apiRequestWithSession('GET', '/api/inventory/v1/product/list')
})

Cypress.Commands.add('GetProductListNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/inventory/v1/product/list')
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
