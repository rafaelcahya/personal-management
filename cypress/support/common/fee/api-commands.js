Cypress.Commands.add('GetFeeDetail', (id) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/fee/${id}`)
})

Cypress.Commands.add('GetFeeDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/fee/${id}`)
})

Cypress.Commands.add('GetFeeSummary', () => {
  return cy.apiRequestWithSession('GET', '/api/trade/v1/fee/summary')
})

Cypress.Commands.add('GetFeeSummaryNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/trade/v1/fee/summary')
})

Cypress.Commands.add('GetSingleFee', (id) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/fee/${id}`)
})

Cypress.Commands.add('GetSingleFeeNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/fee/${id}`)
})

Cypress.Commands.add('GetListFee', (qs = {}) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/fee/list`, { qs })
})

Cypress.Commands.add('GetListFeeNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/fee/list`, { qs })
})

Cypress.Commands.add('AddFee', (request) => {
  return cy.apiRequestWithSession('POST', '/api/trade/v1/fee/create', {
    body: request,
  })
})

Cypress.Commands.add('AddFeeNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', '/api/trade/v1/fee/create', {
    body: request,
  })
})

Cypress.Commands.add('DeleteFee', (id) => {
  return cy.apiRequestWithSession('DELETE', `/api/trade/v1/fee/delete/${id}`)
})

Cypress.Commands.add('DeleteFeeNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `/api/trade/v1/fee/delete/${id}`)
})

Cypress.Commands.add('UpdateFee', (id, request) => {
  return cy.apiRequestWithSession('PUT', `/api/trade/v1/fee/update/${id}`, {
    body: request,
  })
})

Cypress.Commands.add('UpdateFeeNoAuth', (id, request) => {
  return cy.apiRequestNoAuth('PUT', `/api/trade/v1/fee/update/${id}`, {
    body: request,
  })
})
