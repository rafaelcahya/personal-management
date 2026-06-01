import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { ROUTES } from '../../../fixtures/routes.js'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ROUTE = ROUTES.running_activities
const IDS = TEST_IDS.running_activities
const ACTIVITIES_ENDPOINT = RUNNING_ENDPOINTS.ACTIVITIES

// Shared helpers

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

function makeActivity(overrides = {}) {
  return {
    id: 'act-001',
    activity_type: 'Run',
    name: 'Morning Run',
    started_at: '2026-05-20T07:00:00Z',
    distance_m: 10000,
    moving_time_sec: 3600,
    duration_sec: 3600,
    avg_pace_sec_per_km: 360,
    avg_hr: 145,
    elevation_gain_m: 80,
    pr_count: 0,
    workout_type: null,
    source: 'strava',
    ...overrides,
  }
}

const stubActivitiesHappy = (activities = [makeActivity()]) => {
  cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
    statusCode: 200,
    body: { data: activities, total: activities.length, page: 1, limit: 20 },
  }).as('getActivities')
}

const stubActivitiesError = () => {
  cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
    statusCode: 500,
    body: { error: 'Internal server error' },
  }).as('getActivitiesError')
}

describe('Activities List — Auth Guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(ROUTE, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

describe('Activities List — Loading skeleton', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('shows loading skeleton while activities are pending', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()

    // Delay the activities response so the skeleton is visible
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, (req) => {
      req.reply((res) => {
        res.setDelay(800)
        res.send({
          statusCode: 200,
          body: { data: [makeActivity()], total: 1, page: 1, limit: 20 },
        })
      })
    }).as('getActivitiesDelayed')

    cy.viewport(1280, 720)
    cy.visit(ROUTE)

    // Skeleton must appear before the response resolves
    cy.get(`#${IDS.loading_skeleton}`).should('exist')
  })
})

describe('Activities List — Happy path (stubbed data)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivitiesHappy([
      makeActivity({ id: 'act-001', name: 'Morning Run', distance_m: 10000 }),
      makeActivity({ id: 'act-002', name: 'Evening Jog', distance_m: 5000 }),
    ])
    cy.visit(ROUTE)
    cy.wait('@getActivities')
  })

  it('renders the activities page container', () => {
    cy.get(`#${IDS.page}`).should('exist')
  })

  it('does NOT show skeleton after data loads', () => {
    cy.get(`#${IDS.loading_skeleton}`).should('not.exist')
  })

  it('does NOT show error state after data loads', () => {
    cy.get(`#${IDS.error}`).should('not.exist')
  })

  it('renders the activities list container', () => {
    cy.get(`#${IDS.list}`).should('exist')
  })

  it('renders two activity rows when API returns two activities', () => {
    // Each row is a <tr> in the TableBody#activitiesList
    cy.get(`#${IDS.list}`).find('tr').should('have.length', 2)
  })

  it('first row displays the activity name', () => {
    cy.get(`#${IDS.list}`).find('tr').first().contains('Morning Run').should('exist')
  })

  it('activity row shows formatted distance (10.00 km)', () => {
    cy.get(`#${IDS.list}`).find('tr').first().contains('10.00 km').should('exist')
  })

  it('shows activity count label after data loads', () => {
    // "2 activities" count label rendered above the table
    cy.get(`#${IDS.page}`).contains('2 activities').should('exist')
  })
})

describe('Activities List — Type filter', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
    // Return one Run so the Run chip appears
    stubActivitiesHappy([makeActivity({ activity_type: 'Run' })])
    cy.visit(ROUTE)
    cy.wait('@getActivities')
  })

  it('clicking a type chip adds ?type= to the URL', () => {
    // The page builds type chips from knownTypes based on loaded data.
    // After the initial load, a "Run" chip should be visible.
    cy.contains('button', 'Run').click()
    cy.url().should('include', 'type=Run')
  })

  it('clicking "All" chip removes ?type= from the URL', () => {
    // First set type=Run
    cy.contains('button', 'Run').click()
    cy.url().should('include', 'type=Run')

    // Then click All
    cy.contains('button', 'All').click()
    cy.url().should('not.include', 'type=')
  })
})

describe('Activities List — Pagination', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
  })

  it('pagination controls appear when total > limit', () => {
    // total=25, limit=20 → totalPages=2 → pagination should render
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [makeActivity()], total: 25, page: 1, limit: 20 },
    }).as('getActivitiesPaged')

    cy.visit(ROUTE)
    cy.wait('@getActivitiesPaged')

    cy.get('button[aria-label="Next page"]').should('be.visible')
    cy.get('button[aria-label="Previous page"]').should('be.visible')
  })

  it('clicking Next page adds ?page=2 to the URL', () => {
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [makeActivity()], total: 25, page: 1, limit: 20 },
    }).as('getActivitiesPaged')

    cy.visit(ROUTE)
    cy.wait('@getActivitiesPaged')

    cy.get('button[aria-label="Next page"]').click()
    cy.url().should('include', 'page=2')
  })

  it('Prev button is disabled on page 1', () => {
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [makeActivity()], total: 25, page: 1, limit: 20 },
    }).as('getActivitiesPaged')

    cy.visit(ROUTE)
    cy.wait('@getActivitiesPaged')

    cy.get('button[aria-label="Previous page"]').should('be.disabled')
  })

  it('pagination controls do NOT appear when total <= limit', () => {
    // total=5, limit=20 → only one page → no pagination bar
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [makeActivity()], total: 5, page: 1, limit: 20 },
    }).as('getActivitiesSingle')

    cy.visit(ROUTE)
    cy.wait('@getActivitiesSingle')

    cy.get('button[aria-label="Next page"]').should('not.exist')
  })
})

describe('Activities List — Error state', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()
  })

  it('shows error state when API returns 500', () => {
    stubActivitiesError()
    cy.visit(ROUTE)
    cy.wait('@getActivitiesError')

    cy.get(`#${IDS.error}`, { timeout: 10000 }).should('be.visible')
    cy.get(`#${IDS.loading_skeleton}`).should('not.exist')
  })

  it('error state contains a "Try again" affordance', () => {
    stubActivitiesError()
    cy.visit(ROUTE)
    cy.wait('@getActivitiesError')

    cy.get(`#${IDS.error}`).contains('Try again').should('be.visible')
  })
})

describe('Activities List — Empty state', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.setupApiAuthCookies()
    stubRtUsers()

    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [], total: 0, page: 1, limit: 20 },
    }).as('getActivitiesEmpty')

    cy.visit(ROUTE)
    cy.wait('@getActivitiesEmpty')
  })

  it('shows "No activities yet." message when data array is empty', () => {
    cy.get(`#${IDS.page}`).contains('No activities yet.').should('be.visible')
  })

  it('does NOT render any table rows when data is empty', () => {
    // No real data rows — skeleton is also gone
    cy.get(`#${IDS.loading_skeleton}`).should('not.exist')
    cy.get(`#${IDS.error}`).should('not.exist')
    // The list body should have no clickable rows
    cy.get(`#${IDS.list}`).find('tr[class*="cursor-pointer"]').should('not.exist')
  })

  it('shows "No activities match your filters." when type filter is active with no results', () => {
    // Visit with an explicit type that returns nothing
    cy.intercept('GET', `${ACTIVITIES_ENDPOINT}*`, {
      statusCode: 200,
      body: { data: [], total: 0, page: 1, limit: 20 },
    }).as('getActivitiesFilteredEmpty')

    cy.visit(`${ROUTE}?type=Swim`)
    cy.wait('@getActivitiesFilteredEmpty')

    cy.get(`#${IDS.page}`).contains('No activities match your filters.').should('be.visible')
  })
})
