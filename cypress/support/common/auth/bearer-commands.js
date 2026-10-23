// Bearer requests must carry no cookies: a cypress-bypass or session cookie in the jar would
// change which auth branch the middleware takes.
Cypress.Commands.add('getBearerSession', () => {
  return cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
    return cy
      .task('getSupabaseSession', { email: TEST_EMAIL, password: TEST_PASSWORD })
      .then((session) => {
        if (!session?.access_token) throw new Error('Failed to sign in the test account')
        return {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }
      })
  })
})

// options.authorization sends the raw header value; options.token sends `Bearer <token>`.
Cypress.Commands.add('apiRequestBearer', (method, url, options = {}) => {
  if (!options.keepCookies) cy.clearCookies()

  const headers = { ...(options.headers || {}) }
  if (options.authorization !== undefined) headers.Authorization = options.authorization
  else if (options.token) headers.Authorization = `Bearer ${options.token}`

  return cy.request({
    method,
    url,
    body: options.body,
    qs: options.qs,
    headers,
    followRedirect: false,
    failOnStatusCode: false,
  })
})
