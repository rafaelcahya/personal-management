// API spec — Settings menu.
//   GET   /api/running/v1/user/settings           (#199, #171)
//   PATCH /api/running/v1/user/settings           (#199, #171)
//   POST  /api/running/v1/user/push-subscription  (#135)
//   POST  /api/running/v1/sync/strava             (#392)
//   GET   /api/running/v1/sync/status             (#392)
//   GET   /api/running/v1/auth/strava/callback    (#392, #845)
//   GET   /api/running/v1/auth/strava/connect     (#845)
//   POST  /api/running/v1/auth/strava/{sync,disconnect,re-enrich} (#845)
//   GET|POST|PATCH|DELETE /api/running/v1/health/{subjective,weight}[/:id] (#845)
//   GET|PATCH /api/running/v1/user/hr-zones, GET user/threshold-pace-detect (#845)
//   PATCH /api/running/v1/user/profile, DELETE user/activities (#845)
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

  it('returns 400 when notify_race_reminder is not a boolean', () => {
    cy.patchUserSettings({ notify_race_reminder: 'yes' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 400 when hr_zones_method is invalid', () => {
    cy.patchUserSettings({ hr_zones_method: 'invalid_method' }).then((res) => {
      expect(res.status).to.eq(400)
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

describe('Strava OAuth callback — state and missing code (never reaches Strava)', () => {
  // The callback is a public route; every case below is rejected before any token exchange.
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('redirects to settings error URL when code param is missing', () => {
    cy.getStravaCallbackNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('settings')
      expect(res.headers.location).to.include('error=strava_auth')
    })
  })

  it('redirects with error=strava_state when a code arrives without the state cookie', () => {
    cy.getStravaCallbackNoAuth({ code: 'cypress_fake_code', state: 'cypress_fake_state' }).then(
      (res) => {
        expect(res.status).to.be.oneOf([302, 307])
        expect(res.headers.location).to.include('settings')
        expect(res.headers.location).to.include('error=strava_state')
      }
    )
  })

  it('redirects with error=strava_state when the state param is missing', () => {
    cy.getStravaCallbackNoAuth({ code: 'cypress_fake_code' }).then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('error=strava_state')
    })
  })
})

describe('Strava OAuth callback — state cookie issued by connect', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('rejects a state that does not match the cookie and clears the cookie', () => {
    cy.getStravaConnect().then(() => {
      cy.getStravaCallback({ code: 'cypress_fake_code', state: 'not_the_issued_state' }).then(
        (res) => {
          expect(res.status).to.be.oneOf([302, 307])
          expect(res.headers.location).to.include('error=strava_state')
          const cookies = [].concat(res.headers['set-cookie'] || []).join(';')
          expect(cookies).to.include('strava_oauth_state=')
          expect(cookies).to.match(/Max-Age=0|Expires=Thu, 01 Jan 1970/i)
        }
      )
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

// ─── health logs (subjective + weight) ────────────────────────────────────────

const SEED_TAG = 'cypress-845-seed'
const MALFORMED_ID = 'not-a-uuid'

const HEALTH_KINDS = {
  subjective: {
    createBody: { log_date: '2001-03-14', sleep_hours: 7.5, notes: SEED_TAG },
    status: 200,
    patchBody: { sleep_hours: 6 },
    patchField: 'sleep_hours',
    patchValue: 6,
    invalidCreate: [
      { log_date: 'bad-date' },
      { log_date: '2001-03-14', morning_energy: 9 },
      { log_date: '2001-03-14', sleep_quality: 'great' },
      {},
    ],
    invalidPatch: [{ morning_energy: 9 }, {}],
  },
  weight: {
    createBody: { measured_at: '2001-03-14T06:00:00.000Z', weight_kg: 67.5, notes: SEED_TAG },
    status: 201,
    patchBody: { weight_kg: 66 },
    patchField: 'weight_kg',
    patchValue: 66,
    invalidCreate: [
      { measured_at: 'bad-date', weight_kg: 67 },
      { measured_at: '2001-03-14T06:00:00.000Z', weight_kg: 5 },
      { measured_at: '2001-03-14T06:00:00.000Z' },
      {},
    ],
    invalidPatch: [{ weight_kg: 5 }, {}],
  },
}

Object.entries(HEALTH_KINDS).forEach(([kind, cfg]) => {
  describe(`Health ${kind} API — auth guard`, () => {
    beforeEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
    })

    it('GET list returns 401 without a session', () => {
      cy.getHealthLogsNoAuth(kind).then((res) => {
        expect(res.status).to.eq(401)
      })
    })

    it('POST returns 401 without a session', () => {
      cy.postHealthLogNoAuth(kind, cfg.createBody).then((res) => {
        expect(res.status).to.eq(401)
      })
    })

    it('PATCH and DELETE on [id] return 401 without a session', () => {
      const id = crypto.randomUUID()
      cy.patchHealthLogNoAuth(kind, id, cfg.patchBody).then((res) => {
        expect(res.status).to.eq(401)
      })
      cy.deleteHealthLogNoAuth(kind, id).then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })

  describe(`Health ${kind} API — create, read, update, delete`, () => {
    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    after(() => {
      cy.deleteSeededHealthLogsInDb()
    })

    it('creates a log, lists it inside a from/to window, patches it, then deletes it', () => {
      cy.postHealthLog(kind, cfg.createBody).then((created) => {
        expect(created.status).to.eq(cfg.status)
        const row = created.body.data
        expect(row).to.have.property('id').that.is.a('string')
        expect(row.notes).to.eq(SEED_TAG)
        const id = row.id

        cy.getHealthLogs(kind, { from: '2001-03-01', to: '2001-03-31' }).then((list) => {
          expect(list.status).to.eq(200)
          expect(list.body.data).to.be.an('array')
          expect(list.body).to.have.property('total').that.is.a('number')
          expect(list.body).to.have.property('page', 1)
          expect(list.body.data.map((r) => r.id)).to.include(id)
        })

        cy.patchHealthLog(kind, id, cfg.patchBody).then((patched) => {
          expect(patched.status).to.eq(200)
          expect(patched.body.data.id).to.eq(id)
          expect(Number(patched.body.data[cfg.patchField])).to.eq(cfg.patchValue)
        })

        cy.deleteHealthLog(kind, id).then((del) => {
          expect(del.status).to.eq(204)
        })

        cy.getHealthLogFromDb(kind, id).then((dbRow) => {
          expect(dbRow).to.eq(null)
        })

        cy.deleteHealthLog(kind, id).then((again) => {
          expect(again.status).to.eq(404)
        })
      })
    })

    it('returns 404 for a well-formed id that does not exist', () => {
      const id = crypto.randomUUID()
      cy.patchHealthLog(kind, id, cfg.patchBody).then((res) => {
        expect(res.status).to.eq(404)
      })
      cy.deleteHealthLog(kind, id).then((res) => {
        expect(res.status).to.eq(404)
      })
    })
  })

  describe(`Health ${kind} API — validation (400)`, () => {
    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    it('POST rejects invalid bodies with 400 and an issues array', () => {
      cfg.invalidCreate.forEach((body) => {
        cy.postHealthLog(kind, body).then((res) => {
          expect(res.status, JSON.stringify(body)).to.eq(400)
          expect(res.body).to.have.property('error', 'Validation failed')
          expect(res.body).to.have.property('issues')
        })
      })
    })

    it('PATCH rejects invalid or empty bodies with 400', () => {
      const id = crypto.randomUUID()
      cfg.invalidPatch.forEach((body) => {
        cy.patchHealthLog(kind, id, body).then((res) => {
          expect(res.status, JSON.stringify(body)).to.eq(400)
          expect(res.body).to.have.property('error', 'Validation failed')
        })
      })
    })

    it('PATCH and DELETE reject a malformed id with 400', () => {
      cy.patchHealthLog(kind, MALFORMED_ID, cfg.patchBody).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('message', 'Invalid id')
      })
      cy.deleteHealthLog(kind, MALFORMED_ID).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('message', 'Invalid id')
      })
    })

    it('GET list rejects bad page, limit, from, to and from after to with 400', () => {
      const badQueries = [
        { page: 0 },
        { page: 'abc' },
        { page: 1.5 },
        { limit: 0 },
        { limit: 'abc' },
        { from: 'garbage' },
        { to: '2001-13-45' },
        { from: '2001-12-31', to: '2001-01-01' },
      ]
      badQueries.forEach((qs) => {
        cy.getHealthLogs(kind, qs).then((res) => {
          expect(res.status, JSON.stringify(qs)).to.eq(400)
          expect(res.body).to.have.property('error', 'Validation failed')
        })
      })
    })

    it('GET list clamps limit above 100 and treats empty params as omitted', () => {
      cy.getHealthLogs(kind, { limit: 1000 }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.limit).to.eq(100)
      })
      cy.getHealthLogs(kind, { page: '', limit: '', from: '', to: '' }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.page).to.eq(1)
        expect(res.body.limit).to.eq(30)
      })
    })

    it('GET list returns an empty page, not an error, when page is past the last row', () => {
      cy.getHealthLogs(kind, { page: 9999 }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data).to.be.an('array').that.is.empty
      })
    })
  })
})

// ─── strava: connect, disconnected state, seeded needs_reconnect ──────────────

describe('Strava auth routes — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('connect, sync, re-enrich and disconnect return 401 without a session', () => {
    cy.getStravaConnectNoAuth().then((res) => expect(res.status).to.eq(401))
    cy.postStravaAuthSyncNoAuth().then((res) => expect(res.status).to.eq(401))
    cy.postStravaReEnrichNoAuth().then((res) => expect(res.status).to.eq(401))
    cy.postStravaDisconnectNoAuth().then((res) => expect(res.status).to.eq(401))
  })
})

describe('Strava connect — redirect only, no Strava call', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('redirects to the Strava authorize URL with a state param and sets the state cookie', () => {
    cy.getStravaConnect().then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      const location = new URL(res.headers.location)
      expect(location.origin + location.pathname).to.eq('https://www.strava.com/oauth/authorize')
      const state = location.searchParams.get('state')
      expect(state).to.match(/^[0-9a-f]{64}$/)
      expect(location.searchParams.get('response_type')).to.eq('code')
      expect(location.searchParams.get('redirect_uri')).to.include('/auth/strava/callback')

      const cookie = []
        .concat(res.headers['set-cookie'] || [])
        .find((c) => c.startsWith('strava_oauth_state='))
      expect(cookie, 'state cookie').to.be.a('string')
      expect(cookie).to.include(`strava_oauth_state=${state}`)
      expect(cookie).to.match(/HttpOnly/i)
      expect(cookie).to.include('Path=/api/running/v1/auth/strava')
      expect(cookie).to.match(/Max-Age=600/i)
    })
  })

  it('issues a different state on every call', () => {
    cy.getStravaConnect().then((first) => {
      cy.getStravaConnect().then((second) => {
        const a = new URL(first.headers.location).searchParams.get('state')
        const b = new URL(second.headers.location).searchParams.get('state')
        expect(a).to.not.eq(b)
      })
    })
  })
})

describe('Strava auth routes — not connected', () => {
  // Guard first: disconnect deletes credentials, so these only run when the test user has none.
  beforeEach(function () {
    cy.setupApiAuthCookies()
    cy.getStravaCredentialsFromDb().then((creds) => {
      if (creds) {
        cy.log('Test user already has Strava credentials - skipping')
        this.skip()
      }
    })
  })

  it('sync returns 400 Strava not connected', () => {
    cy.postStravaAuthSync().then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error', 'Strava not connected')
    })
  })

  it('re-enrich returns 400 Strava not connected', () => {
    cy.postStravaReEnrich().then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error', 'Strava not connected')
    })
  })

  it('disconnect returns 404 Strava not connected', () => {
    cy.postStravaDisconnect().then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('message', 'Strava not connected')
    })
  })
})

describe('Strava auth routes — seeded needs_reconnect credentials', () => {
  // Seeds a fake row (athlete_id 990000845, junk tokens) and refuses to overwrite a real one.
  before(() => {
    cy.seedStravaCredentialsInDb(true)
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.deleteSeededStravaCredentialsInDb()
  })

  it('sync returns 409 with needs_reconnect true', () => {
    cy.postStravaAuthSync().then((res) => {
      expect(res.status).to.eq(409)
      expect(res.body).to.have.property('needs_reconnect', true)
      expect(res.body).to.have.property('error')
      expect(res.body).to.have.property('message')
    })
  })

  it('strava-status reports connected with needs_reconnect true', () => {
    cy.getStravaStatus().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.connected).to.eq(true)
      expect(res.body.data.needs_reconnect).to.eq(true)
    })
  })

  it('disconnect removes the seeded row and a second disconnect returns 404', () => {
    cy.postStravaDisconnect().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Disconnected')
    })
    cy.getStravaCredentialsFromDb().then((creds) => {
      expect(creds).to.eq(null)
    })
    cy.postStravaDisconnect().then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── hr-zones, threshold pace, profile, delete activities ─────────────────────

describe('HR zones, threshold pace, profile and delete-activities — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('all return 401 without a session', () => {
    cy.getHrZonesNoAuth().then((res) => expect(res.status).to.eq(401))
    cy.patchHrZonesNoAuth({ max_hr: 190 }).then((res) => expect(res.status).to.eq(401))
    cy.getThresholdPaceDetectNoAuth().then((res) => expect(res.status).to.eq(401))
    cy.deleteAllUserActivitiesNoAuth({ confirmation: 'DELETE' }).then((res) =>
      expect(res.status).to.eq(401)
    )
    cy.patchUserProfileNoAuth({ display_name: 'x' }).then((res) => expect(res.status).to.eq(401))
  })
})

describe('HR zones API — read, validation, update and restore', () => {
  let original

  beforeEach(() => {
    cy.setupApiAuthCookies()
    if (!original) {
      cy.getHrZones().then((res) => {
        original = res.body.data
      })
    }
  })

  // The test user's HR values are put back to exactly what they were before the run.
  after(() => {
    cy.setupApiAuthCookies()
    if (original) {
      cy.patchHrZones({
        max_hr: original.max_hr,
        resting_hr_baseline: original.resting_hr_baseline,
        threshold_hr: original.threshold_hr,
        hr_zones_method: original.hr_zones_method,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    }
  })

  it('GET returns the four HR fields', () => {
    cy.getHrZones().then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.all.keys(
        'max_hr',
        'resting_hr_baseline',
        'threshold_hr',
        'hr_zones_method'
      )
      expect(['max_hr', 'karvonen', 'threshold']).to.include(data.hr_zones_method)
    })
  })

  it('PATCH rejects an empty body with 400', () => {
    cy.patchHrZones({}).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error', 'Validation failed')
      expect(res.body).to.have.property('message')
    })
  })

  it('PATCH rejects out-of-range values and an unknown method with 400', () => {
    const bodies = [
      { max_hr: 300 },
      { max_hr: 'abc' },
      { threshold_hr: 50 },
      { hr_zones_method: 'bogus' },
    ]
    bodies.forEach((body) => {
      cy.patchHrZones(body).then((res) => {
        expect(res.status, JSON.stringify(body)).to.eq(400)
      })
    })
  })

  it('PATCH cross-field checks return 400 with a top-level message', () => {
    cy.patchHrZones({ max_hr: 80, resting_hr_baseline: 100 }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Resting HR must be lower than max HR')
    })
    cy.patchHrZones({ max_hr: 150, threshold_hr: 160 }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Threshold HR must not exceed max HR')
    })
  })

  it('PATCH updates the values, GET returns them, then the originals are restored', () => {
    const update = {
      max_hr: 191,
      resting_hr_baseline: 51,
      threshold_hr: 171,
      hr_zones_method: 'karvonen',
    }
    cy.patchHrZones(update).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'HR zones updated')
    })
    cy.getHrZones().then((res) => {
      expect(res.body.data).to.deep.include(update)
    })
    cy.then(() => {
      cy.patchHrZones({
        max_hr: original.max_hr,
        resting_hr_baseline: original.resting_hr_baseline,
        threshold_hr: original.threshold_hr,
        hr_zones_method: original.hr_zones_method,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
      cy.getHrZones().then((res) => {
        expect(res.body.data).to.deep.eq(original)
      })
    })
  })
})

describe('Threshold pace detect API', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 422 when no threshold HR is set (route still on 422), else 200 or 404', () => {
    cy.getHrZones().then((zones) => {
      cy.getThresholdPaceDetect().then((res) => {
        if (zones.body.data.threshold_hr === null) {
          expect(res.status).to.eq(422)
          expect(res.body).to.have.property('error', 'No threshold HR set')
        } else {
          cy.log('Threshold HR is set and streams are not seeded here, accepting 200 or 404')
          expect(res.status).to.be.oneOf([200, 404])
        }
      })
    })
  })
})

describe('User profile API — validation (400)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('PATCH rejects invalid bodies with 400', () => {
    const bodies = [
      {},
      { display_name: '' },
      { height_cm: -5 },
      { birth_date: '15/06/1994' },
      { sex: 'other' },
      { max_hr: 80, resting_hr_baseline: 100 },
    ]
    bodies.forEach((body) => {
      cy.patchUserProfile(body).then((res) => {
        expect(res.status, JSON.stringify(body)).to.eq(400)
        expect(res.body).to.have.property('error', 'Validation failed')
      })
    })
  })
})

describe('Delete all activities API — confirmation guard (no deletion path)', () => {
  // The success path wipes every activity of the logged-in user, and the test account owns
  // real rows, so only requests that must be rejected are sent here.
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('rejects a missing or wrong confirmation with 400 and deletes nothing', () => {
    cy.getActivityCountFromDb().then((before) => {
      const bodies = [
        undefined,
        {},
        { confirmation: 'delete' },
        { confirmation: 'yes' },
        { confirmation: 1 },
      ]
      bodies.forEach((body) => {
        cy.deleteAllUserActivities(body).then((res) => {
          expect(res.status, JSON.stringify(body)).to.eq(400)
        })
      })
      cy.deleteAllUserActivities({}).then((res) => {
        expect(res.body).to.have.property('message', 'Type DELETE to confirm')
        expect(res.body).to.have.property('issues')
      })
      cy.getActivityCountFromDb().then((after) => {
        expect(after).to.eq(before)
      })
    })
  })
})
