import constants from '../../../fixtures/app-constants.json'

const EP = constants.endpoints
const HR_ZONES = EP.running_user.hr_zones
const ACTIVITIES = EP.running_manual.activities
const PRODUCTS = EP.product.list
const FEES = EP.trading_fee.list
const NOTIFICATIONS = EP.notifications.list
const USER = EP.user.profile
const PAGE = constants.routes.inventory
const PNG_PATH = ACTIVITIES.replace(/activities$/, 'x.png')

const SAMPLE_ROUTES = [
  ['running hr-zones', HR_ZONES],
  ['running activities', ACTIVITIES],
  ['inventory products', PRODUCTS],
  ['trading fees', FEES],
  ['notifications', NOTIFICATIONS],
  ['user profile', USER],
]

const b64urlEncode = (obj) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const b64urlDecode = (str) => {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '=')))
}

const rebuild = (token, { header, payload }) => {
  const [h, p, s] = token.split('.')
  return [header ? b64urlEncode(header) : h, payload ? b64urlEncode(payload) : p, s].join('.')
}

const shape = (body) => {
  const out = { top: Object.keys(body || {}).sort() }
  if (body?.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
    out.data = Object.keys(body.data).sort()
  }
  return out
}

const expectUnauthorizedJson = (res) => {
  expect(res.status).to.eq(401)
  expect(res.headers['content-type']).to.include('application/json')
  expect(res.body).to.have.property('error')
  expect(res.body).to.have.property('message')
}

describe('Bearer auth API — session and token setup', () => {
  let session

  before(() => {
    cy.getBearerSession().then((s) => {
      session = s
    })
  })

  describe('valid Bearer matches the cookie session', () => {
    SAMPLE_ROUTES.forEach(([name, url]) => {
      it(`${name}: 200 with the same body shape as the cookie session`, () => {
        cy.apiRequestBearer('GET', url, { token: session.access_token }).then((bearerRes) => {
          expect(bearerRes.status).to.eq(200)
          expect(bearerRes.headers['content-type']).to.include('application/json')
          expect(bearerRes.headers).to.not.have.property('set-cookie')

          cy.setupApiAuthCookies()
          cy.apiRequestWithSession('GET', url).then((cookieRes) => {
            expect(cookieRes.status).to.eq(200)
            expect(shape(bearerRes.body)).to.deep.eq(shape(cookieRes.body))
          })
        })
      })
    })

    it('accepts a lowercase scheme', () => {
      cy.apiRequestBearer('GET', HR_ZONES, {
        authorization: `bearer ${session.access_token}`,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })
  })

  describe('missing or invalid token returns 401 JSON', () => {
    SAMPLE_ROUTES.forEach(([name, url]) => {
      it(`${name}: no Authorization header is 401 JSON, not a redirect`, () => {
        cy.apiRequestBearer('GET', url).then((res) => {
          expectUnauthorizedJson(res)
          expect(res.headers).to.not.have.property('location')
        })
      })

      it(`${name}: fake token is 401 JSON`, () => {
        cy.apiRequestBearer('GET', url, { token: 'aaaa.bbbb.cccc' }).then(expectUnauthorizedJson)
      })
    })

    it('refresh token used as Bearer is 401', () => {
      cy.apiRequestBearer('GET', HR_ZONES, { token: session.refresh_token }).then(
        expectUnauthorizedJson
      )
    })

    it('Basic scheme is 401', () => {
      cy.apiRequestBearer('GET', HR_ZONES, {
        authorization: `Basic ${session.access_token}`,
      }).then(expectUnauthorizedJson)
    })

    it('two tokens in one header are 401', () => {
      cy.apiRequestBearer('GET', HR_ZONES, {
        authorization: `Bearer ${session.access_token}, Bearer ${session.access_token}`,
      }).then(expectUnauthorizedJson)
    })

    it('token only in the query string is 401', () => {
      cy.apiRequestBearer('GET', HR_ZONES, { qs: { access_token: session.access_token } }).then(
        expectUnauthorizedJson
      )
    })

    it('token with an exp moved to the past (signature kept) is 401', () => {
      const payload = b64urlDecode(session.access_token.split('.')[1])
      const forged = rebuild(session.access_token, {
        payload: { ...payload, exp: Math.floor(Date.now() / 1000) - 3600 },
      })
      cy.apiRequestBearer('GET', HR_ZONES, { token: forged }).then(expectUnauthorizedJson)
    })

    it('token with an unknown kid is 401', () => {
      const header = b64urlDecode(session.access_token.split('.')[0])
      const forged = rebuild(session.access_token, {
        header: { ...header, kid: '00000000-0000-0000-0000-000000000000' },
      })
      cy.apiRequestBearer('GET', HR_ZONES, { token: forged }).then(expectUnauthorizedJson)
    })

    it('HS256 header is 401', () => {
      const header = b64urlDecode(session.access_token.split('.')[0])
      const forged = rebuild(session.access_token, { header: { ...header, alg: 'HS256' } })
      cy.apiRequestBearer('GET', HR_ZONES, { token: forged }).then(expectUnauthorizedJson)
    })
  })

  describe('Bearer and cookie together', () => {
    it('bad Bearer + good cookie session is 401 (Bearer wins, no fallback)', () => {
      cy.setupApiAuthCookies()
      cy.getCookies().then((cookies) => {
        expect(cookies.some((c) => c.name.endsWith('-auth-token'))).to.eq(true)
      })
      cy.apiRequestBearer('GET', HR_ZONES, { token: 'aaaa.bbbb.cccc', keepCookies: true }).then(
        expectUnauthorizedJson
      )
    })

    it('good Bearer + garbage cookie is 200', () => {
      cy.env(['SUPABASE_PROJECT_REF']).then(({ SUPABASE_PROJECT_REF }) => {
        cy.clearCookies()
        cy.setCookie(`sb-${SUPABASE_PROJECT_REF}-auth-token`, 'garbage-not-a-session')
        cy.apiRequestBearer('GET', HR_ZONES, {
          token: session.access_token,
          keepCookies: true,
        }).then((res) => {
          expect(res.status).to.eq(200)
        })
      })
    })
  })

  describe('pages stay cookie-only', () => {
    it('page with a valid Bearer only redirects to /login', () => {
      cy.apiRequestBearer('GET', PAGE, { token: session.access_token }).then((res) => {
        expect(res.status).to.be.oneOf([302, 307, 308])
        expect(res.headers.location).to.include('/login')
      })
    })
  })

  describe('forged x-auth-source header', () => {
    it('is not trusted on a normal route (no auth)', () => {
      cy.apiRequestBearer('GET', HR_ZONES, { headers: { 'x-auth-source': 'bearer' } }).then(
        expectUnauthorizedJson
      )
    })

    it('is not trusted on an /api path ending in .png (no auth)', () => {
      cy.apiRequestBearer('GET', PNG_PATH, { headers: { 'x-auth-source': 'bearer' } }).then(
        expectUnauthorizedJson
      )
    })

    it('forged header + forged x-pathname + bad Bearer is 401', () => {
      cy.apiRequestBearer('GET', HR_ZONES, {
        token: 'aaaa.bbbb.cccc',
        headers: { 'x-auth-source': 'bearer', 'x-pathname': '/api/x' },
      }).then(expectUnauthorizedJson)
    })
  })

  describe('PUT /api/user with Bearer', () => {
    let original

    before(() => {
      cy.apiRequestBearer('GET', USER, { token: session.access_token }).then((res) => {
        expect(res.status).to.eq(200)
        original = res.body.data.user
      })
    })

    after(() => {
      cy.apiRequestBearer('PUT', USER, {
        token: session.access_token,
        body: { nickname: original.nickname },
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it('empty object is 200', () => {
      cy.apiRequestBearer('PUT', USER, { token: session.access_token, body: {} }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it('unknown key is 400', () => {
      cy.apiRequestBearer('PUT', USER, {
        token: session.access_token,
        body: { role: 'admin' },
      }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('error')
      })
    })

    it('javascript: avatar is 400', () => {
      cy.apiRequestBearer('PUT', USER, {
        token: session.access_token,
        body: { avatar: 'javascript:alert(1)' },
      }).then((res) => {
        expect(res.status).to.eq(400)
      })
    })

    it('invalid JSON is 400', () => {
      cy.apiRequestBearer('PUT', USER, {
        token: session.access_token,
        headers: { 'Content-Type': 'application/json' },
        body: '{not json',
      }).then((res) => {
        expect(res.status).to.eq(400)
      })
    })

    it('PUT without a token is 401', () => {
      cy.apiRequestBearer('PUT', USER, { body: { nickname: 'x' } }).then(expectUnauthorizedJson)
    })

    it('valid nickname is 200 and reads back', () => {
      const nickname = `bearer-qa-${Date.now()}`.slice(0, 50)
      cy.apiRequestBearer('PUT', USER, { token: session.access_token, body: { nickname } }).then(
        (res) => {
          expect(res.status).to.eq(200)
        }
      )
      cy.apiRequestBearer('GET', USER, { token: session.access_token }).then((res) => {
        expect(res.body.data.user.nickname).to.eq(nickname)
      })
    })
  })

  describe('cross-user ownership', () => {
    const otherId = Cypress.env('OTHER_USER_ACTIVITY_ID')

    it("another user's activity id is 404 with Bearer and with the cookie session", function () {
      if (!otherId) {
        cy.log('OTHER_USER_ACTIVITY_ID not set, skipping')
        this.skip()
      }
      cy.apiRequestBearer('GET', `${ACTIVITIES}/${otherId}`, { token: session.access_token }).then(
        (res) => {
          expect(res.status).to.eq(404)
          expect(res.body).to.not.have.property('data')
        }
      )
      cy.setupApiAuthCookies()
      cy.apiRequestWithSession('GET', `${ACTIVITIES}/${otherId}`).then((res) => {
        expect(res.status).to.eq(404)
      })
    })
  })
})
