import { normalizeToStandardDistance, lookupVdotFromTime } from '@/lib/data/vdot-table'
import { getVo2maxCategory } from '@/lib/data/vo2max-norms'
import { computeAge } from '@/lib/utils/date'

const MIN_HR_SAMPLE_SIZE = 4

// Monthly improvement rates by fitness category (mid, low, high)
const IMPROVEMENT_RATES = {
  Poor: { realistic: 0.04, optimistic: 0.05, pessimistic: 0.03 },
  Fair: { realistic: 0.04, optimistic: 0.05, pessimistic: 0.03 },
  Good: { realistic: 0.02, optimistic: 0.025, pessimistic: 0.015 },
  Excellent: { realistic: 0.01, optimistic: 0.015, pessimistic: 0.005 },
  Superior: { realistic: 0.0035, optimistic: 0.005, pessimistic: 0.002 },
  // Fallback if no sex/age to determine category
  default: { realistic: 0.025, optimistic: 0.04, pessimistic: 0.015 },
}

const PHYSIOLOGICAL_MAX_VDOT = 85

/**
 * Compute weeks-to-goal for each scenario.
 * Formula: weeks = ln(required / current) / ln(1 + monthly_rate / 4)
 * Returns null if already at goal.
 */
function computeWeeksToGoal(current, required, rates) {
  if (current >= required) return { optimistic: 0, realistic: 0, pessimistic: 0 }

  const calc = (rate) => {
    const weeklyRate = rate / 4
    if (weeklyRate <= 0) return null
    return Math.ceil(Math.log(required / current) / Math.log(1 + weeklyRate))
  }

  return {
    optimistic: calc(rates.optimistic),
    realistic: calc(rates.realistic),
    pessimistic: calc(rates.pessimistic),
  }
}

/**
 * Rules-based training recommendation copy.
 */
// gap is current - required: negative means behind, positive means ahead
function getTrainingRecommendation(gap, weeksToRace) {
  const deficit = -gap // positive = how far behind you are
  if (deficit > 3 && weeksToRace !== null && weeksToRace > 8) {
    return 'Add 2 interval sessions/week (4×4 min @ 90–95% max HR with 3 min recovery)'
  }
  if (deficit > 3 && weeksToRace !== null && weeksToRace <= 8) {
    return 'Behind schedule — consider adjusting your target time or extending the race date'
  }
  if (deficit > 1) {
    return 'Add 1 quality session/week (5×3 min hard, 2 min easy)'
  }
  return 'Nearly there — maintain current training to arrive at peak fitness'
}

/**
 * Main service function.
 * Returns all fields needed for the TargetEffortCard.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {object}
 */
export async function getTargetEffort(supabase, userId) {
  // 1. Fetch user profile (sex, birth_date for category badge)
  const { data: userRow } = await supabase
    .from('rt_users')
    .select('birth_date, sex')
    .eq('id', userId)
    .maybeSingle()

  const age = computeAge(userRow?.birth_date)
  const sex = userRow?.sex ?? null

  // 2. Fetch nearest upcoming race (race_date >= today, distance_m not null)
  const today = new Date().toISOString().split('T')[0]

  const { data: races } = await supabase
    .from('rt_upcoming_races')
    .select('id, title, race_date, distance_m, target_time_sec')
    .eq('user_id', userId)
    .gte('race_date', today)
    .not('distance_m', 'is', null)
    .order('race_date', { ascending: true })
    .limit(1)

  const race = races?.[0] ?? null

  if (!race) {
    return { status: 'no_goal', currentVo2max: null, requiredVo2max: null }
  }

  // Upcoming race exists but no target time set — show actionable empty state
  if (race.target_time_sec == null) {
    return {
      status: 'no_target_time',
      currentVo2max: null,
      requiredVo2max: null,
      goal: {
        id: race.id,
        title: race.title ?? null,
        targetDate: race.race_date,
        targetDistM: Number(race.distance_m),
        targetTimeSec: null,
      },
    }
  }

  const targetDate = race.race_date
  const targetDistM = Number(race.distance_m)
  const targetTimeSec = Number(race.target_time_sec)

  // 3. Compute required VO2max via VDOT lookup
  const { distKey, timeSec: normalizedTimeSec } = normalizeToStandardDistance(
    targetDistM,
    targetTimeSec
  )
  const requiredVdot = lookupVdotFromTime(distKey, normalizedTimeSec)
  const requiredVo2max = Math.round(requiredVdot * 10) / 10

  // 4. Fetch current VO2max (average of last 30 days with HR data)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: activityRows } = await supabase
    .from('rt_activities')
    .select('estimated_vo2max')
    .eq('user_id', userId)
    .eq('activity_type', 'Run')
    .not('estimated_vo2max', 'is', null)
    .not('avg_hr', 'is', null)
    .gte('started_at', thirtyDaysAgo.toISOString())

  if (!activityRows || activityRows.length < MIN_HR_SAMPLE_SIZE) {
    return {
      status: 'insufficient_data',
      currentVo2max: null,
      requiredVo2max,
      sampleSize: activityRows?.length ?? 0,
      goal: {
        targetDate,
        targetDistM,
        targetTimeSec,
      },
    }
  }

  const avgVo2max =
    activityRows.reduce((sum, r) => sum + Number(r.estimated_vo2max), 0) / activityRows.length
  const currentVo2max = Math.round(avgVo2max * 10) / 10

  // 5. Compute gap (positive = ahead of target, negative = behind)
  const gapMlKgMin = Math.round((currentVo2max - requiredVo2max) * 10) / 10

  // 6. Category + improvement rates
  const category = getVo2maxCategory(currentVo2max, sex, age)
  const rates = IMPROVEMENT_RATES[category] ?? IMPROVEMENT_RATES.default
  const categoryBadge = sex != null && age != null ? category : null

  // 7. Weeks to goal
  const weeksToGoal = computeWeeksToGoal(currentVo2max, requiredVo2max, rates)

  // 8. Weeks to race
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const raceDate = new Date(targetDate)
  raceDate.setHours(0, 0, 0, 0)
  const weeksToRace =
    raceDate < now ? null : Math.ceil((raceDate - now) / (7 * 24 * 60 * 60 * 1000))

  // 9. Status badge
  let statusBadge
  if (raceDate < now) {
    statusBadge = 'Goal Expired'
  } else if (currentVo2max >= requiredVo2max) {
    statusBadge = 'Goal Reached'
  } else if (
    weeksToGoal.realistic !== null &&
    weeksToRace !== null &&
    weeksToGoal.realistic > weeksToRace
  ) {
    statusBadge = 'Behind Schedule'
  } else {
    statusBadge = 'On Track'
  }

  // 10. Warning for physiologically extreme targets
  const physiologicalWarning =
    requiredVo2max > PHYSIOLOGICAL_MAX_VDOT ? 'Goal may not be physiologically achievable' : null

  // 11. Training recommendation
  const recommendedTraining = getTrainingRecommendation(gapMlKgMin, weeksToRace)

  return {
    status: 'ok',
    currentVo2max,
    requiredVo2max,
    gapMlKgMin,
    weeksToGoal,
    statusBadge,
    categoryBadge,
    recommendedTraining,
    physiologicalWarning,
    goal: {
      targetDate,
      targetDistM,
      targetTimeSec,
      id: race.id,
      title: race.title ?? null,
    },
    sampleSize: activityRows.length,
  }
}
