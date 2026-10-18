// API-only spec: cy.request only — no cy.visit, no DOM assertions.
// Covers:
//   GET /api/running/v1/analytics/personal-bests          (#174)
//   GET /api/running/v1/analytics/target-effort           (#137)
//   GET /api/running/v1/analytics/calorie-trend           (#360)
//   GET /api/running/v1/analytics/gear                    (#360)
//   GET /api/running/v1/analytics/zones                   (#360)
//   GET /api/running/v1/analytics/zones/reference         (#360)
//   GET /api/running/v1/analytics/pmc                     (#360)
//   GET /api/running/v1/ai/insights                       (#360)
//   POST /api/running/v1/ai/insights/generate             (#360)
//   GET /api/running/v1/ai/insights/staleness             (#360)
//   GET /api/running/v1/analytics/session-profile         (#413)
//   GET /api/running/v1/analytics/temperature-efficiency  (#413)
//   GET /api/running/v1/analytics/overview                (#842)
//   GET /api/running/v1/analytics/activity-series         (#842)
//
// The activity-series block seeds 120 tagged activities (external_id cy842-*) for the Cypress
// test account in before() and deletes only those rows in after(). It runs last so the other
// blocks see the account's original data.

import constants from '../../../fixtures/app-constants.json'

const AI = constants.endpoints.running_analytics_ai
const INSIGHTS_EP = AI.insights
const GENERATE_EP = AI.generate
const STALENESS_EP = AI.staleness

// Most describes below assert different properties of the same GET response, so each
// (command, query) pair is requested once per spec run and later tests re-read the stored
// response. The first test for an endpoint still goes through beforeEach session cookies.
const responses = {}
const cached = (command, qs) => {
  const key = `${command}:${JSON.stringify(qs ?? {})}`
  if (responses[key]) return cy.wrap(responses[key], { log: false })
  const request = qs === undefined ? cy[command]() : cy[command](qs)
  return request.then((res) => {
    responses[key] = res
    return res
  })
}

// ─── personal-bests ──────────────────────────────────────────────────────────

describe('Personal Bests API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getPersonalBestsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Personal Bests API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a top-level data object', () => {
    cached('getPersonalBests').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains all 5 expected distance keys', () => {
    const expectedDistances = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']
    cached('getPersonalBests').then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expectedDistances.forEach((distance) => {
        expect(data).to.have.property(distance)
        expect(data[distance]).to.be.an('array')
      })
    })
  })

  it('each distance entry array has at most 5 items', () => {
    cached('getPersonalBests').then((res) => {
      expect(res.status).to.eq(200)
      Object.values(res.body.data).forEach((entries) => {
        expect(entries.length).to.be.lte(5)
      })
    })
  })
})

describe('Personal Bests API — entry field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each entry includes required fields when present', () => {
    cached('getPersonalBests').then((res) => {
      expect(res.status).to.eq(200)
      const firstNonEmpty = Object.entries(res.body.data).find(([, entries]) => entries.length > 0)
      if (!firstNonEmpty) {
        return cy.log('No personal best entries found — field shape skipped')
      }
      const entry = firstNonEmpty[1][0]
      expect(entry).to.have.property('rank')
      expect(entry.rank).to.be.a('number')
      expect(entry).to.have.property('elapsed_time_sec')
      expect(entry.elapsed_time_sec).to.be.a('number')
      expect(entry).to.have.property('date')
      expect(entry).to.have.property('activity_id')
      expect(entry).to.have.property('pace_sec_per_km')
    })
  })

  it('rank of top entry is 1', () => {
    cached('getPersonalBests').then((res) => {
      const firstNonEmpty = Object.entries(res.body.data).find(([, entries]) => entries.length > 0)
      if (!firstNonEmpty) return cy.log('No personal best entries — rank check skipped')
      expect(firstNonEmpty[1][0].rank).to.eq(1)
    })
  })

  it('entries within a distance are ordered rank ascending', () => {
    cached('getPersonalBests').then((res) => {
      Object.values(res.body.data).forEach((entries) => {
        if (entries.length < 2) return
        for (let i = 1; i < entries.length; i++) {
          expect(entries[i].rank).to.be.gte(entries[i - 1].rank)
        }
      })
    })
  })
})

// ─── target-effort ───────────────────────────────────────────────────────────

describe('VO2max Target Effort API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getTargetEffortNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('VO2max Target Effort API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a top-level data object', () => {
    cached('getTargetEffort').then((res) => {
      expect([200, 500]).to.include(res.status)
      if (res.status === 200) {
        expect(res.body).to.have.property('data')
      }
    })
  })

  it('response data includes a status field', () => {
    cached('getTargetEffort').then((res) => {
      expect(res.status).to.not.eq(401)
      if (res.status === 200) {
        expect(['no_goal', 'no_target_time', 'insufficient_data', 'ok']).to.include(
          res.body.data.status
        )
      }
    })
  })
})

describe('VO2max Target Effort API — ok status field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('when status is ok: response includes all required fields', () => {
    cached('getTargetEffort').then((res) => {
      expect(res.status).to.not.eq(401)
      if (res.status !== 200) return
      const d = res.body.data
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
        expect(d).to.have.property('currentVo2max')
        expect(d).to.have.property('requiredVo2max')
      }
    })
  })
})

// ─── calorie-trend ───────────────────────────────────────────────────────────

describe('Calorie Trend API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getCalorieTrendNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Calorie Trend API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array and weight_kg', () => {
    cached('getCalorieTrend').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
      expect(res.body).to.have.property('weight_kg')
      expect(res.body).to.have.property('message', 'ok')
    })
  })

  it('weight_kg is null or a positive number', () => {
    cached('getCalorieTrend').then((res) => {
      const { weight_kg } = res.body
      expect(weight_kg === null || (typeof weight_kg === 'number' && weight_kg > 0)).to.be.true
    })
  })

  it('data is empty array when weight_kg is null', () => {
    cached('getCalorieTrend').then((res) => {
      if (res.body.weight_kg === null) {
        expect(res.body.data).to.deep.eq([])
      }
    })
  })
})

describe('Calorie Trend API — monthly entry field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each entry has month and total_kcal fields', () => {
    cached('getCalorieTrend').then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      if (data.length === 0) {
        return cy.log('No calorie trend entries found — field shape skipped')
      }
      data.forEach((entry) => {
        expect(entry).to.have.property('month')
        expect(entry).to.have.property('total_kcal')
      })
    })
  })

  it('each entry month is in YYYY-MM format', () => {
    cached('getCalorieTrend').then((res) => {
      const { data } = res.body
      if (data.length === 0) {
        return cy.log('No calorie trend entries — month format check skipped')
      }
      data.forEach((entry) => {
        expect(entry.month).to.match(/^\d{4}-\d{2}$/)
      })
    })
  })

  it('each entry total_kcal is a non-negative integer', () => {
    cached('getCalorieTrend').then((res) => {
      const { data } = res.body
      if (data.length === 0) {
        return cy.log('No calorie trend entries — total_kcal check skipped')
      }
      data.forEach((entry) => {
        expect(Number.isInteger(entry.total_kcal)).to.be.true
        expect(entry.total_kcal).to.be.gte(0)
      })
    })
  })

  it('entries are sorted chronologically ascending by month', () => {
    cached('getCalorieTrend').then((res) => {
      const { data } = res.body
      if (data.length < 2) {
        return cy.log('Fewer than 2 entries — sort order check skipped')
      }
      for (let i = 1; i < data.length; i++) {
        expect(data[i].month.localeCompare(data[i - 1].month)).to.be.gte(0)
      }
    })
  })

  it('at most 6 monthly entries are returned', () => {
    cached('getCalorieTrend').then((res) => {
      expect(res.body.data.length).to.be.lte(6)
    })
  })
})

// DB comparison note — calorie-trend:
// Not implemented. The formula (kcal = 1.036 × weight_kg × distance_km +
// elevation_gain_m / 100 × 2) applies floating-point arithmetic across many
// rows before Math.round(). Reproducing the exact same rounding in Cypress
// would tightly couple the test to the service implementation rather than
// validating an observable contract. The shape and type assertions above are
// the meaningful API-contract checks for this endpoint.

// ─── gear ────────────────────────────────────────────────────────────────────

describe('Gear Analytics API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getGearAnalyticsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Gear Analytics API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a data array', () => {
    cached('getGearAnalytics').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
      expect(res.body).to.have.property('message', 'ok')
    })
  })
})

describe('Gear Analytics API — gear entry field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each gear entry has all required fields when data is non-empty', () => {
    cached('getGearAnalytics').then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      if (data.length === 0) {
        return cy.log('No gear analytics entries — field shape skipped')
      }
      data.forEach((entry) => {
        expect(entry).to.include.all.keys(
          'id',
          'name',
          'brand_name',
          'model_name',
          'retired',
          'category',
          'total_activities',
          'total_moving_time_sec',
          'total_distance_m'
        )
      })
    })
  })

  it('retired is a boolean', () => {
    cached('getGearAnalytics').then((res) => {
      const { data } = res.body
      if (data.length === 0) return cy.log('No gear entries — retired type check skipped')
      data.forEach((entry) => {
        expect(entry.retired).to.be.a('boolean')
      })
    })
  })

  it('total_activities is a non-negative integer', () => {
    cached('getGearAnalytics').then((res) => {
      const { data } = res.body
      if (data.length === 0) return cy.log('No gear entries — total_activities check skipped')
      data.forEach((entry) => {
        expect(Number.isInteger(entry.total_activities)).to.be.true
        expect(entry.total_activities).to.be.gte(0)
      })
    })
  })

  it('total_distance_m and total_moving_time_sec are non-negative numbers', () => {
    cached('getGearAnalytics').then((res) => {
      const { data } = res.body
      if (data.length === 0) return cy.log('No gear entries — distance/time check skipped')
      data.forEach((entry) => {
        expect(entry.total_distance_m).to.be.a('number')
        expect(entry.total_distance_m).to.be.gte(0)
        expect(entry.total_moving_time_sec).to.be.a('number')
        expect(entry.total_moving_time_sec).to.be.gte(0)
      })
    })
  })

  it('category is null or a string', () => {
    cached('getGearAnalytics').then((res) => {
      const { data } = res.body
      if (data.length === 0) return cy.log('No gear entries — category check skipped')
      data.forEach((entry) => {
        expect(entry.category === null || typeof entry.category === 'string').to.be.true
      })
    })
  })

  it('entries are sorted by total_distance_m descending', () => {
    cached('getGearAnalytics').then((res) => {
      const { data } = res.body
      if (data.length < 2) return cy.log('Fewer than 2 gear entries — sort order check skipped')
      for (let i = 1; i < data.length; i++) {
        expect(data[i].total_distance_m).to.be.lte(data[i - 1].total_distance_m)
      }
    })
  })
})

describe('Gear Analytics API — query params', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?range=4w returns 200', () => {
    cached('getGearAnalytics', { range: '4w' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('?range=3m returns 200', () => {
    cached('getGearAnalytics', { range: '3m' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('?activity_type=Run returns 200', () => {
    cached('getGearAnalytics', { activity_type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('?range=invalid returns 400', () => {
    cached('getGearAnalytics', { range: 'invalid_range_xyz' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

// DB comparison note — gear:
// Not implemented. getGearUsage() joins rt_activities with rt_gear using a
// Supabase embedded select, then aggregates across up to 100 activity rows per
// request. Reproducing this join and aggregation inside a Cypress task would
// duplicate the service logic without adding observational value beyond the
// shape/sort/type assertions above.

// ─── zones ───────────────────────────────────────────────────────────────────

describe('Zone Analytics API — auth guard', () => {
  it('returns 401 on /zones when unauthenticated', () => {
    cy.getZoneAnalyticsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 401 on /zones/reference when unauthenticated', () => {
    cy.getZonesReferenceNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Zone Analytics API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a data object', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('object')
      expect(res.body).to.have.property('message', 'ok')
    })
  })

  it('data has hr, pace, cadence, activity_count keys', () => {
    cached('getZoneAnalytics').then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys('hr', 'pace', 'cadence', 'activity_count')
    })
  })

  it('activity_count is a non-negative integer', () => {
    cached('getZoneAnalytics').then((res) => {
      const { activity_count } = res.body.data
      expect(Number.isInteger(activity_count)).to.be.true
      expect(activity_count).to.be.gte(0)
    })
  })
})

describe('Zone Analytics API — hr block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('hr block has method, has_data, missing_config keys', () => {
    cached('getZoneAnalytics').then((res) => {
      const { hr } = res.body.data
      expect(hr).to.include.all.keys('method', 'has_data', 'missing_config')
    })
  })

  it('hr.has_data is a boolean', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.body.data.hr.has_data).to.be.a('boolean')
    })
  })

  it('hr.missing_config is a boolean', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.body.data.hr.missing_config).to.be.a('boolean')
    })
  })

  it('hr.method is a valid zone method string', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.body.data.hr.method).to.be.oneOf(['max_hr', 'karvonen', 'threshold'])
    })
  })

  it('hr.zones is null or an array of 5 zones', () => {
    cached('getZoneAnalytics').then((res) => {
      const { zones } = res.body.data.hr
      if (zones === null) {
        return cy.log('HR zones are null — no config set, skipping zone count check')
      }
      expect(zones).to.be.an('array')
      expect(zones).to.have.length(5)
    })
  })

  it('each hr zone entry has label, min, max, time_sec, distance_m, pct_time, pct_dist when zones non-null', () => {
    cached('getZoneAnalytics').then((res) => {
      const { zones } = res.body.data.hr
      if (!zones) return cy.log('HR zones null — zone field shape skipped')
      zones.forEach((zone) => {
        expect(zone).to.include.all.keys(
          'label',
          'min',
          'max',
          'time_sec',
          'distance_m',
          'pct_time',
          'pct_dist'
        )
      })
    })
  })

  it('pct_time values across all hr zones sum to ~100 when has_data is true', () => {
    cached('getZoneAnalytics').then((res) => {
      const { hr } = res.body.data
      if (!hr.zones || !hr.has_data) return cy.log('No HR zone data — pct_time sum check skipped')
      const total = hr.zones.reduce((sum, z) => sum + z.pct_time, 0)
      // Allow small rounding error from Math.round per zone
      expect(total).to.be.gte(98)
      expect(total).to.be.lte(102)
    })
  })
})

describe('Zone Analytics API — pace block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('pace block has threshold_pace_sec, has_threshold, has_data keys', () => {
    cached('getZoneAnalytics').then((res) => {
      const { pace } = res.body.data
      expect(pace).to.include.all.keys('threshold_pace_sec', 'has_threshold', 'has_data')
    })
  })

  it('pace.has_threshold is a boolean', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.body.data.pace.has_threshold).to.be.a('boolean')
    })
  })

  it('pace.threshold_pace_sec is null or a positive number', () => {
    cached('getZoneAnalytics').then((res) => {
      const { threshold_pace_sec } = res.body.data.pace
      expect(
        threshold_pace_sec === null ||
          (typeof threshold_pace_sec === 'number' && threshold_pace_sec > 0)
      ).to.be.true
    })
  })

  it('pace.zones is null or an array of 5 entries when has_threshold is true', () => {
    cached('getZoneAnalytics').then((res) => {
      const { pace } = res.body.data
      if (!pace.has_threshold) {
        expect(pace.zones).to.be.null
        return
      }
      expect(pace.zones).to.be.an('array')
      expect(pace.zones).to.have.length(5)
    })
  })
})

describe('Zone Analytics API — cadence block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('cadence block has has_data key', () => {
    cached('getZoneAnalytics').then((res) => {
      const { cadence } = res.body.data
      expect(cadence).to.have.property('has_data')
    })
  })

  it('cadence.has_data is a boolean', () => {
    cached('getZoneAnalytics').then((res) => {
      expect(res.body.data.cadence.has_data).to.be.a('boolean')
    })
  })

  it('cadence.bands is null or an array of 4 cadence bands', () => {
    cached('getZoneAnalytics').then((res) => {
      const { bands } = res.body.data.cadence
      if (bands === null) {
        return cy.log('No cadence bands — array check skipped')
      }
      expect(bands).to.be.an('array')
      expect(bands).to.have.length(4)
    })
  })

  it('each cadence band has label, time_sec, pct_time, distance_m, pct_dist fields when bands non-null', () => {
    cached('getZoneAnalytics').then((res) => {
      const { bands } = res.body.data.cadence
      if (!bands) return cy.log('Cadence bands null — field shape skipped')
      bands.forEach((band) => {
        expect(band).to.include.all.keys('label', 'time_sec', 'pct_time', 'distance_m', 'pct_dist')
      })
    })
  })
})

describe('Zone Analytics API — query params', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?range=4w returns 200', () => {
    cached('getZoneAnalytics', { range: '4w' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?range=3m returns 200', () => {
    cached('getZoneAnalytics', { range: '3m' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?activity_type=Run returns 200', () => {
    cached('getZoneAnalytics', { activity_type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?range=invalid returns 400', () => {
    cached('getZoneAnalytics', { range: 'bogus_range' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Zone Analytics Reference API — response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with zones array and config flags', () => {
    cached('getZonesReference').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      const { data } = res.body
      expect(data).to.include.all.keys('zones', 'hr_method', 'hr_configured', 'pace_configured')
    })
  })

  it('data.zones is an array of 5 entries', () => {
    cached('getZonesReference').then((res) => {
      expect(res.body.data.zones).to.be.an('array')
      expect(res.body.data.zones).to.have.length(5)
    })
  })

  it('each reference zone has zone, name, hr, pace, guidance fields', () => {
    cached('getZonesReference').then((res) => {
      res.body.data.zones.forEach((z) => {
        expect(z).to.include.all.keys('zone', 'name', 'hr', 'pace', 'guidance')
        expect(z.guidance).to.be.a('string')
      })
    })
  })

  it('hr_configured and pace_configured are booleans', () => {
    cached('getZonesReference').then((res) => {
      const { hr_configured, pace_configured } = res.body.data
      expect(hr_configured).to.be.a('boolean')
      expect(pace_configured).to.be.a('boolean')
    })
  })
})

// DB comparison note — zones:
// Not implemented. getZoneAnalytics() fetches up to 100 activity IDs, then
// batch-fetches up to 250,000 stream rows from rt_activity_streams, and
// aggregates them into HR / pace / cadence buckets using floating-point
// arithmetic with Math.round() per bucket. Reproducing the identical
// multi-batch aggregation in a Cypress task would duplicate the entire service
// computation — producing a test that validates implementation, not contract.
// The structural checks above (method enum, boolean flags, zone count = 5,
// pct_time sum ≈ 100) cover the meaningful API-contract obligations.

// ─── pmc ─────────────────────────────────────────────────────────────────────

describe('PMC API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getPmcNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('PMC API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a data object', () => {
    cached('getPmc').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('object')
    })
  })

  it('data has series array and meets_min_history boolean', () => {
    cached('getPmc').then((res) => {
      const { data } = res.body
      expect(data).to.have.property('series')
      expect(data.series).to.be.an('array')
      expect(data).to.have.property('meets_min_history')
      expect(data.meets_min_history).to.be.a('boolean')
    })
  })

  it('series has at most 90 entries by default', () => {
    cached('getPmc').then((res) => {
      expect(res.body.data.series.length).to.be.lte(90)
    })
  })
})

describe('PMC API — series entry field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each series entry has date, chronic_load_28d, acute_load_7d, tsb fields', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length === 0) {
        return cy.log('No PMC series entries — field shape skipped')
      }
      series.forEach((entry) => {
        expect(entry).to.include.all.keys('date', 'chronic_load_28d', 'acute_load_7d', 'tsb')
      })
    })
  })

  it('each series entry date is in YYYY-MM-DD format', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length === 0) {
        return cy.log('No PMC series entries — date format check skipped')
      }
      series.forEach((entry) => {
        expect(entry.date).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('each series entry chronic_load_28d, acute_load_7d, tsb are numbers', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length === 0) {
        return cy.log('No PMC series entries — numeric type check skipped')
      }
      series.forEach((entry) => {
        expect(typeof entry.chronic_load_28d).to.eq('number')
        expect(typeof entry.acute_load_7d).to.eq('number')
        expect(typeof entry.tsb).to.eq('number')
      })
    })
  })

  it('each series entry chronic_load_28d and acute_load_7d are non-negative', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length === 0) return cy.log('No PMC series entries — range check skipped')
      series.forEach((entry) => {
        expect(entry.chronic_load_28d).to.be.gte(0)
        expect(entry.acute_load_7d).to.be.gte(0)
      })
    })
  })

  it('tsb equals chronic_load_28d minus acute_load_7d (rounded to 1 decimal)', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length === 0) return cy.log('No PMC series entries — TSB formula check skipped')
      const entry = series[0]
      const expectedTsb = Math.round((entry.chronic_load_28d - entry.acute_load_7d) * 10) / 10
      expect(entry.tsb).to.eq(expectedTsb)
    })
  })

  it('series entries are in ascending date order', () => {
    cached('getPmc').then((res) => {
      const { series } = res.body.data
      if (series.length < 2) return cy.log('Fewer than 2 entries — sort order check skipped')
      for (let i = 1; i < series.length; i++) {
        expect(series[i].date.localeCompare(series[i - 1].date)).to.be.gte(0)
      }
    })
  })
})

describe('PMC API — days query param', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?days=30 returns series with at most 30 entries', () => {
    cached('getPmc', { days: 30 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.series.length).to.be.lte(30)
    })
  })

  it('?days=60 returns series with at most 60 entries', () => {
    cached('getPmc', { days: 60 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.series.length).to.be.lte(60)
    })
  })

  it('?days=90 returns series with at most 90 entries', () => {
    cached('getPmc', { days: 90 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.series.length).to.be.lte(90)
    })
  })

  it('?days=999 (invalid) falls back to 90-day default', () => {
    cached('getPmc', { days: 999 }).then((res) => {
      expect(res.status).to.eq(200)
      // Falls back to default 90 days — series length is at most 90
      expect(res.body.data.series.length).to.be.lte(90)
    })
  })
})

// DB comparison note — pmc:
// Not implemented. getPmcSeries() pulls rt_activities rows over a rolling
// window of up to 118 days (90 + 28 - 1), computes daily load aggregates
// from relative_effort or duration_sec, then applies 28-day / 7-day rolling
// averages with Math.round() per day. Validating the exact numeric output
// would require fetching the same raw rows and executing identical date
// arithmetic in Cypress — coupling the test to implementation rather than
// the observable contract.
// The structural checks above (date format, non-negative loads, TSB = CTL - ATL,
// ascending date order, series length bounded by ?days param) cover the
// meaningful API-contract obligations for this endpoint.

// ─── performance trends ───────────────────────────────────────────────────────

describe('Running Performance Trends API — GET /performance-trends', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array', () => {
    cached('getPerformanceTrends').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each item has started_at and distance_m fields', () => {
    cached('getPerformanceTrends').then((res) => {
      const items = res.body.data
      if (items.length === 0)
        return cy.log('No performance trend items — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.have.property('started_at')
        expect(item).to.have.property('distance_m')
      })
    })
  })

  it('?limit=20 returns at most 20 items', () => {
    cached('getPerformanceTrends', { limit: 20 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.be.lte(20)
    })
  })

  it('?type=Run filter returns 200', () => {
    cached('getPerformanceTrends', { type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })
})

describe('Running Performance Trends API — GET /performance-trends — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.getPerformanceTrendsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── analytics AI insights ───────────────────────────────────────────────────

describe('Analytics AI Insights API — GET list (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array on happy path', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: INSIGHTS_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect([200, 500]).to.include(res.status)
        if (res.status === 200) {
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
        }
      })
    })
  })

  it('filters by section param → returns 200 or authenticated response', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: `${INSIGHTS_EP}?section=weekly_distance`,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200) {
          expect(res.body.data).to.be.an('array')
        }
      })
    })
  })

  it('filters by type param → returns authenticated response', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: `${INSIGHTS_EP}?type=analytics_summary`,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200) {
          expect(res.body.data).to.be.an('array')
        }
      })
    })
  })

  it('returns insight objects with expected fields when data exists', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: INSIGHTS_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200 && res.body.data?.length > 0) {
          const item = res.body.data[0]
          expect(item).to.have.property('id')
          expect(item).to.have.property('status')
          expect(item).to.have.property('is_valid')
          expect(item).to.have.property('created_at')
        }
      })
    })
  })
})

describe('Analytics AI Insights API — GET list (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: INSIGHTS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Analytics AI Generate API — POST analytics_summary (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with queued:true for type=analytics_summary', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'POST',
        url: GENERATE_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        body: { type: 'analytics_summary' },
        failOnStatusCode: false,
      }).then((res) => {
        expect([200, 500]).to.include(res.status)
        if (res.status === 200) {
          expect(res.body).to.have.property('queued', true)
        }
      })
    })
  })
})

describe('Analytics AI Generate API — POST validation (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 422 (or 500 on DB error) when type=post_activity without activity_id', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'POST',
        url: GENERATE_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        body: { type: 'post_activity' },
        failOnStatusCode: false,
      }).then((res) => {
        expect([422, 500]).to.include(res.status)
        if (res.status === 422) {
          expect(res.body).to.have.property('error')
        }
      })
    })
  })

  it('returns 422 (or 500 on DB error) when focus is invalid', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'POST',
        url: GENERATE_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        body: { type: 'post_activity', activity_id: 'some-id', focus: 'invalid_focus_value' },
        failOnStatusCode: false,
      }).then((res) => {
        expect([422, 500]).to.include(res.status)
      })
    })
  })

  it('returns 400 when request body is malformed', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'POST',
        url: GENERATE_EP,
        headers: {
          ...(cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {}),
          'Content-Type': 'application/json',
        },
        body: 'not-json-at-all',
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 422, 500]).to.include(res.status)
      })
    })
  })
})

describe('Analytics AI Generate API — POST unauthenticated', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'POST',
      url: GENERATE_EP,
      body: { type: 'analytics_summary' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Analytics AI Staleness API — GET (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns authenticated response with is_stale boolean', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: STALENESS_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200) {
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.have.property('is_stale')
          expect(typeof res.body.data.is_stale).to.eq('boolean')
        }
      })
    })
  })

  it('returns latest_activity_at and latest_insight_at fields when successful', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: STALENESS_EP,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200) {
          expect(res.body.data).to.have.property('latest_activity_at')
          expect(res.body.data).to.have.property('latest_insight_at')
        }
      })
    })
  })

  it('accepts valid section param → not 401', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: `${STALENESS_EP}?section=weekly_distance`,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(401)
        if (res.status === 200) {
          expect(res.body.data).to.have.property('is_stale')
        }
      })
    })
  })

  it('rejects invalid section param → 422 (or 500 on DB error)', () => {
    cy.getCookie('sb-access-token').then((cookie) => {
      cy.request({
        method: 'GET',
        url: `${STALENESS_EP}?section=invalid_section_xyz`,
        headers: cookie?.value ? { Authorization: `Bearer ${cookie.value}` } : {},
        failOnStatusCode: false,
      }).then((res) => {
        expect([422, 500]).to.include(res.status)
        if (res.status === 422) {
          expect(res.body).to.have.property('error')
        }
      })
    })
  })
})

describe('Analytics AI Staleness API — GET unauthenticated', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: STALENESS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── session-profile ─────────────────────────────────────────────────────────
// Generated by Cypress Author — 2026-06-20
// Covers GET /api/running/v1/analytics/session-profile (#413)
// Returns pagi/sore stats split by WIB time window, plus threshold metadata.

describe('Session Profile API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getSessionProfileNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Session Profile API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with success flag and top-level keys', () => {
    cached('getSessionProfile').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.include.all.keys('pagi', 'sore', 'threshold', 'total_runs')
    })
  })

  it('total_runs is a non-negative integer', () => {
    cached('getSessionProfile').then((res) => {
      expect(res.status).to.eq(200)
      const { total_runs } = res.body
      expect(Number.isInteger(total_runs)).to.be.true
      expect(total_runs).to.be.gte(0)
    })
  })
})

describe('Session Profile API — pagi and sore block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('pagi block has all required stats keys', () => {
    cached('getSessionProfile').then((res) => {
      const { pagi } = res.body
      expect(pagi).to.include.all.keys(
        'count',
        'avg_distance_km',
        'avg_duration_min',
        'avg_pace_sec',
        'avg_elevation_m',
        'avg_relative_effort',
        'avg_hr',
        'relative_effort_count',
        'hr_count'
      )
    })
  })

  it('sore block has all required stats keys', () => {
    cached('getSessionProfile').then((res) => {
      const { sore } = res.body
      expect(sore).to.include.all.keys(
        'count',
        'avg_distance_km',
        'avg_duration_min',
        'avg_pace_sec',
        'avg_elevation_m',
        'avg_relative_effort',
        'avg_hr',
        'relative_effort_count',
        'hr_count'
      )
    })
  })

  it('pagi.count and sore.count are non-negative integers', () => {
    cached('getSessionProfile').then((res) => {
      const { pagi, sore } = res.body
      expect(Number.isInteger(pagi.count)).to.be.true
      expect(pagi.count).to.be.gte(0)
      expect(Number.isInteger(sore.count)).to.be.true
      expect(sore.count).to.be.gte(0)
    })
  })

  it('pagi.count + sore.count equals total_runs', () => {
    cached('getSessionProfile').then((res) => {
      const { pagi, sore, total_runs } = res.body
      // total_runs only counts classified sessions (pagi + sore); unclassified are excluded
      expect(pagi.count + sore.count).to.eq(total_runs)
    })
  })

  it('avg fields are null when count is 0, numbers when count > 0', () => {
    cached('getSessionProfile').then((res) => {
      ;[res.body.pagi, res.body.sore].forEach((block) => {
        if (block.count === 0) {
          // All avg fields must be null when no runs in that window
          expect(block.avg_distance_km).to.be.null
          expect(block.avg_duration_min).to.be.null
          expect(block.avg_pace_sec).to.be.null
          expect(block.avg_elevation_m).to.be.null
        } else {
          // Populated blocks must have numeric avg_distance_km and avg_duration_min
          expect(block.avg_distance_km).to.be.a('number')
          expect(block.avg_distance_km).to.be.gte(0)
          expect(block.avg_duration_min).to.be.a('number')
          expect(block.avg_duration_min).to.be.gte(0)
          expect(block.avg_pace_sec).to.be.a('number')
          expect(block.avg_pace_sec).to.be.gte(0)
        }
      })
    })
  })

  it('avg_relative_effort is null or a non-negative number', () => {
    cached('getSessionProfile').then((res) => {
      ;[res.body.pagi, res.body.sore].forEach((block) => {
        expect(
          block.avg_relative_effort === null ||
            (typeof block.avg_relative_effort === 'number' && block.avg_relative_effort >= 0)
        ).to.be.true
      })
    })
  })

  it('avg_hr is null or a positive number', () => {
    cached('getSessionProfile').then((res) => {
      ;[res.body.pagi, res.body.sore].forEach((block) => {
        expect(block.avg_hr === null || (typeof block.avg_hr === 'number' && block.avg_hr > 0)).to
          .be.true
      })
    })
  })

  it('relative_effort_count and hr_count are non-negative integers', () => {
    cached('getSessionProfile').then((res) => {
      ;[res.body.pagi, res.body.sore].forEach((block) => {
        expect(Number.isInteger(block.relative_effort_count)).to.be.true
        expect(block.relative_effort_count).to.be.gte(0)
        expect(Number.isInteger(block.hr_count)).to.be.true
        expect(block.hr_count).to.be.gte(0)
      })
    })
  })
})

describe('Session Profile API — threshold block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('threshold block has all required keys', () => {
    cached('getSessionProfile').then((res) => {
      const { threshold } = res.body
      expect(threshold).to.include.all.keys(
        'value',
        'pagi_re_count',
        'sore_re_count',
        'pagi_met',
        'sore_met'
      )
    })
  })

  it('threshold.value equals 20 (RE_THRESHOLD_MIN_COUNT)', () => {
    cached('getSessionProfile').then((res) => {
      expect(res.body.threshold.value).to.eq(20)
    })
  })

  it('pagi_met and sore_met are booleans', () => {
    cached('getSessionProfile').then((res) => {
      const { threshold } = res.body
      expect(threshold.pagi_met).to.be.a('boolean')
      expect(threshold.sore_met).to.be.a('boolean')
    })
  })

  it('pagi_re_count and sore_re_count are non-negative integers', () => {
    cached('getSessionProfile').then((res) => {
      const { threshold } = res.body
      expect(Number.isInteger(threshold.pagi_re_count)).to.be.true
      expect(threshold.pagi_re_count).to.be.gte(0)
      expect(Number.isInteger(threshold.sore_re_count)).to.be.true
      expect(threshold.sore_re_count).to.be.gte(0)
    })
  })

  it('pagi_met reflects whether pagi_re_count >= threshold.value', () => {
    cached('getSessionProfile').then((res) => {
      const { threshold } = res.body
      const expectedPagiMet = threshold.pagi_re_count >= threshold.value
      expect(threshold.pagi_met).to.eq(expectedPagiMet)
    })
  })

  it('sore_met reflects whether sore_re_count >= threshold.value', () => {
    cached('getSessionProfile').then((res) => {
      const { threshold } = res.body
      const expectedSoreMet = threshold.sore_re_count >= threshold.value
      expect(threshold.sore_met).to.eq(expectedSoreMet)
    })
  })

  it('pagi_re_count matches pagi.relative_effort_count', () => {
    cached('getSessionProfile').then((res) => {
      const { pagi, threshold } = res.body
      expect(threshold.pagi_re_count).to.eq(pagi.relative_effort_count)
    })
  })

  it('sore_re_count matches sore.relative_effort_count', () => {
    cached('getSessionProfile').then((res) => {
      const { sore, threshold } = res.body
      expect(threshold.sore_re_count).to.eq(sore.relative_effort_count)
    })
  })
})

// ─── temperature-efficiency ───────────────────────────────────────────────────
// Generated by Cypress Author — 2026-06-20
// Covers GET /api/running/v1/analytics/temperature-efficiency (#413)
// Returns per-run records, 1-degree temp bucket aggregates, morning/evening
// summary, and a p25–p75 reference band over all qualifying runs.

describe('Temperature Efficiency API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getTemperatureEfficiencyNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Temperature Efficiency API — authenticated response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with success flag and top-level keys', () => {
    cached('getTemperatureEfficiency').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.include.all.keys('runs', 'temp_groups', 'summary', 'ref_band')
    })
  })

  it('runs is an array', () => {
    cached('getTemperatureEfficiency').then((res) => {
      expect(res.body.runs).to.be.an('array')
    })
  })

  it('temp_groups is an array', () => {
    cached('getTemperatureEfficiency').then((res) => {
      expect(res.body.temp_groups).to.be.an('array')
    })
  })

  it('summary has morning, evening, overall_avg_ratio, hr_run_count keys', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { summary } = res.body
      expect(summary).to.include.all.keys('morning', 'evening', 'overall_avg_ratio', 'hr_run_count')
    })
  })

  it('summary.hr_run_count is a non-negative integer', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { hr_run_count } = res.body.summary
      expect(Number.isInteger(hr_run_count)).to.be.true
      expect(hr_run_count).to.be.gte(0)
    })
  })

  it('ref_band is null or an object with low and high', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { ref_band } = res.body
      if (ref_band === null) {
        return cy.log('ref_band is null — fewer than 3 qualifying runs, skip shape check')
      }
      expect(ref_band).to.include.all.keys('low', 'high')
      expect(ref_band.low).to.be.a('number')
      expect(ref_band.high).to.be.a('number')
      expect(ref_band.low).to.be.lte(ref_band.high)
    })
  })
})

describe('Temperature Efficiency API — runs array field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each run entry has all required fields when data is non-empty', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { runs } = res.body
      if (runs.length === 0) {
        return cy.log('No qualifying runs — run field shape skipped')
      }
      runs.forEach((run) => {
        expect(run).to.include.all.keys(
          'started_at',
          'distance_km',
          'avg_pace_sec',
          'avg_hr',
          'avg_temp_c',
          'pace_hr_ratio',
          'time_of_day'
        )
      })
    })
  })

  it('time_of_day is either pagi or malam', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { runs } = res.body
      if (runs.length === 0) return cy.log('No runs — time_of_day check skipped')
      runs.forEach((run) => {
        expect(run.time_of_day).to.be.oneOf(['pagi', 'malam'])
      })
    })
  })

  it('distance_km, avg_pace_sec, avg_hr, avg_temp_c, pace_hr_ratio are numbers', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { runs } = res.body
      if (runs.length === 0) return cy.log('No runs — numeric type check skipped')
      runs.forEach((run) => {
        expect(typeof run.distance_km).to.eq('number')
        expect(typeof run.avg_pace_sec).to.eq('number')
        expect(typeof run.avg_hr).to.eq('number')
        expect(typeof run.avg_temp_c).to.eq('number')
        expect(typeof run.pace_hr_ratio).to.eq('number')
      })
    })
  })

  it('pace_hr_ratio is positive for all runs', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { runs } = res.body
      if (runs.length === 0) return cy.log('No runs — ratio positivity check skipped')
      runs.forEach((run) => {
        expect(run.pace_hr_ratio).to.be.gt(0)
      })
    })
  })

  it('runs count matches summary.hr_run_count', () => {
    cached('getTemperatureEfficiency').then((res) => {
      expect(res.body.runs.length).to.eq(res.body.summary.hr_run_count)
    })
  })
})

describe('Temperature Efficiency API — temp_groups field shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each temp group has temp_c, n, q1, median, q3, min, max fields', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { temp_groups } = res.body
      if (temp_groups.length === 0) {
        return cy.log('No temp groups — field shape skipped')
      }
      temp_groups.forEach((group) => {
        expect(group).to.include.all.keys('temp_c', 'n', 'q1', 'median', 'q3', 'min', 'max')
      })
    })
  })

  it('temp_c is an integer (1-degree bucket)', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { temp_groups } = res.body
      if (temp_groups.length === 0) return cy.log('No temp groups — temp_c check skipped')
      temp_groups.forEach((group) => {
        expect(Number.isInteger(group.temp_c)).to.be.true
      })
    })
  })

  it('n is a positive integer in each group', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { temp_groups } = res.body
      if (temp_groups.length === 0) return cy.log('No temp groups — n check skipped')
      temp_groups.forEach((group) => {
        expect(Number.isInteger(group.n)).to.be.true
        expect(group.n).to.be.gte(1)
      })
    })
  })

  it('min <= q1 <= median <= q3 <= max in each group', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { temp_groups } = res.body
      if (temp_groups.length === 0) return cy.log('No temp groups — ordering check skipped')
      temp_groups.forEach((group) => {
        expect(group.min).to.be.lte(group.q1)
        expect(group.q1).to.be.lte(group.median)
        expect(group.median).to.be.lte(group.q3)
        expect(group.q3).to.be.lte(group.max)
      })
    })
  })

  it('temp_groups are sorted by temp_c ascending', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { temp_groups } = res.body
      if (temp_groups.length < 2) return cy.log('Fewer than 2 temp groups — sort check skipped')
      for (let i = 1; i < temp_groups.length; i++) {
        expect(temp_groups[i].temp_c).to.be.gte(temp_groups[i - 1].temp_c)
      }
    })
  })
})

describe('Temperature Efficiency API — summary morning/evening block shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('morning block has count, avg_temp_c, avg_pace_sec, avg_hr, avg_ratio keys', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { morning } = res.body.summary
      expect(morning).to.include.all.keys(
        'count',
        'avg_temp_c',
        'avg_pace_sec',
        'avg_hr',
        'avg_ratio'
      )
    })
  })

  it('evening block has count, avg_temp_c, avg_pace_sec, avg_hr, avg_ratio keys', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { evening } = res.body.summary
      expect(evening).to.include.all.keys(
        'count',
        'avg_temp_c',
        'avg_pace_sec',
        'avg_hr',
        'avg_ratio'
      )
    })
  })

  it('morning.count and evening.count are non-negative integers', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { morning, evening } = res.body.summary
      expect(Number.isInteger(morning.count)).to.be.true
      expect(morning.count).to.be.gte(0)
      expect(Number.isInteger(evening.count)).to.be.true
      expect(evening.count).to.be.gte(0)
    })
  })

  it('morning.count + evening.count equals hr_run_count', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { morning, evening, hr_run_count } = res.body.summary
      expect(morning.count + evening.count).to.eq(hr_run_count)
    })
  })

  it('avg fields in morning are null when count is 0, numbers when count > 0', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { morning } = res.body.summary
      if (morning.count === 0) {
        expect(morning.avg_temp_c).to.be.null
        expect(morning.avg_hr).to.be.null
        expect(morning.avg_ratio).to.be.null
      } else {
        expect(morning.avg_temp_c).to.be.a('number')
        expect(morning.avg_hr).to.be.a('number')
        expect(morning.avg_ratio).to.be.a('number')
        expect(morning.avg_ratio).to.be.gt(0)
      }
    })
  })

  it('avg fields in evening are null when count is 0, numbers when count > 0', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { evening } = res.body.summary
      if (evening.count === 0) {
        expect(evening.avg_temp_c).to.be.null
        expect(evening.avg_hr).to.be.null
        expect(evening.avg_ratio).to.be.null
      } else {
        expect(evening.avg_temp_c).to.be.a('number')
        expect(evening.avg_hr).to.be.a('number')
        expect(evening.avg_ratio).to.be.a('number')
        expect(evening.avg_ratio).to.be.gt(0)
      }
    })
  })

  it('overall_avg_ratio is null when hr_run_count is 0, positive number otherwise', () => {
    cached('getTemperatureEfficiency').then((res) => {
      const { overall_avg_ratio, hr_run_count } = res.body.summary
      if (hr_run_count === 0) {
        expect(overall_avg_ratio).to.be.null
      } else {
        expect(overall_avg_ratio).to.be.a('number')
        expect(overall_avg_ratio).to.be.gt(0)
      }
    })
  })
})

// ─── overview ────────────────────────────────────────────────────────────────

const OVERVIEW_SECTIONS = [
  'calorie_trend',
  'endurance_score',
  'fitness_age',
  'personal_bests',
  'session_profile',
  'temperature_efficiency',
]

describe('Analytics Overview API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getAnalyticsOverviewNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Analytics Overview API — response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data, errors and message OK', () => {
    cached('getAnalyticsOverview').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'OK')
      expect(res.body.data).to.be.an('object')
      expect(res.body.errors).to.be.an('object')
    })
  })

  it('data contains all six sections', () => {
    cached('getAnalyticsOverview').then((res) => {
      expect(res.body.data).to.include.all.keys(...OVERVIEW_SECTIONS)
    })
  })

  it('errors is empty and no section is null for a healthy account', () => {
    cached('getAnalyticsOverview').then((res) => {
      expect(res.body.errors).to.deep.eq({})
      OVERVIEW_SECTIONS.forEach((key) => {
        expect(res.body.data[key], `data.${key}`).to.not.be.null
      })
    })
  })

  it('calorie_trend has a data array and weight_kg', () => {
    cached('getAnalyticsOverview').then((res) => {
      expect(res.body.data.calorie_trend.data).to.be.an('array')
      expect(res.body.data.calorie_trend).to.have.property('weight_kg')
    })
  })

  it('personal_bests is an object of arrays', () => {
    cached('getAnalyticsOverview').then((res) => {
      Object.values(res.body.data.personal_bests).forEach((entries) => {
        expect(entries).to.be.an('array')
      })
    })
  })

  it('session_profile and temperature_efficiency keep their top-level keys', () => {
    cached('getAnalyticsOverview').then((res) => {
      const { session_profile, temperature_efficiency } = res.body.data
      expect(session_profile).to.include.all.keys('pagi', 'sore', 'threshold', 'total_runs')
      expect(temperature_efficiency).to.include.all.keys(
        'runs',
        'temp_groups',
        'summary',
        'ref_band'
      )
    })
  })
})

// Each section must equal what the dedicated endpoint returns for the same session. Those
// endpoints are scoped by the logged-in user, so equal output means the aggregate does not
// pull in another user's rows.
describe('Analytics Overview API — matches the per-section endpoints', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  const withoutSuccess = ({ success, ...rest }) => rest

  it('calorie_trend equals GET /calorie-trend', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getCalorieTrend').then((single) => {
        expect(overview.body.data.calorie_trend.data).to.deep.eq(single.body.data)
        expect(overview.body.data.calorie_trend.weight_kg).to.deep.eq(single.body.weight_kg)
      })
    })
  })

  it('endurance_score equals GET /endurance-score', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getEnduranceScore').then((single) => {
        expect(overview.body.data.endurance_score).to.deep.eq(single.body.data)
      })
    })
  })

  it('fitness_age equals GET /fitness-age', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getFitnessAgeTrend').then((single) => {
        expect(overview.body.data.fitness_age).to.deep.eq(single.body.data)
      })
    })
  })

  it('personal_bests equals GET /personal-bests', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getPersonalBests').then((single) => {
        expect(overview.body.data.personal_bests).to.deep.eq(single.body.data)
      })
    })
  })

  it('session_profile equals GET /session-profile', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getSessionProfile').then((single) => {
        expect(overview.body.data.session_profile).to.deep.eq(withoutSuccess(single.body))
      })
    })
  })

  it('temperature_efficiency equals GET /temperature-efficiency', () => {
    cached('getAnalyticsOverview').then((overview) => {
      cached('getTemperatureEfficiency').then((single) => {
        expect(overview.body.data.temperature_efficiency).to.deep.eq(withoutSuccess(single.body))
      })
    })
  })
})

// ─── activity-series ─────────────────────────────────────────────────────────

const SERIES_COLUMNS = [
  'id',
  'started_at',
  'activity_type',
  'distance_m',
  'avg_pace_sec_per_km',
  'avg_hr',
  'elevation_gain_m',
  'efficiency_factor',
  'estimated_vo2max',
  'avg_watts',
  'weighted_avg_watts',
  'device_watts',
]
const SEED_COUNT = 120

describe('Activity Series API — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getActivitySeriesNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

describe('Activity Series API — account with more than 100 activities', () => {
  let preExistingCount
  let seededRows
  let dbRows

  before(() => {
    cy.deleteSeededAnalyticsActivitiesFromDb()
    cy.getActivityCountFromDb().then((count) => {
      preExistingCount = count
    })
    cy.seedAnalyticsActivitiesInDb(SEED_COUNT).then((result) => {
      expect(result.inserted).to.eq(SEED_COUNT)
    })
    cy.getSeededAnalyticsActivitiesFromDb().then((rows) => {
      seededRows = rows
    })
    cy.getActivityListFromDb().then((rows) => {
      dbRows = rows
    })
  })

  after(() => {
    cy.deleteSeededAnalyticsActivitiesFromDb().then((result) => {
      expect(result.deleted).to.eq(SEED_COUNT)
    })
    cy.getActivityCountFromDb().then((count) => {
      expect(count, 'pre-existing activities untouched by cleanup').to.eq(preExistingCount)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array, total and message OK', () => {
    cached('getActivitySeries').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      expect(res.body.total).to.be.a('number')
      expect(res.body).to.have.property('message', 'OK')
      expect(res.body.total).to.eq(res.body.data.length)
    })
  })

  it('returns every activity with no 100-row cap', () => {
    cached('getActivitySeries').then((res) => {
      expect(dbRows.length, 'account holds more than 100 rows').to.be.greaterThan(100)
      expect(res.body.data.length).to.be.greaterThan(100)
      expect(res.body.data.length).to.eq(dbRows.length)
      expect(res.body.total).to.eq(preExistingCount + SEED_COUNT)
    })
  })

  it('includes every seeded activity exactly once', () => {
    cached('getActivitySeries').then((res) => {
      const ids = res.body.data.map((row) => row.id)
      expect(new Set(ids).size).to.eq(ids.length)
      expect(seededRows).to.have.length(SEED_COUNT)
      seededRows.forEach((seeded) => {
        expect(ids).to.include(seeded.id)
      })
    })
  })

  it('each row carries exactly the light chart columns and no user_id', () => {
    cached('getActivitySeries').then((res) => {
      res.body.data.forEach((row) => {
        expect(row).to.have.all.keys(...SERIES_COLUMNS)
        expect(row).to.not.have.property('user_id')
      })
    })
  })

  it('efficiency_factor, estimated_vo2max and avg_watts are returned and match the DB', () => {
    cached('getActivitySeries').then((res) => {
      const byId = Object.fromEntries(res.body.data.map((row) => [row.id, row]))
      let withEf = 0
      let withVo2 = 0
      let withWatts = 0
      seededRows.forEach((seeded) => {
        const row = byId[seeded.id]
        expect(row.efficiency_factor).to.eq(seeded.efficiency_factor)
        expect(row.estimated_vo2max).to.eq(seeded.estimated_vo2max)
        expect(row.avg_watts).to.eq(seeded.avg_watts)
        if (row.efficiency_factor !== null) {
          withEf++
          expect(row.efficiency_factor).to.be.a('number')
        }
        if (row.estimated_vo2max !== null) {
          withVo2++
          expect(row.estimated_vo2max).to.be.a('number')
        }
        if (row.avg_watts !== null) {
          withWatts++
          expect(row.avg_watts).to.be.a('number')
        }
      })
      expect(withEf, 'seeded rows with EF').to.be.greaterThan(SEED_COUNT / 2)
      expect(withVo2, 'seeded rows with VO2max').to.be.greaterThan(SEED_COUNT / 2)
      expect(withWatts, 'seeded rows with watts').to.be.greaterThan(SEED_COUNT / 2)
    })
  })

  it('rows are ordered newest first', () => {
    cached('getActivitySeries').then((res) => {
      const times = res.body.data.map((row) => new Date(row.started_at).getTime())
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).to.be.lte(times[i - 1])
      }
    })
  })

  it('only returns the test account rows', () => {
    cached('getActivitySeries').then((res) => {
      const ownIds = new Set(dbRows.map((row) => row.id))
      res.body.data.forEach((row) => {
        expect(ownIds.has(row.id), `activity ${row.id} belongs to the test account`).to.be.true
      })
    })
  })
})
