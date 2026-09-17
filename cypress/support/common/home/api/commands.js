import constants from '../../../../fixtures/app-constants.json'

const INVENTORY = constants.endpoints.home.inventory
const TRADING = constants.endpoints.home.trading
const RUNNING = constants.endpoints.home.running

Cypress.Commands.add('getHomeInventory', () => cy.apiRequestWithSession('GET', INVENTORY))
Cypress.Commands.add('getHomeInventoryNoAuth', () => cy.apiRequestNoAuth('GET', INVENTORY))

Cypress.Commands.add('getHomeTrading', () => cy.apiRequestWithSession('GET', TRADING))
Cypress.Commands.add('getHomeTradingNoAuth', () => cy.apiRequestNoAuth('GET', TRADING))

Cypress.Commands.add('getHomeRunning', (qs = {}) =>
  cy.apiRequestWithSession('GET', RUNNING, { qs })
)
Cypress.Commands.add('getHomeRunningNoAuth', () => cy.apiRequestNoAuth('GET', RUNNING))
