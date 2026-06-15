import { startOfWeek, subWeeks, startOfMonth, endOfMonth, format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { computeFitnessAge } from '@/lib/data/ntnu-fitness-age'
import { computeAge } from '@/lib/utils/date'
import {
  computeEnduranceScore,
  getEnduranceTier,
} from '@/lib/services/running/utils/enduranceScore'

const RECENT_ACTIVITIES_LIMIT = 5
const ACWR_ACUTE_DAYS = 7
const ACWR_CHRONIC_DAYS = 28

const VO2MAX_SLOPE_THRESHOLD_PER_WEEK = 0.3

// Uses UTC `now` intentionally — consistent with fetchTrainingLoad. A 28-day
// rolling window on timestamps does not require local-time day-boundary alignment.
async function fetchVo2maxSlope(supabase, userId, now) {
  const from = new Date(now)
  from.setDate(from.getDate() - 28)

  const { data, error } = await supabase
    .from('rt_activities')
    .select('started_at, estimated_vo2max')
    .eq('user_id', userId)
    .gte('started_at', from.toISOString())
    .lte('started_at', now.toISOString())
    .gte('moving_time_sec', 1200)
    .not('estimated_vo2max', 'is', null)
    .order('started_at', { ascending: true })

  if (error) throw error

  const activities = (data ?? []).filter((a) => Number(a.estimated_vo2max) > 0)
  if (activities.length < 4) return null

  const t0 = new Date(activities[0].started_at).getTime()
  const points = activities.map((a) => ({
    x: (new Date(a.started_at).getTime() - t0) / (1000 * 60 * 60 * 24),
    y: Number(a.estimated_vo2max),
  }))

  const n = points.length
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)

  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return null

  const slopePerWeek = ((n * sumXY - sumX * sumY) / denom) * 7

  // Guard against NaN: denom being NaN (not 0) bypasses the guard above
  if (!isFinite(slopePerWeek)) return null
  if (slopePerWeek > VO2MAX_SLOPE_THRESHOLD_PER_WEEK) return 'rising'
  if (slopePerWeek < -VO2MAX_SLOPE_THRESHOLD_PER_WEEK) return 'declining'
  return 'flat'
}

function computeTrainingStatus(acwrStatus, vo2maxTrend) {
  if (!vo2maxTrend || acwrStatus === 'no_data') return null
  if (acwrStatus === 'caution' || acwrStatus === 'danger') return 'overreaching'
  if (acwrStatus === 'optimal') {
    if (vo2maxTrend === 'rising') return 'productive'
    if (vo2maxTrend === 'flat') return 'maintaining'
    return 'unproductive'
  }
  if (acwrStatus === 'resting') {
    return vo2maxTrend === 'rising' ? 'peaking' : 'detraining'
  }
  // low ACWR + rising VO2max → no badge ("—" per spec matrix; flat/declining → detraining)
  return vo2maxTrend === 'rising' ? null : 'detraining'
}

function computeAcwrStatus(acwr, chronicLoad) {
  if (chronicLoad > 0 && acwr === 0) return 'resting'
  if (acwr === 0) return 'no_data'
  if (acwr <= 0.8) return 'low'
  if (acwr <= 1.3) return 'optimal'
  if (acwr <= 1.5) return 'caution'
  return 'danger'
}

const QUALIFYING_TYPES = ['Run', 'TrailRun', 'VirtualRun']
const LONG_RUN_TYPES = ['Run', 'TrailRun', 'Race']

async function fetchEnduranceScore(supabase, userId, now) {
  const chronic_from = new Date(now)
  chronic_from.setDate(chronic_from.getDate() - 28)

  const long_run_from = new Date(now)
  long_run_from.setDate(long_run_from.getDate() - 56)

  const [vo2maxRes, loadRes, longRunRes] = await Promise.all([
    supabase
      .from('rt_activities')
      .select('estimated_vo2max')
      .eq('user_id', userId)
      .in('activity_type', QUALIFYING_TYPES)
      .gte('moving_time_sec', 1200)
      .eq('has_heartrate', true)
      .not('estimated_vo2max', 'is', null)
      .order('started_at', { ascending: false })
      .limit(8),
    supabase
      .from('rt_activities')
      .select('relative_effort, duration_sec')
      .eq('user_id', userId)
      .gte('started_at', chronic_from.toISOString())
      .lte('started_at', now.toISOString()),
    supabase
      .from('rt_activities')
      .select('distance_m')
      .eq('user_id', userId)
      .in('activity_type', LONG_RUN_TYPES)
      .gte('started_at', long_run_from.toISOString())
      .lte('started_at', now.toISOString()),
  ])

  if (vo2maxRes.error) throw vo2maxRes.error
  if (loadRes.error) throw loadRes.error
  if (longRunRes.error) throw longRunRes.error

  const qualifying = (vo2maxRes.data ?? []).filter((a) => Number(a.estimated_vo2max) > 0)
  if (qualifying.length < 4) return { endurance_score: null, endurance_tier: null }

  const avgVo2max =
    qualifying.reduce((sum, a) => sum + Number(a.estimated_vo2max), 0) / qualifying.length

  const chronicLoad =
    (loadRes.data ?? []).reduce((sum, a) => {
      const load =
        a.relative_effort != null ? a.relative_effort : (Number(a.duration_sec) || 0) / 60
      return sum + load
    }, 0) / 28

  const bestLongRunKm =
    (longRunRes.data ?? []).reduce((max, a) => Math.max(max, Number(a.distance_m) || 0), 0) / 1000

  const endurance_score = computeEnduranceScore({ vo2max: avgVo2max, chronicLoad, bestLongRunKm })

  return { endurance_score, endurance_tier: getEnduranceTier(endurance_score) }
}

async function fetchFitnessAge(supabase, userId) {
  const [{ data: userRow, error: userError }, { data: rows, error: rowsError }] = await Promise.all(
    [
      supabase.from('rt_users').select('birth_date, sex').eq('id', userId).maybeSingle(),
      supabase
        .from('rt_activities')
        .select('estimated_vo2max')
        .eq('user_id', userId)
        .in('activity_type', QUALIFYING_TYPES)
        .gte('moving_time_sec', 1200)
        .eq('has_heartrate', true)
        .not('estimated_vo2max', 'is', null)
        .order('started_at', { ascending: false })
        .limit(8),
    ]
  )

  if (userError) throw userError
  if (rowsError) throw rowsError

  const sex = userRow?.sex ?? null
  if (!sex || (sex !== 'male' && sex !== 'female')) {
    return { fitness_age: null, chronological_age: null, sex_missing: true }
  }

  const qualifying = (rows ?? []).filter((a) => Number(a.estimated_vo2max) > 0)
  if (qualifying.length < 4) {
    return {
      fitness_age: null,
      chronological_age: computeAge(userRow?.birth_date),
      sex_missing: false,
    }
  }

  const avgVo2max =
    qualifying.reduce((sum, a) => sum + Number(a.estimated_vo2max), 0) / qualifying.length

  return {
    fitness_age: computeFitnessAge(avgVo2max, sex),
    chronological_age: computeAge(userRow?.birth_date),
    sex_missing: false,
  }
}

/**
 * Derives weekly stats summary from a list of activity rows.
 * @param {Array<{distance_m: number, duration_sec: number}>} activities
 * @returns {{ distance_m: number, duration_sec: number, count: number, avg_pace_sec_per_km: number|null }}
 */
function summarizeWeek(activities) {
  const distance_m = activities.reduce((sum, a) => sum + (Number(a.distance_m) || 0), 0)
  const duration_sec = activities.reduce((sum, a) => sum + (Number(a.duration_sec) || 0), 0)
  const elevation_gain_m = activities.reduce((sum, a) => sum + (Number(a.elevation_gain_m) || 0), 0)
  const total_calories = activities.reduce((sum, a) => sum + (Number(a.calories) || 0), 0)
  const longest_run_m =
    activities.length > 0
      ? activities.reduce((max, a) => Math.max(max, Number(a.distance_m) || 0), 0)
      : null
  const count = activities.length

  const avg_pace_sec_per_km = distance_m > 0 ? Math.round(duration_sec / (distance_m / 1000)) : null

  let movingTimeSec = 0
  let movingDistanceM = 0
  let hrWeightedSum = 0
  let hrDurationSum = 0

  for (const a of activities) {
    if (a.moving_time_sec != null) {
      movingTimeSec += Number(a.moving_time_sec)
      movingDistanceM += Number(a.distance_m) || 0
    }
    if (a.avg_hr != null) {
      const dur = Number(a.duration_sec) || 0
      hrWeightedSum += Number(a.avg_hr) * dur
      hrDurationSum += dur
    }
  }

  const avg_moving_pace_sec_per_km =
    movingDistanceM > 0 ? Math.round(movingTimeSec / (movingDistanceM / 1000)) : null

  const avg_hr = hrDurationSum > 0 ? Math.round(hrWeightedSum / hrDurationSum) : null

  return {
    distance_m,
    duration_sec,
    elevation_gain_m,
    total_calories,
    longest_run_m,
    count,
    avg_pace_sec_per_km,
    avg_moving_pace_sec_per_km,
    avg_hr,
  }
}

/**
 * Fetches weekly stats for both current and previous weeks.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {Date} currentWeekStart
 * @param {Date} prevWeekStart
 * @returns {Promise<{ current: object, prev: object }>}
 */
async function fetchWeeklyStats(supabase, userId, currentWeekStart, prevWeekStart, activityType) {
  const now = new Date()

  let currentQ = supabase
    .from('rt_activities')
    .select('distance_m, duration_sec, moving_time_sec, elevation_gain_m, avg_hr, calories')
    .eq('user_id', userId)
    .gte('started_at', currentWeekStart.toISOString())
    .lte('started_at', now.toISOString())

  let prevQ = supabase
    .from('rt_activities')
    .select('distance_m, duration_sec, moving_time_sec, elevation_gain_m, avg_hr, calories')
    .eq('user_id', userId)
    .gte('started_at', prevWeekStart.toISOString())
    .lt('started_at', currentWeekStart.toISOString())

  if (activityType) {
    currentQ = currentQ.eq('activity_type', activityType)
    prevQ = prevQ.eq('activity_type', activityType)
  }

  const [currentRes, prevRes] = await Promise.all([currentQ, prevQ])

  if (currentRes.error) throw currentRes.error
  if (prevRes.error) throw prevRes.error

  return {
    current: summarizeWeek(currentRes.data ?? []),
    prev: summarizeWeek(prevRes.data ?? []),
  }
}

function activityLoad(activity) {
  return activity.relative_effort != null
    ? activity.relative_effort
    : (Number(activity.duration_sec) || 0) / 60
}

async function fetchTrainingLoad(supabase, userId, now) {
  const chronic_from = new Date(now)
  chronic_from.setDate(chronic_from.getDate() - ACWR_CHRONIC_DAYS)

  const { data, error } = await supabase
    .from('rt_activities')
    .select('started_at, duration_sec, relative_effort')
    .eq('user_id', userId)
    .gte('started_at', chronic_from.toISOString())
    .lte('started_at', now.toISOString())

  if (error) throw error

  const activities = data ?? []

  const acute_cutoff = new Date(now)
  acute_cutoff.setDate(acute_cutoff.getDate() - ACWR_ACUTE_DAYS)

  let acute_total_load = 0
  let chronic_total_load = 0

  for (const activity of activities) {
    const load = activityLoad(activity)
    chronic_total_load += load
    if (new Date(activity.started_at) >= acute_cutoff) {
      acute_total_load += load
    }
  }

  const acute_load_7d = acute_total_load / ACWR_ACUTE_DAYS
  const chronic_load_28d = chronic_total_load / ACWR_CHRONIC_DAYS
  const acwr = chronic_load_28d > 0 ? acute_load_7d / chronic_load_28d : 0
  const status = computeAcwrStatus(acwr, chronic_load_28d)

  return {
    acwr: Math.round(acwr * 100) / 100,
    acute_load_7d: Math.round(acute_load_7d * 10) / 10,
    chronic_load_28d: Math.round(chronic_load_28d * 10) / 10,
    status,
  }
}

async function fetchWeeklyLoad(supabase, userId, currentWeekStart, prevWeekStart) {
  const now = new Date()

  const [currentRes, prevRes] = await Promise.all([
    supabase
      .from('rt_activities')
      .select('relative_effort, duration_sec')
      .eq('user_id', userId)
      .gte('started_at', currentWeekStart.toISOString())
      .lte('started_at', now.toISOString()),
    supabase
      .from('rt_activities')
      .select('relative_effort, duration_sec')
      .eq('user_id', userId)
      .gte('started_at', prevWeekStart.toISOString())
      .lt('started_at', currentWeekStart.toISOString()),
  ])

  if (currentRes.error) throw currentRes.error
  if (prevRes.error) throw prevRes.error

  const sumLoad = (rows) => (rows ?? []).reduce((sum, a) => sum + activityLoad(a), 0)

  const current_week_load = Math.round(sumLoad(currentRes.data))
  const prev_week_load = Math.round(sumLoad(prevRes.data))
  const ramp_pct =
    prev_week_load > 0
      ? Math.round(((current_week_load - prev_week_load) / prev_week_load) * 100)
      : null

  return { current_week_load, prev_week_load, ramp_pct }
}

async function fetchEffortSplit(supabase, userId, currentWeekStart) {
  const now = new Date()

  const { data, error } = await supabase
    .from('rt_activities')
    .select('relative_effort, duration_sec, workout_type')
    .eq('user_id', userId)
    .gte('started_at', currentWeekStart.toISOString())
    .lte('started_at', now.toISOString())

  if (error) throw error

  const activities = data ?? []
  let easy_load = 0
  let hard_load = 0

  for (const a of activities) {
    const load = activityLoad(a)
    // workout_type 1 = race, 3 = workout → hard; everything else (0=default, 2=long run, null) → easy
    const isHard = a.workout_type === 1 || a.workout_type === 3
    if (isHard) hard_load += load
    else easy_load += load
  }

  const total = easy_load + hard_load
  return {
    easy_load: Math.round(easy_load),
    hard_load: Math.round(hard_load),
    easy_pct: total > 0 ? Math.round((easy_load / total) * 100) : null,
    hard_pct: total > 0 ? Math.round((hard_load / total) * 100) : null,
  }
}

async function fetchNextRaceGoal(supabase, userId, localNow) {
  const today = format(localNow, 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('rt_goals')
    .select('id, target_distance_m, target_date, title, description')
    .eq('user_id', userId)
    .eq('goal_type', 'race')
    .eq('status', 'active')
    .gte('target_date', today)
    .order('target_date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const days_until = Math.ceil(
    (new Date(data.target_date).getTime() - localNow.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    id: data.id,
    distance_m: Number(data.target_distance_m),
    target_date: data.target_date,
    title: data.title ?? null,
    description: data.description ?? null,
    days_until,
  }
}

/**
 * Fetches the 5 most recent activities for the user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function fetchRecentActivities(supabase, userId, activityType) {
  let q = supabase
    .from('rt_activities')
    .select(
      'id, started_at, name, distance_m, duration_sec, moving_time_sec, avg_pace_sec_per_km, avg_hr, activity_type, source, elevation_gain_m, calories, pr_count, workout_type'
    )
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(RECENT_ACTIVITIES_LIMIT)

  if (activityType) q = q.eq('activity_type', activityType)

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

/**
 * Fetches activities for the current calendar month, returning date + activity_type pairs.
 * Multiple activities on the same day are all included.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {Date} now
 * @returns {Promise<Array<{ date: string, activity_type: string }>>}
 */
async function fetchCalendarActivities(supabase, userId, localNow, tzOffsetMs) {
  const localMonthStart = startOfMonth(localNow)
  const localMonthEnd = endOfMonth(localNow)
  const monthStart = new Date(localMonthStart.getTime() + tzOffsetMs)
  const monthEnd = new Date(localMonthEnd.getTime() + tzOffsetMs)

  const { data, error } = await supabase
    .from('rt_activities')
    .select('id, started_at, activity_type, name, distance_m, relative_effort')
    .eq('user_id', userId)
    .gte('started_at', monthStart.toISOString())
    .lte('started_at', monthEnd.toISOString())
    .order('started_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((a) => ({
    id: a.id,
    date: format(new Date(new Date(a.started_at).getTime() - tzOffsetMs), 'yyyy-MM-dd'),
    activity_type: a.activity_type,
    name: a.name ?? null,
    distance_m: a.distance_m ?? null,
    relative_effort: a.relative_effort ?? null,
  }))
}

/**
 * Fetches today's subjective health log for the user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {Date} now
 * @returns {Promise<{ logged: boolean, data: object|null }>}
 */
async function fetchHealthToday(supabase, userId, localNow) {
  const today = format(localNow, 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('rt_subjective_health_logs')
    .select(
      'id, log_date, sleep_hours, sleep_quality, morning_energy, mood, soreness_level, manual_rhr, notes'
    )
    .eq('user_id', userId)
    .eq('log_date', today)
    .maybeSingle()

  if (error) throw error

  return {
    logged: data !== null,
    data: data ?? null,
  }
}

/**
 * Aggregates all dashboard data for a given user in a single call.
 * Independent queries run in parallel via Promise.all.
 *
 * @param {string} userId
 * @returns {Promise<{
 *   weekly_stats: { current: object, prev: object },
 *   training_load: { acwr: number, acute_load_7d: number, chronic_load_28d: number, status: string },
 *   recent_activities: Array,
 *   calendar_activities: Array,
 *   health_today: { logged: boolean, data: object|null }
 * }>}
 */
export async function getDashboardData(userId, activityType = null, tzOffsetMs = 0) {
  const supabase = await createClient()
  const now = new Date()

  // Shift to user's local time for day/week boundary math
  const localNow = new Date(now.getTime() - tzOffsetMs)

  // Compute week boundaries in local time, then shift back to UTC for DB queries
  const localCurrentWeekStart = startOfWeek(localNow, { weekStartsOn: 1 })
  const localPrevWeekStart = startOfWeek(subWeeks(localNow, 1), { weekStartsOn: 1 })
  const currentWeekStart = new Date(localCurrentWeekStart.getTime() + tzOffsetMs)
  const prevWeekStart = new Date(localPrevWeekStart.getTime() + tzOffsetMs)

  const [
    weekly_stats,
    training_load,
    weekly_load,
    effort_split,
    next_race_goal,
    recent_activities,
    calendar_activities,
    health_today,
    vo2max_trend,
    fitness_age_data,
    endurance_score_data,
  ] = await Promise.all([
    fetchWeeklyStats(supabase, userId, currentWeekStart, prevWeekStart, activityType),
    fetchTrainingLoad(supabase, userId, now),
    fetchWeeklyLoad(supabase, userId, currentWeekStart, prevWeekStart),
    fetchEffortSplit(supabase, userId, currentWeekStart),
    fetchNextRaceGoal(supabase, userId, localNow),
    fetchRecentActivities(supabase, userId, activityType),
    fetchCalendarActivities(supabase, userId, localNow, tzOffsetMs),
    fetchHealthToday(supabase, userId, localNow),
    fetchVo2maxSlope(supabase, userId, now),
    fetchFitnessAge(supabase, userId),
    fetchEnduranceScore(supabase, userId, now),
  ])

  const training_status = computeTrainingStatus(training_load.status, vo2max_trend)

  return {
    weekly_stats,
    training_load: {
      ...training_load,
      ...weekly_load,
      effort_split,
      next_race_goal,
      training_status,
    },
    recent_activities,
    calendar_activities,
    health_today,
    fitness_age: fitness_age_data,
    endurance_score: endurance_score_data,
  }
}
