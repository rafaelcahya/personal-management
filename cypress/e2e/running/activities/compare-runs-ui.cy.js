// Covers: Compare Runs selector in AIInsightCard (issue #121)
//   Regression spec for bug where fetchActivities() envelope was filtered
//   directly instead of result.data — selector was always empty.
//
// Suites:
//   A. Selector opens and shows activity list (not "No matching runs found")
//   B. Search input filters results by name or date
//   C. Selecting an activity shows a compare pill
//   D. Removing the pill clears the selection

import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_activity_detail
const ACTIVITY_ID = 'test-activity-id-compare-runs'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`
const AI_EP = constants.endpoints.running_ai_insights.list
const ACTIVITIES_EP = constants.endpoints.running_manual.activities

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Long Run Sunday',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-05-25T06:00:00Z',
  distance_m: 15000,
  moving_time_sec: 5400,
  duration_sec: 5450,
  avg_pace_sec_per_km: 360,
  avg_hr: 148,
  max_hr: 170,
  avg_cadence: 83,
  elevation_gain_m: 80,
  calories: 900,
  pr_count: 0,
  workout_type: null,
  summary_polyline: null,
  gear: null,
  device_name: null,
  notes: null,
  weather_summary: null,
  zones: null,
}

const completedInsight = {
  id: 'insight-compare-runs-001',
  insight_type: 'post_activity',
  status: 'completed',
  is_valid: true,
  title: 'Post-Run Analysis',
  content: '## Summary\n\nGood long run.\n\n## Recommendations\n\n- Keep this pace',
  data_refs: { focus: 'performance' },
  acknowledged: false,
  created_at: '2026-05-25T08:00:00Z',
}

// Two activities for comparison — neither matches ACTIVITY_ID
const compareActivities = [
  {
    id: 'compare-act-alpha',
    name: 'Morning Easy Run',
    started_at: '2026-05-18T06:00:00Z',
    distance_m: 8000,
    avg_pace_sec_per_km: 375,
  },
  {
    id: 'compare-act-beta',
    name: 'Interval Session',
    started_at: '2026-05-10T05:30:00Z',
    distance_m: 6000,
    avg_pace_sec_per_km: 320,
  },
]

// ---------------------------------------------------------------------------
// Stub helpers
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
    body: {
      activity: baseActivity,
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

const stubInsightCompleted = () => {
  cy.intercept('GET', `${AI_EP}*`, {
    statusCode: 200,
    body: { data: [completedInsight] },
  }).as('getInsight')
}

// Stub activities list with paginated envelope — mirrors the real API shape.
// Bug #121: old code filtered the envelope object; fix reads result.data.
const stubActivitiesEnvelope = (items = compareActivities) => {
  cy.intercept('GET', `${ACTIVITIES_EP}*`, {
    statusCode: 200,
    body: { data: items, total: items.length, page: 1, limit: 100 },
  }).as('getActivities')
}

const setup = () => {
  cy.setupApiAuthCookies()
  stubRtUsers()
  stubActivity()
  stubDashboard()
  stubRaceLog()
  stubStreams()
  stubInsightCompleted()
  stubActivitiesEnvelope()
  cy.viewport(1280, 720)
  cy.visit(DETAIL_URL)
  cy.wait('@getActivity')
  cy.wait('@getInsight')
}

const openSelector = () => {
  cy.get(`#${IDS.ai_insight_compare_trigger}`).scrollIntoView().click()
  cy.wait('@getActivities')
}

// ---------------------------------------------------------------------------
// A. Selector opens and shows activity list
// ---------------------------------------------------------------------------

describe('Compare Runs — selector opens and shows activities', () => {
  beforeEach(setup)

  it('compare section and trigger are visible in content state', () => {
    cy.get(`#${IDS.ai_insight_compare_section}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.ai_insight_compare_trigger}`).should('be.visible')
  })

  it('clicking the trigger opens the comparison popover', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).should('be.visible')
  })

  it('popover contains the command container', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get(`#${IDS.ai_insight_compare_command}`).should('exist')
    })
  })

  it('activity list renders stubbed activities (not "No matching runs found")', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('No matching runs found.').should('not.exist')
      cy.contains('May 18').should('exist')
      cy.contains('May 10').should('exist')
    })
  })

  it('activities are grouped under a month header', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 2026').should('exist')
    })
  })
})

// ---------------------------------------------------------------------------
// B. Search input filters results
// ---------------------------------------------------------------------------

describe('Compare Runs — search filters activity list', () => {
  beforeEach(setup)

  it('search input is rendered inside the popover', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get('input[placeholder*="Search"]').should('exist')
    })
  })

  it('typing a name that matches one activity shows only that activity', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get('input[placeholder*="Search"]').type('Interval')
      cy.contains('May 10').should('exist')
      cy.contains('May 18').should('not.exist')
    })
  })

  it('typing a date fragment that matches one activity shows only that activity', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get('input[placeholder*="Search"]').type('May 18')
      cy.contains('May 18').should('exist')
      cy.contains('May 10').should('not.exist')
    })
  })

  it('typing a term with no match shows "No matching runs found."', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get('input[placeholder*="Search"]').type('xyz-no-match')
      cy.contains('No matching runs found.').should('exist')
    })
  })

  it('clearing the search restores the full list', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.get('input[placeholder*="Search"]').type('Interval').clear()
      cy.contains('May 18').should('exist')
      cy.contains('May 10').should('exist')
    })
  })
})

// ---------------------------------------------------------------------------
// C. Selecting an activity shows a compare pill
// ---------------------------------------------------------------------------

describe('Compare Runs — selecting an activity shows a pill', () => {
  beforeEach(setup)

  it('no compare pill is shown before selecting an activity', () => {
    cy.get(`#${IDS.ai_insight_compare_pill}`).should('not.exist')
  })

  it('selecting an activity from the list closes the popover', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 18').click()
    })
    cy.get(`#${IDS.ai_insight_compare_popover}`, { timeout: 8000 }).should('not.exist')
  })

  it('a compare pill appears after selecting an activity', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 18').click()
    })
    cy.get(`#${IDS.ai_insight_compare_pill}`, { timeout: 8000 }).should('exist').and('be.visible')
  })

  it('compare pill contains the selected activity date', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 18').click()
    })
    cy.get(`#${IDS.ai_insight_compare_pill}`, { timeout: 8000 }).should('contain.text', 'May 18')
  })

  it('Get Recommendation button appears after selecting a comparison activity', () => {
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 18').click()
    })
    cy.get(`#${IDS.ai_insight_get_recommendation_btn}`, { timeout: 8000 })
      .scrollIntoView()
      .should('be.visible')
  })
})

// ---------------------------------------------------------------------------
// D. Removing the pill clears the selection
// ---------------------------------------------------------------------------

describe('Compare Runs — clearing the pill removes the selection', () => {
  beforeEach(() => {
    setup()
    // Select an activity first so we start in pill state
    openSelector()
    cy.get(`#${IDS.ai_insight_compare_popover}`).within(() => {
      cy.contains('May 18').click()
    })
    cy.get(`#${IDS.ai_insight_compare_pill}`, { timeout: 8000 }).should('exist')
  })

  it('compare pill has a remove button', () => {
    cy.get(`#${IDS.ai_insight_compare_pill}`).within(() => {
      cy.get('button[aria-label="Remove comparison activity"]').should('exist')
    })
  })

  it('clicking the remove button hides the compare pill', () => {
    cy.get(`#${IDS.ai_insight_compare_pill}`).within(() => {
      cy.get('button[aria-label="Remove comparison activity"]').click()
    })
    cy.get(`#${IDS.ai_insight_compare_pill}`).should('not.exist')
  })

  it('removing the pill hides the Get Recommendation button', () => {
    cy.get(`#${IDS.ai_insight_compare_pill}`).within(() => {
      cy.get('button[aria-label="Remove comparison activity"]').click()
    })
    cy.get(`#${IDS.ai_insight_get_recommendation_btn}`).should('not.exist')
  })

  it('after clearing, the compare trigger is visible again', () => {
    cy.get(`#${IDS.ai_insight_compare_pill}`).within(() => {
      cy.get('button[aria-label="Remove comparison activity"]').click()
    })
    cy.get(`#${IDS.ai_insight_compare_trigger}`).scrollIntoView().should('be.visible')
  })
})
