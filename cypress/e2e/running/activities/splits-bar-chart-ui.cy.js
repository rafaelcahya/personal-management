// UI spec: SplitsSection bar chart + view toggle on activity detail page.
// Issue: #164 (splits bar chart view with GAP, EF, pacing insights)
//
// AUTH STRATEGY: cy.setupApiAuthCookies() + stubs per block.

import constants from '../../../fixtures/app-constants.json'

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('ServiceWorker') ||
    err.message.includes('serviceWorker') ||
    err.message.includes('sw.js')
  ) {
    return false
  }
})

const IDS = constants.test_ids.running_activity_detail
const ACTIVITY_ID = 'test-splits-activity-001'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`

const makeSplit = (n, paceSec, hrOverride, elevGain = 0) => ({
  id: `split-${n}`,
  split_number: n,
  distance_m: 1000,
  duration_sec: paceSec,
  pace_sec_per_km: paceSec,
  avg_hr: hrOverride ?? null,
  elevation_gain_m: elevGain,
})

const makePartialSplit = (n, distM, paceSec) => ({
  id: `split-partial-${n}`,
  split_number: n,
  distance_m: distM,
  duration_sec: Math.round(paceSec * (distM / 1000)),
  pace_sec_per_km: paceSec,
  avg_hr: null,
  elevation_gain_m: 0,
})

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Test Run',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-01-10T07:00:00Z',
  distance_m: 5000,
  moving_time_sec: 1500,
  duration_sec: 1500,
  avg_pace_sec_per_km: 300,
  avg_hr: 145,
  max_hr: 165,
  avg_cadence: 85,
  elevation_gain_m: 10,
  calories: 400,
  pr_count: 0,
  workout_type: null,
  summary_polyline: null,
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

// ---------------------------------------------------------------------------
// Shared stubs
// ---------------------------------------------------------------------------

const stubPageDeps = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user', onboarding_complete: true }],
  }).as('rtUsersCheck')

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

  cy.intercept('GET', '/api/running/v1/race-log*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getRaceLog')

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

  cy.intercept('GET', '/api/running/v1/ai/insights*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getInsights')

  cy.intercept('GET', '/api/running/v1/health/subjective*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getHealth')
}

const stubActivity = (splits = []) => {
  cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
    statusCode: 200,
    body: {
      activity: baseActivity,
      splits,
      laps: [],
      best_efforts: [],
      photos: [],
    },
  }).as('getActivity')
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(DETAIL_URL)
  cy.wait('@getActivity')
}

// ---------------------------------------------------------------------------
// A. No splits — section hidden
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — no splits data', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity([])
    visitAndWait()
  })

  it('does not render #splitsSection_activityDetailPage when splits are empty', () => {
    cy.get(`#${IDS.splits_section}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// B. Default view — bar chart renders
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — default bar view', () => {
  const splits = [
    makeSplit(1, 290, 140),
    makeSplit(2, 300, 145),
    makeSplit(3, 310, 150),
    makeSplit(4, 305, 148),
    makeSplit(5, 295, 143),
  ]

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity(splits)
    visitAndWait()
  })

  it('renders #splitsSection_activityDetailPage', () => {
    cy.get(`#${IDS.splits_section}`).scrollIntoView().should('be.visible')
  })

  it('bar view is the default — bar chart is visible', () => {
    cy.get(`#${IDS.splits_bar_chart}`).scrollIntoView().should('be.visible')
  })

  it('Bar toggle button is aria-pressed=true by default', () => {
    cy.get(`#${IDS.splits_view_bar_btn}`)
      .scrollIntoView()
      .should('have.attr', 'aria-pressed', 'true')
  })

  it('Table toggle button is aria-pressed=false by default', () => {
    cy.get(`#${IDS.splits_view_table_btn}`)
      .scrollIntoView()
      .should('have.attr', 'aria-pressed', 'false')
  })

  it('renders metric selector tabs: Pace, Time, GAP, EF', () => {
    cy.get(`#${IDS.splits_metric_pace}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.splits_metric_time}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.splits_metric_gap}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.splits_metric_ef}`).scrollIntoView().should('be.visible')
  })

  it('Pace metric tab is active by default', () => {
    cy.get(`#${IDS.splits_metric_pace}`).scrollIntoView().should('have.class', 'bg-violet-600')
  })
})

// ---------------------------------------------------------------------------
// C. HR metric tab — only shown when HR data exists
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — HR tab visibility', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
  })

  it('HR tab is visible when splits have avg_hr', () => {
    stubActivity([makeSplit(1, 300, 145), makeSplit(2, 305, 150)])
    visitAndWait()
    cy.get(`#${IDS.splits_metric_hr}`).scrollIntoView().should('be.visible')
  })

  it('HR tab is not rendered when splits have no avg_hr', () => {
    stubActivity([makeSplit(1, 300, null), makeSplit(2, 305, null)])
    visitAndWait()
    cy.get(`#${IDS.splits_metric_hr}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// D. View toggle — switch to table view
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — view toggle', () => {
  const splits = [makeSplit(1, 290, 140), makeSplit(2, 300, 145), makeSplit(3, 310, 150)]

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity(splits)
    visitAndWait()
  })

  it('clicking Table toggle hides bar chart', () => {
    cy.get(`#${IDS.splits_view_table_btn}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_bar_chart}`).should('not.exist')
  })

  it('clicking Table toggle shows table rows', () => {
    cy.get(`#${IDS.splits_view_table_btn}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_section}`)
      .scrollIntoView()
      .within(() => {
        cy.contains('Pace').should('be.visible')
        cy.contains('Time').should('be.visible')
      })
  })

  it('clicking Bar toggle after Table restores the bar chart', () => {
    cy.get(`#${IDS.splits_view_table_btn}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_view_bar_btn}`).click()
    cy.get(`#${IDS.splits_bar_chart}`).should('exist')
  })
})

// ---------------------------------------------------------------------------
// E. Pacing strategy chip
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — pacing strategy chip', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
  })

  it('shows Negative split chip when 2nd half is significantly faster', () => {
    // 1st half avg ~320, 2nd half avg ~290 → clearly negative
    stubActivity([
      makeSplit(1, 320, null),
      makeSplit(2, 320, null),
      makeSplit(3, 290, null),
      makeSplit(4, 290, null),
    ])
    visitAndWait()
    cy.get(`#${IDS.splits_pacing_chip}`).scrollIntoView().should('contain.text', 'Negative split')
  })

  it('shows Positive split chip when 2nd half is significantly slower', () => {
    // 1st half avg ~280, 2nd half avg ~320 → clearly positive (>3%)
    stubActivity([
      makeSplit(1, 280, null),
      makeSplit(2, 280, null),
      makeSplit(3, 320, null),
      makeSplit(4, 320, null),
    ])
    visitAndWait()
    cy.get(`#${IDS.splits_pacing_chip}`).scrollIntoView().should('contain.text', 'Positive split')
    cy.get(`#${IDS.splits_pace_fade}`).scrollIntoView().should('exist')
  })

  it('shows Even split chip when splits are close', () => {
    stubActivity([
      makeSplit(1, 300, null),
      makeSplit(2, 300, null),
      makeSplit(3, 300, null),
      makeSplit(4, 300, null),
    ])
    visitAndWait()
    cy.get(`#${IDS.splits_pacing_chip}`).scrollIntoView().should('contain.text', 'Even split')
  })
})

// ---------------------------------------------------------------------------
// F. Partial split — lower opacity
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — partial split handling', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity([
      makeSplit(1, 300, null),
      makeSplit(2, 305, null),
      makeSplit(3, 295, null),
      makePartialSplit(4, 250, 300),
    ])
    visitAndWait()
  })

  it('renders bar chart with partial split present', () => {
    cy.get(`#${IDS.splits_bar_chart}`).scrollIntoView().should('be.visible')
  })

  it('legend shows Partial indicator when a partial split exists', () => {
    cy.get(`#${IDS.splits_bar_chart}`)
      .scrollIntoView()
      .parents()
      .first()
      .parent()
      .within(() => {
        cy.contains('Partial').should('exist')
      })
  })
})

// ---------------------------------------------------------------------------
// G. Cardiac drift — visible in both views
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — cardiac drift visibility', () => {
  const splitsWithHr = [makeSplit(1, 300, 140), makeSplit(2, 300, 145), makeSplit(3, 300, 155)]

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity(splitsWithHr)
    visitAndWait()
  })

  it('shows cardiac drift in bar view', () => {
    cy.get(`#${IDS.splits_cardiac_drift}`).scrollIntoView().should('be.visible')
  })

  it('shows cardiac drift in table view', () => {
    cy.get(`#${IDS.splits_view_table_btn}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_cardiac_drift}`).should('be.visible')
  })

  it('cardiac drift shows correct bpm value (+15 bpm: 140→155)', () => {
    cy.get(`#${IDS.splits_cardiac_drift}`).scrollIntoView().should('contain.text', '+15 bpm')
  })
})

// ---------------------------------------------------------------------------
// H. Metric switching
// ---------------------------------------------------------------------------

describe('Splits Bar Chart — metric selector switching', () => {
  const splits = [makeSplit(1, 290, 140), makeSplit(2, 300, 145), makeSplit(3, 310, 150)]

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubPageDeps()
    stubActivity(splits)
    visitAndWait()
  })

  it('clicking Time metric tab activates it', () => {
    cy.get(`#${IDS.splits_metric_time}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_metric_time}`).should('have.class', 'bg-violet-600')
    cy.get(`#${IDS.splits_metric_pace}`).should('not.have.class', 'bg-violet-600')
  })

  it('clicking GAP metric tab activates it', () => {
    cy.get(`#${IDS.splits_metric_gap}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_metric_gap}`).should('have.class', 'bg-violet-600')
  })

  it('clicking EF metric tab activates it', () => {
    cy.get(`#${IDS.splits_metric_ef}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_metric_ef}`).should('have.class', 'bg-violet-600')
  })

  it('clicking HR metric tab activates it when HR data exists', () => {
    cy.get(`#${IDS.splits_metric_hr}`).scrollIntoView().click()
    cy.get(`#${IDS.splits_metric_hr}`).should('have.class', 'bg-violet-600')
  })
})
