import { TEST_IDS } from '../../../fixtures/test-ids.js'

const ACT_IDS = TEST_IDS.running_activity_detail
const ACTIVITY_ID = 'test-activity-cadence-enhance'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Test Cadence Run',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-06-01T06:00:00Z',
  distance_m: 10000,
  moving_time_sec: 3600,
  duration_sec: 3660,
  avg_pace_sec_per_km: 360,
  avg_hr: null,
  avg_cadence: 86,
  historical_avg_cadence: 172,
  elevation_gain_m: 50,
  calories: 600,
  pr_count: 0,
  workout_type: null,
  summary_polyline: null,
  gear: null,
  zones: null,
}

// Cadence stream: 8 points — first 25% avg ~180 spm, last 25% avg ~168 spm → drop = 12 spm
const cadenceStreamData = {
  meta: {
    has_hr: false,
    has_cadence: true,
    has_altitude: false,
    total_points: 8,
    returned_points: 8,
    resolution: '10s',
  },
  data: [
    { dist_m: 0, cadence: 180, pace: 360 },
    { dist_m: 1000, cadence: 182, pace: 358 },
    { dist_m: 2500, cadence: 178, pace: 360 },
    { dist_m: 3500, cadence: 176, pace: 362 },
    { dist_m: 5000, cadence: 174, pace: 365 },
    { dist_m: 6500, cadence: 172, pace: 368 },
    { dist_m: 8000, cadence: 166, pace: 370 },
    { dist_m: 10000, cadence: 168, pace: 372 },
  ],
}

// No-fatigue stream: first and last 25% within 5 spm of each other
const noFatigueStreamData = {
  meta: {
    has_hr: false,
    has_cadence: true,
    has_altitude: false,
    total_points: 8,
    returned_points: 8,
    resolution: '10s',
  },
  data: [
    { dist_m: 0, cadence: 175, pace: 360 },
    { dist_m: 1000, cadence: 176, pace: 360 },
    { dist_m: 2500, cadence: 177, pace: 360 },
    { dist_m: 3500, cadence: 175, pace: 360 },
    { dist_m: 5000, cadence: 174, pace: 360 },
    { dist_m: 6500, cadence: 174, pace: 360 },
    { dist_m: 8000, cadence: 173, pace: 360 },
    { dist_m: 10000, cadence: 172, pace: 360 },
  ],
}

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
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

const stubStreams = (streamData) => {
  cy.intercept('GET', `/api/running/v1/activities/*/streams*`, {
    statusCode: 200,
    body: streamData,
  }).as('getStreams')
}

const stubInsight = () => {
  cy.intercept('GET', '/api/running/v1/ai/insights*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getInsight')
}

const visitAndWait = () => {
  cy.viewport(1280, 720)
  cy.visit(DETAIL_URL)
  cy.wait('@getActivity')
  cy.wait('@getStreams')
}

// ─── Benchmark bands ─────────────────────────────────────────────────────────

describe('Cadence chart enhancements — benchmark bands', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(cadenceStreamData)
    stubInsight()
    visitAndWait()
  })

  it('cadence chart container is rendered', () => {
    cy.get(`#${ACT_IDS.stream_chart_cadence}`).should('exist')
  })

  it('Beginner benchmark band is rendered', () => {
    cy.get(`#${ACT_IDS.cadence_band_beginner}`).should('exist')
  })

  it('Recreational benchmark band is rendered', () => {
    cy.get(`#${ACT_IDS.cadence_band_recreational}`).should('exist')
  })

  it('Semi-athlete benchmark band is rendered', () => {
    cy.get(`#${ACT_IDS.cadence_band_semiathlete}`).should('exist')
  })

  it('Elite benchmark band is rendered', () => {
    cy.get(`#${ACT_IDS.cadence_band_elite}`).should('exist')
  })
})

// ─── Historical avg cadence line ─────────────────────────────────────────────

describe('Cadence chart enhancements — historical avg cadence line', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(cadenceStreamData)
    stubInsight()
    visitAndWait()
  })

  it('historical avg cadence reference line is rendered when data exists', () => {
    cy.get(`#${ACT_IDS.cadence_historical_avg_line}`).should('exist')
  })

  it('historical avg cadence label shows correct value', () => {
    cy.get(`#${ACT_IDS.stream_chart_cadence}`).within(() => {
      cy.contains('Your avg: 172 spm').should('exist')
    })
  })

  it('historical avg cadence line is not rendered when historicalAvgCadence is null', () => {
    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        activity: { ...baseActivity, historical_avg_cadence: null },
        splits: [],
        laps: [],
        best_efforts: [],
        photos: [],
      },
    }).as('getActivityNoHist')
    cy.visit(DETAIL_URL)
    cy.wait('@getActivityNoHist')
    cy.get(`#${ACT_IDS.cadence_historical_avg_line}`).should('not.exist')
  })
})

// ─── Fatigue drop detection ───────────────────────────────────────────────────

describe('Cadence chart enhancements — fatigue drop detection', () => {
  it('fatigue region is rendered when cadence drops >5 spm in last 25%', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(cadenceStreamData)
    stubInsight()
    visitAndWait()

    cy.get(`#${ACT_IDS.cadence_fatigue_region}`).should('exist')
  })

  it('fatigue region is not rendered when cadence is stable (drop ≤5 spm)', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(noFatigueStreamData)
    stubInsight()
    visitAndWait()

    cy.get(`#${ACT_IDS.cadence_fatigue_region}`).should('not.exist')
  })
})

// ─── Stability score badge ────────────────────────────────────────────────────

describe('Cadence chart enhancements — stability score badge', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(cadenceStreamData)
    stubInsight()
    visitAndWait()
  })

  it('stability score badge is rendered near the chart title', () => {
    cy.get(`#${ACT_IDS.cadence_stability_score}`).should('exist')
  })

  it('stability score badge contains a numeric value', () => {
    cy.get(`#${ACT_IDS.cadence_stability_score}`)
      .invoke('text')
      .should('match', /Stability:\s*\d+/)
  })

  it('stability score value is between 0 and 100', () => {
    cy.get(`#${ACT_IDS.cadence_stability_score}`)
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+)/)
        expect(match).to.not.be.null
        const score = parseInt(match[1], 10)
        expect(score).to.be.gte(0).and.lte(100)
      })
  })
})

// ─── Info tooltip ─────────────────────────────────────────────────────────────

describe('Cadence chart enhancements — info tooltip', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams(cadenceStreamData)
    stubInsight()
    visitAndWait()
  })

  it('info trigger button is rendered near the chart title', () => {
    cy.get(`#${ACT_IDS.cadence_info_trigger}`).should('exist')
  })

  it('info trigger is keyboard accessible (has aria-label)', () => {
    cy.get(`#${ACT_IDS.cadence_info_trigger}`).should('have.attr', 'aria-label')
  })

  it('info tooltip shows 180 spm guide text on hover', () => {
    cy.get(`#${ACT_IDS.cadence_info_trigger}`)
      .scrollIntoView()
      .then(($el) => {
        $el[0].dispatchEvent(
          new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            pointerType: 'mouse',
            pointerId: 1,
            isPrimary: true,
          })
        )
      })
    cy.wait(300)
    cy.get(`#${ACT_IDS.cadence_info_tooltip}`).should('exist')
  })
})
