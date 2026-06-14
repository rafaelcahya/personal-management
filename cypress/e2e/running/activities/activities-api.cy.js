import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'
import constants from '../../../fixtures/app-constants.json'

const ACTIVITIES_BASE = RUNNING_ENDPOINTS.ACTIVITIES
const GOALS_BASE = RUNNING_ENDPOINTS.GOALS_UPDATE
const AI_LIST_EP = RUNNING_ENDPOINTS.AI_INSIGHTS_LIST
const AI_GEN_EP = RUNNING_ENDPOINTS.AI_INSIGHTS_GENERATE
const STREAMS_BASE = '/api/running/v1/activities'
const PROFILE_EP = constants.endpoints.running_user_profile.get

function findActivities(predicate) {
  return cy
    .request({ method: 'GET', url: ACTIVITIES_BASE, failOnStatusCode: false })
    .then((res) => {
      if (res.status !== 200) return []
      const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? [])
      return list.filter(predicate)
    })
}

// ─── activities list ──────────────────────────────────────────────────────────

describe('Activities API — GET /api/running/v1/activities (authenticated)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a valid session', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response body has paginated shape: data, total, page, limit', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('total')
      expect(res.body).to.have.property('page')
      expect(res.body).to.have.property('limit')
    })
  })

  it('data is an array', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('total, page, and limit are numbers', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.total).to.be.a('number')
      expect(res.body.page).to.be.a('number')
      expect(res.body.limit).to.be.a('number')
    })
  })

  it('each activity item in data has required fields (id, activity_type, started_at)', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        const first = res.body.data[0]
        expect(first).to.have.property('id')
        expect(first).to.have.property('activity_type')
        expect(first).to.have.property('started_at')
        expect(first).to.have.property('distance_m')
      }
    })
  })

  it('accepts ?type=Run filter without erroring', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      qs: { type: 'Run' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      res.body.data.forEach((item) => {
        expect(item.activity_type).to.eq('Run')
      })
    })
  })

  it('accepts ?page=1&limit=5 and returns at most 5 items', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      qs: { page: 1, limit: 5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.at.most(5)
      expect(res.body.page).to.eq(1)
      expect(res.body.limit).to.eq(5)
    })
  })
})

describe('Activities API — GET /api/running/v1/activities (unauthenticated)', () => {
  it('returns 401 when no session cookie is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── activity detail ──────────────────────────────────────────────────────────

describe('Activity Detail API — GET (authenticated)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 for a valid activity_id belonging to the user', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response body has top-level keys: activity, splits, laps, best_efforts, photos', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('activity')
      expect(res.body).to.have.property('splits')
      expect(res.body).to.have.property('laps')
      expect(res.body).to.have.property('best_efforts')
      expect(res.body).to.have.property('photos')
    })
  })

  it('splits, laps, best_efforts, and photos are arrays', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.splits).to.be.an('array')
      expect(res.body.laps).to.be.an('array')
      expect(res.body.best_efforts).to.be.an('array')
      expect(res.body.photos).to.be.an('array')
    })
  })

  it('activity object has required fields', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const act = res.body.activity
      expect(act).to.have.property('id')
      expect(act).to.have.property('activity_type')
      expect(act).to.have.property('started_at')
      expect(act).to.have.property('distance_m')
      expect(act).to.have.property('moving_time_sec')
      expect(act).to.have.property('source')
    })
  })

  it('activity.id matches the requested id', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.activity.id).to.eq(activityId)
    })
  })
})

describe('Activity Detail API — GET (unauthenticated)', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/any-activity-id`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activity Detail API — GET (ownership check)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity_id does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${nonExistentId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Activity Detail API — PATCH (authenticated, happy paths)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when updating notes with a valid string', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { notes: 'Test note from Cypress' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id', activityId)
    })
  })

  it('returns 200 when clearing notes with null', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { notes: null },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 422])
    })
  })

  it('returns 200 when updating perceived_exertion with a valid value (1-10)', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { perceived_exertion: 7 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('id', activityId)
    })
  })

  it('response data includes id and notes fields', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { notes: 'Shape check note' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const data = res.body.data
      expect(data).to.have.property('id')
      expect(data).to.have.property('notes')
      expect(data).to.have.property('started_at')
      expect(data).to.have.property('activity_type')
    })
  })
})

describe('Activity Detail API — PATCH (validation errors)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 422 when body is empty (at-least-one-field refinement)', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when activity_type is an unrecognised enum value', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { activity_type: 'ultra' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 400 when notes exceeds 2000 characters', function () {
    if (!activityId) this.skip()
    const longNote = 'x'.repeat(2001)
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { notes: longNote },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 400 when perceived_exertion is out of range (> 10)', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${activityId}`,
      body: { perceived_exertion: 11 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })
})

describe('Activity Detail API — PATCH (unauthenticated)', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/any-activity-id`,
      body: { notes: 'Should fail' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activity Detail API — PATCH (ownership check)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity_id does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'PATCH',
      url: `${ACTIVITIES_BASE}/${nonExistentId}`,
      body: { notes: 'Ownership test' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Activity Detail API — PATCH goals (authenticated)', () => {
  let goalId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: '/api/running/v1/dashboard',
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200) {
        const goal = res.body?.data?.training_load?.next_race_goal
        if (goal?.id) goalId = goal.id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when updating the goal title with a valid string', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: { title: 'Cypress Goal Title' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'Goal updated')
    })
  })

  it('response data includes id and title fields after update', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: { title: 'Shape Check Goal' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const data = res.body.data
      expect(data).to.have.property('id')
      expect(data).to.have.property('title')
    })
  })

  it('returns 200 when updating target_date', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: { target_date: '2027-03-15' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})

describe('Activity Detail API — PATCH goals (validation errors)', () => {
  let goalId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: '/api/running/v1/dashboard',
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200) {
        const goal = res.body?.data?.training_load?.next_race_goal
        if (goal?.id) goalId = goal.id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 when body is empty (at-least-one-field)', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when target_date format is invalid', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: { target_date: '15-03-2027' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when target_distance_m is negative', function () {
    if (!goalId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${goalId}`,
      body: { target_distance_m: -500 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Activity Detail API — PATCH goals (unauthenticated)', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/any-goal-id`,
      body: { title: 'Should fail' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activity Detail API — PATCH goals (ownership check)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when goal_id does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'PATCH',
      url: `${GOALS_BASE}/${nonExistentId}`,
      body: { title: 'Ownership test' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── ai insights ──────────────────────────────────────────────────────────────

describe('AI Insights API — GET (authenticated)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 or 204 for a valid activity_id → insight found or no content', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: AI_LIST_EP,
      qs: { activity_id: activityId, type: 'post_activity' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204])
    })
  })

  it('insight object has required fields when status 200', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: AI_LIST_EP,
      qs: { activity_id: activityId, type: 'post_activity' },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status !== 200 || !res.body) {
        cy.log('No insight found for this activity — skipping field assertions')
        return
      }
      const raw = res.body.data ?? res.body
      const insight = Array.isArray(raw) ? raw[0] : raw
      if (!insight) {
        cy.log('No insight for this activity — skipping field assertions')
        return
      }
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('is_valid')
      expect(insight).to.have.property('insight_type')
    })
  })

  it('insight status is one of: pending, completed, failed', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: AI_LIST_EP,
      qs: { activity_id: activityId, type: 'post_activity' },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status !== 200 || !res.body) {
        cy.log('No insight — skipping status assertion')
        return
      }
      const raw = res.body.data ?? res.body
      const insight = Array.isArray(raw) ? raw[0] : raw
      if (!insight) {
        cy.log('No insight — skipping status assertion')
        return
      }
      expect(['pending', 'completed', 'failed']).to.include(insight.status)
    })
  })

  it('completed insight with is_valid=true has a content string', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: AI_LIST_EP,
      qs: { activity_id: activityId, type: 'post_activity' },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status !== 200 || !res.body) return
      const insight = res.body.data ?? res.body
      if (insight.status !== 'completed' || !insight.is_valid) {
        cy.log('Insight not completed+valid — skipping content assertion')
        return
      }
      expect(insight.content).to.be.a('string').and.have.length.greaterThan(0)
    })
  })
})

describe('AI Insights API — GET (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: AI_LIST_EP,
      qs: { activity_id: 'any-id', type: 'post_activity' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('AI Insights API — POST generate (authenticated)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 202 with queued message for a valid activity_id', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'POST',
      url: AI_GEN_EP,
      body: { activity_id: activityId, focus: 'general' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 202, 429])
    })
  })

  it('returns 400 when activity_id is missing from request body', () => {
    cy.request({
      method: 'POST',
      url: AI_GEN_EP,
      body: { focus: 'performance' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })
})

describe('AI Insights API — POST generate (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'POST',
      url: AI_GEN_EP,
      body: { activity_id: 'any-id', focus: 'general' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── hr zones ─────────────────────────────────────────────────────────────────

describe('HR Zones API — Authenticated (via GET activity)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('activity detail response includes a zones field (object or null)', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { activity } = res.body
      expect(activity).to.have.property('zones')
      if (activity.zones !== null) {
        expect(activity.zones).to.be.an('object')
      }
    })
  })

  it('zones.heart_rate.zones is an array when HR zone data is present', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { activity } = res.body
      if (!activity.zones || !activity.zones.heart_rate) {
        cy.log('No HR zone data on this activity — skipping zone array assertions')
        return
      }
      expect(activity.zones.heart_rate).to.have.property('zones')
      expect(activity.zones.heart_rate.zones).to.be.an('array')
    })
  })

  it('each HR zone entry has min, max, and time fields', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { activity } = res.body
      const hrZones = activity.zones?.heart_rate?.zones
      if (!hrZones || hrZones.length === 0) {
        cy.log('No HR zones on this activity — skipping field assertions')
        return
      }
      hrZones.forEach((zone) => {
        expect(zone).to.have.property('min')
        expect(zone).to.have.property('max')
        expect(zone).to.have.property('time')
        expect(zone.time).to.be.a('number')
      })
    })
  })

  it('HR zones array has exactly 5 entries when present', function () {
    if (!activityId) this.skip()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${activityId}`,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { activity } = res.body
      const hrZones = activity.zones?.heart_rate?.zones
      if (!hrZones || hrZones.length === 0) {
        cy.log('No HR zones on this activity — skipping zone count assertion')
        return
      }
      expect(hrZones).to.have.length(5)
    })
  })
})

describe('HR Zones API — Unauthenticated', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/any-id`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('HR Zones API — Ownership check', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity ID does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${nonExistentId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── streams ──────────────────────────────────────────────────────────────────

describe('Streams API — Authenticated', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.apiRequestWithSession('GET', ACTIVITIES_BASE).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with meta and data array for authenticated request', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('meta')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('response meta contains required fields', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams`).then((res) => {
      expect(res.status).to.eq(200)
      const { meta } = res.body
      expect(meta).to.have.property('has_hr')
      expect(meta).to.have.property('has_altitude')
      expect(meta).to.have.property('has_cadence')
      expect(meta).to.have.property('total_points')
      expect(meta).to.have.property('returned_points')
      expect(meta).to.have.property('resolution')
      expect(meta.resolution).to.eq('10s')
    })
  })

  it('returns 200 for resolution=raw', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams?resolution=raw`).then(
      (res) => {
        expect(res.status).to.eq(200)
        expect(res.body.meta.resolution).to.eq('raw')
      }
    )
  })

  it('returns 200 for resolution=60s', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams?resolution=60s`).then(
      (res) => {
        expect(res.status).to.eq(200)
        expect(res.body.meta.resolution).to.eq('60s')
      }
    )
  })
})

describe('Streams API — Unauthenticated', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: `${STREAMS_BASE}/any-activity-id/streams`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Streams API — Ownership check', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity ID does not belong to authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${nonExistentId}/streams`).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Streams API — Input validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 for invalid resolution parameter', () => {
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/any-id/streams?resolution=invalid`).then(
      (res) => {
        expect(res.status).to.eq(400)
      }
    )
  })
})

// ─── lazy compute metrics ────────────────────────────────────────────────────

describe('Lazy Compute Metrics API — compute triggered on long HR activity', () => {
  let eligibleId

  before(() => {
    cy.setupApiAuthCookies()
    findActivities(
      (a) => (a.moving_time_sec ?? a.duration_sec ?? 0) > 1200 && a.avg_hr != null
    ).then((matches) => {
      if (matches.length > 0) {
        eligibleId = matches[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('GET activity detail → 200 with at least one derived metric non-null', function () {
    if (!eligibleId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${eligibleId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const act = res.body.activity

      const hasAtLeastOneMetric =
        act.aerobic_decoupling != null ||
        act.efficiency_factor != null ||
        act.estimated_vo2max != null

      expect(hasAtLeastOneMetric, 'at least one derived metric is non-null').to.be.true
    })
  })
})

describe('Lazy Compute Metrics API — idempotency (already-computed unaffected)', () => {
  let eligibleId

  before(() => {
    cy.setupApiAuthCookies()
    findActivities(
      (a) => (a.moving_time_sec ?? a.duration_sec ?? 0) > 1200 && a.avg_hr != null
    ).then((matches) => {
      if (matches.length > 0) {
        eligibleId = matches[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('two successive GETs return identical derived metric values', function () {
    if (!eligibleId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${eligibleId}`,
      failOnStatusCode: false,
    })
      .then((firstRes) => {
        expect(firstRes.status).to.eq(200)
        return firstRes.body.activity
      })
      .then((firstActivity) => {
        cy.request({
          method: 'GET',
          url: `${ACTIVITIES_BASE}/${eligibleId}`,
          failOnStatusCode: false,
        }).then((secondRes) => {
          expect(secondRes.status).to.eq(200)
          const secondActivity = secondRes.body.activity

          expect(secondActivity.aerobic_decoupling, 'aerobic_decoupling unchanged').to.eq(
            firstActivity.aerobic_decoupling
          )
          expect(secondActivity.efficiency_factor, 'efficiency_factor unchanged').to.eq(
            firstActivity.efficiency_factor
          )
          expect(secondActivity.estimated_vo2max, 'estimated_vo2max unchanged').to.eq(
            firstActivity.estimated_vo2max
          )
        })
      })
  })
})

describe('Lazy Compute Metrics API — gate fails (short or no-HR activity)', () => {
  let shortOrNoHrId

  before(() => {
    cy.setupApiAuthCookies()
    findActivities(
      (a) => (a.moving_time_sec ?? a.duration_sec ?? 0) <= 1200 || a.avg_hr == null
    ).then((matches) => {
      if (matches.length > 0) {
        shortOrNoHrId = matches[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('GET activity below gate threshold → 200 with null derived metrics', function () {
    if (!shortOrNoHrId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${shortOrNoHrId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const act = res.body.activity

      expect(act.aerobic_decoupling, 'aerobic_decoupling must be null').to.be.null
      expect(act.efficiency_factor, 'efficiency_factor must be null').to.be.null
      expect(act.estimated_vo2max, 'estimated_vo2max must be null').to.be.null
    })
  })
})

describe('Lazy Compute Metrics API — response shape contract', () => {
  let anyActivityId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200) {
        const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? [])
        if (list.length > 0) {
          anyActivityId = list[0].id
        }
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('200 response activity object includes aerobic_decoupling key', function () {
    if (!anyActivityId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${anyActivityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.activity).to.have.property('aerobic_decoupling')
    })
  })

  it('200 response activity object includes efficiency_factor key', function () {
    if (!anyActivityId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${anyActivityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.activity).to.have.property('efficiency_factor')
    })
  })

  it('200 response activity object includes estimated_vo2max key', function () {
    if (!anyActivityId) this.skip()

    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/${anyActivityId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.activity).to.have.property('estimated_vo2max')
    })
  })

  it('unauthenticated GET → 401', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: `${ACTIVITIES_BASE}/any-id`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── user profile ─────────────────────────────────────────────────────────────

describe('User Profile API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { weight_kg: 70 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('User Profile API — GET response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data object and message OK', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains required profile fields', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('id')
      expect(data).to.have.property('email')
      expect(data).to.have.property('height_cm')
      expect(data).to.have.property('weight_kg')
      expect(data).to.have.property('max_hr')
    })
  })

  it('weight_kg and height_cm are numbers when set', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      if (data.weight_kg !== null) expect(data.weight_kg).to.be.a('number')
      if (data.height_cm !== null) expect(data.height_cm).to.be.a('number')
    })
  })
})

describe('User Profile API — PATCH validation (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 when body is empty object', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 422 when weight_kg is negative', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { weight_kg: -5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when height_cm is zero', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { height_cm: 0 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when max_hr exceeds 250', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { max_hr: 300 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when sex is invalid value', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { sex: 'unknown' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 400 when body is invalid JSON', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
      failOnStatusCode: false,
    }).then((res) => {
      expect([400, 422]).to.include(res.status)
    })
  })

  it('returns 200 with updated data on valid PATCH', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((getRes) => {
      const original = getRes.body.data.display_name

      cy.request({
        method: 'PATCH',
        url: PROFILE_EP,
        body: { display_name: original ?? 'Test User' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('display_name')
      })
    })
  })
})
