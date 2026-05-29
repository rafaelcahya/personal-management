// Covers: AI Coach card on the Running Dashboard
//   Issues: #22 (card states), #23 (retry button)
//
// AUTH STRATEGY:
//   - Uses cy.setupApiAuthCookies() for a real Supabase session.
//   - Stubs rt_users, dashboard, and ai/insights APIs.
//   - All states (loading, empty, error, content) are covered via intercept.

import constants from '../../../fixtures/app-constants.json'

const IDS = constants.test_ids.running_dashboard
const DASHBOARD_URL = constants.routes.running_dashboard
const AI_EP = constants.endpoints.running_ai_insights.list

// ---------------------------------------------------------------------------
// Shared stubs
// ---------------------------------------------------------------------------

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubDashboard = () => {
  cy.intercept('GET', '/api/running/v1/dashboard*', {
    statusCode: 200,
    body: {
      data: {
        weekly_stats: {
          current: { distance_m: 21000, duration_sec: 7200, count: 3, avg_pace_sec_per_km: 343 },
          prev: { distance_m: 18000, duration_sec: 6300, count: 2, avg_pace_sec_per_km: 350 },
        },
        training_load: {
          acwr: 0.95,
          acute_load_7d: 48.5,
          chronic_load_28d: 51.0,
          status: 'optimal',
        },
        recent_activities: [],
        calendar_activities: [],
        health_today: { logged: false, data: null },
      },
    },
  }).as('getDashboard')
}

const completedInsight = {
  id: 'insight-001',
  title: 'Good aerobic base this week',
  content: 'Your training has been consistent.\n\n## Details\nMore info here.',
  status: 'completed',
  is_valid: true,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  data_refs: { activity_id: 'act-123' },
}

// ---------------------------------------------------------------------------
// A. Auth guard
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(DASHBOARD_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

// ---------------------------------------------------------------------------
// B. Card root always renders (#22)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Card root', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, { statusCode: 200, body: { data: [] } }).as('getInsights')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
  })

  it('renders #aiCoachCard on the dashboard', () => {
    cy.get(`#${IDS.ai_coach_card}`).should('exist')
  })
})

// ---------------------------------------------------------------------------
// C. Empty state — no completed insights (#22)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Empty state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [] },
    }).as('getInsights')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsights')
  })

  it('shows #aiCoachEmpty_dashboardPage when no insights exist', () => {
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
  })

  it('shows the no-insights copy', () => {
    cy.get(`#${IDS.ai_coach_empty}`).within(() => {
      cy.contains('No AI insights yet').should('be.visible')
    })
  })

  it('does not show content or error state', () => {
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
    cy.get(`#${IDS.ai_coach_error}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// D. Content state — completed valid insight (#22)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Content state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [completedInsight] },
    }).as('getInsights')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsights')
  })

  it('shows #aiCoachContent_dashboardPage with the insight title', () => {
    cy.get(`#${IDS.ai_coach_content}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).within(() => {
      cy.contains('Good aerobic base this week').should('be.visible')
    })
  })

  it('shows first paragraph of content (before ## heading)', () => {
    cy.get(`#${IDS.ai_coach_content}`).within(() => {
      cy.contains('Your training has been consistent').should('be.visible')
      cy.contains('Details').should('not.exist')
    })
  })

  it('shows a link to the activity when data_refs.activity_id is present', () => {
    cy.get(`#${IDS.ai_coach_content}`).within(() => {
      cy.contains('View activity').should('be.visible')
      cy.get('a[href*="/running/activities/act-123"]').should('exist')
    })
  })

  it('does not show empty or error state', () => {
    cy.get(`#${IDS.ai_coach_empty}`).should('not.exist')
    cy.get(`#${IDS.ai_coach_error}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// E. Pending/invalid insights fall back to empty state (#22)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Pending insight shows empty state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: {
        data: [{ ...completedInsight, status: 'pending', is_valid: false }],
      },
    }).as('getInsights')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsights')
  })

  it('shows empty state when only pending/invalid insights exist', () => {
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// F. Error state — API failure (#22)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Error state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getInsightsError')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsightsError')
  })

  it('shows #aiCoachError_dashboardPage on fetch failure', () => {
    cy.get(`#${IDS.ai_coach_error}`).should('be.visible')
  })

  it('shows "Unable to load insights" message', () => {
    cy.get(`#${IDS.ai_coach_error}`).within(() => {
      cy.contains('Unable to load').should('be.visible')
    })
  })

  it('renders the retry button', () => {
    cy.get(`#${IDS.ai_coach_retry_btn}`).should('be.visible')
  })

  it('does not show content or empty state', () => {
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
    cy.get(`#${IDS.ai_coach_empty}`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// G. Retry button triggers reload (#23)
// ---------------------------------------------------------------------------

describe('Dashboard AI Coach — Retry reloads insights', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.viewport(1280, 900)
  })

  it('clicking retry re-fetches insights and shows content on success', () => {
    // First call fails
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 500,
      body: { error: 'fail' },
    }).as('getInsightsFail')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsightsFail')

    cy.get(`#${IDS.ai_coach_error}`).should('be.visible')

    // Second call succeeds
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [completedInsight] },
    }).as('getInsightsRetry')

    cy.get(`#${IDS.ai_coach_retry_btn}`).click()
    cy.wait('@getInsightsRetry')

    cy.get(`#${IDS.ai_coach_content}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_error}`).should('not.exist')
  })

  it('clicking retry re-fetches insights and stays in error on continued failure', () => {
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 500,
      body: { error: 'fail' },
    }).as('getInsightsFail')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsightsFail')

    cy.get(`#${IDS.ai_coach_error}`).should('be.visible')

    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 500,
      body: { error: 'still failing' },
    }).as('getInsightsRetry2')

    cy.get(`#${IDS.ai_coach_retry_btn}`).click()
    cy.wait('@getInsightsRetry2')

    cy.get(`#${IDS.ai_coach_error}`).should('be.visible')
  })
})
