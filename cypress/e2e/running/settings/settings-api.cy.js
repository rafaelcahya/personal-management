// API spec — Settings menu.
//   GET   /api/running/v1/user/settings           (#199, #171)
//   PATCH /api/running/v1/user/settings           (#199, #171)
//   POST  /api/running/v1/user/push-subscription  (#135)
//   POST  /api/running/v1/sync/strava             (#392)
//   GET   /api/running/v1/sync/status             (#392)
//   GET   /api/running/v1/auth/strava/callback    (#392)

import constants from '../../../fixtures/app-constants.json'

const SETTINGS_EP = constants.endpoints.running_user.settings

describe('User Settings API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('User Settings API — GET response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data object and message OK', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains all notification toggle fields', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('notify_post_activity')
      expect(data).to.have.property('notify_weekly_review')
      expect(data).to.have.property('notify_friday_prep')
      expect(data).to.have.property('notify_anomaly')
      expect(data).to.have.property('notify_race_reminder')
    })
  })

  it('notify_race_reminder is a boolean', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.notify_race_reminder).to.be.a('boolean')
    })
  })

  it('data contains hr_zones_method field', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('hr_zones_method')
      expect(['max_hr', 'karvonen', 'threshold']).to.include(res.body.data.hr_zones_method)
    })
  })
})

describe('User Settings API — PATCH notify_race_reminder (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when setting notify_race_reminder to false', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: false },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(false)
    })
  })

  it('returns 200 when setting notify_race_reminder to true', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(true)
    })
  })

  it('returns 422 when notify_race_reminder is not a boolean', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: 'yes' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when hr_zones_method is invalid', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { hr_zones_method: 'invalid_method' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 200 with updated message on valid PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Settings updated')
    })
  })
})

describe('Push Subscription API — POST (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('valid subscription object → 200 with push_notifications_enabled: true', () => {
    cy.postPushSubscription({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
        keys: {
          p256dh: 'fake-p256dh-key-for-testing',
          auth: 'fake-auth-key',
        },
      },
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('push_notifications_enabled', true)
    })
  })

  it('{ subscription: null } → 200 with push_notifications_enabled: false', () => {
    cy.postPushSubscription({ subscription: null }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('push_notifications_enabled', false)
    })
  })

  it('subscription without keys → 400 validation error', () => {
    // keys.p256dh and keys.auth are required — endpoint alone is not a valid subscription
    cy.postPushSubscription({
      subscription: {
        endpoint: 'https://test.push/endpoint',
      },
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Push Subscription API — POST (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie present', () => {
    cy.postPushSubscriptionNoAuth({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
        keys: { p256dh: 'fake-p256dh', auth: 'fake-auth' },
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Sync API — GET /api/running/v1/sync/status (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with connected=false and last_sync_at=null when Strava not connected', () => {
    cy.getSyncStatus().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('connected', false)
      expect(res.body).to.have.property('last_sync_at', null)
    })
  })

  it('response body has connected as boolean and last_sync_at as string or null', () => {
    cy.getSyncStatus().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.connected).to.be.a('boolean')
      const lastSync = res.body.last_sync_at
      expect(lastSync === null || typeof lastSync === 'string').to.be.true
    })
  })
})

describe('Sync API — GET /api/running/v1/auth/strava/callback (OAuth redirect)', () => {
  // Middleware bypasses this route (public OAuth callback) — auth only needed for token exchange
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('redirects to settings error URL when code param is missing', () => {
    cy.getStravaCallback().then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('settings')
      expect(res.headers.location).to.include('error=strava_auth')
    })
  })

  it('redirects to settings error URL when code is invalid', () => {
    cy.getStravaCallback({ code: 'invalid_code_12345' }).then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('settings')
      expect(res.headers.location).to.include('error=strava_auth')
    })
  })
})

describe('Sync API — Unauthenticated access (no session)', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('POST /sync/strava returns 401 with error field when no session cookie', () => {
    cy.postSyncStravaNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('GET /sync/status returns 401 with error field when no session cookie', () => {
    cy.getSyncStatusNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})
