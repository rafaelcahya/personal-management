import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { ROUTES } from '../../../fixtures/routes.js'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const IDS = TEST_IDS.running_dashboard
const DASHBOARD_URL = ROUTES.running_dashboard
const DASHBOARD_API = RUNNING_ENDPOINTS.DASHBOARD

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubDashboardHappy = () => {
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
        recent_activities: [
          {
            id: 'act-1',
            started_at: '2026-05-20T07:30:00Z',
            distance_m: 10500,
            duration_sec: 3600,
            avg_pace_sec_per_km: 343,
            avg_hr: 148,
            activity_type: 'easy',
            source: 'strava',
          },
        ],
        calendar_activities: [{ date: '2026-05-20', activity_type: 'easy' }],
        health_today: { logged: false, data: null },
      },
    },
  }).as('getDashboard')
}

describe('Running Dashboard — Auth Guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(DASHBOARD_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

describe('Running Dashboard — Loading skeleton', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('shows loading skeleton while dashboard data is pending', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()

    // Delay the response so we can catch the skeleton while it is visible
    cy.intercept('GET', `${DASHBOARD_API}*`, (req) => {
      req.reply((res) => {
        res.setDelay(800)
        res.send({
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
        })
      })
    }).as('getDashboardDelayed')

    cy.viewport(1280, 720)
    cy.visit(DASHBOARD_URL)

    // Skeleton should appear before data resolves
    cy.get(`#${IDS.skeleton}`).should('exist')
  })
})

describe('Running Dashboard — Happy path (stubbed data)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubDashboardHappy()
    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboard')
  })

  it('renders the dashboard page container', () => {
    cy.get(`#${IDS.page}`).should('exist')
  })

  it('does NOT show skeleton after data loads', () => {
    cy.get(`#${IDS.skeleton}`).should('not.exist')
  })

  it('does NOT show error state after data loads', () => {
    cy.get(`#${IDS.error}`).should('not.exist')
  })

  it('renders This Week stats section with distance value', () => {
    cy.get(`#${IDS.weekly_stats_card}`).should('be.visible')
    cy.get(`#${IDS.weekly_stats_card}`).contains('This Week').should('be.visible')
    // 21000m → 21.00 km
    cy.get(`#${IDS.weekly_stats_card}`).contains('21.00 km').should('be.visible')
  })

  it('renders session count tile (3) in weekly stats', () => {
    cy.get(`#${IDS.weekly_stats_card}`).contains('3').should('exist')
  })

  it('renders avg pace tile in weekly stats (5:43 /km)', () => {
    // 343 sec/km → 5:43 /km
    cy.get(`#${IDS.weekly_stats_card}`).contains('5:43 /km').should('exist')
  })

  it('renders Training Load section with ACWR value', () => {
    cy.get(`#${IDS.training_load_card}`).should('be.visible')
    cy.get(`#${IDS.training_load_card}`).contains('0.95').should('be.visible')
  })

  it('renders Training Load status badge as "Optimal"', () => {
    cy.get(`#${IDS.training_load_card}`).contains('Optimal').should('be.visible')
  })

  it('renders Activity Calendar section', () => {
    cy.get('#activitySection').should('exist')
  })

  it('renders Recent Activities section with one activity row', () => {
    // scrollIntoView needed — section is below viewport fold and clipped by overflow:hidden
    cy.get('#activitySection').scrollIntoView().should('be.visible')
    cy.get('#activitySection').find('li').should('have.length', 1)
  })

  it('recent activity row shows distance (10.50 km)', () => {
    cy.get('#activitySection').scrollIntoView()
    cy.get('#activitySection').contains('10.50 km').should('be.visible')
  })

  it('renders AI Coach placeholder section', () => {
    cy.get(`#${IDS.ai_coach_card}`).scrollIntoView().should('be.visible')
    cy.get(`#${IDS.ai_coach_card}`).contains('AI Coach').should('be.visible')
  })

  it('renders Health Check-in section when health_today is present', () => {
    cy.get(`#${IDS.health_checkin_card}`).scrollIntoView().should('be.visible')
  })

  it('shows "not logged today" message when health_today.logged is false', () => {
    cy.get(`#${IDS.health_checkin_card}`).scrollIntoView()
    cy.get(`#${IDS.health_checkin_card}`)
      .contains("You haven't logged today's health yet")
      .should('be.visible')
  })
})

describe('Running Dashboard — Empty state (no activities)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()

    cy.intercept('GET', `${DASHBOARD_API}*`, {
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
    }).as('getDashboardEmpty')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardEmpty')
  })

  it('shows "No activities yet" when recent_activities is empty', () => {
    // scrollIntoView needed — section is below viewport fold and clipped by overflow:hidden
    cy.get('#activitySection').scrollIntoView()
    cy.get('#activitySection').contains('No activities yet').should('be.visible')
  })

  it('shows no_data training load status badge', () => {
    cy.get(`#${IDS.training_load_card}`).contains('No Data').should('be.visible')
  })

  it('avg pace shows "—" when no data (null avg_pace_sec_per_km)', () => {
    cy.get(`#${IDS.weekly_stats_card}`).contains('Avg Pace').should('exist')
    // When avg_pace is null, fmtPace returns '—'
    cy.get(`#${IDS.weekly_stats_card}`).contains('—').should('exist')
  })
})

describe('Running Dashboard — Health check-in logged state', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()

    cy.intercept('GET', `${DASHBOARD_API}*`, {
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
          health_today: {
            logged: true,
            data: {
              sleep_hours: 7.5,
              sleep_quality: 4,
              morning_energy: 3,
              mood: 4,
              soreness_level: 2,
            },
          },
        },
      },
    }).as('getDashboardHealthLogged')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardHealthLogged')
  })

  it('shows "Today\'s health logged" when health_today.logged is true', () => {
    // scrollIntoView needed — section is below viewport fold and clipped by overflow:hidden
    cy.get(`#${IDS.health_checkin_card}`).scrollIntoView()
    cy.get(`#${IDS.health_checkin_card}`).contains("Today's health logged").should('be.visible')
  })

  it('shows sleep hours value from health data', () => {
    cy.get(`#${IDS.health_checkin_card}`).scrollIntoView()
    cy.get(`#${IDS.health_checkin_card}`).contains('7.5').should('be.visible')
  })
})

describe('Running Dashboard — Error state and retry', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
  })

  it('shows error state when API returns 500', () => {
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 500,
      body: { error: 'Internal server error', message: 'Something went wrong' },
    }).as('getDashboardError')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardError')

    cy.get(`#${IDS.error}`, { timeout: 10000 }).should('be.visible')
    cy.get(`#${IDS.skeleton}`).should('not.exist')
  })

  it('shows default fallback error message when server returns no message', () => {
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 500,
      body: {},
    }).as('getDashboardErrorNoMsg')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardErrorNoMsg')

    cy.get(`#${IDS.error}`).contains('Failed to load dashboard').should('be.visible')
  })

  it('shows Retry button in error state', () => {
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getDashboardErrorRetry')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardErrorRetry')

    cy.get(`#${IDS.error}`).contains('Retry').should('be.visible')
  })

  it('clicking Retry re-fetches dashboard and shows data on success', () => {
    // First call fails
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getDashboardFirst')

    cy.visit(DASHBOARD_URL)
    cy.wait('@getDashboardFirst')

    cy.get(`#${IDS.error}`).should('be.visible')

    // Second call (after Retry click) succeeds
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 200,
      body: {
        data: {
          weekly_stats: {
            current: { distance_m: 5000, duration_sec: 1800, count: 1, avg_pace_sec_per_km: 360 },
            prev: { distance_m: 0, duration_sec: 0, count: 0, avg_pace_sec_per_km: null },
          },
          training_load: { acwr: 0.5, acute_load_7d: 20, chronic_load_28d: 40, status: 'low' },
          recent_activities: [],
          calendar_activities: [],
          health_today: { logged: false, data: null },
        },
      },
    }).as('getDashboardRetry')

    cy.get(`#${IDS.error}`).contains('Retry').click()
    cy.wait('@getDashboardRetry')

    cy.get(`#${IDS.error}`).should('not.exist')
    cy.get(`#${IDS.weekly_stats_card}`).should('be.visible')
  })
})

describe('Running Dashboard — Training load status badge variants', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  const visitWithStatus = (status, acwr) => {
    stubRtUsers()
    cy.intercept('GET', `${DASHBOARD_API}*`, {
      statusCode: 200,
      body: {
        data: {
          weekly_stats: {
            current: { distance_m: 0, duration_sec: 0, count: 0, avg_pace_sec_per_km: null },
            prev: { distance_m: 0, duration_sec: 0, count: 0, avg_pace_sec_per_km: null },
          },
          training_load: { acwr, acute_load_7d: 30, chronic_load_28d: 30, status },
          recent_activities: [],
          calendar_activities: [],
          health_today: { logged: false, data: null },
        },
      },
    }).as(`getDashboard_${status}`)

    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    cy.visit(DASHBOARD_URL)
    cy.wait(`@getDashboard_${status}`)
  }

  it('shows "Low Load" badge for status=low', () => {
    visitWithStatus('low', 0.6)
    cy.get(`#${IDS.training_load_card}`).contains('Low Load').should('be.visible')
  })

  it('shows "Caution" badge for status=caution', () => {
    visitWithStatus('caution', 1.3)
    cy.get(`#${IDS.training_load_card}`).contains('Caution').should('be.visible')
  })

  it('shows "High Risk" badge for status=danger', () => {
    visitWithStatus('danger', 1.6)
    cy.get(`#${IDS.training_load_card}`).contains('High Risk').should('be.visible')
  })
})
