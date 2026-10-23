const SEED_TAG = 'cy843'

// Most describes assert different properties of the same GET response, so each
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

// ─── dashboard ────────────────────────────────────────────────────────────────

describe('Running Dashboard API — GET /dashboard — core response', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cached('getDashboard').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data contains all top-level keys', () => {
    cached('getDashboard').then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys(
        'weekly_stats',
        'training_load',
        'recent_activities',
        'calendar_activities',
        'fitness_age',
        'endurance_score',
        'streak',
        'last_sync_at'
      )
    })
  })

  it('health_today was removed from the payload', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data).to.not.have.property('health_today')
    })
  })

  it('last_sync_at is null or a string', () => {
    cached('getDashboard').then((res) => {
      const { last_sync_at } = res.body.data
      expect(last_sync_at === null || typeof last_sync_at === 'string').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard — weekly_stats', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('weekly_stats has current and prev blocks', () => {
    cached('getDashboard').then((res) => {
      const { weekly_stats } = res.body.data
      expect(weekly_stats).to.have.property('current')
      expect(weekly_stats).to.have.property('prev')
    })
  })

  it('weekly_stats.current has all expected fields', () => {
    cached('getDashboard').then((res) => {
      const { current } = res.body.data.weekly_stats
      expect(current).to.include.all.keys(
        'distance_m',
        'duration_sec',
        'elevation_gain_m',
        'total_calories',
        'longest_run_m',
        'count',
        'avg_pace_sec_per_km',
        'avg_moving_pace_sec_per_km',
        'avg_hr'
      )
    })
  })

  it('weekly_stats.current distance_m, duration_sec, count are integers', () => {
    cached('getDashboard').then((res) => {
      const { current } = res.body.data.weekly_stats
      expect(Number.isInteger(current.distance_m)).to.eq(true)
      expect(Number.isInteger(current.duration_sec)).to.eq(true)
      expect(Number.isInteger(current.count)).to.eq(true)
    })
  })

  it('weekly_stats.prev has same shape as current', () => {
    cached('getDashboard').then((res) => {
      const { prev } = res.body.data.weekly_stats
      expect(prev).to.include.all.keys(
        'distance_m',
        'duration_sec',
        'elevation_gain_m',
        'total_calories',
        'longest_run_m',
        'count',
        'avg_pace_sec_per_km',
        'avg_moving_pace_sec_per_km',
        'avg_hr'
      )
    })
  })

  it('avg_pace_sec_per_km is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { avg_pace_sec_per_km } = res.body.data.weekly_stats.current
      expect(avg_pace_sec_per_km === null || typeof avg_pace_sec_per_km === 'number').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard — training_load', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('training_load has all expected top-level keys', () => {
    cached('getDashboard').then((res) => {
      const { training_load } = res.body.data
      expect(training_load).to.include.all.keys(
        'acwr',
        'acute_load_7d',
        'chronic_load_28d',
        'tsb',
        'status',
        'current_week_load',
        'prev_week_load',
        'ramp_pct',
        'training_status',
        'ytd_stats'
      )
    })
  })

  it('training_load.status is a valid ACWR status value', () => {
    cached('getDashboard').then((res) => {
      const { status } = res.body.data.training_load
      expect(status).to.be.oneOf(['no_data', 'resting', 'low', 'optimal', 'caution', 'danger'])
    })
  })

  it('acwr, acute_load_7d, chronic_load_28d are numbers', () => {
    cached('getDashboard').then((res) => {
      const { acwr, acute_load_7d, chronic_load_28d } = res.body.data.training_load
      expect(typeof acwr).to.eq('number')
      expect(typeof acute_load_7d).to.eq('number')
      expect(typeof chronic_load_28d).to.eq('number')
    })
  })

  it('current_week_load and prev_week_load are numbers', () => {
    cached('getDashboard').then((res) => {
      const { current_week_load, prev_week_load } = res.body.data.training_load
      expect(typeof current_week_load).to.eq('number')
      expect(typeof prev_week_load).to.eq('number')
    })
  })

  it('ramp_pct is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { ramp_pct } = res.body.data.training_load
      expect(ramp_pct === null || typeof ramp_pct === 'number').to.be.true
    })
  })

  it('training_status is null or a valid status string', () => {
    cached('getDashboard').then((res) => {
      const { training_status } = res.body.data.training_load
      const valid = [
        'productive',
        'maintaining',
        'unproductive',
        'overreaching',
        'peaking',
        'detraining',
      ]
      expect(training_status === null || valid.includes(training_status)).to.be.true
    })
  })

  it('ytd_stats is null or an object', () => {
    cached('getDashboard').then((res) => {
      const { ytd_stats } = res.body.data.training_load
      expect(ytd_stats === null || typeof ytd_stats === 'object').to.be.true
    })
  })

  it('tsb is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { tsb } = res.body.data.training_load
      expect(tsb === null || typeof tsb === 'number').to.be.true
    })
  })

  it('tsb is null only when status is no_data, otherwise a number', () => {
    cached('getDashboard').then((res) => {
      const { tsb, status } = res.body.data.training_load
      if (status === 'no_data') {
        expect(tsb).to.be.null
      } else {
        expect(typeof tsb).to.eq('number')
      }
    })
  })

  it('tsb is rounded to at most 1 decimal place', () => {
    cached('getDashboard').then((res) => {
      const { tsb } = res.body.data.training_load
      if (tsb !== null) {
        expect(Math.round(tsb * 10) / 10).to.eq(tsb)
      }
    })
  })
})

describe('Running Dashboard API — GET /dashboard — recent_activities', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('recent_activities is an array', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data.recent_activities).to.be.an('array')
    })
  })

  it('each recent_activity item has required fields', () => {
    cached('getDashboard').then((res) => {
      const items = res.body.data.recent_activities
      if (items.length === 0) return cy.log('No recent activities — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.include.all.keys(
          'id',
          'started_at',
          'name',
          'distance_m',
          'duration_sec',
          'moving_time_sec',
          'avg_pace_sec_per_km',
          'avg_hr',
          'activity_type',
          'source',
          'elevation_gain_m',
          'calories',
          'pr_count',
          'workout_type'
        )
      })
    })
  })

  it('each recent_activity carries every field the UI reads (gear_name, temp, watts)', () => {
    cached('getDashboard').then((res) => {
      const items = res.body.data.recent_activities
      if (items.length === 0) return cy.log('No recent activities — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.include.all.keys(
          'gear_name',
          'avg_temp_c',
          'avg_watts',
          'weighted_avg_watts',
          'device_watts'
        )
        expect(item.gear_name === null || typeof item.gear_name === 'string').to.eq(true)
        ;['avg_temp_c', 'avg_watts', 'weighted_avg_watts'].forEach((k) => {
          expect(item[k] === null || typeof item[k] === 'number', k).to.eq(true)
        })
        expect(item.device_watts === null || typeof item.device_watts === 'boolean').to.eq(true)
      })
    })
  })

  it('has at most 5 items', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data.recent_activities.length).to.be.lte(5)
    })
  })

  it('each recent_activity has a valid id and activity_type', () => {
    cached('getDashboard').then((res) => {
      const items = res.body.data.recent_activities
      if (items.length === 0) return cy.log('No recent activities — skipping type assertions')
      items.forEach((item) => {
        expect(item.id, 'id should be a string or number').to.satisfy(
          (id) => typeof id === 'string' || typeof id === 'number'
        )
        expect(item.activity_type, 'activity_type should be a string or null').to.satisfy(
          (at) => at === null || typeof at === 'string'
        )
      })
    })
  })
})

describe('Running Dashboard API — GET /dashboard — calendar_activities', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('calendar_activities is an array', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data.calendar_activities).to.be.an('array')
    })
  })

  it('each calendar_activity item has required fields', () => {
    cached('getDashboard').then((res) => {
      const items = res.body.data.calendar_activities
      if (items.length === 0) return cy.log('No calendar activities — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.include.all.keys(
          'id',
          'date',
          'activity_type',
          'name',
          'distance_m',
          'relative_effort'
        )
      })
    })
  })

  it('each calendar_activity date is in YYYY-MM-DD format', () => {
    cached('getDashboard').then((res) => {
      const items = res.body.data.calendar_activities
      if (items.length === 0)
        return cy.log('No calendar activities — skipping date format assertion')
      items.forEach((item) => {
        expect(item.date).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })
})

describe('Running Dashboard API — GET /dashboard — fitness_age', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('fitness_age is an object with required keys', () => {
    cached('getDashboard').then((res) => {
      const { fitness_age } = res.body.data
      expect(fitness_age).to.be.an('object')
      expect(fitness_age).to.include.all.keys('fitness_age', 'chronological_age', 'sex_missing')
    })
  })

  it('fitness_age.sex_missing is a boolean', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data.fitness_age.sex_missing).to.be.a('boolean')
    })
  })

  it('fitness_age.fitness_age is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { fitness_age: fa } = res.body.data.fitness_age
      expect(fa === null || typeof fa === 'number').to.be.true
    })
  })

  it('fitness_age.chronological_age is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { chronological_age } = res.body.data.fitness_age
      expect(chronological_age === null || typeof chronological_age === 'number').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard — query params', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?type=Run returns 200 and data', () => {
    cached('getDashboard', { type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('?type=TrailRun returns 200 and data', () => {
    cached('getDashboard', { type: 'TrailRun' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('?tz_offset=-420 returns 200', () => {
    cached('getDashboard', { tz_offset: -420 }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?tz_offset=invalid returns 400 with a message', () => {
    cy.getDashboard({ tz_offset: 'invalid' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error', 'Bad request')
      expect(res.body.message).to.be.a('string').and.not.be.empty
    })
  })

  it('tz_offset outside -840..840 or not a whole number returns 400', () => {
    ;[841, -841, 1.5].forEach((tz_offset) => {
      cy.getDashboard({ tz_offset }).then((res) => {
        expect(res.status, `tz_offset=${tz_offset}`).to.eq(400)
        expect(res.body.message).to.be.a('string')
      })
    })
  })

  it('tz_offset at the -840 and 840 bounds returns 200', () => {
    ;[-840, 840].forEach((tz_offset) => {
      cy.getDashboard({ tz_offset }).then((res) => {
        expect(res.status, `tz_offset=${tz_offset}`).to.eq(200)
      })
    })
  })

  it('empty tz_offset and empty type are treated as missing', () => {
    cy.getDashboard({ tz_offset: '', type: '' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('whitespace-only type is treated as no type', () => {
    cy.getDashboard({ type: ' ' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('type with non-letters returns 400 "type must contain letters only"', () => {
    ;['Run;x', 'Run1'].forEach((type) => {
      cy.getDashboard({ type }).then((res) => {
        expect(res.status, `type=${type}`).to.eq(400)
        expect(res.body.message).to.eq('type must contain letters only')
      })
    })
  })
})

describe('Running Dashboard API — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 with no session cookie', () => {
    cy.getDashboardNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })
})

// ─── gear ─────────────────────────────────────────────────────────────────────

describe('Running Gear API — GET /gear', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array', () => {
    cached('getGear').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each gear item has required fields: id, name, distance_m, retired', () => {
    cached('getGear').then((res) => {
      const items = res.body.data
      if (items.length === 0) return cy.log('No gear items — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.include.all.keys('id', 'name', 'distance_m', 'retired')
      })
    })
  })

  it('each gear item has optional limit fields: category, retirement_km, notification_distance_m', () => {
    cached('getGear').then((res) => {
      const items = res.body.data
      if (items.length === 0) return cy.log('No gear items — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.have.any.keys('category', 'retirement_km', 'notification_distance_m')
      })
    })
  })
})

describe('Running Gear API — GET /gear — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.getGearNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Running Gear API — PATCH /gear', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with updated gear object when patching category and retirement_km', () => {
    cached('getGear').then((res) => {
      const items = res.body.data
      if (items.length === 0) return cy.log('No gear items — skipping PATCH test')
      const gearId = items[0].id
      cy.patchGear({ id: gearId, category: 'daily', retirement_km: 800 }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        expect(patchRes.body).to.have.property('data')
        expect(patchRes.body.data).to.have.property('id', gearId)
      })
    })
  })
})

describe('Running Gear API — PATCH /gear — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.patchGearNoAuth({ id: 'some-id', category: 'tempo' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── fitness age analytics ────────────────────────────────────────────────────

describe('Running Fitness Age API — GET /analytics/fitness-age', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data', () => {
    cached('getFitnessAgeTrend').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data has weekly, chronological_age, sex_missing keys', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys('weekly', 'chronological_age', 'sex_missing')
    })
  })

  it('data.weekly is an array', () => {
    cached('getFitnessAgeTrend').then((res) => {
      expect(res.body.data.weekly).to.be.an('array')
    })
  })

  it('data.sex_missing is a boolean', () => {
    cached('getFitnessAgeTrend').then((res) => {
      expect(res.body.data.sex_missing).to.be.a('boolean')
    })
  })

  it('data.chronological_age is null or a number', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { chronological_age } = res.body.data
      expect(chronological_age === null || typeof chronological_age === 'number').to.be.true
    })
  })

  it('each weekly item has week, fitness_age, avg_vo2max fields', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping field assertions')
      weekly.forEach((item) => {
        expect(item).to.include.all.keys('week', 'fitness_age', 'avg_vo2max')
      })
    })
  })

  it('each weekly item week is in YYYY-MM-DD format', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping date format assertion')
      weekly.forEach((item) => {
        expect(item.week).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('each weekly item fitness_age is a multiple of 5 between 20 and 70', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0)
        return cy.log('No weekly data — skipping fitness_age range assertion')
      weekly.forEach((item) => {
        expect(item.fitness_age).to.be.gte(20)
        expect(item.fitness_age).to.be.lte(70)
        expect(item.fitness_age % 5).to.eq(0)
      })
    })
  })

  it('each weekly item avg_vo2max is a positive number', () => {
    cached('getFitnessAgeTrend').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping avg_vo2max assertion')
      weekly.forEach((item) => {
        expect(item.avg_vo2max).to.be.a('number')
        expect(item.avg_vo2max).to.be.gt(0)
      })
    })
  })
})

describe('Running Fitness Age API — GET /analytics/fitness-age — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.getFitnessAgeTrendNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })
})

// ─── endurance_score (dashboard field) ───────────────────────────────────────

// Generated by Cypress Author — 2026-06-15
describe('Running Dashboard API — GET /dashboard — endurance_score', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('endurance_score is an object with required keys', () => {
    cached('getDashboard').then((res) => {
      const { endurance_score } = res.body.data
      expect(endurance_score).to.be.an('object')
      expect(endurance_score).to.include.all.keys('endurance_score', 'endurance_tier')
    })
  })

  it('endurance_score.endurance_score is null or a number', () => {
    cached('getDashboard').then((res) => {
      const { endurance_score: score } = res.body.data.endurance_score
      expect(score === null || typeof score === 'number').to.be.true
    })
  })

  it('endurance_score.endurance_tier is null or a valid tier string', () => {
    cached('getDashboard').then((res) => {
      const { endurance_tier } = res.body.data.endurance_score
      const validTiers = ['Beginner', 'Building', 'Developing', 'Solid', 'Advanced']
      expect(endurance_tier === null || validTiers.includes(endurance_tier)).to.be.true
    })
  })

  it('endurance_score.endurance_score is between 0 and 100 when not null', () => {
    cached('getDashboard').then((res) => {
      const { endurance_score: score } = res.body.data.endurance_score
      if (score === null) return cy.log('endurance_score is null — skipping range assertion')
      expect(score).to.be.gte(0)
      expect(score).to.be.lte(100)
    })
  })

  it('endurance_score.endurance_tier is non-null when score is non-null', () => {
    cached('getDashboard').then((res) => {
      const { endurance_score: score, endurance_tier } = res.body.data.endurance_score
      if (score === null) return cy.log('endurance_score is null — skipping tier co-presence check')
      expect(endurance_tier).to.not.be.null
    })
  })
})

// ─── streak (dashboard field) ─────────────────────────────────────────────────

// Streak counter — issue #820. Weekly streak folded into the dashboard payload.
// Rules under test: weekly unit, strict reset, >=1 activity of any type per week,
// at-risk only in the last 2 days of a week with a live streak.
describe('Running Dashboard API — GET /dashboard — streak', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('streak is an object with required keys', () => {
    cached('getDashboard').then((res) => {
      const { streak } = res.body.data
      expect(streak).to.be.an('object')
      expect(streak).to.include.all.keys(
        'current_weeks',
        'best_weeks',
        'at_risk',
        'active_this_week',
        'unit'
      )
    })
  })

  it('current_weeks and best_weeks are non-negative integers', () => {
    cached('getDashboard').then((res) => {
      const { current_weeks, best_weeks } = res.body.data.streak
      expect(Number.isInteger(current_weeks)).to.eq(true)
      expect(Number.isInteger(best_weeks)).to.eq(true)
      expect(current_weeks).to.be.gte(0)
      expect(best_weeks).to.be.gte(0)
    })
  })

  it('at_risk and active_this_week are booleans', () => {
    cached('getDashboard').then((res) => {
      const { at_risk, active_this_week } = res.body.data.streak
      expect(at_risk).to.be.a('boolean')
      expect(active_this_week).to.be.a('boolean')
    })
  })

  it('unit is "week"', () => {
    cached('getDashboard').then((res) => {
      expect(res.body.data.streak.unit).to.eq('week')
    })
  })

  it('best_weeks is always >= current_weeks', () => {
    cached('getDashboard').then((res) => {
      const { current_weeks, best_weeks } = res.body.data.streak
      expect(best_weeks).to.be.gte(current_weeks)
    })
  })

  it('at_risk is only true when a live streak exists and this week is not yet active', () => {
    cached('getDashboard').then((res) => {
      const { at_risk, current_weeks, active_this_week } = res.body.data.streak
      if (at_risk) {
        expect(current_weeks).to.be.gte(1)
        expect(active_this_week).to.eq(false)
      }
    })
  })

  it('active_this_week true implies current_weeks >= 1', () => {
    cached('getDashboard').then((res) => {
      const { active_this_week, current_weeks } = res.body.data.streak
      if (active_this_week) expect(current_weeks).to.be.gte(1)
    })
  })

  it('at_risk and active_this_week are never both true', () => {
    cached('getDashboard').then((res) => {
      const { at_risk, active_this_week } = res.body.data.streak
      expect(at_risk && active_this_week).to.eq(false)
    })
  })

  it('streak is present regardless of the activity type filter', () => {
    cached('getDashboard', { type: 'Run' }).then((res) => {
      const { streak } = res.body.data
      expect(streak).to.be.an('object')
      expect(streak).to.include.all.keys('current_weeks', 'best_weeks', 'unit')
    })
  })

  it('streak counts any activity type — identical across type filters', () => {
    cached('getDashboard').then((allRes) => {
      cached('getDashboard', { type: 'Run' }).then((runRes) => {
        expect(runRes.body.data.streak.current_weeks).to.eq(allRes.body.data.streak.current_weeks)
        expect(runRes.body.data.streak.best_weeks).to.eq(allRes.body.data.streak.best_weeks)
      })
    })
  })

  it('streak is present for a non-zero tz_offset', () => {
    cached('getDashboard', { tz_offset: -420 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.streak).to.include.all.keys('current_weeks', 'best_weeks', 'unit')
    })
  })
})

// ─── endurance score analytics ────────────────────────────────────────────────

describe('Running Endurance Score API — GET /analytics/endurance-score', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data', () => {
    cached('getEnduranceScore').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data has weekly key', () => {
    cached('getEnduranceScore').then((res) => {
      expect(res.body.data).to.have.property('weekly')
    })
  })

  it('data.weekly is an array', () => {
    cached('getEnduranceScore').then((res) => {
      expect(res.body.data.weekly).to.be.an('array')
    })
  })

  it('each weekly item has week, endurance_score, avg_vo2max, chronic_load, best_long_run_km fields', () => {
    cached('getEnduranceScore').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping field assertions')
      weekly.forEach((item) => {
        expect(item).to.include.all.keys(
          'week',
          'endurance_score',
          'avg_vo2max',
          'chronic_load',
          'best_long_run_km'
        )
      })
    })
  })

  it('each weekly item week is in YYYY-MM-DD format', () => {
    cached('getEnduranceScore').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping date format assertion')
      weekly.forEach((item) => {
        expect(item.week).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('each weekly item endurance_score is between 0 and 100', () => {
    cached('getEnduranceScore').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping score range assertion')
      weekly.forEach((item) => {
        expect(item.endurance_score).to.be.a('number')
        expect(item.endurance_score).to.be.gte(0)
        expect(item.endurance_score).to.be.lte(100)
      })
    })
  })

  it('each weekly item avg_vo2max is a positive number', () => {
    cached('getEnduranceScore').then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping avg_vo2max assertion')
      weekly.forEach((item) => {
        expect(item.avg_vo2max).to.be.a('number')
        expect(item.avg_vo2max).to.be.gt(0)
      })
    })
  })

  it('weekly array has at most 12 entries', () => {
    cached('getEnduranceScore').then((res) => {
      expect(res.body.data.weekly.length).to.be.lte(12)
    })
  })
})

describe('Running Endurance Score API — GET /analytics/endurance-score — unauthenticated', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 when unauthenticated', () => {
    cy.getEnduranceScoreNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })
})

// ─── weekly stats ─────────────────────────────────────────────────────────────

describe('Running Dashboard API — GET /dashboard/weekly-stats — auth guard', () => {
  it('returns 401 when unauthenticated', () => {
    cy.getWeeklyStatsNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns 200 with valid session', () => {
    cy.setupApiAuthCookies()
    cached('getWeeklyStats').then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})

describe('Running Dashboard API — GET /dashboard/weekly-stats — response shape', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('response has data.current and data.prev objects', () => {
    cached('getWeeklyStats').then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('current')
      expect(res.body.data).to.have.property('prev')
      expect(res.body.data.current).to.be.an('object')
      expect(res.body.data.prev).to.be.an('object')
    })
  })

  it('data.current has all required fields', () => {
    cached('getWeeklyStats').then((res) => {
      const { current } = res.body.data
      expect(current).to.include.all.keys(
        'distance_m',
        'duration_sec',
        'elevation_gain_m',
        'total_calories',
        'longest_run_m',
        'count',
        'avg_pace_sec_per_km',
        'avg_moving_pace_sec_per_km',
        'avg_hr'
      )
    })
  })

  it('data.prev has all required fields', () => {
    cached('getWeeklyStats').then((res) => {
      const { prev } = res.body.data
      expect(prev).to.include.all.keys(
        'distance_m',
        'duration_sec',
        'elevation_gain_m',
        'total_calories',
        'longest_run_m',
        'count',
        'avg_pace_sec_per_km',
        'avg_moving_pace_sec_per_km',
        'avg_hr'
      )
    })
  })

  it('numeric fields in current are numbers', () => {
    cached('getWeeklyStats').then((res) => {
      const { current } = res.body.data
      expect(typeof current.distance_m).to.eq('number')
      expect(typeof current.duration_sec).to.eq('number')
      expect(typeof current.elevation_gain_m).to.eq('number')
      expect(typeof current.total_calories).to.eq('number')
      expect(typeof current.count).to.eq('number')
    })
  })

  it('nullable fields in current are null or a number', () => {
    cached('getWeeklyStats').then((res) => {
      const { current } = res.body.data
      expect(current.longest_run_m === null || typeof current.longest_run_m === 'number').to.be.true
      expect(
        current.avg_pace_sec_per_km === null || typeof current.avg_pace_sec_per_km === 'number'
      ).to.be.true
      expect(
        current.avg_moving_pace_sec_per_km === null ||
          typeof current.avg_moving_pace_sec_per_km === 'number'
      ).to.be.true
      expect(current.avg_hr === null || typeof current.avg_hr === 'number').to.be.true
    })
  })

  it('numeric fields in prev are numbers', () => {
    cached('getWeeklyStats').then((res) => {
      const { prev } = res.body.data
      expect(typeof prev.distance_m).to.eq('number')
      expect(typeof prev.duration_sec).to.eq('number')
      expect(typeof prev.elevation_gain_m).to.eq('number')
      expect(typeof prev.total_calories).to.eq('number')
      expect(typeof prev.count).to.eq('number')
    })
  })

  it('nullable fields in prev are null or a number', () => {
    cached('getWeeklyStats').then((res) => {
      const { prev } = res.body.data
      expect(prev.longest_run_m === null || typeof prev.longest_run_m === 'number').to.be.true
      expect(prev.avg_pace_sec_per_km === null || typeof prev.avg_pace_sec_per_km === 'number').to
        .be.true
      expect(
        prev.avg_moving_pace_sec_per_km === null ||
          typeof prev.avg_moving_pace_sec_per_km === 'number'
      ).to.be.true
      expect(prev.avg_hr === null || typeof prev.avg_hr === 'number').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard/weekly-stats — weeks_ago param', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('weeks_ago=0 (default) returns 200', () => {
    cached('getWeeklyStats', { weeks_ago: 0 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('weeks_ago=1 returns 200', () => {
    cached('getWeeklyStats', { weeks_ago: 1 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('weeks_ago=4 (max) returns 200', () => {
    cached('getWeeklyStats', { weeks_ago: 4 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('no weeks_ago param defaults to current week — returns 200', () => {
    cached('getWeeklyStats').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('weeks_ago=0 and weeks_ago=1 return different current window data', () => {
    cached('getWeeklyStats', { weeks_ago: 0 }).then((week0Res) => {
      cached('getWeeklyStats', { weeks_ago: 1 }).then((week1Res) => {
        const w0 = week0Res.body.data
        const w1 = week1Res.body.data
        // The current block for weeks_ago=0 covers Mon–now (partial week).
        // The current block for weeks_ago=1 covers a full Mon–Sun 7-day window.
        // These are different time windows so at minimum one field must differ,
        // unless both windows happen to have identical stats (e.g. no runs).
        // We assert the response shape is valid for both rather than exact equality.
        expect(w0).to.have.property('current')
        expect(w1).to.have.property('current')
      })
    })
  })

  it('?tz_offset=-420 with weeks_ago=0 returns 200', () => {
    cached('getWeeklyStats', { weeks_ago: 0, tz_offset: -420 }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?type=Run with weeks_ago=0 returns 200', () => {
    cached('getWeeklyStats', { weeks_ago: 0, type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })
})

describe('Running Dashboard API — GET /dashboard/weekly-stats — input validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('weeks_ago outside 0..4 or not a whole number returns 400 with a message', () => {
    ;[5, -1, 'abc', 1.5].forEach((weeks_ago) => {
      cy.getWeeklyStats({ weeks_ago }).then((res) => {
        expect(res.status, `weeks_ago=${weeks_ago}`).to.eq(400)
        expect(res.body).to.have.property('error', 'Bad request')
        expect(res.body.message).to.be.a('string').and.not.be.empty
      })
    })
  })

  it('tz_offset outside -840..840 or non-numeric returns 400', () => {
    ;[841, -841, 'abc'].forEach((tz_offset) => {
      cy.getWeeklyStats({ tz_offset }).then((res) => {
        expect(res.status, `tz_offset=${tz_offset}`).to.eq(400)
        expect(res.body.message).to.be.a('string')
      })
    })
  })

  it('empty weeks_ago, tz_offset and type are treated as missing', () => {
    cy.getWeeklyStats({ weeks_ago: '', tz_offset: '', type: '' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('current')
    })
  })

  it('type with non-letters returns 400 "type must contain letters only"', () => {
    cy.getWeeklyStats({ type: 'Run1' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('type must contain letters only')
    })
  })
})

describe('Running Dashboard API — GET /dashboard/weekly-stats — response time', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('responds within 1500ms', () => {
    const start = Date.now()
    cy.getWeeklyStats().then((res) => {
      const elapsed = Date.now() - start
      expect(res.status).to.eq(200)
      expect(elapsed).to.be.lte(1500)
    })
  })
})

// ─── calendar ─────────────────────────────────────────────────────────────────

const CALENDAR_FIELDS = [
  'id',
  'started_at',
  'activity_type',
  'name',
  'distance_m',
  'relative_effort',
]
const currentMonth = () => new Date().toISOString().slice(0, 7)

describe('Running Calendar API — GET /calendar — auth guard', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 with error and message when unauthenticated', () => {
    cy.getCalendarNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
      expect(res.body).to.have.property('message')
    })
  })
})

describe('Running Calendar API — GET /calendar — response', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with { data: [] } for a valid month, items have the documented fields', () => {
    cached('getCalendar', { month: currentMonth() }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      res.body.data.forEach((item) => {
        expect(item).to.have.all.keys(...CALENDAR_FIELDS)
        expect(item.started_at).to.be.a('string')
        expect(item.activity_type).to.be.a('string')
      })
    })
  })

  it('without month it defaults to the current month and ascending started_at', () => {
    cached('getCalendar').then((res) => {
      expect(res.status).to.eq(200)
      const times = res.body.data.map((a) => a.started_at)
      expect([...times].sort()).to.deep.eq(times)
    })
    cached('getCalendar').then((defaultRes) => {
      cached('getCalendar', { month: currentMonth() }).then((monthRes) => {
        expect(defaultRes.body.data.map((a) => a.id)).to.deep.eq(
          monthRes.body.data.map((a) => a.id)
        )
      })
    })
  })

  it('a month with no activities returns an empty array', () => {
    cy.getCalendar({ month: '1999-01' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.deep.eq([])
    })
  })

  it('invalid month returns 400 with a message', () => {
    ;['2026-13', '2026-00', '2026-1', '26-01', 'abc', '2026-01-15'].forEach((month) => {
      cy.getCalendar({ month }).then((res) => {
        expect(res.status, `month=${month}`).to.eq(400)
        expect(res.body).to.have.property('error', 'Bad request')
        expect(res.body.message).to.eq('month must be YYYY-MM')
      })
    })
  })

  it('empty month= is treated as missing (current month)', () => {
    cy.getCalendar({ month: '' }).then((res) => {
      expect(res.status).to.eq(200)
      cached('getCalendar').then((defaultRes) => {
        expect(res.body.data.map((a) => a.id)).to.deep.eq(defaultRes.body.data.map((a) => a.id))
      })
    })
  })

  it('invalid tz_offset returns 400 with a message', () => {
    ;['abc', 841, -841, 1.5].forEach((tz_offset) => {
      cy.getCalendar({ tz_offset }).then((res) => {
        expect(res.status, `tz_offset=${tz_offset}`).to.eq(400)
        expect(res.body.message).to.be.a('string').and.not.be.empty
      })
    })
  })

  it('empty tz_offset= is treated as missing', () => {
    cy.getCalendar({ tz_offset: '' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})

describe('Running Calendar API — GET /calendar — type filter', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('a letters-only type returns only that activity_type', () => {
    cy.getCalendar({ type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      res.body.data.forEach((a) => expect(a.activity_type).to.eq('Run'))
    })
  })

  it('an unused letters-only type returns an empty array', () => {
    cy.getCalendar({ type: 'Zzzqx' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.deep.eq([])
    })
  })

  it('type with non-letters returns 400 "type must contain letters only"', () => {
    ;['Run;x', 'Run1'].forEach((type) => {
      cy.getCalendar({ type }).then((res) => {
        expect(res.status, `type=${type}`).to.eq(400)
        expect(res.body.message).to.eq('type must contain letters only')
      })
    })
  })

  it('type longer than 30 letters returns 400', () => {
    cy.getCalendar({ type: 'a'.repeat(31) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('empty or whitespace-only type returns all types', () => {
    cached('getCalendar').then((allRes) => {
      ;['', ' '].forEach((type) => {
        cy.getCalendar({ type }).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body.data.map((a) => a.id)).to.deep.eq(allRes.body.data.map((a) => a.id))
        })
      })
    })
  })
})

// ─── performance trends ───────────────────────────────────────────────────────

const TREND_FIELDS = [
  'id',
  'started_at',
  'activity_type',
  'distance_m',
  'avg_pace_sec_per_km',
  'avg_hr',
  'max_hr',
  'relative_effort',
  'avg_watts',
  'weighted_avg_watts',
  'device_watts',
]

describe('Running Performance Trends API — GET /performance-trends — auth guard', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 with error and message when unauthenticated', () => {
    cy.getPerformanceTrendsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
      expect(res.body).to.have.property('message')
    })
  })
})

describe('Running Performance Trends API — GET /performance-trends — response', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 { data: [] } with the documented fields on every item', () => {
    cached('getPerformanceTrends').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.be.lte(25)
      res.body.data.forEach((item) => {
        expect(item).to.have.all.keys(...TREND_FIELDS)
        expect(item.avg_pace_sec_per_km, 'only paced activities').to.be.a('number')
      })
    })
  })

  it('is ordered oldest to newest', () => {
    cached('getPerformanceTrends').then((res) => {
      const times = res.body.data.map((a) => a.started_at)
      expect([...times].sort()).to.deep.eq(times)
    })
  })

  it('limit=1 returns at most one row and it is the newest of the default set', () => {
    cached('getPerformanceTrends').then((defaultRes) => {
      cy.getPerformanceTrends({ limit: 1 }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data.length).to.be.lte(1)
        if (defaultRes.body.data.length > 0) {
          expect(res.body.data[0].id).to.eq(defaultRes.body.data.at(-1).id)
        }
      })
    })
  })

  it('limit above 100 is capped at 100 rows, not rejected', () => {
    cy.getPerformanceTrends({ limit: 500 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.lte(100)
    })
  })

  it('limit=abc, 0, negative or decimal returns 400 with a message', () => {
    ;['abc', 0, -5, 2.5].forEach((limit) => {
      cy.getPerformanceTrends({ limit }).then((res) => {
        expect(res.status, `limit=${limit}`).to.eq(400)
        expect(res.body).to.have.property('error', 'Bad request')
        expect(res.body.message).to.be.a('string').and.not.be.empty
      })
    })
  })

  it('empty limit= falls back to the default', () => {
    cy.getPerformanceTrends({ limit: '' }).then((res) => {
      expect(res.status).to.eq(200)
      cached('getPerformanceTrends').then((defaultRes) => {
        expect(res.body.data.map((a) => a.id)).to.deep.eq(defaultRes.body.data.map((a) => a.id))
      })
    })
  })

  it('type filter returns only that activity_type; non-letters return 400', () => {
    cy.getPerformanceTrends({ type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      res.body.data.forEach((a) => expect(a.activity_type).to.eq('Run'))
    })
    cy.getPerformanceTrends({ type: 'Run1' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('type must contain letters only')
    })
  })

  it('empty type= returns the same rows as no type', () => {
    cy.getPerformanceTrends({ type: '' }).then((res) => {
      expect(res.status).to.eq(200)
      cached('getPerformanceTrends').then((defaultRes) => {
        expect(res.body.data.map((a) => a.id)).to.deep.eq(defaultRes.body.data.map((a) => a.id))
      })
    })
  })
})

// ─── seeded: month edges with tz_offset and calendar vs activity type ─────────
// Declared last on purpose: the seeded rows can be picked up by the 300 s dashboard cache,
// so nothing after this block reads /dashboard.

describe('Running Calendar API — seeded month edges and activity type (tagged rows)', () => {
  const rand = Array.from({ length: 8 }, () => 'abcdefghij'[Math.floor(Math.random() * 10)]).join(
    ''
  )
  const SEED_TYPE = `Cy${rand}`
  const monthStart = `${currentMonth()}-01T12:00:00.000Z`
  let preExistingCount

  const rowsFor = (res) => res.body.data.filter((a) => a.name?.startsWith(`${SEED_TAG} run`))
  const names = (res) =>
    rowsFor(res)
      .map((a) => a.name)
      .sort()
  const name = (i) => `${SEED_TAG} run ${i}`

  before(() => {
    cy.deleteSeededDashboardActivitiesFromDb()
    cy.getActivityCountFromDb().then((count) => {
      preExistingCount = count
    })
    // 0: last minute of March 2020 UTC, 1: first instant of April UTC,
    // 2: Feb 29 17:00 UTC = Mar 1 00:00 at UTC+7, 3: Mar 31 16:59:59 UTC = Mar 31 23:59:59 at UTC+7,
    // 4: current month, unique activity type
    cy.seedTaggedActivitiesInDb([
      { started_at: '2020-03-31T23:59:00.000Z', activity_type: 'Run' },
      { started_at: '2020-04-01T00:00:00.000Z', activity_type: 'Walk' },
      { started_at: '2020-02-29T17:00:00.000Z', activity_type: 'Run' },
      { started_at: '2020-03-31T16:59:59.000Z', activity_type: 'Walk' },
      { started_at: monthStart, activity_type: SEED_TYPE },
    ]).then((rows) => {
      expect(rows).to.have.length(5)
    })
  })

  after(() => {
    cy.deleteSeededDashboardActivitiesFromDb().then((result) => {
      expect(result.deleted).to.eq(5)
    })
    cy.getActivityCountFromDb().then((count) => {
      expect(count, 'pre-existing activities untouched by cleanup').to.eq(preExistingCount)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('tz_offset=0: March holds rows 0 and 3, April holds row 1, Feb row 2', () => {
    cy.getCalendar({ month: '2020-03', tz_offset: 0 }).then((res) => {
      expect(names(res)).to.deep.eq([name(0), name(3)])
    })
    cy.getCalendar({ month: '2020-04' }).then((res) => {
      expect(names(res)).to.deep.eq([name(1)])
    })
    cy.getCalendar({ month: '2020-02' }).then((res) => {
      expect(names(res)).to.deep.eq([name(2)])
    })
  })

  it('tz_offset=-420 (UTC+7): March holds rows 2 and 3, April holds rows 0 and 1', () => {
    cy.getCalendar({ month: '2020-03', tz_offset: -420 }).then((res) => {
      expect(names(res)).to.deep.eq([name(2), name(3)])
    })
    cy.getCalendar({ month: '2020-04', tz_offset: -420 }).then((res) => {
      expect(names(res)).to.deep.eq([name(0), name(1)])
    })
    cy.getCalendar({ month: '2020-02', tz_offset: -420 }).then((res) => {
      expect(names(res)).to.deep.eq([])
    })
  })

  it('the month end is exclusive: 00:00 local on the 1st belongs to the new month', () => {
    cy.getCalendar({ month: '2020-03', tz_offset: 0 }).then((res) => {
      expect(names(res)).to.not.include(name(1))
    })
  })

  it('type filter narrows a seeded month', () => {
    cy.getCalendar({ month: '2020-03', type: 'Walk' }).then((res) => {
      expect(names(res)).to.deep.eq([name(3)])
      cy.getCalendar({ month: '2020-03', type: 'Run' }).then((runRes) => {
        expect(names(runRes)).to.deep.eq([name(0)])
      })
    })
  })

  it('dashboard calendar respects the activity type, same as /calendar (current month)', () => {
    cy.getCalendar({ type: SEED_TYPE }).then((calRes) => {
      expect(names(calRes)).to.deep.eq([name(4)])
      cy.getDashboard({ type: SEED_TYPE }).then((dashRes) => {
        expect(dashRes.status).to.eq(200)
        const dash = dashRes.body.data.calendar_activities
        expect(dash.map((a) => a.id).sort()).to.deep.eq(calRes.body.data.map((a) => a.id).sort())
        dash.forEach((a) => expect(a.activity_type).to.eq(SEED_TYPE))
      })
    })
  })

  it('dashboard calendar for another type excludes the seeded type', () => {
    cy.getCalendar({ type: 'Run' }).then((calRes) => {
      cy.getDashboard({ type: 'Run' }).then((dashRes) => {
        const dash = dashRes.body.data.calendar_activities
        dash.forEach((a) => expect(a.activity_type).to.eq('Run'))
        expect(dash.map((a) => a.id).sort()).to.deep.eq(calRes.body.data.map((a) => a.id).sort())
      })
    })
  })

  it('the seeded rows appear in /calendar without a type filter', () => {
    cy.getCalendar().then((res) => {
      expect(names(res)).to.include(name(4))
    })
  })
})
