import { getDateRange } from './analyticsRangeUtils'

const ACTIVITY_LIMIT = 100
// Max stream rows per batch × ceil(ACTIVITY_LIMIT / BATCH_SIZE) = 50 000 × 5 = 250 000 rows max
const STREAM_BATCH_SIZE = 20
const STREAM_ROWS_PER_BATCH = 50000

const HR_ZONE_LABELS = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO₂max']

const HR_ZONE_PERCENTS_MAXHR = [
  [0, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.0],
]

// Karvonen uses % of Heart Rate Reserve, with a 50% floor for Z1
const HR_ZONE_PERCENTS_KARVONEN = [
  [0.5, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.0],
]

// Friel model anchored to lactate threshold HR
const HR_ZONE_PERCENTS_THRESHOLD = [
  [0, 0.81],
  [0.81, 0.89],
  [0.89, 0.94],
  [0.94, 1.06],
  [1.06, Infinity],
]

// Boundaries reused from StreamCharts.jsx
const CADENCE_BAND_DEFS = [
  { label: 'Beginner', min: 140, max: 165 },
  { label: 'Recreational', min: 165, max: 175 },
  { label: 'Semi-athlete', min: 175, max: 185 },
  { label: 'Elite', min: 185, max: 220 },
]
const CADENCE_MIN = CADENCE_BAND_DEFS[0].min

function computeHrBoundaries(method, maxHr, restingHr, thresholdHr) {
  if (method === 'karvonen') {
    if (!maxHr || !restingHr) return null
    const hrr = maxHr - restingHr
    return HR_ZONE_PERCENTS_KARVONEN.map(([lo, hi]) => ({
      min: Math.round(restingHr + lo * hrr),
      max: Math.round(restingHr + hi * hrr),
    }))
  }
  if (method === 'threshold') {
    if (!thresholdHr) return null
    return HR_ZONE_PERCENTS_THRESHOLD.map(([lo, hi]) => ({
      min: Math.round(lo * thresholdHr),
      max: hi === Infinity ? 9999 : Math.round(hi * thresholdHr),
    }))
  }
  // max_hr (default)
  if (!maxHr) return null
  return HR_ZONE_PERCENTS_MAXHR.map(([lo, hi]) => ({
    min: Math.round(lo * maxHr),
    max: Math.round(hi * maxHr),
  }))
}

// Pace: lower sec/km = faster. Zones ordered slow→fast (Z1→Z5).
// A row belongs to zone i when pace_sec_per_km ∈ [zone.min, zone.max).
// Zone boundaries from Jack Daniels %threshold model.
function computePaceBoundaries(thresholdPaceSec) {
  if (!thresholdPaceSec) return null
  return [
    { label: 'Z1 Easy', min: Math.round(thresholdPaceSec * 1.29), max: 9999 },
    {
      label: 'Z2 Aerobic',
      min: Math.round(thresholdPaceSec * 1.14),
      max: Math.round(thresholdPaceSec * 1.29),
    },
    {
      label: 'Z3 Tempo',
      min: Math.round(thresholdPaceSec * 1.06),
      max: Math.round(thresholdPaceSec * 1.14),
    },
    {
      label: 'Z4 Threshold',
      min: Math.round(thresholdPaceSec * 0.97),
      max: Math.round(thresholdPaceSec * 1.06),
    },
    { label: 'Z5 VO₂max', min: 0, max: Math.round(thresholdPaceSec * 0.97) },
  ]
}

// Each row = 1 second; distance ≈ velocity_m_s × 1s.
function aggregateIntoBuckets(rows, buckets, field) {
  const totals = buckets.map((b) => ({ ...b, time_sec: 0, distance_m: 0 }))

  for (const row of rows) {
    const val = row[field]
    if (val == null || val <= 0) continue
    for (const bucket of totals) {
      if (val >= bucket.min && val < bucket.max) {
        bucket.time_sec += 1
        bucket.distance_m += row.velocity_m_s ?? 0
        break
      }
    }
  }

  const totalTime = totals.reduce((s, b) => s + b.time_sec, 0)
  const totalDist = totals.reduce((s, b) => s + b.distance_m, 0)

  return totals.map((b) => ({
    label: b.label,
    min: b.min,
    max: b.max,
    time_sec: b.time_sec,
    distance_m: Math.round(b.distance_m),
    pct_time: totalTime > 0 ? Math.round((b.time_sec / totalTime) * 100) : 0,
    pct_dist: totalDist > 0 ? Math.round((b.distance_m / totalDist) * 100) : 0,
  }))
}

export async function getZoneAnalytics(supabase, userId, range, activityType, startDate, endDate) {
  const { fromDate, toDate } = getDateRange(range, startDate, endDate)

  // 1. User profile for HR zone config
  const [profileResult, settingsResult] = await Promise.all([
    supabase
      .from('rt_users')
      .select('max_hr, resting_hr_baseline, threshold_hr, threshold_pace_sec')
      .eq('id', userId)
      .maybeSingle(),
    supabase.from('rt_user_settings').select('hr_zones_method').eq('user_id', userId).maybeSingle(),
  ])

  if (profileResult.error)
    console.warn('[getZoneAnalytics] rt_users query failed:', profileResult.error.message)
  if (settingsResult.error)
    console.warn('[getZoneAnalytics] rt_user_settings query failed:', settingsResult.error.message)

  const maxHr = profileResult.data?.max_hr ?? null
  const restingHr = profileResult.data?.resting_hr_baseline ?? null
  const thresholdHr = profileResult.data?.threshold_hr ?? null
  const thresholdPaceSec = profileResult.data?.threshold_pace_sec ?? null
  const hrMethod = settingsResult.data?.hr_zones_method ?? 'max_hr'

  // 2. Matching activity IDs (capped at ACTIVITY_LIMIT for performance)
  let activityQuery = supabase
    .from('rt_activities')
    .select('id')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(ACTIVITY_LIMIT)

  if (fromDate) activityQuery = activityQuery.gte('started_at', fromDate)
  if (toDate) activityQuery = activityQuery.lte('started_at', toDate)
  if (activityType && activityType !== 'All') {
    activityQuery = activityQuery.eq('activity_type', activityType)
  }

  const { data: activityRows } = await activityQuery
  const activityIds = activityRows?.map((r) => r.id) ?? []

  if (!activityIds.length) {
    return buildEmptyResult(hrMethod, thresholdPaceSec)
  }

  // 3. Batch-fetch stream rows (STREAM_BATCH_SIZE activities per batch)
  const allStreams = []
  for (let i = 0; i < activityIds.length; i += STREAM_BATCH_SIZE) {
    const batchIds = activityIds.slice(i, i + STREAM_BATCH_SIZE)
    const { data: rows, error: streamErr } = await supabase
      .from('rt_activity_streams')
      .select('heart_rate, cadence, pace_sec_per_km, velocity_m_s')
      .in('activity_id', batchIds)
      .limit(STREAM_ROWS_PER_BATCH)
    if (streamErr) {
      console.warn('[getZoneAnalytics] stream batch fetch failed:', streamErr.message)
      continue
    }
    if (rows) allStreams.push(...rows)
  }

  // 4. HR zones
  const hrBoundaries = computeHrBoundaries(hrMethod, maxHr, restingHr, thresholdHr)
  const hrRows = allStreams.filter((r) => r.heart_rate != null && r.heart_rate > 0)

  // 5. Pace zones
  const paceBoundaries = computePaceBoundaries(thresholdPaceSec)
  const paceRows = allStreams.filter((r) => r.pace_sec_per_km != null && r.pace_sec_per_km > 0)

  // 6. Cadence bands (floor derived from CADENCE_BAND_DEFS to stay in sync with that definition)
  const cadenceBuckets = CADENCE_BAND_DEFS.map((b, i) => ({
    ...b,
    max: i === CADENCE_BAND_DEFS.length - 1 ? 9999 : b.max,
  }))
  const cadenceRows = allStreams.filter((r) => r.cadence != null && r.cadence >= CADENCE_MIN)

  return {
    hr: hrBoundaries
      ? {
          method: hrMethod,
          zones: aggregateIntoBuckets(
            hrRows,
            hrBoundaries.map((b, i) => ({ ...b, label: HR_ZONE_LABELS[i] })),
            'heart_rate'
          ),
          has_data: hrRows.length > 0,
          missing_config: false,
        }
      : { method: hrMethod, zones: null, has_data: false, missing_config: true },
    pace: paceBoundaries
      ? {
          threshold_pace_sec: thresholdPaceSec,
          zones: aggregateIntoBuckets(paceRows, paceBoundaries, 'pace_sec_per_km'),
          has_threshold: true,
          has_data: paceRows.length > 0,
        }
      : { threshold_pace_sec: null, zones: null, has_threshold: false, has_data: false },
    cadence: {
      bands: aggregateIntoBuckets(cadenceRows, cadenceBuckets, 'cadence'),
      has_data: cadenceRows.length > 0,
    },
    activity_count: activityIds.length,
  }
}

function buildEmptyResult(hrMethod, thresholdPaceSec) {
  return {
    hr: { method: hrMethod, zones: null, has_data: false, missing_config: false },
    pace: {
      threshold_pace_sec: thresholdPaceSec,
      zones: null,
      has_threshold: !!thresholdPaceSec,
      has_data: false,
    },
    cadence: { bands: null, has_data: false },
    activity_count: 0,
  }
}
