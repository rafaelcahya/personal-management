import { computeEnduranceScore } from '@/lib/services/running/utils/enduranceScore'

const QUALIFYING_TYPES = ['Run', 'TrailRun', 'VirtualRun']
const LONG_RUN_TYPES = ['Run', 'TrailRun', 'Race']
const MIN_VO2MAX_SAMPLE = 4
const LOOKBACK = 8
const WEEKS = 12
const LONG_RUN_DAYS = 56
const LOAD_DAYS = 28
const VO2MAX_LOOKBACK_BUFFER_DAYS = 60

/**
 * Computes weekly Endurance Score for the last 12 weeks.
 * For each week: avg VO2max of last 8 qualifying runs, 28-day chronic load, best long run in 56 days.
 */
export async function getEnduranceScoreWeekly(supabase, userId) {
  const now = new Date()

  const vo2maxFrom = new Date(now)
  vo2maxFrom.setDate(now.getDate() - 7 * WEEKS - VO2MAX_LOOKBACK_BUFFER_DAYS)

  const loadFrom = new Date(now)
  loadFrom.setDate(now.getDate() - 7 * WEEKS - LOAD_DAYS)

  const longRunFrom = new Date(now)
  longRunFrom.setDate(now.getDate() - 7 * WEEKS - LONG_RUN_DAYS)

  const nowIso = now.toISOString()

  const [vo2maxRes, loadRes, longRunRes] = await Promise.all([
    supabase
      .from('rt_activities')
      .select('started_at, estimated_vo2max')
      .eq('user_id', userId)
      .in('activity_type', QUALIFYING_TYPES)
      .gte('moving_time_sec', 1200)
      .eq('has_heartrate', true)
      .not('estimated_vo2max', 'is', null)
      .gte('started_at', vo2maxFrom.toISOString())
      .lte('started_at', nowIso)
      .order('started_at', { ascending: false }),
    supabase
      .from('rt_activities')
      .select('started_at, relative_effort, duration_sec')
      .eq('user_id', userId)
      .gte('started_at', loadFrom.toISOString())
      .lte('started_at', nowIso),
    supabase
      .from('rt_activities')
      .select('started_at, distance_m')
      .eq('user_id', userId)
      .in('activity_type', LONG_RUN_TYPES)
      .gte('started_at', longRunFrom.toISOString())
      .lte('started_at', nowIso),
  ])

  if (vo2maxRes.error) throw vo2maxRes.error
  if (loadRes.error) throw loadRes.error
  if (longRunRes.error) throw longRunRes.error

  const vo2maxActivities = (vo2maxRes.data ?? []).filter((a) => Number(a.estimated_vo2max) > 0)
  const loadActivities = loadRes.data ?? []
  const longRunActivities = longRunRes.data ?? []

  const dayOfWeek = now.getDay()
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const latestSunday = new Date(now)
  latestSunday.setDate(now.getDate() + daysToSunday)
  latestSunday.setHours(23, 59, 59, 999)

  const weekly = []
  for (let i = 0; i < WEEKS; i++) {
    const weekEnd = new Date(latestSunday)
    weekEnd.setDate(latestSunday.getDate() - i * 7)
    const weekEndIso = weekEnd.toISOString()

    const qualifying = vo2maxActivities.filter((a) => a.started_at <= weekEndIso).slice(0, LOOKBACK)
    if (qualifying.length < MIN_VO2MAX_SAMPLE) continue

    const avgVo2max =
      qualifying.reduce((sum, a) => sum + Number(a.estimated_vo2max), 0) / qualifying.length

    const loadCutoff = new Date(weekEnd)
    loadCutoff.setDate(weekEnd.getDate() - LOAD_DAYS)
    const loadCutoffIso = loadCutoff.toISOString()
    const chronicLoad =
      loadActivities
        .filter((a) => a.started_at <= weekEndIso && a.started_at >= loadCutoffIso)
        .reduce((sum, a) => {
          const load =
            a.relative_effort != null ? a.relative_effort : (Number(a.duration_sec) || 0) / 60
          return sum + load
        }, 0) / LOAD_DAYS

    const longRunCutoff = new Date(weekEnd)
    longRunCutoff.setDate(weekEnd.getDate() - LONG_RUN_DAYS)
    const longRunCutoffIso = longRunCutoff.toISOString()
    const bestLongRunKm =
      longRunActivities
        .filter((a) => a.started_at <= weekEndIso && a.started_at >= longRunCutoffIso)
        .reduce((max, a) => Math.max(max, Number(a.distance_m) || 0), 0) / 1000

    const endurance_score = computeEnduranceScore({ vo2max: avgVo2max, chronicLoad, bestLongRunKm })

    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)

    weekly.push({
      week: weekStart.toISOString().slice(0, 10),
      endurance_score,
      avg_vo2max: parseFloat(avgVo2max.toFixed(2)),
      chronic_load: parseFloat(chronicLoad.toFixed(1)),
      best_long_run_km: parseFloat(bestLongRunKm.toFixed(2)),
    })
  }

  weekly.reverse()
  return { weekly }
}
