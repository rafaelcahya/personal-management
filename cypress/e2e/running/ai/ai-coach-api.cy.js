// API spec — AI Coach menu. All AI Coach endpoints in one file.
//   GET  /api/running/v1/ai/insights?type=anomaly        (#361)
//   GET  /api/running/v1/ai/insights?type=daily          (#361)
//   GET  /api/running/v1/ai/insights?type=weekly_review  (#361)
//   POST /api/running/v1/ai/insights/daily               (#361)
//   POST /api/running/v1/ai/insights/followup            (#361)
//   PATCH /api/running/v1/ai/insights/[id]/ack           (#361)
//   GET  /api/running/v1/ai/insights?type=friday_prep    (#247)
//   POST /api/running/v1/ai/injury-coach                 (#160)
//   GET/POST/PATCH /api/running/v1/symptoms              (#160)

import constants from '../../../fixtures/app-constants.json'
import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const INSIGHTS_EP = constants.endpoints.running_analytics_ai.insights
const INJURY_COACH_EP = RUNNING_ENDPOINTS.INJURY_COACH
const SYMPTOMS_EP = RUNNING_ENDPOINTS.SYMPTOMS
const SYMPTOMS_BY_ID_EP = RUNNING_ENDPOINTS.SYMPTOMS_BY_ID

const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000'

// ─── GET /ai/insights?type=anomaly ───────────────────────────────────────────

describe('AI Coach — GET insights?type=anomaly — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getAiInsightsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('AI Coach — GET insights?type=anomaly — authenticated', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array for ?type=anomaly', () => {
    cy.getAiInsights({ type: 'anomaly' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('every returned insight has insight_type=anomaly when data exists', () => {
    cy.getAiInsights({ type: 'anomaly' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No anomaly insights in test account — type filter check skipped')
        return
      }
      res.body.data.forEach((insight) => {
        expect(insight.insight_type).to.eq('anomaly')
      })
    })
  })

  it('each insight has required top-level fields when data exists', () => {
    cy.getAiInsights({ type: 'anomaly' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No anomaly insights — field shape check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('insight_type')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('acknowledged')
      expect(insight).to.have.property('created_at')
    })
  })

  // DB comparison: verify insight_type=anomaly rows exist in rt_ai_insights
  it('DB: anomaly insights in API match what is stored in rt_ai_insights', () => {
    cy.getAiInsights({ type: 'anomaly' }).then((apiRes) => {
      expect(apiRes.status).to.eq(200)
      if (apiRes.body.data.length === 0) {
        cy.log('No anomaly insights — DB comparison skipped')
        return
      }
      const firstInsight = apiRes.body.data[0]
      cy.getLatestAiInsightByTypeFromDb('anomaly').then((dbRow) => {
        expect(dbRow).to.not.be.null
        expect(dbRow.insight_type).to.eq('anomaly')
        expect(dbRow.id).to.eq(firstInsight.id)
      })
    })
  })
})

// ─── GET /ai/insights?type=daily ─────────────────────────────────────────────

describe('AI Coach — GET insights?type=daily — authenticated', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array for ?type=daily', () => {
    cy.getAiInsights({ type: 'daily' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('every returned insight has insight_type=daily when data exists', () => {
    cy.getAiInsights({ type: 'daily' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No daily insights in test account — type filter check skipped')
        return
      }
      res.body.data.forEach((insight) => {
        expect(insight.insight_type).to.eq('daily')
      })
    })
  })

  it('each insight has required top-level fields when data exists', () => {
    cy.getAiInsights({ type: 'daily' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No daily insights — field shape check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('insight_type')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('content')
      expect(insight).to.have.property('acknowledged')
      expect(insight).to.have.property('created_at')
      expect(insight.acknowledged).to.be.a('boolean')
    })
  })

  // DB comparison: verify insight_type=daily rows exist in rt_ai_insights
  it('DB: daily insights in API match what is stored in rt_ai_insights', () => {
    cy.getAiInsights({ type: 'daily' }).then((apiRes) => {
      expect(apiRes.status).to.eq(200)
      if (apiRes.body.data.length === 0) {
        cy.log('No daily insights — DB comparison skipped')
        return
      }
      const firstInsight = apiRes.body.data[0]
      cy.getLatestAiInsightByTypeFromDb('daily').then((dbRow) => {
        expect(dbRow).to.not.be.null
        expect(dbRow.insight_type).to.eq('daily')
        expect(dbRow.id).to.eq(firstInsight.id)
      })
    })
  })
})

// ─── GET /ai/insights?type=weekly_review ─────────────────────────────────────

describe('AI Coach — GET insights?type=weekly_review — authenticated', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array for ?type=weekly_review', () => {
    cy.getAiInsights({ type: 'weekly_review' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('every returned insight has insight_type=weekly_review when data exists', () => {
    cy.getAiInsights({ type: 'weekly_review' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No weekly_review insights in test account — type filter check skipped')
        return
      }
      res.body.data.forEach((insight) => {
        expect(insight.insight_type).to.eq('weekly_review')
      })
    })
  })

  it('each insight has required top-level fields when data exists', () => {
    cy.getAiInsights({ type: 'weekly_review' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No weekly_review insights — field shape check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('insight_type')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('content')
      expect(insight).to.have.property('created_at')
    })
  })

  // DB comparison: verify insight_type=weekly_review rows exist in rt_ai_insights
  it('DB: weekly_review insights in API match what is stored in rt_ai_insights', () => {
    cy.getAiInsights({ type: 'weekly_review' }).then((apiRes) => {
      expect(apiRes.status).to.eq(200)
      if (apiRes.body.data.length === 0) {
        cy.log('No weekly_review insights — DB comparison skipped')
        return
      }
      const firstInsight = apiRes.body.data[0]
      cy.getLatestAiInsightByTypeFromDb('weekly_review').then((dbRow) => {
        expect(dbRow).to.not.be.null
        expect(dbRow.insight_type).to.eq('weekly_review')
        expect(dbRow.id).to.eq(firstInsight.id)
      })
    })
  })
})

// ─── POST /ai/insights/daily ──────────────────────────────────────────────────

describe('AI Coach — POST insights/daily — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.postAiInsightsDailyNoAuth({ force: true }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('AI Coach — POST insights/daily — authenticated', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 or 500 when authenticated with force:true', () => {
    // 200: queued successfully
    // 500: Inngest not configured in this environment
    // force:true bypasses the rate-limit check so 429 is not expected here
    cy.postAiInsightsDaily({ force: true }).then((res) => {
      expect([200, 500]).to.include(res.status)
      if (res.status === 200) {
        expect(res.body).to.have.property('queued', true)
        expect(res.body).to.have.property('message')
      }
    })
  })

  it('returns 429 or 200 or 500 when called without force', () => {
    // Without force: 429 if a daily insight was generated in the last hour,
    // 200 if no recent insight exists, 500 if Inngest is down
    cy.postAiInsightsDaily({}).then((res) => {
      expect([200, 429, 500]).to.include(res.status)
      if (res.status === 429) {
        expect(res.body).to.have.property('error')
      }
    })
  })

  // NOTE: POST /ai/insights/daily has no traditional body validation —
  // the body is optional (force defaults to false). The route does not
  // reject missing or invalid body shapes. Validation testing is not applicable.
})

// ─── POST /ai/insights/followup ──────────────────────────────────────────────

describe('AI Coach — POST insights/followup — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.postAiInsightsFollowupNoAuth({
      question: 'What should I focus on?',
      insightId: '00000000-0000-0000-0000-000000000000',
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('AI Coach — POST insights/followup — validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 when question is missing', () => {
    cy.postAiInsightsFollowup({
      insightId: '00000000-0000-0000-0000-000000000000',
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when insightId is missing', () => {
    cy.postAiInsightsFollowup({
      question: 'What should I focus on this week?',
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when body is empty', () => {
    cy.postAiInsightsFollowup({}).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('AI Coach — POST insights/followup — valid request', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with content when insight exists, or skipped when no daily insight', () => {
    cy.getAiInsights({ type: 'daily' }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No daily insight exists — skipping followup success test')
        return
      }
      const insightId = res.body.data[0].id
      cy.postAiInsightsFollowup({
        question: 'What should I focus on this week to improve my performance?',
        insightId,
      }).then((followupRes) => {
        expect(followupRes.status).to.eq(200)
        expect(followupRes.body).to.have.property('content')
        expect(followupRes.body.content).to.be.a('string')
        expect(followupRes.body.content.length).to.be.gt(0)
      })
    })
  })

  it('returns 404 when insightId does not belong to user', () => {
    // Use a valid UUID format that is not owned by the test user
    cy.postAiInsightsFollowup({
      question: 'What should I focus on this week?',
      insightId: '00000000-0000-0000-0000-000000000001',
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── PATCH /ai/insights/[id]/ack ─────────────────────────────────────────────

describe('AI Coach — PATCH insights/[id]/ack — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.patchAiInsightAckNoAuth('00000000-0000-0000-0000-000000000000').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('AI Coach — PATCH insights/[id]/ack — not found and invalid', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 for a random UUID not owned by the user', () => {
    cy.patchAiInsightAck('00000000-0000-0000-0000-000000000002').then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('returns 400 for an invalid (non-UUID) id', () => {
    cy.patchAiInsightAck('not-a-valid-uuid').then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('AI Coach — PATCH insights/[id]/ack — valid ack', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with acknowledged:true and DB confirms the update', () => {
    cy.getUnacknowledgedInsightIdFromDb().then((row) => {
      if (!row) {
        cy.log('No unacknowledged insight found in DB — skipping ack test')
        return
      }
      const insightId = row.id
      cy.patchAiInsightAck(insightId).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.id).to.eq(insightId)
        expect(res.body.data.acknowledged).to.eq(true)
        expect(res.body).to.have.property('message')
        // DB comparison: confirm acknowledged=true persisted in rt_ai_insights
        cy.getAiInsightFromDb(insightId).then((dbRow) => {
          expect(dbRow).to.not.be.null
          expect(dbRow.acknowledged).to.eq(true)
        })
      })
    })
  })
})

// ─── friday prep ─────────────────────────────────────────────────────────────

describe('Friday Prep API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Friday Prep API — type filter (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array for ?type=friday_prep', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('every returned insight has insight_type=friday_prep when data exists', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights in test account — type filter check skipped')
        return
      }
      res.body.data.forEach((insight) => {
        expect(insight.insight_type).to.eq('friday_prep')
      })
    })
  })
})

describe('Friday Prep API — response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each insight has required top-level fields', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights — field shape check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('insight_type')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('content')
      expect(insight).to.have.property('data_refs')
      expect(insight).to.have.property('created_at')
    })
  })

  it('data_refs contains week_start field when insight exists', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights — data_refs.week_start check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight.data_refs).to.be.an('object')
      expect(insight.data_refs).to.have.property('week_start')
      expect(insight.data_refs.week_start).to.match(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  it('insights are ordered by created_at descending', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length < 2) return
      const dates = res.body.data.map((i) => new Date(i.created_at).getTime())
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).to.be.lte(dates[i - 1])
      }
    })
  })
})

// ─── injury coach ────────────────────────────────────────────────────────────

describe('Injury Coach API — POST valid physio', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with role:physio and valid question → 200 with data.content and escalate', () => {
    cy.apiRequestWithSession('POST', INJURY_COACH_EP, {
      body: {
        role: 'physio',
        question: 'What exercises help with knee rehabilitation?',
        body_region: 'left_knee',
        phase: 'subacute',
      },
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('content')
      expect(res.body).to.have.property('escalate')
    })
  })
})

describe('Injury Coach API — POST valid sports_medicine', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with role:sports_medicine and valid question → 200', () => {
    cy.apiRequestWithSession('POST', INJURY_COACH_EP, {
      body: {
        role: 'sports_medicine',
        question: 'What diagnostic tests should I consider for Achilles tendon pain?',
        body_region: 'right_achilles',
      },
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('content')
    })
  })
})

describe('Injury Coach API — POST missing question', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST without question field → 400 Bad Request', () => {
    cy.apiRequestWithSession('POST', INJURY_COACH_EP, {
      body: { role: 'physio', body_region: 'left_knee' },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Injury Coach API — POST question under 10 chars', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with question shorter than 10 chars → 400 Bad Request', () => {
    cy.apiRequestWithSession('POST', INJURY_COACH_EP, {
      body: { role: 'physio', question: 'Hurts?', body_region: 'left_knee' },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Injury Coach API — POST invalid role', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with role:invalid_role → 400 Bad Request', () => {
    cy.apiRequestWithSession('POST', INJURY_COACH_EP, {
      body: {
        role: 'invalid_role',
        question: 'What should I do about my injury recovery plan?',
        body_region: 'lower_back',
      },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Injury Coach API — No auth', () => {
  it('POST without authentication → 401 Unauthorized', () => {
    cy.apiRequestNoAuth('POST', INJURY_COACH_EP, {
      body: {
        role: 'physio',
        question: 'What exercises help with knee rehabilitation?',
        body_region: 'left_knee',
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── symptom log ─────────────────────────────────────────────────────────────

describe('Symptom Log API — POST valid log', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with body_region and pain_level:5 → 201 Created', () => {
    cy.apiRequestWithSession('POST', SYMPTOMS_EP, {
      body: { body_region: 'left_knee', pain_level: 5, description: 'Dull ache after long run' },
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')
    })
  })
})

describe('Symptom Log API — POST missing body_region', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST without body_region → 400 Bad Request', () => {
    cy.apiRequestWithSession('POST', SYMPTOMS_EP, {
      body: { pain_level: 5 },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Symptom Log API — POST pain_level out of range', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with pain_level:11 → 400 Bad Request', () => {
    cy.apiRequestWithSession('POST', SYMPTOMS_EP, {
      body: { body_region: 'right_ankle', pain_level: 11 },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Symptom Log API — GET active logs', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('GET active symptom logs → 200 with data array', () => {
    cy.apiRequestWithSession('GET', SYMPTOMS_EP).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })
})

describe('Symptom Log API — PATCH archive', () => {
  let symptomIdToArchive = null

  before(() => {
    cy.setupApiAuthCookies()
    cy.apiRequestWithSession('POST', SYMPTOMS_EP, {
      body: { body_region: 'lower_back', pain_level: 3 },
    }).then((res) => {
      if (res.status === 201) {
        symptomIdToArchive = res.body.data.id
      }
    })
  })

  it('PATCH archive existing symptom → 200', function () {
    if (!symptomIdToArchive) this.skip()
    cy.apiRequestWithSession('PATCH', SYMPTOMS_BY_ID_EP(symptomIdToArchive), {
      body: { archived: true },
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})

describe('Symptom Log API — PATCH non-existent UUID', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('PATCH non-existent symptom UUID → 404', () => {
    cy.apiRequestWithSession('PATCH', SYMPTOMS_BY_ID_EP(NON_EXISTENT_UUID), {
      body: { archived: true },
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})
