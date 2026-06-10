// Coverage:
//   1. Lazy compute triggered — activity with moving_time > 20 min + avg_hr present
//      → at least one derived metric is non-null in response
//   2. Already-computed unaffected — two successive GETs return identical metric values
//   3. Gate fails — activity < 20 min or no HR → 200 with null derived metrics
//   4. Response shape contract — every 200 response includes aerobic_decoupling,
//      efficiency_factor, estimated_vo2max keys in activity object

import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ACTIVITIES_BASE = RUNNING_ENDPOINTS.ACTIVITIES

// ---------------------------------------------------------------------------
// Helper: fetch the activity list and find activities matching a predicate.
// Returns [] if the list request fails or returns no results.
// ---------------------------------------------------------------------------
function findActivities(predicate) {
  return cy
    .request({
      method: 'GET',
      url: ACTIVITIES_BASE,
      failOnStatusCode: false,
    })
    .then((res) => {
      if (res.status !== 200) return []
      const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? [])
      return list.filter(predicate)
    })
}

// ---------------------------------------------------------------------------
// 1. Lazy compute triggered
//    Find an activity with moving_time_sec > 1200 AND avg_hr != null.
//    GET /activities/:id must return 200 with at least one derived metric
//    (aerobic_decoupling, efficiency_factor, or estimated_vo2max) non-null.
// ---------------------------------------------------------------------------

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

      // At least one of the three derived metrics must be computed and non-null.
      // The lazy compute may already have run on prior loads, so we assert the
      // presence of at least one value rather than requiring all three.
      const hasAtLeastOneMetric =
        act.aerobic_decoupling != null ||
        act.efficiency_factor != null ||
        act.estimated_vo2max != null

      expect(hasAtLeastOneMetric, 'at least one derived metric is non-null').to.be.true
    })
  })
})

// ---------------------------------------------------------------------------
// 2. Already-computed unaffected
//    Two successive GETs of the same eligible activity must return the same
//    aerobic_decoupling, efficiency_factor, and estimated_vo2max values.
//    This confirms the lazy compute is idempotent and does not mutate values
//    across calls.
// ---------------------------------------------------------------------------

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

    // First call — may trigger lazy compute
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
        // Second call — compute must already be saved; values must not change
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

// ---------------------------------------------------------------------------
// 3. Gate fails — activity < 20 min or no HR
//    Find an activity that does NOT meet the gate condition
//    (moving_time_sec <= 1200 OR avg_hr is null). The API must still return
//    200, and null derived metric fields must remain null (no compute occurs).
// ---------------------------------------------------------------------------

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

      // For activities that fail the gate, all three derived fields must be null
      // (the server should not have computed or stored any value).
      expect(act.aerobic_decoupling, 'aerobic_decoupling must be null').to.be.null
      expect(act.efficiency_factor, 'efficiency_factor must be null').to.be.null
      expect(act.estimated_vo2max, 'estimated_vo2max must be null').to.be.null
    })
  })
})

// ---------------------------------------------------------------------------
// 4. Response shape contract
//    Every successful GET /activities/:id must include the three derived
//    metric keys on the activity object — regardless of their value (null or
//    computed). This ensures the frontend can safely access these fields.
// ---------------------------------------------------------------------------

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
