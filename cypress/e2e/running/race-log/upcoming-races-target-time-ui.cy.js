// UI-only spec: uses cy.visit + DOM assertions.
// API commands in before()/beforeEach() are for stub setup only — no real DB writes.
// Covers: target_time_sec H/M/S inputs in the form modal + target time badge on cards.
// Issues: #137 (VO2max Target Effort — target time on upcoming race)

import constants from '../../../fixtures/app-constants.json'

const RACE_LOG_URL = constants.routes.running_race_log
const IDS = constants.test_ids.upcoming_races
const UPCOMING_EP = constants.endpoints.running_upcoming_races.list

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const raceWithTargetTime = {
  id: 'upcoming-with-target',
  title: 'Bali Marathon 2099',
  race_date: '2099-12-01',
  distance_m: 42195,
  location: 'Bali, Indonesia',
  notes: null,
  linked_activity_id: null,
  finish_time_sec: null,
  position_place: null,
  position_male: null,
  // 4h 00m 00s = 14400 seconds
  target_time_sec: 14400,
  created_at: '2099-01-01T00:00:00Z',
}

const raceWithoutTargetTime = {
  id: 'upcoming-no-target',
  title: 'Jakarta 10K 2099',
  race_date: '2099-06-15',
  distance_m: 10000,
  location: null,
  notes: null,
  linked_activity_id: null,
  finish_time_sec: null,
  position_place: null,
  position_male: null,
  target_time_sec: null,
  created_at: '2099-01-02T00:00:00Z',
}

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user-id', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubRaceLog = (entries = []) => {
  cy.intercept('GET', `${constants.endpoints.running_race_log.list}*`, {
    statusCode: 200,
    body: { data: entries, message: 'ok' },
  }).as('getRaceLog')
}

const stubUpcoming = (races = [], statusCode = 200) => {
  cy.intercept('GET', `${UPCOMING_EP}*`, {
    statusCode,
    body: statusCode === 200 ? { data: races, message: 'OK' } : { error: 'Server error' },
  }).as('getUpcoming')
}

const visitPage = () => {
  cy.viewport(1280, 720)
  cy.visit(RACE_LOG_URL)
}

// ---------------------------------------------------------------------------
// A. Add form — H/M/S inputs present
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — Add form shows H/M/S inputs', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([])
    visitPage()
    cy.wait('@getUpcoming')
    cy.get(`[id="${IDS.add_btn}"]`).click()
    // Give Radix Dialog animation time to finish (duration-200 in Tailwind = 200ms)
    cy.get(`[id="${IDS.form_modal}"]`, { timeout: 8000 }).should('be.visible')
  })

  it('shows target time hours input', () => {
    cy.get(`#${IDS.target_time_hours_input}`).should('exist').and('be.visible')
  })

  it('shows target time minutes input', () => {
    cy.get(`#${IDS.target_time_minutes_input}`).should('exist').and('be.visible')
  })

  it('shows target time seconds input', () => {
    cy.get(`#${IDS.target_time_seconds_input}`).should('exist').and('be.visible')
  })

  it('H/M/S inputs are empty when adding a new race', () => {
    cy.get(`#${IDS.target_time_hours_input}`).should('have.value', '')
    cy.get(`#${IDS.target_time_minutes_input}`).should('have.value', '')
    cy.get(`#${IDS.target_time_seconds_input}`).should('have.value', '')
  })

  it('accepts numeric input in the hours field', () => {
    cy.get(`#${IDS.target_time_hours_input}`).type('4')
    cy.get(`#${IDS.target_time_hours_input}`).should('have.value', '4')
  })

  it('accepts numeric input in the minutes field', () => {
    cy.get(`#${IDS.target_time_minutes_input}`).type('30')
    cy.get(`#${IDS.target_time_minutes_input}`).should('have.value', '30')
  })

  it('accepts numeric input in the seconds field', () => {
    cy.get(`#${IDS.target_time_seconds_input}`).type('45')
    cy.get(`#${IDS.target_time_seconds_input}`).should('have.value', '45')
  })
})

// ---------------------------------------------------------------------------
// B. Target time badge on card — appears when target_time_sec is set
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — badge visible when target_time_sec is set', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([raceWithTargetTime])
    visitPage()
    cy.wait('@getUpcoming')
  })

  it('renders the target time badge on the card', () => {
    cy.get(`#targetTimeBadge_${raceWithTargetTime.id}_raceLogPage`)
      .scrollIntoView()
      .should('be.visible')
  })

  it('badge shows the correct formatted time (4:00:00)', () => {
    cy.get(`#targetTimeBadge_${raceWithTargetTime.id}_raceLogPage`)
      .scrollIntoView()
      .should('contain.text', '4:00:00')
  })
})

// ---------------------------------------------------------------------------
// C. Target time badge on card — absent when target_time_sec is null
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — no badge when target_time_sec is null', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([raceWithoutTargetTime])
    visitPage()
    cy.wait('@getUpcoming')
  })

  it('does not render target time badge when target_time_sec is null', () => {
    cy.get(`#targetTimeBadge_${raceWithoutTargetTime.id}_raceLogPage`).should('not.exist')
  })

  it('renders the card without a target time badge', () => {
    cy.get('[id^="upcomingRaceCard_"]').should('have.length', 1)
    cy.get('[id^="targetTimeBadge_"]').should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// D. Both cards — with and without target time — in the same list
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — mixed list (one with, one without)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([raceWithTargetTime, raceWithoutTargetTime])
    visitPage()
    cy.wait('@getUpcoming')
  })

  it('shows exactly one target time badge for the card with target_time_sec', () => {
    cy.get('[id^="targetTimeBadge_"]').should('have.length', 1)
  })

  it('badge only appears on the card that has target_time_sec', () => {
    cy.get(`#targetTimeBadge_${raceWithTargetTime.id}_raceLogPage`).should('exist')
    cy.get(`#targetTimeBadge_${raceWithoutTargetTime.id}_raceLogPage`).should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// E. Edit modal — pre-populates existing target time in H/M/S fields
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — edit modal pre-populates H/M/S', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([raceWithTargetTime])
    visitPage()
    cy.wait('@getUpcoming')
  })

  it('edit modal is not visible on initial load', () => {
    cy.get(`[id="${IDS.form_modal}"]`).should('not.exist')
  })

  it('opens edit modal when pencil icon is clicked', () => {
    cy.get('[id^="upcomingRaceCard_"]')
      .first()
      .within(() => {
        cy.get('[aria-label="Edit upcoming race"]').click()
      })
    cy.get(`[id="${IDS.form_modal}"]`, { timeout: 8000 }).should('be.visible')
    cy.contains('Edit Upcoming Race').should('be.visible')
  })

  it('edit modal pre-populates hours field from target_time_sec (4h = 4)', () => {
    cy.get('[id^="upcomingRaceCard_"]')
      .first()
      .within(() => {
        cy.get('[aria-label="Edit upcoming race"]').click()
      })
    cy.get(`[id="${IDS.form_modal}"]`, { timeout: 8000 }).should('be.visible')
    // 14400s = 4h 0m 0s
    cy.get(`#${IDS.target_time_hours_input}`).should('have.value', '4')
  })

  it('edit modal pre-populates minutes field from target_time_sec (0m = "00")', () => {
    cy.get('[id^="upcomingRaceCard_"]')
      .first()
      .within(() => {
        cy.get('[aria-label="Edit upcoming race"]').click()
      })
    cy.get(`[id="${IDS.form_modal}"]`, { timeout: 8000 }).should('be.visible')
    // secondsToHms pads m/s to 2 digits: 0 → "00"
    cy.get(`#${IDS.target_time_minutes_input}`).should('have.value', '00')
  })

  it('edit modal pre-populates seconds field from target_time_sec (0s = "00")', () => {
    cy.get('[id^="upcomingRaceCard_"]')
      .first()
      .within(() => {
        cy.get('[aria-label="Edit upcoming race"]').click()
      })
    cy.get(`[id="${IDS.form_modal}"]`, { timeout: 8000 }).should('be.visible')
    // secondsToHms pads m/s to 2 digits: 0 → "00"
    cy.get(`#${IDS.target_time_seconds_input}`).should('have.value', '00')
  })
})

// ---------------------------------------------------------------------------
// F. Edit modal — no target time pre-populates empty H/M/S fields
// ---------------------------------------------------------------------------

describe('Upcoming Races Target Time — edit modal empty when no target time', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubRaceLog([])
    stubUpcoming([raceWithoutTargetTime])
    visitPage()
    cy.wait('@getUpcoming')
  })

  it('H/M/S fields are empty when race has no target_time_sec', () => {
    cy.get('[id^="upcomingRaceCard_"]')
      .first()
      .within(() => {
        cy.get('[aria-label="Edit upcoming race"]').click()
      })
    cy.get(`[id="${IDS.form_modal}"]`).should('have.attr', 'data-state', 'open')
    cy.get(`[id="${IDS.form_modal}"]`).should('not.have.css', 'opacity', '0')
    cy.get(`#${IDS.target_time_hours_input}`).should('have.value', '')
    cy.get(`#${IDS.target_time_minutes_input}`).should('have.value', '')
    cy.get(`#${IDS.target_time_seconds_input}`).should('have.value', '')
  })
})
