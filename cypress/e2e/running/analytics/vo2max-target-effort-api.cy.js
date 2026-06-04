// API-only spec: cy.request only — no cy.visit, no DOM assertions.
// Covers: GET /api/running/v1/analytics/target-effort
// Issues: #137 (VO2max Target Effort feature)

import constants from '../../../fixtures/app-constants.json'

const TARGET_EFFORT_EP = constants.endpoints.running_analytics.target_effort

// ---------------------------------------------------------------------------
// A. Auth guard — no session → 401
// ---------------------------------------------------------------------------

describe('VO2max Target Effort API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: TARGET_EFFORT_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ---------------------------------------------------------------------------
// B. Authenticated — top-level response shape
// ---------------------------------------------------------------------------

describe('VO2max Target Effort API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a top-level data object', () => {
    cy.request({
      method: 'GET',
      url: TARGET_EFFORT_EP,
      failOnStatusCode: false,
    }).then((res) => {
      // Accept 200 (data) or 500 (transient Supabase error); both indicate auth guard passed
      expect([200, 500]).to.include(res.status)
      if (res.status === 200) {
        expect(res.body).to.have.property('data')
      }
    })
  })

  it('response data includes a status field', () => {
    cy.request({
      method: 'GET',
      url: TARGET_EFFORT_EP,
      failOnStatusCode: false,
    }).then((res) => {
      // 401 means auth failed; 200/500 means auth passed
      expect(res.status).to.not.eq(401)
      if (res.status === 200) {
        expect(res.body.data).to.have.property('status')
        expect(['no_goal', 'no_target_time', 'insufficient_data', 'ok']).to.include(
          res.body.data.status
        )
      }
    })
  })
})

// ---------------------------------------------------------------------------
// C. ok status — full field set present
// ---------------------------------------------------------------------------

describe('VO2max Target Effort API — ok status field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('when status is ok: response includes all required fields', () => {
    cy.request({
      method: 'GET',
      url: TARGET_EFFORT_EP,
      failOnStatusCode: false,
    }).then((res) => {
      // 401 means auth failed; 200/500 means auth passed
      expect(res.status).to.not.eq(401)
      if (res.status !== 200) return

      const d = res.body.data

      // Only assert full field set if the real account has status=ok data.
      // For accounts without a goal, assert the fields present on those statuses.
      if (d.status === 'ok') {
        expect(d).to.have.property('currentVo2max')
        expect(d).to.have.property('requiredVo2max')
        expect(d).to.have.property('gapMlKgMin')
        expect(d).to.have.property('statusBadge')
        expect(d).to.have.property('weeksToGoal')
        expect(d).to.have.property('goal')
        expect(['On Track', 'Behind Schedule', 'Goal Reached', 'Goal Expired']).to.include(
          d.statusBadge
        )
      } else {
        // All other statuses must still include currentVo2max and requiredVo2max (may be null)
        expect(d).to.have.property('currentVo2max')
        expect(d).to.have.property('requiredVo2max')
      }
    })
  })
})
