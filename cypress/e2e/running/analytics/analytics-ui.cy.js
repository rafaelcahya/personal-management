import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { ROUTES } from '../../../fixtures/routes.js'

const IDS = TEST_IDS.running_analytics
const ANALYTICS_URL = ROUTES.running_analytics

// Shared stubs

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

const stubActivitiesWithHr = () => {
  const runs = Array.from({ length: 5 }, (_, i) => ({
    id: `act-${i}`,
    activity_type: 'Run',
    started_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    distance_m: 10000,
    moving_time_sec: 3600,
    duration_sec: 3660,
    avg_pace_sec_per_km: 360,
    avg_hr: 145,
    estimated_vo2max: 48 + i * 0.5,
    efficiency_factor: 1.18 + i * 0.01,
  }))
  cy.intercept('GET', '/api/running/v1/activities*', {
    statusCode: 200,
    body: { data: runs, meta: { total: runs.length, page: 1, limit: 200 } },
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

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(ANALYTICS_URL)
  cy.wait('@getActivities')
}

describe('Analytics UI — Auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(ANALYTICS_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

describe('Analytics UI — VO2max trend section (empty state)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('renders #vo2maxTrendSection', () => {
    cy.get(`#${IDS.vo2max_trend_section}`).should('exist')
  })

  // Updated 2026-05-31 (cypress-author): reflects new empty state copy from fix #63
  it('shows empty state copy when no HR data', () => {
    cy.get(`#${IDS.vo2max_trend_section}`)
      .scrollIntoView()
      .within(() => {
        cy.contains('Not enough VO₂max data yet').should('be.visible')
        cy.contains('Needs 3+ runs with a VO₂max estimate').should('be.visible')
      })
  })
})

describe('Analytics UI — VO2max trend section (with data)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesWithHr()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('renders #vo2maxTrendSection with chart content', () => {
    cy.get(`#${IDS.vo2max_trend_section}`).scrollIntoView().should('be.visible')
  })

  it('does not show empty state when ≥3 runs have VO2max data', () => {
    cy.get(`#${IDS.vo2max_trend_section}`).within(() => {
      cy.contains('Not enough VO₂max data yet').should('not.exist')
    })
  })
})

describe('Analytics UI — EF trend section (empty state)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('renders #efTrendSection', () => {
    cy.get(`#${IDS.ef_trend_section}`).should('exist')
  })

  // Updated 2026-05-31 (cypress-author): reflects new empty state copy from fix #63
  it('shows empty state copy when no EF data', () => {
    cy.get(`#${IDS.ef_trend_section}`)
      .scrollIntoView()
      .within(() => {
        cy.contains('Not enough Efficiency Factor data yet').should('be.visible')
        cy.contains('Needs 3+ runs with an Efficiency Factor').should('be.visible')
      })
  })
})

describe('Analytics UI — EF trend section (with data)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesWithHr()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('renders #efTrendSection with chart content', () => {
    cy.get(`#${IDS.ef_trend_section}`).scrollIntoView().should('be.visible')
  })

  it('does not show empty state when ≥3 runs have EF data', () => {
    cy.get(`#${IDS.ef_trend_section}`).within(() => {
      cy.contains('Not enough Efficiency Factor data yet').should('not.exist')
    })
  })
})
