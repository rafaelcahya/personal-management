// Covers: StreamCharts component on the Activity Detail page
//   /main/running/activities/:id — loading, happy path, empty, error, retry,
//   partial data, accessibility

import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_activity_detail
const ACTIVITY_ID = 'test-activity-id-stream'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const activityFixture = {
  activity: {
    id: ACTIVITY_ID,
    name: 'Morning Run',
    activity_type: 'Run',
    source: 'strava',
    started_at: '2026-05-26T06:00:00Z',
    distance_m: 10000,
    moving_time_sec: 3600,
    duration_sec: 3650,
    avg_pace_sec_per_km: 360,
    avg_hr: 145,
    max_hr: 168,
    avg_cadence: 82,
    elevation_gain_m: 50,
    calories: 600,
    pr_count: 0,
    workout_type: null,
    summary_polyline: null,
    gear: null,
    device_name: null,
    notes: null,
    weather_summary: null,
  },
  splits: [],
  laps: [],
  best_efforts: [],
  photos: [],
}

const dashboardFixture = {
  training_load: { next_race_goal: null },
  weekly_stats: null,
  ytd_stats: null,
  recent_activities: [],
  health_checkin: null,
}

const streamFixture = {
  meta: {
    has_hr: true,
    has_cadence: true,
    has_altitude: true,
    total_points: 300,
    returned_points: 30,
    resolution: '10s',
  },
  data: [
    { t: 0, dist_m: 0, dist_km: 0, hr: 140, cadence: 160, alt: 10, pace: 340 },
    { t: 10, dist_m: 50, dist_km: 0.05, hr: 145, cadence: 162, alt: 11, pace: 335 },
    { t: 20, dist_m: 100, dist_km: 0.1, hr: 148, cadence: 164, alt: 12, pace: 330 },
  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubActivity = () => {
  cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
    statusCode: 200,
    body: activityFixture,
  }).as('getActivity')
}

const stubDashboard = () => {
  cy.intercept('GET', '/api/running/v1/dashboard', {
    statusCode: 200,
    body: { data: dashboardFixture },
  }).as('getDashboard')
}

const stubStreams = (body, statusCode = 200) => {
  cy.intercept('GET', `/api/running/v1/activities/*/streams*`, {
    statusCode,
    body,
  }).as('getStreams')
}

// ---------------------------------------------------------------------------
// A. Auth guard
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Auth Guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(DETAIL_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

// ---------------------------------------------------------------------------
// B. Loading state
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Loading state', () => {
  it('shows stream charts skeleton while fetch is in-flight', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()

    cy.intercept('GET', `/api/running/v1/activities/*/streams*`, (req) => {
      req.reply((res) => {
        res.setDelay(800)
        res.send({ statusCode: 200, body: streamFixture })
      })
    }).as('getStreamsDelayed')

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)

    cy.get(`#${IDS.stream_charts_loading}`).should('exist')
  })
})

// ---------------------------------------------------------------------------
// C. Happy path — all three charts render
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Happy path', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams(streamFixture)
    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')
  })

  it('shows the performance section after data loads', () => {
    cy.get(`#${IDS.stream_charts_section}`).should('exist')
  })

  it('renders the pace chart', () => {
    cy.get(`#${IDS.stream_chart_pace}`).should('exist')
  })

  it('renders the HR chart when has_hr is true', () => {
    cy.get(`#${IDS.stream_chart_hr}`).should('exist')
  })

  it('renders the elevation chart when has_altitude is true', () => {
    cy.get(`#${IDS.stream_chart_elevation}`).should('exist')
  })

  it('sr-only description is present for screen readers', () => {
    cy.get(`#${IDS.stream_charts_section}`).find('.sr-only').should('exist')
  })
})

// ---------------------------------------------------------------------------
// D. Empty state
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Empty state', () => {
  it('shows empty state when stream data is empty', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams({
      meta: {
        has_hr: false,
        has_cadence: false,
        has_altitude: false,
        total_points: 0,
        returned_points: 0,
        resolution: '10s',
      },
      data: [],
    })

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_charts_empty}`).should('exist')
    cy.get(`#${IDS.stream_chart_pace}`).should('not.exist')
    cy.get(`#${IDS.stream_chart_hr}`).should('not.exist')
    cy.get(`#${IDS.stream_chart_elevation}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// E. Error state & retry
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Error state', () => {
  it('shows error state when stream fetch fails', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams({ error: 'Internal server error' }, 500)

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_charts_error}`).should('exist')
  })

  it('retry button refetches and shows charts on success', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()

    // First request fails
    cy.intercept('GET', `/api/running/v1/activities/*/streams*`, {
      statusCode: 500,
      body: { error: 'error' },
    }).as('getStreamsFail')

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreamsFail')

    cy.get(`#${IDS.stream_charts_error}`).should('exist')

    // Stub success for retry
    stubStreams(streamFixture)

    cy.get(`#${IDS.stream_charts_retry}`).click()
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_charts_section}`).should('exist')
  })
})

// ---------------------------------------------------------------------------
// F. Partial data
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Partial data', () => {
  it('hides HR chart when has_hr is false', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams({
      meta: {
        has_hr: false,
        has_cadence: false,
        has_altitude: true,
        total_points: 3,
        returned_points: 3,
        resolution: '10s',
      },
      data: [
        { t: 0, dist_m: 0, dist_km: 0, hr: null, cadence: null, alt: 10, pace: 340 },
        { t: 10, dist_m: 50, dist_km: 0.05, hr: null, cadence: null, alt: 11, pace: 335 },
      ],
    })

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_chart_hr}`).should('not.exist')
    cy.get(`#${IDS.stream_chart_pace}`).should('exist')
    cy.get(`#${IDS.stream_chart_elevation}`).should('exist')
  })

  it('hides elevation chart when has_altitude is false', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams({
      meta: {
        has_hr: true,
        has_cadence: false,
        has_altitude: false,
        total_points: 3,
        returned_points: 3,
        resolution: '10s',
      },
      data: [
        { t: 0, dist_m: 0, dist_km: 0, hr: 140, cadence: null, alt: null, pace: 340 },
        { t: 10, dist_m: 50, dist_km: 0.05, hr: 145, cadence: null, alt: null, pace: 335 },
      ],
    })

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_chart_elevation}`).should('not.exist')
    cy.get(`#${IDS.stream_chart_pace}`).should('exist')
    cy.get(`#${IDS.stream_chart_hr}`).should('exist')
  })
})

// ---------------------------------------------------------------------------
// G. Accessibility
// ---------------------------------------------------------------------------

describe('Activity Detail StreamCharts — Accessibility', () => {
  it('loading skeleton has aria-label', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()

    cy.intercept('GET', `/api/running/v1/activities/*/streams*`, (req) => {
      req.reply((res) => {
        res.setDelay(800)
        res.send({ statusCode: 200, body: streamFixture })
      })
    }).as('getStreamsDelayed')

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)

    cy.get(`#${IDS.stream_charts_loading}`).should('have.attr', 'aria-label')
  })

  it('error container has role="alert"', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubStreams({ error: 'fail' }, 500)

    cy.viewport(1280, 720)
    cy.visit(DETAIL_URL)
    cy.wait('@getStreams')

    cy.get(`#${IDS.stream_charts_error}`).should('have.attr', 'role', 'alert')
  })
})
