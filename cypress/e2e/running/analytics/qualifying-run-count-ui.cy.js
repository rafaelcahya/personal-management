import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_analytics
const ANALYTICS_URL = constants.routes.running_analytics
const VO2MAX_STAT_ENDPOINT = '/api/running/v1/analytics/vo2max-stat'

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
    improvement_signal: false,
  }
  cy.intercept('GET', VO2MAX_STAT_ENDPOINT, {
    statusCode: 200,
    body: { data: { ...defaultData, ...overrides } },
  }).as('getVo2maxStat')
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

// ─── Current VO2max — sample size when data exists ───────────────────────────

describe('Qualifying run count — Current VO2max (data exists)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat({ sample_size: 12 })
    visitAndWait()
  })

  it('shows sample size subtext below the stat', () => {
    cy.get(`#${IDS.vo2max_sample_size}`).scrollIntoView().should('exist')
  })

  it('sample size text shows correct count from API', () => {
    cy.get(`#${IDS.vo2max_sample_size}`)
      .scrollIntoView()
      .should('contain.text', 'Based on 12 qualifying runs (last 30 days)')
  })

  it('sample size uses singular "run" when count is 1', () => {
    stubVo2maxStat({ sample_size: 1 })
    cy.reload()
    cy.wait('@getActivities')
    cy.get(`#${IDS.vo2max_sample_size}`)
      .scrollIntoView()
      .should('contain.text', 'Based on 1 qualifying run (last 30 days)')
      .and('not.contain.text', 'runs')
  })
})

// ─── Current VO2max — count in empty state ────────────────────────────────────

describe('Qualifying run count — Current VO2max (empty state)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat({ empty: true, current: null, trend: null, delta: null, sample_size: 3 })
    visitAndWait()
  })

  it('empty state shows qualifying count from API', () => {
    cy.get(`#${IDS.vo2max_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Currently have 3 qualifying runs')
  })

  it('empty state includes the minimum threshold message', () => {
    cy.get(`#${IDS.vo2max_empty_count}`)
      .scrollIntoView()
      .should('contain.text', 'Need at least 5 runs with HR data in the last 30 days')
  })
})

// ─── VO2max Trend — data point count when chart renders ──────────────────────

describe('Qualifying run count — VO2max Trend (data exists)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivities(5)
    stubPerformanceTrends()
    stubDashboard()
    stubVo2maxStat()
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
    stubVo2maxStat()
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
    stubVo2maxStat()
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
    stubVo2maxStat()
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
