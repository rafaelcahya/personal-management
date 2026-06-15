import { computeFitnessAge } from '@/lib/data/ntnu-fitness-age'
import { computeAge } from '@/lib/utils/date'

const QUALIFYING_TYPES = ['Run', 'TrailRun', 'VirtualRun']
const MIN_SAMPLE = 4
const LOOKBACK = 8
const HISTORY_BUFFER_DAYS = 60

/**
 * Computes weekly Fitness Age for the last 12 weeks.
 * For each week ending on Sunday, takes the 8 most recent qualifying activities
 * up to that date and computes the average VO2max → fitness age.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<{ weekly: Array<{ week: string, fitness_age: number, avg_vo2max: number }>, chronological_age: number|null, sex_missing: boolean }>}
 */
export async function getFitnessAgeWeekly(supabase, userId) {
  const { data: userRow, error: userError } = await supabase
    .from('rt_users')
    .select('birth_date, sex')
    .eq('id', userId)
    .maybeSingle()

  if (userError) throw userError

  const sex = userRow?.sex ?? null
  if (!sex || (sex !== 'male' && sex !== 'female')) {
    return { weekly: [], chronological_age: null, sex_missing: true }
  }

  const chronological_age = computeAge(userRow?.birth_date)

  // Fetch all qualifying activities — enough history for 12 weeks of lookback
  const from = new Date()
  from.setDate(from.getDate() - 7 * 12 - HISTORY_BUFFER_DAYS)

  const { data: rows, error: rowsError } = await supabase
    .from('rt_activities')
    .select('started_at, estimated_vo2max')
    .eq('user_id', userId)
    .in('activity_type', QUALIFYING_TYPES)
    .gte('moving_time_sec', 1200)
    .eq('has_heartrate', true)
    .not('estimated_vo2max', 'is', null)
    .gte('started_at', from.toISOString())
    .order('started_at', { ascending: false })

  if (rowsError) throw rowsError

  const activities = (rows ?? []).filter((a) => Number(a.estimated_vo2max) > 0)

  // Build week end dates (Sundays) for last 12 weeks
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sun
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const latestSunday = new Date(now)
  latestSunday.setDate(now.getDate() + daysToSunday)
  latestSunday.setHours(23, 59, 59, 999)

  const weekly = []
  for (let i = 0; i < 12; i++) {
    const weekEnd = new Date(latestSunday)
    weekEnd.setDate(latestSunday.getDate() - i * 7)

    const cutoff = weekEnd.toISOString()
    const qualifying = activities.filter((a) => a.started_at <= cutoff).slice(0, LOOKBACK)

    if (qualifying.length < MIN_SAMPLE) continue

    const avgVo2max =
      qualifying.reduce((sum, a) => sum + Number(a.estimated_vo2max), 0) / qualifying.length
    const fitness_age = computeFitnessAge(avgVo2max, sex)
    if (fitness_age == null) continue

    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)
    const week = weekStart.toISOString().slice(0, 10)

    weekly.push({ week, fitness_age, avg_vo2max: parseFloat(avgVo2max.toFixed(2)) })
  }

  weekly.reverse()

  return { weekly, chronological_age, sex_missing: false }
}
