// Covers: CurrentVo2maxStat tile — analytics page
//   Issues: #67 (backend /api/running/v1/analytics/vo2max-stat), #68 (frontend component)
//
// AUTH STRATEGY:
//   - Section A: API contract tests use cy.request() with a real session token.
//   - Sections B-I: UI tests use cy.setupApiAuthCookies() + stubs.
//   - vo2max-stat endpoint is stubbed in every UI describe block so the page
//     controls exactly what data the component renders.

import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_analytics
const ANALYTICS_URL = constants.routes.running_analytics
const VO2MAX_STAT_ENDPOINT = '/api/running/v1/analytics/vo2max-stat'

// ---------------------------------------------------------------------------
// Shared page stubs (other sections must load so the analytics page renders)
// ---------------------------------------------------------------------------

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubActivitiesEmpty = () => {
  cy.intercept('GET', '/api/running/v1/activities*', {
    statusCode: 200,
    body: { data: [], meta: { total: 0, page: 1, limit: 200 } },
  }).as('getActivities')
}

const stubPerformanceTrends = () => {
  cy.intercept('GET', '/api/running/v1/performance-trends*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getPerformanceTrends')
}

const stubDashboard = () => {
  cy.intercept('GET', '/api/running/v1/dashboard*', {
    statusCode: 200,
    body: {
      data: {
        weekly_stats: {
          current: { distance_m: 0, duration_sec: 0, count: 0, avg_pace_sec_per_km: null },
          prev: { distance_m: 0, duration_sec: 0, count: 0, avg_pace_sec_per_km: null },
        },
        training_load: {
          acwr: null,
          acute_load_7d: null,
          chronic_load_28d: null,
          status: 'no_data',
        },
        recent_activities: [],
        calendar_activities: [],
        health_today: { logged: false, data: null },
      },
    },
  }).as('getDashboard')
}

const stubVo2maxStat = (overrides = {}) => {
  const defaultData = {
    empty: false,
    current: 48.3,
    previous: 47.1,
    trend: 'up',
    delta: 1.2,
    sample_size: 12,
    category: 'Good',
    maintenance_status: 'ok',
    improvement_signal: true,
  }
  cy.intercept('GET', VO2MAX_STAT_ENDPOINT, {
    statusCode: 200,
    body: { data: { ...defaultData, ...overrides } },
  }).as('getVo2maxStat')
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(ANALYTICS_URL)
  cy.wait('@getActivities')
}

// ---------------------------------------------------------------------------
// A. API contract — authenticated 200 + response shape
// ---------------------------------------------------------------------------

describe('VO2max Stat API — contract (authenticated)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with correct top-level shape', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      const token = cookie?.value
      cy.request({
        method: 'GET',
        url: VO2MAX_STAT_ENDPOINT,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
      })
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: VO2MAX_STAT_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ---------------------------------------------------------------------------
// B. Loaded state — all 5 element IDs visible with correct text
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — loaded state (happy path)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat()
    visitAndWait()
  })

  it('renders #vo2maxStatSection', () => {
    cy.get(`#${IDS.vo2max_stat_section}`).scrollIntoView().should('be.visible')
  })

  it('shows current VO2max value', () => {
    cy.get(`#${IDS.current_vo2max}`)
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', '48.3')
  })

  it('shows trend arrow container', () => {
    cy.get(`#${IDS.vo2max_trend_arrow}`).scrollIntoView().should('be.visible')
  })

  it('shows category badge', () => {
    cy.get(`#${IDS.vo2max_category}`)
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', 'Good')
  })

  it('shows maintenance status — ok', () => {
    cy.get(`#${IDS.vo2max_maintenance_status}`)
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', 'Maintenance: OK')
  })

  it('shows improvement signal — true', () => {
    cy.get(`#${IDS.vo2max_improvement_signal}`)
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', 'Interval training detected')
  })
})

// ---------------------------------------------------------------------------
// C. Trend variations — up / down / flat
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — trend arrow variations', () => {
  const setupWith = (trendData) => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat(trendData)
    visitAndWait()
  }

  it('shows up arrow when trend is up', () => {
    setupWith({ trend: 'up', delta: 1.2 })
    cy.get(`#${IDS.vo2max_trend_arrow}`)
      .scrollIntoView()
      .within(() => {
        cy.get('[aria-label="Trending up"]').should('exist')
      })
  })

  it('shows down arrow when trend is down', () => {
    setupWith({ trend: 'down', delta: -0.8 })
    cy.get(`#${IDS.vo2max_trend_arrow}`)
      .scrollIntoView()
      .within(() => {
        cy.get('[aria-label="Trending down"]').should('exist')
      })
  })

  it('shows flat (minus) icon when trend is flat', () => {
    setupWith({ trend: 'flat', delta: 0 })
    cy.get(`#${IDS.vo2max_trend_arrow}`)
      .scrollIntoView()
      .within(() => {
        cy.get('[aria-label="Stable"]').should('exist')
      })
  })

  it('does not render trend arrow container when trend is null', () => {
    setupWith({ trend: null, delta: null })
    cy.get(`#${IDS.vo2max_trend_arrow}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// D. Maintenance status variations — ok / at_risk / null
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — maintenance status variations', () => {
  const setupWith = (overrides) => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat(overrides)
    visitAndWait()
  }

  it('shows "Maintenance: OK" when maintenance_status is ok', () => {
    setupWith({ maintenance_status: 'ok' })
    cy.get(`#${IDS.vo2max_maintenance_status}`)
      .scrollIntoView()
      .should('contain.text', 'Maintenance: OK')
  })

  it('shows "Maintenance: At risk" when maintenance_status is at_risk', () => {
    setupWith({ maintenance_status: 'at_risk' })
    cy.get(`#${IDS.vo2max_maintenance_status}`)
      .scrollIntoView()
      .should('contain.text', 'Maintenance: At risk')
  })

  it('shows fallback text when maintenance_status is null', () => {
    setupWith({ maintenance_status: null })
    cy.get(`#${IDS.vo2max_maintenance_status}`)
      .scrollIntoView()
      .should('contain.text', 'Set your max HR in profile to unlock maintenance tracking')
  })
})

// ---------------------------------------------------------------------------
// E. Improvement signal — true / false
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — improvement signal variations', () => {
  const setupWith = (overrides) => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat(overrides)
    visitAndWait()
  }

  it('shows "Interval training detected" when improvement_signal is true', () => {
    setupWith({ improvement_signal: true })
    cy.get(`#${IDS.vo2max_improvement_signal}`)
      .scrollIntoView()
      .should('contain.text', 'Interval training detected')
  })

  it('shows "No interval sessions in last 14d" when improvement_signal is false', () => {
    setupWith({ improvement_signal: false })
    cy.get(`#${IDS.vo2max_improvement_signal}`)
      .scrollIntoView()
      .should('contain.text', 'No interval sessions in last 14d')
  })
})

// ---------------------------------------------------------------------------
// F. Category null — vo2maxCategory_analyticsPage not in DOM
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — category null state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat({ category: null })
    visitAndWait()
  })

  it('does not render category badge when category is null', () => {
    cy.get(`#${IDS.vo2max_stat_section}`).scrollIntoView()
    cy.get(`#${IDS.vo2max_category}`).should('not.exist')
  })

  it('still renders VO2max value and other fields when category is null', () => {
    cy.get(`#${IDS.current_vo2max}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.vo2max_maintenance_status}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.vo2max_improvement_signal}`).scrollIntoView().should('be.visible')
  })
})

// ---------------------------------------------------------------------------
// G. Empty state — empty:true hides stat, shows message
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — empty state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    cy.intercept('GET', VO2MAX_STAT_ENDPOINT, {
      statusCode: 200,
      body: { data: { empty: true } },
    }).as('getVo2maxStat')
    visitAndWait()
  })

  it('does not render the VO2max stat number', () => {
    cy.get(`#${IDS.vo2max_stat_section}`).scrollIntoView()
    cy.get(`#${IDS.current_vo2max}`).should('not.exist')
  })

  it('shows the "Need more HR runs" message', () => {
    cy.get(`#${IDS.vo2max_stat_section}`)
      .scrollIntoView()
      .within(() => {
        cy.contains('Need more HR runs').should('be.visible')
      })
  })

  it('does not render category, maintenance, or improvement elements', () => {
    cy.get(`#${IDS.vo2max_stat_section}`).scrollIntoView()
    cy.get(`#${IDS.vo2max_category}`).should('not.exist')
    cy.get(`#${IDS.vo2max_maintenance_status}`).should('not.exist')
    cy.get(`#${IDS.vo2max_improvement_signal}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// H. Error state — 500 shows "Could not load VO2max data"
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — error state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    cy.intercept('GET', VO2MAX_STAT_ENDPOINT, {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getVo2maxStat')
    visitAndWait()
  })

  it('shows "Could not load VO2max data" error message', () => {
    cy.get(`#${IDS.vo2max_stat_section}`)
      .scrollIntoView()
      .within(() => {
        cy.contains('Could not load VO2max data').should('be.visible')
      })
  })

  it('does not render stat number in error state', () => {
    cy.get(`#${IDS.vo2max_stat_section}`).scrollIntoView()
    cy.get(`#${IDS.current_vo2max}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// I. Auth guard — unauthenticated page visit redirects to /login
// ---------------------------------------------------------------------------

describe('VO2max Stat UI — auth guard', () => {
  it('unauthenticated visit to analytics page redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(ANALYTICS_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})
