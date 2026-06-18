// API spec — Settings menu.
//   GET   /api/running/v1/user/settings           (#199, #171)
//   PATCH /api/running/v1/user/settings           (#199, #171)
//   POST  /api/running/v1/user/push-subscription  (#135)
//   POST  /api/running/v1/sync/strava             (#392)
//   GET   /api/running/v1/sync/status             (#392)
//   GET   /api/running/v1/auth/strava/callback    (#392)
//   GET   /api/running/v1/user/strava-status      (#119)
//   POST  /api/running/v1/sync/webhook            (#119)

// ─── user settings ────────────────────────────────────────────────────────────

describe('User Settings API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when no session cookie is set', () => {
    cy.getUserSettingsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH returns 401 when no session cookie is set', () => {
    cy.patchUserSettingsNoAuth({ notify_race_reminder: true }).then((res) => {
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
    cy.getUserSettings().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains all notification toggle fields', () => {
    cy.getUserSettings().then((res) => {
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
    cy.getUserSettings().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.notify_race_reminder).to.be.a('boolean')
    })
  })

  it('data contains hr_zones_method field', () => {
    cy.getUserSettings().then((res) => {
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
    cy.patchUserSettings({ notify_race_reminder: false }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(false)
    })
  })

  it('returns 200 when setting notify_race_reminder to true', () => {
    cy.patchUserSettings({ notify_race_reminder: true }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(true)
    })
  })

  it('returns 422 when notify_race_reminder is not a boolean', () => {
    cy.patchUserSettings({ notify_race_reminder: 'yes' }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when hr_zones_method is invalid', () => {
    cy.patchUserSettings({ hr_zones_method: 'invalid_method' }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 200 with updated message on valid PATCH', () => {
    cy.patchUserSettings({ notify_race_reminder: true }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Settings updated')
    })
  })
})

// ─── push subscription ────────────────────────────────────────────────────────

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

// ─── sync status / strava oauth ───────────────────────────────────────────────

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

// ─── strava status ────────────────────────────────────────────────────────────

describe('Strava Status API — GET (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with correct response shape', () => {
    cy.getStravaStatus().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'OK')
      expect(res.body).to.have.property('data')

      const { data } = res.body
      expect(data).to.have.property('connected').that.is.a('boolean')
      expect(data).to.have.property('needs_reconnect').that.is.a('boolean')

      const athleteId = data.athlete_id
      expect(athleteId === null || typeof athleteId === 'number').to.be.true

      const lastSync = data.last_sync_at
      expect(lastSync === null || typeof lastSync === 'string').to.be.true
    })
  })

  it('needs_reconnect defaults to false when Strava not connected', () => {
    cy.getStravaStatus().then((res) => {
      expect(res.status).to.eq(200)
      // Test user has no Strava connected — needs_reconnect must be false (not true)
      expect(res.body.data.needs_reconnect).to.eq(false)
    })
  })
})

describe('Strava Status API — GET (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 with error field when no session cookie', () => {
    cy.getStravaStatusNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── strava webhook ───────────────────────────────────────────────────────────

describe('Strava Webhook API — HMAC signature verification', () => {
  const webhookPayload = {
    aspect_type: 'create',
    object_id: 999999,
    object_type: 'activity',
    owner_id: 1,
  }

  it('returns 401 when x-hub-signature header is missing', () => {
    cy.postStravaWebhook({ 'Content-Type': 'application/json' }, webhookPayload).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 401 when x-hub-signature has wrong value', () => {
    cy.postStravaWebhook(
      {
        'Content-Type': 'application/json',
        'x-hub-signature':
          'sha256=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
      webhookPayload
    ).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 401 when x-hub-signature format is invalid', () => {
    cy.postStravaWebhook(
      {
        'Content-Type': 'application/json',
        'x-hub-signature': 'not-a-valid-signature-format',
      },
      webhookPayload
    ).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})
