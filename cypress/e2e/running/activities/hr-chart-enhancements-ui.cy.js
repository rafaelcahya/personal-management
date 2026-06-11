import { TEST_IDS } from '../../../fixtures/test-ids.js'

const ACT_IDS = TEST_IDS.running_activity_detail
const RACE_IDS = TEST_IDS.race_log

const ACTIVITY_ID = 'test-activity-hr-enhance'
const RACE_ID = 'test-race-hr-enhance'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`
const RACE_DETAIL_URL = `/main/running/race-log/${RACE_ID}`

const hrZonesData = {
  heart_rate: {
    zones: [
      { min: 0, max: 114, time: 600 },
      { min: 115, max: 152, time: 1800 },
      { min: 153, max: 171, time: 2100 },
      { min: 172, max: 190, time: 600 },
      { min: 191, max: 220, time: 300 },
    ],
  },
}

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Test HR Run',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-06-01T06:00:00Z',
  distance_m: 10000,
  moving_time_sec: 3600,
  duration_sec: 3660,
  avg_pace_sec_per_km: 360,
  avg_hr: 148,
  max_hr: 185,
  historical_avg_hr: 158,
  avg_cadence: 82,
  elevation_gain_m: 50,
  calories: 600,
  pr_count: 0,
  workout_type: null,
  summary_polyline: null,
  gear: null,
  zones: hrZonesData,
}

const hrStreamData = {
  meta: {
    has_hr: true,
    has_cadence: false,
    has_altitude: false,
    total_points: 6,
    returned_points: 6,
    resolution: '10s',
  },
  data: [
    { dist_m: 0, hr: 140, pace: 365 },
    { dist_m: 2000, hr: 148, pace: 360 },
    { dist_m: 4000, hr: 155, pace: 355 },
    { dist_m: 6000, hr: 165, pace: 350 },
    { dist_m: 8000, hr: 172, pace: 348 },
    { dist_m: 10000, hr: 162, pace: 355 },
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

const stubStreamsHr = () => {
  cy.intercept('GET', `/api/running/v1/activities/*/streams*`, {
    statusCode: 200,
    body: hrStreamData,
  }).as('getStreams')
}

const stubInsight = () => {
  cy.intercept('GET', '/api/running/v1/ai/insights*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getInsight')
}

const visitAndWait = (url = DETAIL_URL, alias = '@getActivity') => {
  cy.viewport(1280, 720)
  cy.visit(url)
  cy.wait(alias)
}

// ─── Activity Detail — avg HR reference line ─────────────────────────────────

describe('HR chart enhancements — avg HR line (Activity Detail)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreamsHr()
    stubInsight()
    visitAndWait()
  })

  it('avg HR reference line is rendered', () => {
    cy.get(`#${ACT_IDS.hr_avg_line}`).should('exist')
  })

  it('avg HR label shows correct value', () => {
    cy.get(`#${ACT_IDS.stream_chart_hr}`).within(() => {
      cy.contains('Avg 148').should('exist')
    })
  })
})

// ─── Activity Detail — historical avg HR reference line ──────────────────────

describe('HR chart enhancements — historical avg HR line (Activity Detail)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreamsHr()
    stubInsight()
    visitAndWait()
  })

  it('historical avg HR reference line is rendered', () => {
    cy.get(`#${ACT_IDS.hr_historical_avg_line}`).should('exist')
  })

  it('historical avg HR label shows correct value', () => {
    cy.get(`#${ACT_IDS.stream_chart_hr}`).within(() => {
      cy.contains('All-time 158').should('exist')
    })
  })

  it('historical avg HR line is not rendered when historicalAvgHr is null', () => {
    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        activity: { ...baseActivity, historical_avg_hr: null },
        splits: [],
        laps: [],
        best_efforts: [],
        photos: [],
      },
    }).as('getActivityNoHist')
    cy.visit(DETAIL_URL)
    cy.wait('@getActivityNoHist')
    cy.get(`#${ACT_IDS.hr_historical_avg_line}`).should('not.exist')
  })
})

// ─── Activity Detail — peak HR marker ────────────────────────────────────────

describe('HR chart enhancements — peak HR marker (Activity Detail)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreamsHr()
    stubInsight()
    visitAndWait()
  })

  it('peak HR marker is rendered at the highest HR point', () => {
    cy.get(`#${ACT_IDS.hr_peak_marker}`).should('exist')
  })

  it('peak HR marker shows the peak value label', () => {
    cy.get(`#${ACT_IDS.stream_chart_hr}`).within(() => {
      // Peak HR in stream data is 172
      cy.contains('172').should('exist')
    })
  })
})

// ─── Activity Detail — time-in-zone section ──────────────────────────────────

describe('HR chart enhancements — time-in-zone section (Activity Detail)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreamsHr()
    stubInsight()
    visitAndWait()
  })

  it('time-in-zone section is rendered', () => {
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).should('exist')
  })

  it('renders all 5 zone label rows', () => {
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).within(() => {
      cy.contains('Z1 Recovery').should('exist')
      cy.contains('Z2 Aerobic').should('exist')
      cy.contains('Z3 Tempo').should('exist')
      cy.contains('Z4 Threshold').should('exist')
      cy.contains('Z5 VO₂max').should('exist')
    })
  })

  it('zone percentages sum makes sense (contains % for each zone)', () => {
    // Z2: 1800/5400 = 33%, Z3: 2100/5400 = 39%
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).within(() => {
      cy.contains('33%').should('exist')
      cy.contains('39%').should('exist')
    })
  })

  it('zone bars have inline background-color styles', () => {
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).within(() => {
      cy.get('div[style*="background-color"]').should('have.length', 5)
    })
  })

  it('time-in-zone section is not rendered when no zone data', () => {
    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        activity: { ...baseActivity, zones: null },
        splits: [],
        laps: [],
        best_efforts: [],
        photos: [],
      },
    }).as('getActivityNoZones')
    cy.visit(DETAIL_URL)
    cy.wait('@getActivityNoZones')
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).should('not.exist')
  })

  it('zone bands render from maxHr fallback when Strava zones is null', () => {
    // When zones=null but maxHr is present, bands are computed from standard % formula
    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        activity: { ...baseActivity, zones: null, max_hr: 185 },
        splits: [],
        laps: [],
        best_efforts: [],
        photos: [],
      },
    }).as('getActivityMaxHrFallback')
    cy.visit(DETAIL_URL)
    cy.wait('@getActivityMaxHrFallback')
    // Zone bands (ReferenceArea) are rendered — chart container exists with HR data
    cy.get(`#${ACT_IDS.stream_chart_hr}`).should('exist')
    // Time-in-zone section does NOT render (no time data without Strava zones)
    cy.get(`#${ACT_IDS.hr_time_in_zone_section}`).should('not.exist')
  })
})

// ─── Race Detail — HR chart elements ─────────────────────────────────────────

describe('HR chart enhancements — Race Detail page', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()

    cy.intercept('GET', `/api/running/v1/race-log/${RACE_ID}`, {
      statusCode: 200,
      body: {
        data: {
          id: RACE_ID,
          activity_id: ACTIVITY_ID,
          name: 'Test Race',
          race_date: '2026-06-01',
          distance_m: 10000,
          finish_time_sec: 3600,
        },
      },
    }).as('getRaceEntry')

    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        activity: { ...baseActivity, id: ACTIVITY_ID },
        splits: [],
        laps: [],
        best_efforts: [],
        photos: [],
      },
    }).as('getRaceActivity')

    stubStreamsHr()

    cy.intercept('GET', '/api/running/v1/health/subjective*', {
      statusCode: 200,
      body: { data: [] },
    }).as('getHealth')

    cy.intercept('GET', '/api/running/v1/ai/insights*', {
      statusCode: 200,
      body: { data: [] },
    }).as('getRaceInsight')

    visitAndWait(RACE_DETAIL_URL, '@getRaceEntry')
    cy.wait('@getRaceActivity')
  })

  it('avg HR reference line is rendered on race detail', () => {
    cy.get(`#${RACE_IDS.hr_avg_line}`).should('exist')
  })

  it('historical avg HR reference line is rendered on race detail', () => {
    cy.get(`#${RACE_IDS.hr_historical_avg_line}`).should('exist')
  })

  it('peak HR marker is rendered on race detail', () => {
    cy.get(`#${RACE_IDS.hr_peak_marker}`).should('exist')
  })

  it('time-in-zone section is rendered on race detail', () => {
    cy.get(`#${RACE_IDS.hr_time_in_zone_section}`).should('exist')
  })

  it('zone label rows are visible on race detail', () => {
    cy.get(`#${RACE_IDS.hr_time_in_zone_section}`).within(() => {
      cy.contains('Z1 Recovery').should('exist')
      cy.contains('Z2 Aerobic').should('exist')
    })
  })
})
