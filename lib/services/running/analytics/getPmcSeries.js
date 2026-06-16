import { format } from 'date-fns'

const ACUTE_DAYS = 7
const CHRONIC_DAYS = 28
const MIN_HISTORY_DAYS = 7

function activityLoad(activity) {
  return activity.relative_effort != null
    ? activity.relative_effort
    : (Number(activity.duration_sec) || 0) / 60
}

/**
 * Computes daily Fitness (CTL) / Fatigue (ATL) / Form (TSB) for the last `days` days,
 * using a rolling window over rt_activities — no dependency on rt_daily_training_metrics,
 * which is not currently populated by any job.
 */
export async function getPmcSeries(supabase, userId, days = 90) {
  const now = new Date()
  const lookbackDays = days + CHRONIC_DAYS - 1
  const from = new Date(now)
  from.setDate(from.getDate() - lookbackDays)

  const { data, error } = await supabase
    .from('rt_activities')
    .select('started_at, duration_sec, relative_effort')
    .eq('user_id', userId)
    .gte('started_at', from.toISOString())
    .lte('started_at', now.toISOString())

  if (error) throw error

  const dailyLoad = new Map()
  for (const activity of data ?? []) {
    const key = format(new Date(activity.started_at), 'yyyy-MM-dd')
    dailyLoad.set(key, (dailyLoad.get(key) ?? 0) + activityLoad(activity))
  }

  const allDays = []
  const cursor = new Date(from)
  while (cursor <= now) {
    allDays.push(format(cursor, 'yyyy-MM-dd'))
    cursor.setDate(cursor.getDate() + 1)
  }

  const loadByIndex = allDays.map((key) => dailyLoad.get(key) ?? 0)

  const series = []
  for (let i = CHRONIC_DAYS - 1; i < allDays.length; i++) {
    const chronicSlice = loadByIndex.slice(i - CHRONIC_DAYS + 1, i + 1)
    const acuteSlice = loadByIndex.slice(i - ACUTE_DAYS + 1, i + 1)
    const chronic_load_28d =
      Math.round((chronicSlice.reduce((s, v) => s + v, 0) / CHRONIC_DAYS) * 10) / 10
    const acute_load_7d = Math.round((acuteSlice.reduce((s, v) => s + v, 0) / ACUTE_DAYS) * 10) / 10
    const tsb = Math.round((chronic_load_28d - acute_load_7d) * 10) / 10
    series.push({ date: allDays[i], chronic_load_28d, acute_load_7d, tsb })
  }

  return {
    series: series.slice(-days),
    meets_min_history: dailyLoad.size >= MIN_HISTORY_DAYS,
  }
}
