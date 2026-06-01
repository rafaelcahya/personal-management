import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { ROUTES } from '../../../fixtures/routes.js'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const IDS = TEST_IDS.running_dashboard
const DASHBOARD_URL = ROUTES.running_dashboard
const DASHBOARD_API = RUNNING_ENDPOINTS.DASHBOARD
const AI_EP = RUNNING_ENDPOINTS.AI_INSIGHTS_LIST

// Shared stubs

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubDashboard = () => {
  cy.intercept('GET', `${DASHBOARD_API}*`, {
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

describe('Dashboard AI Coach — Auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(DASHBOARD_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

describe('Dashboard AI Coach — Card root', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.intercept('GET', `${AI_EP}*`, { statusCode: 200, body: { data: [] } }).as('getInsights')
    cy.viewport(1280, 900)
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
  })

  it('renders #aiCoachCard on the dashboard', () => {
    cy.get(`#${IDS.ai_coach_card}`).should('exist')
  })
})

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
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
  })

  it('shows #aiCoachEmpty_dashboardPage when no insights exist', () => {
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
  })

  it('shows the no-insights copy', () => {
    cy.get(`#${IDS.ai_coach_empty}`).within(() => {
      cy.contains('Complete a run to get AI analysis.').should('be.visible')
    })
  })

  it('does not show content or error state', () => {
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
    cy.get(`#${IDS.ai_coach_error}`).should('not.exist')
  })
})

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
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
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
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
  })

  it('shows empty state when only pending/invalid insights exist', () => {
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
  })
})

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
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
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

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
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

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
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

describe('Dashboard AI Coach — Multi-card rendering', () => {
  const makeInsight = (n) => ({
    id: `insight-00${n}`,
    title: `Insight title ${n}`,
    content: `Paragraph ${n} content here.`,
    status: 'completed',
    is_valid: true,
    created_at: new Date(Date.now() - n * 60 * 60 * 1000).toISOString(),
    data_refs: { activity_id: `act-00${n}` },
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboard()
    cy.viewport(1280, 900)
  })

  it('renders all 3 cards when 3 valid insights are returned', () => {
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [makeInsight(1), makeInsight(2), makeInsight(3)] },
    }).as('getInsights3')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsights3')

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
    cy.get(`#${IDS.ai_coach_content}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).within(() => {
      cy.contains('Insight title 1').should('be.visible')
      cy.contains('Insight title 2').should('be.visible')
      cy.contains('Insight title 3').should('be.visible')
    })
  })

  it('renders 1 card when only 1 valid insight is returned', () => {
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [makeInsight(1)] },
    }).as('getInsights1')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsights1')

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
    cy.get(`#${IDS.ai_coach_content}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).within(() => {
      cy.contains('Insight title 1').should('be.visible')
      cy.contains('Insight title 2').should('not.exist')
    })
  })

  it('shows empty state when all insights have status pending', () => {
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [{ ...makeInsight(1), status: 'pending' }] },
    }).as('getInsightsPending')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsightsPending')

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
  })

  it('shows empty state when all insights have is_valid false', () => {
    cy.intercept('GET', `${AI_EP}*`, {
      statusCode: 200,
      body: { data: [{ ...makeInsight(1), is_valid: false }] },
    }).as('getInsightsInvalid')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
    cy.wait('@getInsightsInvalid')

    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView()
    cy.get(`#${IDS.ai_coach_empty}`).should('be.visible')
    cy.get(`#${IDS.ai_coach_content}`).should('not.exist')
  })
})
