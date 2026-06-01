import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ACTIVITY_ID = 'test-ui-activity-001'
const DETAIL_URL = `/main/running/activities/${ACTIVITY_ID}`
const AI_EP = RUNNING_ENDPOINTS.AI_INSIGHTS_LIST

// Shared fixtures

const baseActivity = {
  id: ACTIVITY_ID,
  name: 'Morning Run',
  activity_type: 'Run',
  source: 'strava',
  started_at: '2026-05-26T06:00:00Z',
  distance_m: 10000,
  moving_time_sec: 3000,
  duration_sec: 3060,
  avg_pace_sec_per_km: 300,
  avg_hr: 145,
  max_hr: 168,
  avg_cadence: 85,
  elevation_gain_m: 50,
  calories: 600,
  pr_count: 0,
  workout_type: null,
  summary_polyline: null,
  gear: null,
  device_name: null,
  notes: null,
  weather_summary: null,
  zones: null,
  efficiency_factor: null,
  estimated_vo2max: null,
  aerobic_decoupling: null,
  avg_temp_c: null,
}

const splitWithHr = (n, hr) => ({
  id: `split-${n}`,
  split_number: n,
  distance_m: 1000,
  duration_sec: 300,
  pace_sec_per_km: 300,
  avg_hr: hr,
  elevation_gain_m: 0,
})

const bestEffortFixture = [
  { id: 'be-1', name: '1 km', distance_m: 1000, elapsed_time_sec: 240, pr_rank: 1 },
  { id: 'be-2', name: '5 km', distance_m: 5000, elapsed_time_sec: 1300, pr_rank: null },
]

const lapFixture = [
  {
    id: 'lap-1',
    lap_index: 1,
    name: 'Lap 1',
    distance_m: 1000,
    elapsed_time_sec: 310,
    moving_time_sec: 300,
    avg_hr: 140,
    total_elevation_gain_m: 5,
  },
  {
    id: 'lap-2',
    lap_index: 2,
    name: 'Lap 2',
    distance_m: 1000,
    elapsed_time_sec: 295,
    moving_time_sec: 290,
    avg_hr: 148,
    total_elevation_gain_m: 3,
  },
]

// Shared stubs

const stubRtUsers = () => {
  cy.intercept('GET', '**/rest/v1/rt_users*', {
    statusCode: 200,
    body: [{ id: 'test-user', onboarding_complete: true }],
  }).as('rtUsersCheck')
}

const stubActivity = (overrides = {}, extra = {}) => {
  cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
    statusCode: 200,
    body: {
      activity: { ...baseActivity, ...overrides },
      splits: extra.splits ?? [],
      laps: extra.laps ?? [],
      best_efforts: extra.best_efforts ?? [],
      photos: [],
    },
  }).as('getActivity')
}

const stubDashboard = (nextRaceGoal = null) => {
  cy.intercept('GET', '/api/running/v1/dashboard', {
    statusCode: 200,
    body: {
      data: {
        training_load: { next_race_goal: nextRaceGoal },
        weekly_stats: null,
        ytd_stats: null,
        recent_activities: [],
        health_checkin: null,
      },
    },
  }).as('getDashboard')
}

const stubRaceLog = (entries = []) => {
  cy.intercept('GET', '/api/running/v1/race-log*', {
    statusCode: 200,
    body: { data: entries },
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

const stubInsightEmpty = () => {
  cy.intercept('GET', `${AI_EP}*`, { statusCode: 200, body: { data: [] } }).as('getInsight')
}

// fetchSubjectiveHealthByDate returns data?.data?.[0] ?? null
// so the API response must be { data: [healthObj] } for a real log, or { data: [] } for null
const stubHealthNull = () => {
  cy.intercept('GET', '/api/running/v1/health/subjective*', {
    statusCode: 200,
    body: { data: [] },
  }).as('getHealth')
}

const stubHealthData = (log) => {
  cy.intercept('GET', '/api/running/v1/health/subjective*', {
    statusCode: 200,
    body: { data: [log] },
  }).as('getHealth')
}

const visitAndWait = () => {
  cy.viewport(1280, 900)
  cy.visit(DETAIL_URL)
  cy.wait('@getActivity')
}

describe('Activity Detail UI — Auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(DETAIL_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

describe('Activity Detail UI — Page root', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders #activityDetailPage root element', () => {
    cy.get('#activityDetailPage').should('exist')
  })

  it('shows the activity name in the header', () => {
    cy.get('#activityDetailPage').within(() => {
      cy.contains('Morning Run').should('be.visible')
    })
  })

  it('renders the next race goal edit button', () => {
    // The edit goal button is below the main card — scroll into view before asserting
    cy.get('#editGoalBtn_activityDetailPage').scrollIntoView().should('exist')
  })
})

describe('Activity Detail UI — Derived metrics with data', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({
      efficiency_factor: 1.2345,
      estimated_vo2max: 52.3,
      aerobic_decoupling: 3.5,
    })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders efficiencyFactor tile when data is present', () => {
    cy.get('#efficiencyFactor_activityDetailPage').should('exist')
    cy.get('#efficiencyFactor_activityDetailPage').within(() => {
      cy.contains('1.2345').should('be.visible')
    })
  })

  it('renders estimatedVo2max tile when data is present', () => {
    cy.get('#estimatedVo2max_activityDetailPage').should('exist')
    cy.get('#estimatedVo2max_activityDetailPage').within(() => {
      cy.contains('52.3').should('be.visible')
    })
  })

  it('renders aeroDrift pill for aerobic_decoupling < 5% with Good label', () => {
    cy.get('#aeroDrift_activityDetailPage').should('exist')
    cy.get('#aeroDrift_activityDetailPage').within(() => {
      cy.contains('Decouple').should('be.visible')
      cy.contains('Good').should('be.visible')
    })
  })
})

describe('Activity Detail UI — Derived metrics guide shown when no HR data', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({
      efficiency_factor: null,
      estimated_vo2max: null,
      aerobic_decoupling: null,
      activity_type: 'Run',
    })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('shows derivedMetricsGuide when EF, VO2max, and aeroDrift are all null for a Run', () => {
    cy.get('#derivedMetricsGuide_activityDetailPage').should('exist')
    cy.get('#derivedMetricsGuide_activityDetailPage').within(() => {
      cy.contains('heart rate data').should('be.visible')
    })
  })

  it('does not render EF or VO2max tiles when data is null', () => {
    cy.get('#efficiencyFactor_activityDetailPage').should('not.exist')
    cy.get('#estimatedVo2max_activityDetailPage').should('not.exist')
  })
})

describe('Activity Detail UI — Notes inline edit (happy path)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({ notes: null })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()

    cy.intercept('PATCH', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 200,
      body: {
        data: { ...baseActivity, notes: 'Felt great today' },
      },
    }).as('patchActivity')

    visitAndWait()
  })

  it('clicking notesEditBtn opens the textarea in edit mode', () => {
    cy.get('#notesEditBtn_activityDetailPage').should('be.visible').click()
    cy.get('#notesTextarea_activityDetailPage').should('be.visible').and('be.focused')
  })

  it('typing and saving a note calls PATCH and shows toast success', () => {
    cy.get('#notesEditBtn_activityDetailPage').click()
    cy.get('#notesTextarea_activityDetailPage').type('Felt great today')
    cy.get('#notesSaveBtn_activityDetailPage').click()

    cy.wait('@patchActivity').its('request.body').should('deep.include', {
      notes: 'Felt great today',
    })

    cy.contains('Notes saved').should('be.visible')
  })

  it('save button is disabled while saving is in progress', () => {
    cy.intercept('PATCH', `/api/running/v1/activities/${ACTIVITY_ID}`, (req) => {
      req.reply((res) => {
        res.setDelay(400)
        res.send({ statusCode: 200, body: { data: { ...baseActivity, notes: 'Test' } } })
      })
    }).as('patchActivityDelayed')

    cy.get('#notesEditBtn_activityDetailPage').click()
    cy.get('#notesTextarea_activityDetailPage').type('Test')
    cy.get('#notesSaveBtn_activityDetailPage').click()

    cy.get('#notesSaveBtn_activityDetailPage').should('be.disabled')
    cy.wait('@patchActivityDelayed')
  })
})

describe('Activity Detail UI — Notes cancel discards changes', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({ notes: 'Original note' })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('clicking cancel hides the textarea and restores view mode', () => {
    cy.get('#notesEditBtn_activityDetailPage').click()
    cy.get('#notesTextarea_activityDetailPage').should('be.visible').clear().type('Unsaved change')

    cy.get('#notesCancelBtn_activityDetailPage').click()

    // Edit form is gone
    cy.get('#notesTextarea_activityDetailPage').should('not.exist')
    // View mode button is back
    cy.get('#notesEditBtn_activityDetailPage').should('exist')
  })
})

describe('Activity Detail UI — Notes save API error shows toast', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({ notes: null })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()

    cy.intercept('PATCH', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 500,
      body: { error: 'Internal server error', message: 'Something went wrong' },
    }).as('patchActivityError')

    visitAndWait()
  })

  it('shows toast error when PATCH fails', () => {
    cy.get('#notesEditBtn_activityDetailPage').click()
    cy.get('#notesTextarea_activityDetailPage').type('Some note')
    cy.get('#notesSaveBtn_activityDetailPage').click()

    cy.wait('@patchActivityError')
    // updateActivity throws data.message → page does toast.error(err.message || 'Failed to save notes')
    cy.contains('Something went wrong').should('be.visible')
  })

  it('keeps the edit form open after a save failure', () => {
    cy.get('#notesEditBtn_activityDetailPage').click()
    cy.get('#notesTextarea_activityDetailPage').type('Some note')
    cy.get('#notesSaveBtn_activityDetailPage').click()

    cy.wait('@patchActivityError')
    cy.get('#notesTextarea_activityDetailPage').should('be.visible')
  })
})

describe('Activity Detail UI — Edit Goal modal open/close', () => {
  const existingGoal = {
    id: 'goal-001',
    title: 'Bali Marathon 2026',
    distance_m: 42195,
    target_date: '2026-10-15',
    description: '',
  }

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard(existingGoal)
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('clicking editGoalBtn opens the edit goal modal', () => {
    cy.get('#editGoalBtn_activityDetailPage').scrollIntoView().click()
    cy.get('#editGoalModal_activityDetailPage').should('be.visible')
    cy.get('#editGoalModal_activityDetailPage').within(() => {
      cy.contains('Edit race goal').should('be.visible')
    })
  })

  it('clicking Cancel closes the modal without saving', () => {
    cy.get('#editGoalBtn_activityDetailPage').scrollIntoView().click()
    cy.get('#editGoalModal_activityDetailPage').should('be.visible')

    cy.get('#editGoalModal_activityDetailPage').within(() => {
      cy.contains('Cancel').click()
    })

    cy.get('#editGoalModal_activityDetailPage').should('not.exist')
  })
})

describe('Activity Detail UI — Edit Goal modal save', () => {
  // This describe does NOT stub the dashboard — it uses the real dashboard response
  // so that nextRaceGoal has a real ID. The PATCH is intercepted generically.

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    // Let the real dashboard response populate nextRaceGoal with its actual ID
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()

    // Intercept any PATCH to goals (wildcard ID) — real goal ID from dashboard
    cy.intercept('PATCH', '/api/running/v1/goals/*', {
      statusCode: 200,
      body: {
        data: { title: 'New Title' },
        message: 'Goal updated',
      },
    }).as('patchGoal')

    visitAndWait()
  })

  it('saving the modal calls PATCH goals and closes the dialog', () => {
    // The edit goal button always renders once the activity card loads
    cy.get('#editGoalBtn_activityDetailPage').scrollIntoView().should('exist').click()

    // Wait for the modal to fully open; the title input is populated by useEffect
    cy.get('#editGoalModal_activityDetailPage').should('be.visible')
    cy.get('#goalTitle').should('be.visible')

    // Use {selectall} to reliably replace the react-hook-form controlled input value
    cy.get('#goalTitle').type('{selectall}New Title')

    cy.get('#editGoalSaveBtn_activityDetailPage').click()
    cy.wait('@patchGoal')

    // Modal should close after successful save
    cy.get('#editGoalModal_activityDetailPage').should('not.exist')
  })

  it('toast success is shown after saving the goal', () => {
    cy.get('#editGoalBtn_activityDetailPage').scrollIntoView().should('exist').click()
    cy.get('#editGoalModal_activityDetailPage').should('be.visible')
    cy.get('#goalTitle').should('be.visible').type('{selectall}New Title')
    cy.get('#editGoalSaveBtn_activityDetailPage').click()
    cy.wait('@patchGoal')

    cy.contains('Race goal updated').should('be.visible')
  })
})

describe('Activity Detail UI — Linked race badge visible', () => {
  const linkedEntry = {
    id: 'race-entry-001',
    title: 'Bali Half Marathon',
    activity_id: ACTIVITY_ID,
    finish_time_sec: 5400,
    race_date: '2026-05-26',
    distance_m: 21097,
  }

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog([linkedEntry])
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('shows #linkedRaceBadge_activityDetailPage when race-log has a matching activity_id', () => {
    cy.get('#linkedRaceBadge_activityDetailPage').should('exist')
    cy.get('#linkedRaceBadge_activityDetailPage').within(() => {
      cy.contains('Race Entry').should('be.visible')
      cy.contains('Bali Half Marathon').should('be.visible')
    })
  })

  it('shows formatted finish time in the linked race badge', () => {
    cy.get('#linkedRaceBadge_activityDetailPage').within(() => {
      // 5400 sec = 1:30:00
      cy.contains('1:30:00').should('be.visible')
    })
  })
})

describe('Activity Detail UI — Linked race badge hidden', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog([
      {
        id: 'race-entry-002',
        title: 'Different Race',
        activity_id: 'other-activity-id',
        finish_time_sec: 3600,
        distance_m: 10000,
      },
    ])
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('does not render #linkedRaceBadge_activityDetailPage when no race entry matches', () => {
    cy.get('#linkedRaceBadge_activityDetailPage').should('not.exist')
  })
})

describe('Activity Detail UI — Pre-activity context with no health log', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    // Return empty array → fetchSubjectiveHealthByDate returns null → healthLog = null
    cy.intercept('GET', '/api/running/v1/health/subjective*', {
      statusCode: 200,
      body: { data: [] },
    }).as('getHealthEmpty')
    visitAndWait()
    cy.wait('@getHealthEmpty')
  })

  it('shows #preActivityContext_activityDetailPage with no-log prompt', () => {
    cy.get('#preActivityContext_activityDetailPage').should('exist')
    cy.get('#preActivityContext_activityDetailPage').within(() => {
      cy.contains('No health log for this day').should('be.visible')
    })
  })
})

describe('Activity Detail UI — Pre-activity context with health log', () => {
  const healthLog = {
    id: 'health-001',
    log_date: '2026-05-26',
    sleep_hours: 7.5,
    sleep_quality: 8,
    morning_energy: 4,
    mood: 4,
    soreness_level: 2,
    manual_rhr: 52,
    notes: 'Felt rested',
  }

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity()
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    // fetchSubjectiveHealthByDate reads data?.data?.[0] ?? null
    stubHealthData(healthLog)
    visitAndWait()
    cy.wait('@getHealth')
  })

  it('shows sleep hours in pre-activity context', () => {
    cy.get('#preActivityContext_activityDetailPage').should('exist')
    cy.get('#preActivityContext_activityDetailPage').within(() => {
      cy.contains('7.5h').should('be.visible')
    })
  })

  it('shows energy level label (High for value 4)', () => {
    cy.get('#preActivityContext_activityDetailPage').within(() => {
      cy.contains('High').should('be.visible')
    })
  })

  it('shows mood label (Good for value 4)', () => {
    cy.get('#preActivityContext_activityDetailPage').within(() => {
      cy.contains('Good').should('be.visible')
    })
  })

  it('shows RHR value', () => {
    cy.get('#preActivityContext_activityDetailPage').within(() => {
      cy.contains('52 bpm').should('be.visible')
    })
  })
})

describe('Activity Detail UI — Splits table with cardiac drift', () => {
  // Two splits — first HR 140, second HR 158 → cardiac drift = +18 bpm
  const splits = [splitWithHr(1, 140), splitWithHr(2, 158)]

  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({}, { splits })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders "Splits (per km)" section label', () => {
    // The section label is inside overflow-hidden card — use exist check and scroll
    cy.contains('Splits (per km)').scrollIntoView().should('exist')
  })

  it('renders a table row for each split', () => {
    // Wait for section to exist before querying table
    cy.contains('Splits (per km)').should('exist')
    cy.get('tbody tr').should('have.length.gte', 2)
  })

  it('renders #cardiacDrift_activityDetailPage with +18 bpm drift', () => {
    cy.get('#cardiacDrift_activityDetailPage').scrollIntoView().should('exist')
    cy.get('#cardiacDrift_activityDetailPage').within(() => {
      cy.contains('Cardiac drift:').should('exist')
      cy.contains('+18 bpm').should('exist')
    })
  })
})

describe('Activity Detail UI — EF trend arrow present', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({
      efficiency_factor: 1.25,
      efficiency_factor_30d_avg: 1.18,
    })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders #efTrendArrow when efficiency_factor_30d_avg is present', () => {
    cy.get('#efficiencyFactor_activityDetailPage').scrollIntoView().should('exist')
    cy.get('#efTrendArrow').should('exist')
  })

  it('shows TrendingUp (green) icon when EF is above 30d avg', () => {
    cy.get('#efTrendArrow').should('have.class', 'text-green-500')
  })

  it('title attribute reflects the 30d average value', () => {
    cy.get('#efTrendArrow').should('have.attr', 'title').and('include', '1.1800')
  })
})

describe('Activity Detail UI — EF trend arrow below average', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({
      efficiency_factor: 1.1,
      efficiency_factor_30d_avg: 1.18,
    })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('shows TrendingDown (red) icon when EF is below 30d avg', () => {
    cy.get('#efTrendArrow').should('exist').and('have.class', 'text-red-400')
  })
})

describe('Activity Detail UI — EF trend arrow hidden when no 30d avg', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({
      efficiency_factor: 1.25,
      efficiency_factor_30d_avg: null,
    })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('does not render #efTrendArrow when efficiency_factor_30d_avg is null', () => {
    cy.get('#efTrendArrow').should('not.exist')
  })
})

describe('Activity Detail UI — No splits table when splits are empty', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({}, { splits: [] })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('does not render the splits section when splits array is empty', () => {
    cy.contains('Splits (per km)').should('not.exist')
    cy.get('#cardiacDrift_activityDetailPage').should('not.exist')
  })
})

describe('Activity Detail UI — Best efforts table', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({}, { best_efforts: bestEffortFixture })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders the Best Efforts section with effort names', () => {
    // Use exist (not visible) — content may be inside overflow:hidden container
    cy.contains('Best Efforts').should('exist')
    cy.contains('1 km').should('exist')
    cy.contains('5 km').should('exist')
  })

  it('renders PR badge for best effort with pr_rank 1', () => {
    cy.contains('Best Efforts').should('exist')
    cy.contains('PR').should('exist')
  })
})

describe('Activity Detail UI — Laps table', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubRtUsers()
    stubActivity({}, { laps: lapFixture })
    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()
    visitAndWait()
  })

  it('renders the Laps section', () => {
    cy.contains('Laps').should('exist')
  })

  it('renders two lap rows in the table', () => {
    cy.contains('Laps').should('exist')
    // Both laps should have their lap_index as text in the table
    cy.contains('1').should('exist')
    cy.contains('2').should('exist')
  })
})

describe('Activity Detail UI — Activity fetch error state', () => {
  it('shows an error alert when GET activity returns 500', () => {
    cy.setupApiAuthCookies()
    stubRtUsers()

    cy.intercept('GET', `/api/running/v1/activities/${ACTIVITY_ID}`, {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getActivityError')

    stubDashboard()
    stubRaceLog()
    stubStreams()
    stubInsightEmpty()
    stubHealthNull()

    cy.viewport(1280, 900)
    cy.visit(DETAIL_URL)
    cy.wait('@getActivityError')

    cy.get('[role="alert"]').should('be.visible')
    cy.contains('Try again').should('be.visible')
  })
})
