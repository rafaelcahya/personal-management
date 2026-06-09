import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ACTIVITY_ID = 'test-ui-activity-001'
const DETAIL_URL = `${ROUTES.running_activities}/${ACTIVITY_ID}`
const AI_EP = RUNNING_ENDPOINTS.AI_INSIGHTS_LIST

const T = TEST_IDS.running_activity_detail

// A real encoded polyline for Leaflet to decode (small triangle in Jakarta area)
const ENCODED_POLYLINE = 'a`s_Fy_nfS??'

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Morning Run',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-05-26T06:00:00Z',
  distance_m: 10000,
  moving_time_sec: 3000,
  duration_sec: 3060,
  avg_pace_sec_per_km: 300,
  avg_hr: 145,
  max_hr: 168,
  avg_cadence: 85,
  elevation_gain_m: 50,
  calories: 600,
  pr_count: 0,
  workout_type: null,
  summary_polyline: ENCODED_POLYLINE,
  gear: null,
  device_name: null,
  notes: null,
  weather_summary: null,
  zones: null,
  efficiency_factor: null,
  estimated_vo2max: null,
  aerobic_decoupling: null,
  avg_temp_c: null,
}

// ── Shared stubs ────────────────────────────────────────────────────

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubActivity = (overrides = {}) => {
  cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
    statusCode: 200,
    body: {
      activity: { ...baseActivity, ...overrides },
      splits: [],
      laps: [],
      best_efforts: [],
      photos: [],
    },
  }).as('getActivity')
}

const stubDashboard = () => {
  cy.intercept('GET', '/api/running/v1/dashboard', {
    statusCode: 200,
    body: {
      data: {
        training_load: { next_race_goal: null },
        weekly_stats: null,
        ytd_stats: null,
        recent_activities: [],
        health_checkin: null,
      },
    },
  }).as('getDashboard')
}

const stubRaceLog = () => {
  cy.intercept('GET', '/api/running/v1/race-log*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getRaceLog')
}

const stubStreams = () => {
  cy.intercept('GET', '/api/running/v1/activities/*/streams*', {
    statusCode: 200,
    body: {
      meta: {
        has_hr: false,
        has_cadence: false,
        has_altitude: false,
        total_points: 0,
        returned_points: 0,
        resolution: '10s',
      },
      data: [],
    },
  }).as('getStreams')
}

const stubInsightEmpty = () => {
  cy.intercept('GET', `${AI_EP}*`, { statusCode: 200, body: { data: [] } }).as('getInsight')
}

const stubHealthNull = () => {
  cy.intercept('GET', '/api/running/v1/health/subjective*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getHealth')
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(DETAIL_URL)
  cy.wait('@getActivity')
}

const setupCommon = () => {
  cy.setupApiAuthCookies()
  stubRtUsers()
  stubDashboard()
  stubRaceLog()
  stubStreams()
  stubInsightEmpty()
  stubHealthNull()
}

// ── Suite A: Toggle visibility, placement, aria-pressed ─────────────

describe('Map Style Toggle — A: Toggle visibility and aria-pressed state', () => {
  beforeEach(() => {
    setupCommon()
    stubActivity()
    visitAndWait()
  })

  it('renders map style toggle when activity has a polyline', () => {
    cy.get(`#${T.map_style_toggle}`).scrollIntoView().should('exist')
  })

  it('Map button has aria-pressed=true by default (initial style is map)', () => {
    cy.get(`#${T.map_style_map_btn}`).scrollIntoView().should('have.attr', 'aria-pressed', 'true')
  })

  it('Satellite button has aria-pressed=false by default', () => {
    cy.get(`#${T.map_style_satellite_btn}`)
      .scrollIntoView()
      .should('have.attr', 'aria-pressed', 'false')
  })

  it('clicking Satellite sets aria-pressed=true on Satellite and false on Map', () => {
    cy.get(`#${T.map_style_satellite_btn}`).scrollIntoView().click()
    cy.get(`#${T.map_style_satellite_btn}`).should('have.attr', 'aria-pressed', 'true')
    cy.get(`#${T.map_style_map_btn}`).should('have.attr', 'aria-pressed', 'false')
  })

  it('clicking Map after Satellite restores Map aria-pressed=true', () => {
    cy.get(`#${T.map_style_satellite_btn}`).scrollIntoView().click()
    cy.get(`#${T.map_style_map_btn}`).scrollIntoView().click()
    cy.get(`#${T.map_style_map_btn}`).should('have.attr', 'aria-pressed', 'true')
    cy.get(`#${T.map_style_satellite_btn}`).should('have.attr', 'aria-pressed', 'false')
  })
})

// ── Suite B: Expanded modal dialog, Escape key, style sync ──────────

describe('Map Style Toggle — B: Expanded modal dialog', () => {
  beforeEach(() => {
    setupCommon()
    stubActivity()
    visitAndWait()
  })

  it('clicking the expand button opens the route map dialog', () => {
    cy.get('[aria-label="Expand map"]').scrollIntoView().click()
    cy.get('[role="dialog"][aria-modal="true"]').should('exist')
  })

  it('expanded modal contains a map style toggle in its footer', () => {
    cy.get('[aria-label="Expand map"]').scrollIntoView().click()
    cy.get('[role="dialog"][aria-modal="true"]').within(() => {
      cy.get(`#${T.map_style_toggle}`).should('exist')
    })
  })

  it('pressing Escape closes the expanded modal', () => {
    cy.get('[aria-label="Expand map"]').scrollIntoView().click()
    cy.get('[role="dialog"][aria-modal="true"]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role="dialog"][aria-modal="true"]').should('not.exist')
  })

  it('style toggle selection in modal is synced with the inline toggle', () => {
    cy.get(`#${T.map_style_satellite_btn}`).scrollIntoView().click()
    cy.get('[aria-label="Expand map"]').scrollIntoView().click()
    cy.get('[role="dialog"][aria-modal="true"]').within(() => {
      cy.get(`#${T.map_style_satellite_btn}`).should('have.attr', 'aria-pressed', 'true')
    })
  })
})

// ── Suite C: No-polyline fallback — toggle must not render ───────────

describe('Map Style Toggle — C: No polyline fallback (no GPS data)', () => {
  beforeEach(() => {
    setupCommon()
    stubActivity({ summary_polyline: null })
    visitAndWait()
  })

  it('does not render map style toggle when polyline is null', () => {
    cy.get(`#${T.map_style_toggle}`).should('not.exist')
  })

  it('does not render the expand map button when polyline is null', () => {
    cy.get('[aria-label="Expand map"]').should('not.exist')
  })
})

// ── Suite D: Regression — toggle IDs present (issue #172) ───────────

describe('Map Style Toggle — D: Regression — all toggle IDs present', () => {
  beforeEach(() => {
    setupCommon()
    stubActivity()
    visitAndWait()
  })

  it('both Map and Satellite button IDs exist on the page', () => {
    cy.get(`#${T.map_style_map_btn}`).scrollIntoView().should('exist')
    cy.get(`#${T.map_style_satellite_btn}`).scrollIntoView().should('exist')
  })

  it('Map button contains visible label text "Map"', () => {
    cy.get(`#${T.map_style_map_btn}`).scrollIntoView().should('contain.text', 'Map')
  })

  it('Satellite button contains visible label text "Satellite"', () => {
    cy.get(`#${T.map_style_satellite_btn}`).scrollIntoView().should('contain.text', 'Satellite')
  })
})
