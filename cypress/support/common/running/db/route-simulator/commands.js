export const ROUTE_SIM_SEED_TAG = 'cy846'

Cypress.Commands.add('seedStreamActivityInDb', (rowCount) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('seedStreamActivityInDb', { userId, tag: ROUTE_SIM_SEED_TAG, rowCount })
  })
})

Cypress.Commands.add('deleteStreamActivityFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('deleteStreamActivityFromDb', { userId, tag: ROUTE_SIM_SEED_TAG })
  })
})

Cypress.Commands.add('countTaggedRouteRowsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('countTaggedRouteRowsFromDb', { userId, tag: ROUTE_SIM_SEED_TAG })
  })
})

Cypress.Commands.add('getOtherUserRouteIdsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getOtherUserRouteIdsFromDb', { userId })
  })
})
