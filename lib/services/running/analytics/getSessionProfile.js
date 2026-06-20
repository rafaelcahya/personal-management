const RUN_TYPES = ['Run', 'TrailRun', 'VirtualRun']

// WIB = UTC+7; boundaries in local hour
const PAGI_START_HOUR = 5
const PAGI_END_HOUR = 11 // inclusive (05:00–11:59)
const SORE_START_HOUR = 12
const SORE_END_HOUR = 20 // inclusive (12:00–20:59)

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

// Minimum relative_effort count for threshold to be meaningful
const RE_THRESHOLD_MIN_COUNT = 20

function classifySession(startedAt) {
  const utcMs = new Date(startedAt).getTime()
  const wibDate = new Date(utcMs + WIB_OFFSET_MS)
  const hour = wibDate.getUTCHours()

  if (hour >= PAGI_START_HOUR && hour <= PAGI_END_HOUR) return 'pagi'
  if (hour >= SORE_START_HOUR && hour <= SORE_END_HOUR) return 'sore'
  return null
}

function buildStats(rows) {
  if (!rows.length) {
    return {
      count: 0,
      avg_distance_km: null,
      avg_duration_min: null,
      avg_pace_sec: null,
      avg_elevation_m: null,
      avg_relative_effort: null,
      avg_hr: null,
      relative_effort_count: 0,
      hr_count: 0,
    }
  }

  const count = rows.length
  const sumDistance = rows.reduce((s, r) => s + (r.distance_m ?? 0), 0)
  const sumDuration = rows.reduce((s, r) => s + (r.moving_time_sec ?? 0), 0)
  const sumPace = rows.reduce((s, r) => s + (r.avg_pace_sec_per_km ?? 0), 0)
  const sumElevation = rows.reduce((s, r) => s + (r.elevation_gain_m ?? 0), 0)

  const reRows = rows.filter((r) => r.relative_effort != null)
  const hrRows = rows.filter((r) => r.avg_hr != null)

  const sumRe = reRows.reduce((s, r) => s + r.relative_effort, 0)
  const sumHr = hrRows.reduce((s, r) => s + r.avg_hr, 0)

  return {
    count,
    avg_distance_km: Math.round((sumDistance / count / 1000) * 10) / 10,
    avg_duration_min: Math.round((sumDuration / count / 60) * 10) / 10,
    avg_pace_sec: Math.round(sumPace / count),
    avg_elevation_m: Math.round((sumElevation / count) * 10) / 10,
    avg_relative_effort: reRows.length > 0 ? Math.round((sumRe / reRows.length) * 10) / 10 : null,
    avg_hr: hrRows.length > 0 ? Math.round((sumHr / hrRows.length) * 10) / 10 : null,
    relative_effort_count: reRows.length,
    hr_count: hrRows.length,
  }
}

export async function getSessionProfile(supabase, userId) {
  const { data: rows, error } = await supabase
    .from('rt_activities')
    .select(
      'started_at, distance_m, moving_time_sec, avg_pace_sec_per_km, elevation_gain_m, relative_effort, avg_hr'
    )
    .eq('user_id', userId)
    .in('activity_type', RUN_TYPES)
    .order('started_at', { ascending: false })

  if (error) {
    throw new Error(`[getSessionProfile] DB query failed: ${error.message}`)
  }

  const pagiRows = []
  const soreRows = []

  for (const row of rows ?? []) {
    const session = classifySession(row.started_at)
    if (session === 'pagi') pagiRows.push(row)
    else if (session === 'sore') soreRows.push(row)
  }

  const pagi = buildStats(pagiRows)
  const sore = buildStats(soreRows)
  const totalRuns = pagiRows.length + soreRows.length

  const thresholdValue = RE_THRESHOLD_MIN_COUNT
  return {
    pagi,
    sore,
    threshold: {
      value: thresholdValue,
      pagi_re_count: pagi.relative_effort_count,
      sore_re_count: sore.relative_effort_count,
      pagi_met: pagi.relative_effort_count >= thresholdValue,
      sore_met: sore.relative_effort_count >= thresholdValue,
    },
    total_runs: totalRuns,
  }
}
