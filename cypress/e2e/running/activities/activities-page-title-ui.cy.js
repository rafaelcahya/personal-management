import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { ROUTES } from '../../../fixtures/routes.js'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ACTIVITIES_ROUTE = ROUTES.running_activities
const RACE_LOG_ROUTE = ROUTES.running_race_log
const ACTIVITIES_EP = RUNNING_ENDPOINTS.ACTIVITIES
const RACE_LOG_EP = RUNNING_ENDPOINTS.RACE_LOG_LIST

// Shared helpers

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubActivities = (overrides = {}) => {
  cy.intercept('GET', `${ACTIVITIES_EP}*`, {
    statusCode: 200,
    body: { data: [], total: 0, page: 1, limit: 20, ...overrides },
  }).as('getActivities')
}

const stubRaceLog = (entries = []) => {
  cy.intercept('GET', `${RACE_LOG_EP}*`, {
    statusCode: 200,
    body: { data: entries, message: 'ok' },
  }).as('getRaceLog')
}

describe('Activities Page — Title and description inside container', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivities()
    cy.viewport(1280, 720)
    cy.visit(ACTIVITIES_ROUTE)
    cy.wait('@getActivities')
  })

  it('renders the Activities emoji title inside the white container', () => {
    cy.get(`#${TEST_IDS.running_activities.page}`)
      .contains('h2', '🏃 Activities')
      .should('exist')
  })

  it('renders the Activities description inside the white container', () => {
    cy.get(`#${TEST_IDS.running_activities.page}`)
      .contains('Browse and filter all your recorded workouts')
      .should('exist')
  })

  it('title and description are rendered inside the rounded white container, not above it', () => {
    // The title must be a descendant of the white container div (border + bg-white)
    // rather than sitting above it alongside PageHeader
    cy.get(`#${TEST_IDS.running_activities.page}`)
      .find('.bg-white')
      .contains('🏃 Activities')
      .should('exist')
  })

  it('filter bar (search input) is still visible after title is added', () => {
    cy.get(`#${TEST_IDS.running_activities.search}`).should('exist')
  })
})

describe('Activities Page — Pagination text is centered', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
  })

  it('pagination page indicator has text-center class', () => {
    // total=25 triggers two-page pagination
    cy.intercept('GET', `${ACTIVITIES_EP}*`, {
      statusCode: 200,
      body: { data: [], total: 25, page: 1, limit: 20 },
    }).as('getActivitiesPaged')

    cy.viewport(375, 812)
    cy.visit(ACTIVITIES_ROUTE)
    cy.wait('@getActivitiesPaged')

    // The pagination span shows "Page 1 of 2 · 25 activities"
    cy.contains('span', 'Page 1 of 2').should('have.class', 'text-center')
  })
})

describe('Race Log Page — Title and description inside container', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    // Stub with one entry so the container (with the title) renders
    stubRaceLog([
      {
        id: 'race-1',
        title: 'Jakarta Marathon 2025',
        race_date: '2025-11-16',
        distance_m: 42195,
        finish_time_sec: 14400,
        avg_pace_sec_per_km: 341,
        avg_hr: 158,
        elevation_gain_m: 120,
        position_place: 42,
        position_male: 8,
        did_not_finish: false,
        activity_id: null,
        notes: null,
        created_at: '2025-11-16T12:00:00Z',
      },
    ])
    cy.viewport(1280, 720)
    cy.visit(RACE_LOG_ROUTE)
    cy.wait('@getRaceLog')
  })

  it('renders the Race Log emoji title inside the white container', () => {
    cy.get(`#${TEST_IDS.race_log.page}`).contains('h2', '🏆 Race Log').should('exist')
  })

  it('renders the Race Log description inside the white container', () => {
    cy.get(`#${TEST_IDS.race_log.page}`).contains('Every finish line').should('exist')
  })

  it('race list is still visible after title is added', () => {
    cy.get(`#${TEST_IDS.race_log.list}`).should('exist')
    cy.contains('Jakarta Marathon 2025').should('be.visible')
  })
})

describe('Race Log Page — Title hidden in empty state', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    // The title container is wrapped by `!error && (loading || entries.length > 0)`
    // so it must NOT appear when the list is empty
    stubRaceLog([])
    cy.viewport(1280, 720)
    cy.visit(RACE_LOG_ROUTE)
    cy.wait('@getRaceLog')
  })

  it('does not show the Race Log title when there are no entries', () => {
    // Empty state shows a different empty state container, not the white container with title
    cy.contains('h2', '🏆 Race Log').should('not.exist')
  })

  it('shows the empty state element instead', () => {
    cy.get(`#${TEST_IDS.race_log.empty_state}`).should('exist')
  })
})
