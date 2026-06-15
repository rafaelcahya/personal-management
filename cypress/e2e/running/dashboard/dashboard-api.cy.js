// ─── dashboard ────────────────────────────────────────────────────────────────

describe('Running Dashboard API — GET /dashboard — core response', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getDashboard().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data contains all top-level keys', () => {
    cy.getDashboard().then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys(
        'weekly_stats',
        'training_load',
        'recent_activities',
        'calendar_activities',
        'health_today',
        'fitness_age',
        'endurance_score',
        'last_sync_at'
      )
    })
  })

  it('last_sync_at is null or a string', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      const { weekly_stats } = res.body.data
      expect(weekly_stats).to.have.property('current')
      expect(weekly_stats).to.have.property('prev')
    })
  })

  it('weekly_stats.current has all expected fields', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      const { current } = res.body.data.weekly_stats
      expect(Number.isInteger(current.distance_m)).to.eq(true)
      expect(Number.isInteger(current.duration_sec)).to.eq(true)
      expect(Number.isInteger(current.count)).to.eq(true)
    })
  })

  it('weekly_stats.prev has same shape as current', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      const { training_load } = res.body.data
      expect(training_load).to.include.all.keys(
        'acwr',
        'acute_load_7d',
        'chronic_load_28d',
        'status',
        'current_week_load',
        'prev_week_load',
        'ramp_pct',
        'effort_split',
        'training_status',
        'ytd_stats'
      )
    })
  })

  it('training_load.status is a valid ACWR status value', () => {
    cy.getDashboard().then((res) => {
      const { status } = res.body.data.training_load
      expect(status).to.be.oneOf(['no_data', 'resting', 'low', 'optimal', 'caution', 'danger'])
    })
  })

  it('acwr, acute_load_7d, chronic_load_28d are numbers', () => {
    cy.getDashboard().then((res) => {
      const { acwr, acute_load_7d, chronic_load_28d } = res.body.data.training_load
      expect(typeof acwr).to.eq('number')
      expect(typeof acute_load_7d).to.eq('number')
      expect(typeof chronic_load_28d).to.eq('number')
    })
  })

  it('current_week_load and prev_week_load are numbers', () => {
    cy.getDashboard().then((res) => {
      const { current_week_load, prev_week_load } = res.body.data.training_load
      expect(typeof current_week_load).to.eq('number')
      expect(typeof prev_week_load).to.eq('number')
    })
  })

  it('ramp_pct is null or a number', () => {
    cy.getDashboard().then((res) => {
      const { ramp_pct } = res.body.data.training_load
      expect(ramp_pct === null || typeof ramp_pct === 'number').to.be.true
    })
  })

  it('effort_split has easy_load, hard_load, easy_pct, hard_pct keys', () => {
    cy.getDashboard().then((res) => {
      const { effort_split } = res.body.data.training_load
      expect(effort_split).to.include.all.keys('easy_load', 'hard_load', 'easy_pct', 'hard_pct')
    })
  })

  it('effort_split easy_pct and hard_pct are null or numbers', () => {
    cy.getDashboard().then((res) => {
      const { easy_pct, hard_pct } = res.body.data.training_load.effort_split
      expect(easy_pct === null || typeof easy_pct === 'number').to.be.true
      expect(hard_pct === null || typeof hard_pct === 'number').to.be.true
    })
  })

  it('training_status is null or a valid status string', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      const { ytd_stats } = res.body.data.training_load
      expect(ytd_stats === null || typeof ytd_stats === 'object').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard — recent_activities', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('recent_activities is an array', () => {
    cy.getDashboard().then((res) => {
      expect(res.body.data.recent_activities).to.be.an('array')
    })
  })

  it('each recent_activity item has required fields', () => {
    cy.getDashboard().then((res) => {
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

  it('each recent_activity has a valid id and activity_type', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      expect(res.body.data.calendar_activities).to.be.an('array')
    })
  })

  it('each calendar_activity item has required fields', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard().then((res) => {
      const items = res.body.data.calendar_activities
      if (items.length === 0)
        return cy.log('No calendar activities — skipping date format assertion')
      items.forEach((item) => {
        expect(item.date).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })
})

describe('Running Dashboard API — GET /dashboard — health_today', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('health_today has logged boolean and data field', () => {
    cy.getDashboard().then((res) => {
      const { health_today } = res.body.data
      expect(health_today).to.have.property('logged')
      expect(health_today).to.have.property('data')
      expect(health_today.logged).to.be.a('boolean')
    })
  })

  it('health_today.data is null or an object', () => {
    cy.getDashboard().then((res) => {
      const { data: healthData } = res.body.data.health_today
      expect(healthData === null || typeof healthData === 'object').to.be.true
    })
  })
})

describe('Running Dashboard API — GET /dashboard — fitness_age', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('fitness_age is an object with required keys', () => {
    cy.getDashboard().then((res) => {
      const { fitness_age } = res.body.data
      expect(fitness_age).to.be.an('object')
      expect(fitness_age).to.include.all.keys('fitness_age', 'chronological_age', 'sex_missing')
    })
  })

  it('fitness_age.sex_missing is a boolean', () => {
    cy.getDashboard().then((res) => {
      expect(res.body.data.fitness_age.sex_missing).to.be.a('boolean')
    })
  })

  it('fitness_age.fitness_age is null or a number', () => {
    cy.getDashboard().then((res) => {
      const { fitness_age: fa } = res.body.data.fitness_age
      expect(fa === null || typeof fa === 'number').to.be.true
    })
  })

  it('fitness_age.chronological_age is null or a number', () => {
    cy.getDashboard().then((res) => {
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
    cy.getDashboard({ type: 'Run' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('?type=TrailRun returns 200 and data', () => {
    cy.getDashboard({ type: 'TrailRun' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('?tz_offset=-420 returns 200', () => {
    cy.getDashboard({ tz_offset: -420 }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('?tz_offset=invalid does not crash — falls back to UTC', () => {
    cy.getDashboard({ tz_offset: 'invalid' }).then((res) => {
      expect(res.status).to.eq(200)
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
    cy.getGear().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each gear item has required fields: id, name, distance_m, retired', () => {
    cy.getGear().then((res) => {
      const items = res.body.data
      if (items.length === 0) return cy.log('No gear items — skipping field assertions')
      items.forEach((item) => {
        expect(item).to.include.all.keys('id', 'name', 'distance_m', 'retired')
      })
    })
  })

  it('each gear item has optional limit fields: category, retirement_km, notification_distance_m', () => {
    cy.getGear().then((res) => {
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
    cy.getGear().then((res) => {
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

// ─── performance trends ───────────────────────────────────────────────────────

describe('Running Performance Trends API — GET /performance-trends', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array', () => {
    cy.getPerformanceTrends().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each item has started_at and distance_m fields', () => {
    cy.getPerformanceTrends().then((res) => {
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
    cy.getPerformanceTrends({ limit: 20 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.be.lte(20)
    })
  })

  it('?type=Run filter returns 200', () => {
    cy.getPerformanceTrends({ type: 'Run' }).then((res) => {
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

// ─── fitness age analytics ────────────────────────────────────────────────────

describe('Running Fitness Age API — GET /analytics/fitness-age', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data', () => {
    cy.getFitnessAgeTrend().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data has weekly, chronological_age, sex_missing keys', () => {
    cy.getFitnessAgeTrend().then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys('weekly', 'chronological_age', 'sex_missing')
    })
  })

  it('data.weekly is an array', () => {
    cy.getFitnessAgeTrend().then((res) => {
      expect(res.body.data.weekly).to.be.an('array')
    })
  })

  it('data.sex_missing is a boolean', () => {
    cy.getFitnessAgeTrend().then((res) => {
      expect(res.body.data.sex_missing).to.be.a('boolean')
    })
  })

  it('data.chronological_age is null or a number', () => {
    cy.getFitnessAgeTrend().then((res) => {
      const { chronological_age } = res.body.data
      expect(chronological_age === null || typeof chronological_age === 'number').to.be.true
    })
  })

  it('each weekly item has week, fitness_age, avg_vo2max fields', () => {
    cy.getFitnessAgeTrend().then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping field assertions')
      weekly.forEach((item) => {
        expect(item).to.include.all.keys('week', 'fitness_age', 'avg_vo2max')
      })
    })
  })

  it('each weekly item week is in YYYY-MM-DD format', () => {
    cy.getFitnessAgeTrend().then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping date format assertion')
      weekly.forEach((item) => {
        expect(item.week).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('each weekly item fitness_age is a multiple of 5 between 20 and 70', () => {
    cy.getFitnessAgeTrend().then((res) => {
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
    cy.getFitnessAgeTrend().then((res) => {
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
    cy.getDashboard().then((res) => {
      const { endurance_score } = res.body.data
      expect(endurance_score).to.be.an('object')
      expect(endurance_score).to.include.all.keys('endurance_score', 'endurance_tier')
    })
  })

  it('endurance_score.endurance_score is null or a number', () => {
    cy.getDashboard().then((res) => {
      const { endurance_score: score } = res.body.data.endurance_score
      expect(score === null || typeof score === 'number').to.be.true
    })
  })

  it('endurance_score.endurance_tier is null or a valid tier string', () => {
    cy.getDashboard().then((res) => {
      const { endurance_tier } = res.body.data.endurance_score
      const validTiers = ['Beginner', 'Building', 'Developing', 'Solid', 'Advanced']
      expect(endurance_tier === null || validTiers.includes(endurance_tier)).to.be.true
    })
  })

  it('endurance_score.endurance_score is between 0 and 100 when not null', () => {
    cy.getDashboard().then((res) => {
      const { endurance_score: score } = res.body.data.endurance_score
      if (score === null) return cy.log('endurance_score is null — skipping range assertion')
      expect(score).to.be.gte(0)
      expect(score).to.be.lte(100)
    })
  })

  it('endurance_score.endurance_tier is non-null when score is non-null', () => {
    cy.getDashboard().then((res) => {
      const { endurance_score: score, endurance_tier } = res.body.data.endurance_score
      if (score === null) return cy.log('endurance_score is null — skipping tier co-presence check')
      expect(endurance_tier).to.not.be.null
    })
  })
})

// ─── endurance score analytics ────────────────────────────────────────────────

describe('Running Endurance Score API — GET /analytics/endurance-score', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data', () => {
    cy.getEnduranceScore().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data has weekly key', () => {
    cy.getEnduranceScore().then((res) => {
      expect(res.body.data).to.have.property('weekly')
    })
  })

  it('data.weekly is an array', () => {
    cy.getEnduranceScore().then((res) => {
      expect(res.body.data.weekly).to.be.an('array')
    })
  })

  it('each weekly item has week, endurance_score, avg_vo2max, chronic_load, best_long_run_km fields', () => {
    cy.getEnduranceScore().then((res) => {
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
    cy.getEnduranceScore().then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping date format assertion')
      weekly.forEach((item) => {
        expect(item.week).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('each weekly item endurance_score is between 0 and 100', () => {
    cy.getEnduranceScore().then((res) => {
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
    cy.getEnduranceScore().then((res) => {
      const { weekly } = res.body.data
      if (weekly.length === 0) return cy.log('No weekly data — skipping avg_vo2max assertion')
      weekly.forEach((item) => {
        expect(item.avg_vo2max).to.be.a('number')
        expect(item.avg_vo2max).to.be.gt(0)
      })
    })
  })

  it('weekly array has at most 12 entries', () => {
    cy.getEnduranceScore().then((res) => {
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
