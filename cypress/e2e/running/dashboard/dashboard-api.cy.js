import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const DASHBOARD_API = RUNNING_ENDPOINTS.DASHBOARD
const GEAR_API = RUNNING_ENDPOINTS.GEAR_LIST
const PERFORMANCE_TRENDS_API = RUNNING_ENDPOINTS.PERFORMANCE_TRENDS

// ─── dashboard ─────────────────────────────────────────────────────────────────

describe('Running Dashboard API — GET /api/running/v1/dashboard', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data contains weekly_stats with current and prev blocks', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('weekly_stats')
      expect(data.weekly_stats).to.have.property('current')
      expect(data.weekly_stats).to.have.property('prev')

      const { current } = data.weekly_stats
      expect(current).to.have.property('distance_m')
      expect(current).to.have.property('duration_sec')
      expect(current).to.have.property('count')
      expect(current).to.have.property('avg_pace_sec_per_km')
    })
  })

  it('response data contains training_load with acwr, acute_load_7d, chronic_load_28d, status', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { training_load } = res.body.data
      expect(training_load).to.have.property('acwr')
      expect(training_load).to.have.property('acute_load_7d')
      expect(training_load).to.have.property('chronic_load_28d')
      expect(training_load).to.have.property('status')
      expect(training_load.status).to.be.oneOf(['no_data', 'low', 'optimal', 'caution', 'danger'])
    })
  })

  it('response data contains recent_activities as an array', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('recent_activities')
      expect(res.body.data.recent_activities).to.be.an('array')
    })
  })

  it('response data contains calendar_activities as an array', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('calendar_activities')
      expect(res.body.data.calendar_activities).to.be.an('array')
    })
  })

  it('response data contains health_today with logged boolean', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { health_today } = res.body.data
      expect(health_today).to.have.property('logged')
      expect(health_today.logged).to.be.a('boolean')
    })
  })

  it('weekly_stats current distance_m and duration_sec are integers', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      const { current } = res.body.data.weekly_stats
      expect(Number.isInteger(current.distance_m)).to.eq(true)
      expect(Number.isInteger(current.duration_sec)).to.eq(true)
    })
  })
})

describe('Running Dashboard API — Unauthenticated access (no session)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 with no session cookie', () => {
    cy.request({
      method: 'GET',
      url: DASHBOARD_API,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })
})

// ─── gear ──────────────────────────────────────────────────────────────────────

describe('Running Gear API — GET /api/running/v1/gear', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array when authenticated', () => {
    cy.request({ method: 'GET', url: GEAR_API }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each gear item has required fields: id, name, distance_m, retired', () => {
    cy.request({ method: 'GET', url: GEAR_API }).then((res) => {
      expect(res.status).to.eq(200)
      const items = res.body.data
      if (items.length === 0) {
        cy.log('No gear items found — skipping field assertions')
        return
      }
      items.forEach((item) => {
        expect(item).to.have.property('id')
        expect(item).to.have.property('name')
        expect(item).to.have.property('distance_m')
        expect(item).to.have.property('retired')
      })
    })
  })

  it('each gear item has optional limit fields: category, retirement_km, notification_distance_m', () => {
    cy.request({ method: 'GET', url: GEAR_API }).then((res) => {
      expect(res.status).to.eq(200)
      const items = res.body.data
      if (items.length === 0) {
        cy.log('No gear items found — skipping field assertions')
        return
      }
      items.forEach((item) => {
        expect(item).to.have.any.keys('category', 'retirement_km', 'notification_distance_m')
      })
    })
  })
})

describe('Running Gear API — GET /api/running/v1/gear — Unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.request({ method: 'GET', url: GEAR_API, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Running Gear API — PATCH /api/running/v1/gear', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with updated gear object when patching category and retirement_km', () => {
    cy.request({ method: 'GET', url: GEAR_API }).then((getRes) => {
      expect(getRes.status).to.eq(200)
      const items = getRes.body.data
      if (items.length === 0) {
        cy.log('No gear items available — skipping PATCH test')
        return
      }

      const gearId = items[0].id
      cy.request({
        method: 'PATCH',
        url: GEAR_API,
        body: { id: gearId, category: 'daily', retirement_km: 800 },
      }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        expect(patchRes.body).to.have.property('data')
        expect(patchRes.body.data).to.have.property('id', gearId)
      })
    })
  })
})

describe('Running Gear API — PATCH /api/running/v1/gear — Unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated on PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: GEAR_API,
      body: { id: 'some-id', category: 'tempo' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── performance trends ────────────────────────────────────────────────────────

describe('Running Performance Trends API — GET /api/running/v1/performance-trends', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array when authenticated', () => {
    cy.request({ method: 'GET', url: PERFORMANCE_TRENDS_API }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each item in data has started_at and distance_m fields', () => {
    cy.request({ method: 'GET', url: PERFORMANCE_TRENDS_API }).then((res) => {
      expect(res.status).to.eq(200)
      const items = res.body.data
      if (items.length === 0) {
        cy.log('No performance trend items — skipping field assertions')
        return
      }
      items.forEach((item) => {
        expect(item).to.have.property('started_at')
        expect(item).to.have.property('distance_m')
      })
    })
  })

  it('?limit=20 param is accepted and returns at most 20 items', () => {
    cy.request({ method: 'GET', url: `${PERFORMANCE_TRENDS_API}?limit=20` }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.be.lte(20)
    })
  })

  it('?type=Run filter param is accepted and returns 200', () => {
    cy.request({ method: 'GET', url: `${PERFORMANCE_TRENDS_API}?type=Run` }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.request({ method: 'GET', url: PERFORMANCE_TRENDS_API, failOnStatusCode: false }).then(
      (res) => {
        expect(res.status).to.eq(401)
      }
    )
  })
})
