import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_analytics
const ANALYTICS_URL = constants.routes.running_analytics
// ─── Shared stubs ────────────────────────────────────────────────────────────

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
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

// 5 activities with both estimated_vo2max and efficiency_factor — satisfies both trend charts
const makeActivities = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `act-${i}`,
    activity_type: 'Run',
    started_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    distance_m: 10000,
    moving_time_sec: 3600,
    avg_hr: 145,
    estimated_vo2max: 48 + i * 0.5,
    efficiency_factor: 1.18 + i * 0.01,
  }))

const stubActivities = (count) => {
  const runs = makeActivities(count)
  cy.intercept('GET', '/api/running/v1/activities*', {
    statusCode: 200,
    body: { data: runs, meta: { total: runs.length, page: 1, limit: 200 } },
  }).as('getActivities')
}

const stubActivitiesEmpty = () => {
  cy.intercept('GET', '/api/running/v1/activities*', {
    statusCode: 200,
    body: { data: [], meta: { total: 0, page: 1, limit: 200 } },
  }).as('getActivities')
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(ANALYTICS_URL)
  cy.wait('@getActivities')
}

// ─── VO2max Trend — data point count when chart renders ──────────────────────

describe('Qualifying run count — VO2max Trend (data exists)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivities(5)
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('shows data count subtext below the trend chart title', () => {
    cy.get(`#${IDS.vo2max_trend_data_count}`).scrollIntoView().should('exist')
  })

  it('data count text shows correct number of data points', () => {
    cy.get(`#${IDS.vo2max_trend_data_count}`)
      .scrollIntoView()
      .should('contain.text', 'Showing 5 data points from last 90 activities')
  })
})

// ─── VO2max Trend — count in empty state ─────────────────────────────────────

describe('Qualifying run count — VO2max Trend (empty state)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('empty state shows current count', () => {
    cy.get(`#${IDS.vo2max_trend_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Currently have 0')
  })

  it('empty state includes minimum and qualifying criteria', () => {
    cy.get(`#${IDS.vo2max_trend_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Need at least 3 runs with VO₂max estimates')
      .and('contain.text', 'Qualifying runs require 20+ min with HR data')
  })
})

// ─── EF Trend — data point count when chart renders ──────────────────────────

describe('Qualifying run count — EF Trend (data exists)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivities(5)
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('shows data count subtext below the EF chart title', () => {
    cy.get(`#${IDS.ef_trend_data_count}`).scrollIntoView().should('exist')
  })

  it('data count text shows correct number of data points', () => {
    cy.get(`#${IDS.ef_trend_data_count}`)
      .scrollIntoView()
      .should('contain.text', 'Showing 5 data points from last 90 activities')
  })
})

// ─── EF Trend — count in empty state ─────────────────────────────────────────

describe('Qualifying run count — EF Trend (empty state)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    visitAndWait()
  })

  it('empty state shows current count', () => {
    cy.get(`#${IDS.ef_trend_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Currently have 0')
  })

  it('empty state includes minimum and qualifying criteria', () => {
    cy.get(`#${IDS.ef_trend_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Need at least 3 runs with EF calculated')
      .and('contain.text', 'Qualifying runs require 20+ min with HR data')
  })
})
