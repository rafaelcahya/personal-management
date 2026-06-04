// UI-only spec: uses cy.visit + DOM assertions.
// API calls are cy.intercept stubs — no real DB writes.
// Covers: Vo2maxTargetEffortSection and Vo2maxGapCard states on the analytics page.
// Issues: #137 (VO2max Target Effort feature)

import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_analytics
const ANALYTICS_URL = constants.routes.running_analytics
const TARGET_EFFORT_EP = constants.endpoints.running_analytics.target_effort

// ---------------------------------------------------------------------------
// Shared page stubs (other sections must load so analytics page renders)
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

const stubAiStaleness = () => {
  cy.intercept('GET', '/api/running/v1/ai/insights/staleness*', {
    statusCode: 200,
    body: { data: { is_stale: false } },
  }).as('getAiStaleness')
}

const stubTargetEffort = (body, statusCode = 200) => {
  cy.intercept('GET', TARGET_EFFORT_EP, {
    statusCode,
    body: statusCode === 200 ? { data: body } : body,
  }).as('getTargetEffort')
}

const setupPage = () => {
  cy.setupApiAuthCookies()
  stubRtUsers()
  stubActivitiesEmpty()
  stubPerformanceTrends()
  stubDashboard()
  stubAiStaleness()
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(ANALYTICS_URL)
  cy.wait('@getActivities')
  cy.wait('@getTargetEffort')
}

// ---------------------------------------------------------------------------
// A. Auth guard — unauthenticated redirect
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(ANALYTICS_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

// ---------------------------------------------------------------------------
// B. no_goal status — no-goal empty state visible
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — no_goal status', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({ status: 'no_goal', currentVo2max: null, requiredVo2max: null })
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows the no-goal empty state element', () => {
    cy.get(`#${IDS.vo2max_gap_no_goal}`).scrollIntoView().should('be.visible')
  })

  it('shows "No active race goal set." text', () => {
    cy.get(`#${IDS.vo2max_gap_no_goal}`)
      .scrollIntoView()
      .should('contain.text', 'No active race goal set.')
  })

  it('shows a "Set a race goal" link/button', () => {
    cy.get(`#${IDS.set_goal_btn}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.set_goal_btn}`).should('contain.text', 'Set a race goal')
  })
})

// ---------------------------------------------------------------------------
// C. no_target_time status — amber warning visible
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — no_target_time status', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({
      status: 'no_target_time',
      currentVo2max: null,
      requiredVo2max: null,
      goal: {
        id: 'race-1',
        title: 'Bali Marathon 2099',
        targetDate: '2099-12-01',
        targetDistM: 42195,
        targetTimeSec: null,
      },
    })
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows the amber warning about missing target time', () => {
    cy.get(`#${IDS.vo2max_gap_card}`)
      .scrollIntoView()
      .within(() => {
        cy.contains("doesn't have a target time yet").should('be.visible')
      })
  })

  it('shows "Add target time" link/button', () => {
    cy.get(`#${IDS.set_goal_btn}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.set_goal_btn}`).should('contain.text', 'Add target time')
  })
})

// ---------------------------------------------------------------------------
// D. insufficient_data status — insufficient data state visible
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — insufficient_data status', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({
      status: 'insufficient_data',
      currentVo2max: null,
      requiredVo2max: 45.0,
      sampleSize: 2,
      goal: {
        targetDate: '2099-12-01',
        targetDistM: 42195,
        targetTimeSec: 14400,
      },
    })
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows the insufficient data element', () => {
    cy.get(`#${IDS.vo2max_gap_insufficient_data}`).scrollIntoView().should('be.visible')
  })

  it('shows "Need more data" heading', () => {
    cy.get(`#${IDS.vo2max_gap_insufficient_data}`)
      .scrollIntoView()
      .should('contain.text', 'Need more data')
  })

  it('shows required VO2max value', () => {
    cy.get(`#${IDS.vo2max_gap_insufficient_data}`).scrollIntoView().should('contain.text', '45')
  })
})

// ---------------------------------------------------------------------------
// E. ok / On Track status — gap numbers + weeks-to-goal + recommended training + chart
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — ok / On Track status', () => {
  const onTrackData = {
    status: 'ok',
    currentVo2max: 42.0,
    requiredVo2max: 45.0,
    gapMlKgMin: -3.0,
    weeksToGoal: { optimistic: 8, realistic: 12, pessimistic: 20 },
    statusBadge: 'On Track',
    categoryBadge: null,
    recommendedTraining:
      'Add 2 interval sessions/week (4×4 min @ 90–95% max HR with 3 min recovery)',
    physiologicalWarning: null,
    goal: {
      id: 'race-1',
      title: 'Bali Marathon 2099',
      targetDate: '2099-12-01',
      targetDistM: 42195,
      targetTimeSec: 14400,
    },
    sampleSize: 8,
  }

  beforeEach(() => {
    setupPage()
    stubTargetEffort(onTrackData)
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows On Track status badge', () => {
    cy.get(`#${IDS.vo2max_gap_status_badge}`).scrollIntoView().should('contain.text', 'On Track')
  })

  it('shows gap numbers card with Current/Required/Gap values', () => {
    cy.get(`#${IDS.vo2max_gap_numbers}`)
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', '42')
      .and('contain.text', '45')
  })

  it('shows weeks-to-goal section', () => {
    cy.get(`#${IDS.vo2max_weeks_to_goal}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.vo2max_weeks_to_goal}`).should('contain.text', 'Weeks to goal')
  })

  it('shows recommended training section', () => {
    cy.get(`#${IDS.vo2max_recommended_training}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.vo2max_recommended_training}`).should('contain.text', 'interval sessions')
  })

  it('shows projection chart', () => {
    cy.get(`#${IDS.vo2max_projection_chart}`).scrollIntoView().should('be.visible')
  })
})

// ---------------------------------------------------------------------------
// F. ok / Goal Reached status — trophy state shown
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — ok / Goal Reached status', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({
      status: 'ok',
      currentVo2max: 48.0,
      requiredVo2max: 45.0,
      gapMlKgMin: 3.0,
      weeksToGoal: { optimistic: 0, realistic: 0, pessimistic: 0 },
      statusBadge: 'Goal Reached',
      categoryBadge: null,
      recommendedTraining: 'Nearly there — maintain current training to arrive at peak fitness',
      physiologicalWarning: null,
      goal: {
        id: 'race-1',
        title: 'Bali Marathon 2099',
        targetDate: '2099-12-01',
        targetDistM: 42195,
        targetTimeSec: 14400,
      },
      sampleSize: 8,
    })
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows Goal Reached status badge', () => {
    cy.get(`#${IDS.vo2max_gap_status_badge}`)
      .scrollIntoView()
      .should('contain.text', 'Goal Reached')
  })

  it('shows trophy congratulation text', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('contain.text', "You're there!")
  })

  it('shows gap numbers with current and required', () => {
    cy.get(`#${IDS.vo2max_gap_numbers}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.vo2max_gap_numbers}`).should('contain.text', '48')
  })
})

// ---------------------------------------------------------------------------
// G. ok / Goal Expired status — expired state shown with "Set a new goal" button
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — ok / Goal Expired status', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({
      status: 'ok',
      currentVo2max: 40.0,
      requiredVo2max: 45.0,
      gapMlKgMin: -5.0,
      weeksToGoal: null,
      statusBadge: 'Goal Expired',
      categoryBadge: null,
      recommendedTraining: null,
      physiologicalWarning: null,
      goal: {
        id: 'race-1',
        title: 'Past Marathon',
        targetDate: '2020-01-01',
        targetDistM: 42195,
        targetTimeSec: 14400,
      },
      sampleSize: 6,
    })
    visitAndWait()
  })

  it('renders the gap card container', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).scrollIntoView().should('be.visible')
  })

  it('shows Goal Expired status badge', () => {
    cy.get(`#${IDS.vo2max_gap_status_badge}`)
      .scrollIntoView()
      .should('contain.text', 'Goal Expired')
  })

  it('shows "Your race goal date has passed." message', () => {
    cy.get(`#${IDS.vo2max_gap_card}`)
      .scrollIntoView()
      .should('contain.text', 'Your race goal date has passed.')
  })

  it('shows "Set a new goal" button', () => {
    cy.get(`#${IDS.set_new_goal_btn}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.set_new_goal_btn}`).should('contain.text', 'Set a new goal')
  })

  it('does not show projection chart when goal is expired', () => {
    cy.get(`#${IDS.vo2max_projection_chart}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// H. Loading state — skeleton visible while intercept is delayed
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — loading state', () => {
  it('shows loading skeleton while target-effort fetch is pending', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesEmpty()
    stubPerformanceTrends()
    stubDashboard()
    stubAiStaleness()

    // Delay the target-effort response so we can observe the loading state
    cy.intercept('GET', TARGET_EFFORT_EP, (req) => {
      req.reply({
        delay: 4000,
        statusCode: 200,
        body: { data: { status: 'no_goal', currentVo2max: null, requiredVo2max: null } },
      })
    }).as('getTargetEffortDelayed')

    cy.viewport(1280, 900)
    cy.visit(ANALYTICS_URL)
    cy.wait('@getActivities')

    // The section wrapper should be present and loading skeleton inside it
    cy.get(`#${IDS.vo2max_target_effort_loading}`).scrollIntoView().should('be.visible')
  })
})

// ---------------------------------------------------------------------------
// I. Error state — error element shown when API returns 500
// ---------------------------------------------------------------------------

describe('VO2max Target Effort UI — error state (500)', () => {
  beforeEach(() => {
    setupPage()
    stubTargetEffort({ error: 'Internal server error', message: 'Something went wrong' }, 500)
    visitAndWait()
  })

  it('shows the error element', () => {
    cy.get(`#${IDS.vo2max_target_effort_error}`).scrollIntoView().should('be.visible')
  })

  it('error element has role="alert"', () => {
    cy.get(`#${IDS.vo2max_target_effort_error}`)
      .scrollIntoView()
      .should('have.attr', 'role', 'alert')
  })

  it('does not render the gap card in error state', () => {
    cy.get(`#${IDS.vo2max_gap_card}`).should('not.exist')
  })
})
