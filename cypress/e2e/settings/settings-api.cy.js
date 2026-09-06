import { USER_ENDPOINTS } from '../../fixtures/endpoints.js'

const VALID_PROFILE = {
  username: 'cypress_user',
  nickname: 'Cypress Tester',
}

describe('User Settings API', () => {
  // Cypress clears cookies between tests, so re-apply the auth cookie before each
  // one. The session is cached, so this is a cheap cookie re-set, not a fresh login.
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── GET /api/user ───────────────────────────────────────────────────────────

  describe('GET /api/user', () => {
    it('returns 200 with valid session', () => {
      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearCookies()
      cy.apiRequestNoAuth('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.status).to.eq(401)
        expect(res.body.error).to.eq('Unauthorized')
      })
    })

    it('returns correct response shape — data.user + message', () => {
      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.body).to.have.property('message', 'User fetched successfully')
        expect(res.body).to.have.nested.property('data.user').that.is.an('object')

        const { user } = res.body.data
        expect(user).to.have.property('id').that.is.a('string')
        expect(user).to.have.property('username')
        expect(user).to.have.property('nickname')
        expect(user).to.have.property('avatar')
      })
    })

    it('responds within 1000ms', () => {
      const start = Date.now()
      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then(() => {
        expect(Date.now() - start).to.be.lte(1000)
      })
    })
  })

  // ─── PUT /api/user ───────────────────────────────────────────────────────────

  describe('PUT /api/user', () => {
    let originalProfile

    // Snapshot the real profile so mutations in this block can be rolled back after.
    before(() => {
      cy.setupApiAuthCookies().then(() => {
        cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
          originalProfile = res.body.data.user
        })
      })
    })

    after(() => {
      cy.setupApiAuthCookies().then(() => {
        cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, {
          body: {
            username: originalProfile.username,
            nickname: originalProfile.nickname,
            avatar: originalProfile.avatar,
          },
        })
      })
    })

    it('returns 200 with valid payload and session', () => {
      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, { body: VALID_PROFILE }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearCookies()
      cy.apiRequestNoAuth('PUT', USER_ENDPOINTS.USER, { body: VALID_PROFILE }).then((res) => {
        expect(res.status).to.eq(401)
        expect(res.body.error).to.eq('Unauthorized')
      })
    })

    it('returns correct response shape — data.user + message', () => {
      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, { body: VALID_PROFILE }).then((res) => {
        expect(res.body).to.have.property('message', 'User updated successfully')
        expect(res.body).to.have.nested.property('data.user').that.is.an('object')
      })
    })

    it('persists username and nickname sent in the request', () => {
      const payload = { username: 'unique_cy_name', nickname: 'Unique Nick' }

      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, { body: payload }).then((res) => {
        expect(res.status).to.eq(200)
      })

      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.body.data.user.username).to.eq(payload.username)
        expect(res.body.data.user.nickname).to.eq(payload.nickname)
      })
    })

    it('stores avatar under avatar_url and returns it on GET', () => {
      const avatarUrl = 'https://example.com/avatars/cypress.png'

      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, { body: { avatar: avatarUrl } }).then(
        (res) => {
          expect(res.status).to.eq(200)
          expect(res.body.data.user).to.have.property('avatar_url', avatarUrl)
        }
      )

      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.body.data.user.avatar).to.eq(avatarUrl)
      })
    })

    it('accepts a partial update without requiring every field', () => {
      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, {
        body: { username: 'only_username' },
      }).then((res) => {
        expect(res.status).to.eq(200)
      })

      cy.apiRequestWithSession('GET', USER_ENDPOINTS.USER).then((res) => {
        expect(res.body.data.user.username).to.eq('only_username')
      })
    })

    it('responds within 1000ms', () => {
      const start = Date.now()
      cy.apiRequestWithSession('PUT', USER_ENDPOINTS.USER, { body: VALID_PROFILE }).then(() => {
        expect(Date.now() - start).to.be.lte(1000)
      })
    })
  })

  // ─── POST /api/user/avatar ───────────────────────────────────────────────────

  describe('POST /api/user/avatar', () => {
    it('returns 401 when unauthenticated', () => {
      cy.clearCookies()
      cy.apiRequestNoAuth('POST', USER_ENDPOINTS.AVATAR).then((res) => {
        expect(res.status).to.eq(401)
        expect(res.body.error).to.eq('Unauthorized')
      })
    })

    it('returns 400 when no file is provided', () => {
      // Send a valid form body without the `file` field. req.formData() parses
      // url-encoded bodies too, so this reaches the explicit "No file provided" guard
      // (a bare FormData object is not serialized reliably by cy.request).
      cy.apiRequestWithSession('POST', USER_ENDPOINTS.AVATAR, {
        body: 'notAFile=x',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.error).to.eq('BAD_REQUEST')
        expect(res.body.message).to.eq('No file provided')
      })
    })
  })
})
