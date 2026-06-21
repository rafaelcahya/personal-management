Cypress.Commands.add('GetTradeDetail', (id) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/trade/${id}`)
})

Cypress.Commands.add('GetTradeDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/trade/${id}`)
})

Cypress.Commands.add('GetTradeSummary', () => {
  return cy.apiRequestWithSession('GET', '/api/trade/v1/trade/summary')
})

Cypress.Commands.add('GetTradeSummaryNoAuth', () => {
  return cy.apiRequestNoAuth('GET', '/api/trade/v1/trade/summary')
})

Cypress.Commands.add('GetSingleTrade', (id) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/trade/${id}`)
})

Cypress.Commands.add('GetSingleTradeNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/trade/${id}`)
})

Cypress.Commands.add('GetListTrade', ({ page = 1, limit = 15, ticker } = {}) => {
  const params = new URLSearchParams({ page, limit })
  if (ticker) params.set('ticker', ticker)
  return cy.apiRequestWithSession('GET', `/api/trade/v1/trade/list?${params}`)
})

Cypress.Commands.add('GetListTradeNoAuth', ({ page = 1, limit = 15 } = {}) => {
  const params = new URLSearchParams({ page, limit })
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/trade/list?${params}`)
})

Cypress.Commands.add('AddTrade', (request) => {
  return cy.apiRequestWithSession('POST', '/api/trade/v1/trade/create', {
    body: request,
  })
})

Cypress.Commands.add('AddTradeNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', '/api/trade/v1/trade/create', {
    body: request,
  })
})

Cypress.Commands.add('GetOption', (option) => {
  return cy.apiRequestWithSession('GET', `/api/trade/v1/trade/options/${option}`)
})

Cypress.Commands.add('GetOptionNoAuth', (option) => {
  return cy.apiRequestNoAuth('GET', `/api/trade/v1/trade/options/${option}`)
})

Cypress.Commands.add('DeleteTrade', (id) => {
  return cy.apiRequestWithSession('DELETE', `/api/trade/v1/trade/delete/${id}`)
})

Cypress.Commands.add('DeleteTradeNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `/api/trade/v1/trade/delete/${id}`)
})

Cypress.Commands.add('UpdateTrade', (id, request) => {
  return cy.apiRequestWithSession('PUT', `/api/trade/v1/trade/update/${id}`, {
    body: request,
  })
})

Cypress.Commands.add('UpdateTradeNoAuth', (id, request) => {
  return cy.apiRequestNoAuth('PUT', `/api/trade/v1/trade/update/${id}`, {
    body: request,
  })
})
