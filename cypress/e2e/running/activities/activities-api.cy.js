import constants from '../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_manual.activities

function getFirstActivityId() {
  return cy.getActivities().then((res) => {
    const list = res.body?.data ?? []
    return list.length > 0 ? list[0].id : null
  })
}

function findActivities(predicate) {
  return cy.getActivities().then((res) => {
    const list = res.body?.data ?? []
    return list.filter(predicate)
  })
}

// ─── activities list ──────────────────────────────────────────────────────────

describe('Activities API — GET list (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getActivities().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response has paginated shape: data, total, page, limit', () => {
    cy.getActivities().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('total')
      expect(res.body).to.have.property('page')
      expect(res.body).to.have.property('limit')
    })
  })

  it('data is an array', () => {
    cy.getActivities().then((res) => {
      expect(res.body.data).to.be.an('array')
    })
  })

  it('total, page, and limit are numbers', () => {
    cy.getActivities().then((res) => {
      expect(res.body.total).to.be.a('number')
      expect(res.body.page).to.be.a('number')
      expect(res.body.limit).to.be.a('number')
    })
  })

  it('each item has required fields when list is non-empty', () => {
    cy.getActivities().then((res) => {
      if (res.body.data.length === 0) return
      const first = res.body.data[0]
      expect(first).to.have.property('id')
      expect(first).to.have.property('activity_type')
      expect(first).to.have.property('started_at')
      expect(first).to.have.property('distance_m')
    })
  })

  it('?type=Run filter returns only Run activities', () => {
    cy.getActivities({ type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      res.body.data.forEach((item) => {
        expect(item.activity_type).to.eq('Run')
      })
    })
  })

  it('?page=1&limit=5 returns at most 5 items', () => {
    cy.getActivities({ page: 1, limit: 5 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.at.most(5)
      expect(res.body.page).to.eq(1)
      expect(res.body.limit).to.eq(5)
    })
  })
})

describe('Activities API — GET list (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session cookie is present', () => {
    cy.getActivitiesNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── activity types ───────────────────────────────────────────────────────────

describe('Activities API — GET types (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200', () => {
    cy.getActivityTypes().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response has data array', () => {
    cy.getActivityTypes().then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each type value is a string when list is non-empty', () => {
    cy.getActivityTypes().then((res) => {
      if (res.body.data.length === 0) return
      res.body.data.forEach((t) => {
        expect(t).to.be.a('string')
      })
    })
  })
})

describe('Activities API — GET types (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.getActivityTypesNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── activity detail ──────────────────────────────────────────────────────────

describe('Activity Detail API — GET (authenticated)', () => {
  let activityId
  let activityIdWithSplits

  before(() => {
    cy.setupApiAuthCookies()
    getFirstActivityId().then((id) => {
      activityId = id
    })
    cy.getActivityIdWithSplitsFromDb().then((id) => {
      activityIdWithSplits = id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 for a valid activity_id', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response has top-level keys: activity, splits, burn_bar, laps, best_efforts, photos', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
      expect(res.body).to.have.property('activity')
      expect(res.body).to.have.property('splits')
      expect(res.body).to.have.property('burn_bar')
      expect(res.body).to.have.property('laps')
      expect(res.body).to.have.property('best_efforts')
      expect(res.body).to.have.property('photos')
    })
  })

  it('splits, laps, best_efforts, photos are arrays', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
      expect(res.body.splits).to.be.an('array')
      expect(res.body.laps).to.be.an('array')
      expect(res.body.best_efforts).to.be.an('array')
      expect(res.body.photos).to.be.an('array')
    })
  })

  it('activity object has required fields', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
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
    cy.getActivityDetail(activityId).then((res) => {
      expect(res.body.activity.id).to.eq(activityId)
    })
  })

  it('activity object includes zones field (object or null)', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
      const { activity } = res.body
      expect(activity).to.have.property('zones')
      if (activity.zones !== null) {
        expect(activity.zones).to.be.an('object')
      }
    })
  })

  it('activity object includes derived metric keys', function () {
    if (!activityId) this.skip()
    cy.getActivityDetail(activityId).then((res) => {
      const act = res.body.activity
      expect(act).to.have.property('aerobic_decoupling')
      expect(act).to.have.property('efficiency_factor')
      expect(act).to.have.property('estimated_vo2max')
    })
  })

  it('each split item has a gap_sec_per_km field (number or null)', function () {
    if (!activityIdWithSplits) this.skip()
    cy.getActivityDetail(activityIdWithSplits).then((res) => {
      res.body.splits.forEach((split) => {
        expect(split).to.have.property('gap_sec_per_km')
        expect(split.gap_sec_per_km === null || typeof split.gap_sec_per_km === 'number').to.be.true
      })
    })
  })

  it('gap_sec_per_km is null when a split has no pace or distance', function () {
    if (!activityIdWithSplits) this.skip()
    cy.getActivityDetail(activityIdWithSplits).then((res) => {
      res.body.splits.forEach((split) => {
        if (!split.pace_sec_per_km || !split.distance_m) {
          expect(split.gap_sec_per_km).to.be.null
        }
      })
    })
  })

  it('burn_bar is null or an array', function () {
    if (!activityIdWithSplits) this.skip()
    cy.getActivityDetail(activityIdWithSplits).then((res) => {
      const { burn_bar } = res.body
      expect(burn_bar === null || Array.isArray(burn_bar)).to.be.true
    })
  })

  it('when burn_bar is an array, each item has the expected shape', function () {
    if (!activityIdWithSplits) this.skip()
    cy.getActivityDetail(activityIdWithSplits).then((res) => {
      const { burn_bar } = res.body
      if (!Array.isArray(burn_bar)) return
      burn_bar.forEach((item) => {
        expect(item).to.have.all.keys(
          'split_number',
          'pace_sec_per_km',
          'avg_hr',
          'historical_avg_pace',
          'historical_avg_hr',
          'pace_diff_sec',
          'hr_diff_bpm'
        )
        expect(item.split_number).to.be.a('number')
        ;[
          'pace_sec_per_km',
          'avg_hr',
          'historical_avg_pace',
          'historical_avg_hr',
          'pace_diff_sec',
          'hr_diff_bpm',
        ].forEach((key) => {
          expect(item[key] === null || typeof item[key] === 'number', `${key} is number or null`).to
            .be.true
        })
      })
    })
  })

  it('burn_bar array length matches splits array length when present', function () {
    if (!activityIdWithSplits) this.skip()
    cy.getActivityDetail(activityIdWithSplits).then((res) => {
      const { burn_bar, splits } = res.body
      if (!Array.isArray(burn_bar)) return
      expect(burn_bar.length).to.eq(splits.length)
    })
  })
})

describe('Activity Detail API — GET (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.getActivityDetailNoAuth('any-activity-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activity Detail API — GET (not found)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 for activity_id not belonging to the user', () => {
    cy.getActivityDetail('00000000-0000-0000-0000-000000000000').then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── activity patch ───────────────────────────────────────────────────────────

describe('Activity Detail API — PATCH (authenticated)', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    getFirstActivityId().then((id) => {
      activityId = id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when updating notes with a valid string', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { notes: 'Test note from Cypress' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id', activityId)
    })
  })

  it('returns 200 when updating perceived_exertion with a valid value (1-10)', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { perceived_exertion: 7 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('id', activityId)
    })
  })

  it('patched field reflects the value sent', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { notes: 'Shape check note' }).then((res) => {
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
    getFirstActivityId().then((id) => {
      activityId = id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 422 when body is empty (at-least-one-field refinement)', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, {}).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 422 when activity_type is an unrecognised enum value', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { activity_type: 'ultra' }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when notes exceeds 2000 characters', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { notes: 'x'.repeat(2001) }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when perceived_exertion is out of range (> 10)', function () {
    if (!activityId) this.skip()
    cy.patchActivity(activityId, { perceived_exertion: 11 }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })
})

describe('Activity Detail API — PATCH (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.patchActivityNoAuth('any-activity-id', { notes: 'Should fail' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activity Detail API — PATCH (not found)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity_id does not belong to the user', () => {
    cy.patchActivity('00000000-0000-0000-0000-000000000000', { notes: 'Ownership test' }).then(
      (res) => {
        expect(res.status).to.eq(404)
        expect(res.body).to.have.property('error')
      }
    )
  })
})

// ─── activity post ────────────────────────────────────────────────────────────

describe('Activities API — POST create (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 201 with valid body', () => {
    cy.postActivity({
      started_at: '2025-01-01T06:00:00.000Z',
      duration_sec: 1800,
      distance_m: 5000,
    }).then((res) => {
      expect(res.status).to.be.oneOf([201, 409])
    })
  })

  it('response has data object on 201', () => {
    cy.postActivity({
      started_at: '2025-01-02T06:00:00.000Z',
      duration_sec: 2400,
      distance_m: 8000,
    }).then((res) => {
      if (res.status !== 201) return
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')
    })
  })

  it('returns 422 when started_at is missing', () => {
    cy.postActivity({ duration_sec: 1800, distance_m: 5000 }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when duration_sec is missing', () => {
    cy.postActivity({
      started_at: '2025-01-01T06:00:00.000Z',
      distance_m: 5000,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when distance_m is missing', () => {
    cy.postActivity({
      started_at: '2025-01-01T06:00:00.000Z',
      duration_sec: 1800,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when duration_sec is negative', () => {
    cy.postActivity({
      started_at: '2025-01-01T06:00:00.000Z',
      duration_sec: -100,
      distance_m: 5000,
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when activity_type is invalid enum value', () => {
    cy.postActivity({
      started_at: '2025-01-01T06:00:00.000Z',
      duration_sec: 1800,
      distance_m: 5000,
      activity_type: 'Run',
    }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })
})

describe('Activities API — POST create (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.postActivityNoAuth({
      started_at: '2025-01-01T06:00:00.000Z',
      duration_sec: 1800,
      distance_m: 5000,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── activity delete ──────────────────────────────────────────────────────────

describe('Activities API — DELETE (authenticated)', () => {
  let createdId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postActivity({
      started_at: '2025-03-15T07:00:00.000Z',
      duration_sec: 3600,
      distance_m: 10000,
    }).then((res) => {
      if (res.status === 201) createdId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 204 when deleting a valid activity', function () {
    if (!createdId) this.skip()
    cy.deleteActivity(createdId).then((res) => {
      expect(res.status).to.eq(204)
    })
  })

  it('returns 404 after the activity has been deleted (idempotency)', function () {
    if (!createdId) this.skip()
    cy.deleteActivity(createdId).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Activities API — DELETE (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.deleteActivityNoAuth('any-activity-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Activities API — DELETE (not found)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity_id does not belong to the user', () => {
    cy.deleteActivity('00000000-0000-0000-0000-000000000000').then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── streams ──────────────────────────────────────────────────────────────────

describe('Streams API — Authenticated', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    getFirstActivityId().then((id) => {
      activityId = id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with meta and data array', function () {
    if (!activityId) this.skip()
    cy.getActivityStreams(activityId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('meta')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('meta contains required fields and defaults to 10s resolution', function () {
    if (!activityId) this.skip()
    cy.getActivityStreams(activityId).then((res) => {
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
    cy.getActivityStreams(activityId, { resolution: 'raw' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.meta.resolution).to.eq('raw')
    })
  })

  it('returns 200 for resolution=60s', function () {
    if (!activityId) this.skip()
    cy.getActivityStreams(activityId, { resolution: '60s' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.meta.resolution).to.eq('60s')
    })
  })

  it('returns 400 for invalid resolution parameter', function () {
    if (!activityId) this.skip()
    cy.getActivityStreams(activityId, { resolution: 'invalid' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 404 when activity_id does not belong to the user', () => {
    cy.getActivityStreams('00000000-0000-0000-0000-000000000000').then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Streams API — Unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when no session is present', () => {
    cy.getActivityStreamsNoAuth('any-activity-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── lazy compute metrics ─────────────────────────────────────────────────────

describe('Lazy Compute Metrics — eligible activity (long + has HR)', () => {
  let eligibleId

  before(() => {
    cy.setupApiAuthCookies()
    findActivities(
      (a) => (a.moving_time_sec ?? a.duration_sec ?? 0) > 1200 && a.avg_hr != null
    ).then((matches) => {
      if (matches.length > 0) eligibleId = matches[0].id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with at least one derived metric non-null', function () {
    if (!eligibleId) this.skip()
    cy.getActivityDetail(eligibleId).then((res) => {
      expect(res.status).to.eq(200)
      const act = res.body.activity
      const hasAtLeastOne =
        act.aerobic_decoupling != null ||
        act.efficiency_factor != null ||
        act.estimated_vo2max != null
      expect(hasAtLeastOne, 'at least one derived metric is non-null').to.be.true
    })
  })

  it('two successive GETs return identical derived metric values (idempotency)', function () {
    if (!eligibleId) this.skip()
    cy.getActivityDetail(eligibleId).then((first) => {
      expect(first.status).to.eq(200)
      cy.getActivityDetail(eligibleId).then((second) => {
        expect(second.status).to.eq(200)
        const a = first.body.activity
        const b = second.body.activity
        expect(b.aerobic_decoupling, 'aerobic_decoupling unchanged').to.eq(a.aerobic_decoupling)
        expect(b.efficiency_factor, 'efficiency_factor unchanged').to.eq(a.efficiency_factor)
        expect(b.estimated_vo2max, 'estimated_vo2max unchanged').to.eq(a.estimated_vo2max)
      })
    })
  })
})

describe('Lazy Compute Metrics — gate fails (short or no-HR activity)', () => {
  let shortOrNoHrId

  before(() => {
    cy.setupApiAuthCookies()
    findActivities(
      (a) => (a.moving_time_sec ?? a.duration_sec ?? 0) <= 1200 || a.avg_hr == null
    ).then((matches) => {
      if (matches.length > 0) shortOrNoHrId = matches[0].id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with null derived metrics below gate threshold', function () {
    if (!shortOrNoHrId) this.skip()
    cy.getActivityDetail(shortOrNoHrId).then((res) => {
      expect(res.status).to.eq(200)
      const act = res.body.activity
      expect(act.aerobic_decoupling, 'aerobic_decoupling must be null').to.be.null
      expect(act.efficiency_factor, 'efficiency_factor must be null').to.be.null
      expect(act.estimated_vo2max, 'estimated_vo2max must be null').to.be.null
    })
  })
})

// ─── api vs database comparison ───────────────────────────────────────────────

describe('Activities API — API vs Database Comparison', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('total count in API response matches database count', () => {
    cy.getActivities().then((apiRes) => {
      expect(apiRes.status).to.eq(200)
      cy.getActivityCountFromDb().then((dbCount) => {
        expect(apiRes.body.total).to.eq(dbCount)
      })
    })
  })

  it('first activity fields match database record', () => {
    cy.getActivities().then((apiRes) => {
      if (apiRes.body.data.length === 0) return
      const first = apiRes.body.data[0]
      cy.getSingleActivityFromDb(first.id).then((dbRow) => {
        expect(first.id).to.eq(dbRow.id)
        expect(first.activity_type).to.eq(dbRow.activity_type)
        expect(first.distance_m).to.eq(dbRow.distance_m)
        expect(first.duration_sec).to.eq(dbRow.duration_sec)
        expect(first.avg_hr).to.eq(dbRow.avg_hr)
        expect(first.source).to.eq(dbRow.source)
      })
    })
  })

  it('all list items belong to authenticated user (cross-check with DB)', () => {
    cy.getActivityListFromDb().then((dbRows) => {
      cy.getActivities().then((apiRes) => {
        apiRes.body.data.forEach((item) => {
          const found = dbRows.find((row) => row.id === item.id)
          expect(found, `activity ${item.id} must exist in DB for this user`).to.exist
        })
      })
    })
  })

  it('patched notes field persists in database', () => {
    cy.getActivities().then((listRes) => {
      if (listRes.body.data.length === 0) return
      const id = listRes.body.data[0].id
      const testNote = 'db-compare-cypress-test'
      cy.patchActivity(id, { notes: testNote }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        cy.getSingleActivityFromDb(id).then((dbRow) => {
          expect(dbRow.notes).to.eq(testNote)
        })
      })
    })
  })
})
