import { getVo2maxCategory } from '@/lib/data/vo2max-norms'

const MIN_SAMPLE_SIZE = 5
const MAINTENANCE_MIN_DURATION_SEC = 1200
const MAINTENANCE_MIN_COUNT = 2
const MAINTENANCE_HR_THRESHOLD = 0.8
const TREND_UP_THRESHOLD = 0.5
const TREND_DOWN_THRESHOLD = -0.5

function computeAge(birthDate) {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

function average(rows, field) {
  if (!rows || rows.length === 0) return null
  const sum = rows.reduce((acc, r) => acc + Number(r[field]), 0)
  return sum / rows.length
}

export async function getCurrentVo2maxStat(supabase, userId) {
  const now = Date.now()

  const { data: userRow, error: userError } = await supabase
    .from('rt_users')
    .select('max_hr, birth_date')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  const age = computeAge(userRow?.birth_date)

  const DAY_MS = 24 * 60 * 60 * 1000
  const current30Start = new Date(now - 30 * DAY_MS).toISOString()
  const previous60Start = new Date(now - 60 * DAY_MS).toISOString()
  const previous30End = new Date(now - 30 * DAY_MS).toISOString()
  const maintenance7Start = new Date(now - 7 * DAY_MS).toISOString()
  const improvement14Start = new Date(now - 14 * DAY_MS).toISOString()

  const [currentRes, previousRes, maintenanceRes, improvementRes] = await Promise.all([
    supabase
      .from('rt_activities')
      .select('estimated_vo2max')
      .eq('user_id', userId)
      .eq('activity_type', 'Run')
      .not('estimated_vo2max', 'is', null)
      .not('avg_hr', 'is', null)
      .gte('started_at', current30Start),
    supabase
      .from('rt_activities')
      .select('estimated_vo2max')
      .eq('user_id', userId)
      .eq('activity_type', 'Run')
      .not('estimated_vo2max', 'is', null)
      .not('avg_hr', 'is', null)
      .gte('started_at', previous60Start)
      .lt('started_at', previous30End),
    supabase
      .from('rt_activities')
      .select('avg_hr')
      .eq('user_id', userId)
      .eq('activity_type', 'Run')
      .not('avg_hr', 'is', null)
      .gte('duration_sec', MAINTENANCE_MIN_DURATION_SEC)
      .gte('started_at', maintenance7Start),
    supabase
      .from('rt_activities')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', 'Run')
      .eq('workout_type', 3)
      .gte('started_at', improvement14Start)
      .limit(1),
  ])

  if (currentRes.error) throw currentRes.error
  if (previousRes.error) throw previousRes.error
  if (maintenanceRes.error) throw maintenanceRes.error
  if (improvementRes.error) throw improvementRes.error

  const currentRows = currentRes.data ?? []

  if (currentRows.length < MIN_SAMPLE_SIZE) {
    return { empty: true, sample_size: currentRows.length }
  }

  const currentAvg = average(currentRows, 'estimated_vo2max')
  const current = Math.round(currentAvg * 10) / 10

  const previousRows = previousRes.data ?? []
  const previousAvg = average(previousRows, 'estimated_vo2max')
  const previous = previousAvg !== null ? Math.round(previousAvg * 10) / 10 : null

  const delta = previous !== null ? Math.round((current - previous) * 10) / 10 : null

  let trend = null
  if (delta !== null) {
    if (delta > TREND_UP_THRESHOLD) trend = 'up'
    else if (delta < TREND_DOWN_THRESHOLD) trend = 'down'
    else trend = 'flat'
  }

  // sex not in rt_users schema yet; category always null until the column is added
  const category = getVo2maxCategory(current, null, age)

  let maintenance_status = null
  if (userRow?.max_hr != null) {
    const threshold = MAINTENANCE_HR_THRESHOLD * userRow.max_hr
    const qualifyingCount = (maintenanceRes.data ?? []).filter(
      (r) => Number(r.avg_hr) >= threshold
    ).length
    maintenance_status = qualifyingCount >= MAINTENANCE_MIN_COUNT ? 'ok' : 'at_risk'
  }

  const improvement_signal = (improvementRes.data ?? []).length > 0

  return {
    empty: false,
    current,
    previous,
    trend,
    delta,
    sample_size: currentRows.length,
    category,
    maintenance_status,
    improvement_signal,
  }
}
