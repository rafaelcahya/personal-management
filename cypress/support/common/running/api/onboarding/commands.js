import constants from '../../../../../fixtures/app-constants.json'

const BIOMETRIC = constants.endpoints.running_onboarding.biometric
const COMPLETE = constants.endpoints.running_onboarding.complete

Cypress.Commands.add('postOnboardingBiometric', (body) => {
  return cy.apiRequestWithSession('POST', BIOMETRIC, { body })
})

Cypress.Commands.add('postOnboardingBiometricNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', BIOMETRIC, { body })
})

Cypress.Commands.add('postOnboardingComplete', (body = {}) => {
  return cy.apiRequestWithSession('POST', COMPLETE, { body })
})

Cypress.Commands.add('postOnboardingCompleteNoAuth', () => {
  return cy.apiRequestNoAuth('POST', COMPLETE)
})
