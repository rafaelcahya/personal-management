Cypress.Commands.add('getTestUserId', () => {
  return cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
    return cy
      .task('getSupabaseSession', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .then((session) => {
        if (!session) throw new Error('Failed to get test user session')
        return session.user.id
      })
  })
})
