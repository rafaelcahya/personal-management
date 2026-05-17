Cypress.Commands.add('login', (email, password) => {
  cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
    const testEmail = email || TEST_EMAIL
    const testPassword = password || TEST_PASSWORD

    if (!testEmail || !testPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD must be configured')
    }

    return cy.session(
      [testEmail, testPassword],
      () => {
        const attemptLogin = (attempt = 1) => {
          cy.task('getSupabaseSession', {
            email: testEmail,
            password: testPassword,
          }).then((session) => {
            if (!session && attempt < 3) {
              cy.log(`⚠️ Attempt ${attempt} failed, retrying...`)
              cy.wait(1000 * attempt)
              attemptLogin(attempt + 1)
              return
            }

            if (!session) {
              throw new Error(`Failed to get session for ${testEmail} after 3 attempts`)
            }

            cy.log(`✅ Session obtained on attempt ${attempt}`)

            cy.setCookie('cypress-session-token', session.access_token, {
              path: '/',
              httpOnly: false,
            })

            cy.visit('/')
            cy.window().then((win) => {
              win.localStorage.setItem('cypress-session', JSON.stringify(session))
              win.localStorage.setItem('cypress-access-token', session.access_token)
            })
          })
        }

        attemptLogin()
      },
      {
        cacheAcrossSpecs: true,
        validate() {
          // cek cookie, bukan localStorage
          cy.getCookie('cypress-session-token').then((cookie) => {
            if (!cookie || !cookie.value) {
              throw new Error('Session validation failed - no token cookie')
            }
            cy.log('✅ Session validated')
          })
        },
      }
    )
  })
})

Cypress.Commands.add('enableBypass', () => {
  cy.env(['CYPRESS_AUTH_SECRET']).then(({ CYPRESS_AUTH_SECRET }) => {
    if (!CYPRESS_AUTH_SECRET) {
      throw new Error('CYPRESS_AUTH_SECRET not configured in env')
    }

    cy.setCookie('cypress-bypass', CYPRESS_AUTH_SECRET, {
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    })

    cy.log('✅ Bypass enabled')
  })
})

Cypress.Commands.add('disableBypass', () => {
  cy.clearCookie('cypress-bypass')
  cy.log('🗑️ Bypass disabled')
})

Cypress.Commands.add('getSession', () => {
  return cy.window().then((win) => {
    const sessionStr = win.localStorage.getItem('cypress-session')
    if (!sessionStr) {
      cy.log('⚠️  No session found in localStorage')
      return null
    }

    try {
      return JSON.parse(sessionStr)
    } catch (err) {
      cy.log(`❌ Failed to parse session: ${err.message}`)
      return null
    }
  })
})

Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('cypress-session')
    win.localStorage.removeItem('cypress-access-token')
  })
  cy.clearAllCookies()
  cy.log('🗑️  Auth cleared')
})

Cypress.Commands.add('loginWithBypass', (email, password) => {
  cy.login(email, password)
  cy.enableBypass()
})

Cypress.Commands.add('getAuthToken', () => {
  return cy.window().then((win) => {
    const token = win.localStorage.getItem('cypress-access-token')
    if (!token) {
      cy.log('⚠️  No access token found in localStorage')
      return null
    }
    return token
  })
})

Cypress.Commands.add('logout', () => {
  cy.request({ method: 'POST', url: '/api/auth/logout', failOnStatusCode: false })
  cy.window().then((win) => {
    win.localStorage.removeItem('cypress-session')
    win.localStorage.removeItem('cypress-access-token')
  })
  cy.clearAllCookies()
  cy.visit('/login')
  cy.log('🗑️  Logged out and redirected to /login')
})
