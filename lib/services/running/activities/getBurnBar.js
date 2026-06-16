const BURN_BAR_MIN_SIMILAR_ACTIVITIES = 3
const BURN_BAR_MAX_SIMILAR_ACTIVITIES = 20
const BURN_BAR_DISTANCE_TOLERANCE = 0.2
const BURN_BAR_RECENCY_MONTHS = 6

/**
 * Compares each split of `activity` against the user's historical average
 * pace/HR for that same split_number, across similar past activities
 * (same activity_type, distance within ±20%, last 6 months, max 20).
 * Returns null when fewer than 3 similar activities exist.
 */
export async function computeBurnBar(supabase, activity, splits, userId) {
  if (!activity.distance_m || !splits?.length) return null

  const recencyFrom = new Date()
  recencyFrom.setMonth(recencyFrom.getMonth() - BURN_BAR_RECENCY_MONTHS)

  const { data: similarActivities, error: similarError } = await supabase
    .from('rt_activities')
    .select('id')
    .eq('user_id', userId)
    .eq('activity_type', activity.activity_type)
    .gte('distance_m', activity.distance_m * (1 - BURN_BAR_DISTANCE_TOLERANCE))
    .lte('distance_m', activity.distance_m * (1 + BURN_BAR_DISTANCE_TOLERANCE))
    .neq('id', activity.id)
    .gte('started_at', recencyFrom.toISOString())
    .order('started_at', { ascending: false })
    .limit(BURN_BAR_MAX_SIMILAR_ACTIVITIES)

  if (similarError) throw similarError

  if (!similarActivities || similarActivities.length < BURN_BAR_MIN_SIMILAR_ACTIVITIES) return null

  const { data: histSplits, error: histSplitsError } = await supabase
    .from('rt_activity_splits')
    .select('split_number, pace_sec_per_km, avg_hr')
    .in(
      'activity_id',
      similarActivities.map((a) => a.id)
    )

  if (histSplitsError) throw histSplitsError

  const bySplit = new Map()
  for (const row of histSplits ?? []) {
    const entry = bySplit.get(row.split_number) ?? {
      paceSum: 0,
      paceCount: 0,
      hrSum: 0,
      hrCount: 0,
    }
    if (row.pace_sec_per_km != null) {
      entry.paceSum += Number(row.pace_sec_per_km)
      entry.paceCount += 1
    }
    if (row.avg_hr != null) {
      entry.hrSum += Number(row.avg_hr)
      entry.hrCount += 1
    }
    bySplit.set(row.split_number, entry)
  }

  return splits.map((s) => {
    const hist = bySplit.get(s.split_number)
    const historical_avg_pace = hist?.paceCount ? Math.round(hist.paceSum / hist.paceCount) : null
    const historical_avg_hr = hist?.hrCount ? Math.round(hist.hrSum / hist.hrCount) : null
    const pace_diff_sec =
      s.pace_sec_per_km != null && historical_avg_pace != null
        ? Math.round(s.pace_sec_per_km - historical_avg_pace)
        : null
    const hr_diff_bpm =
      s.avg_hr != null && historical_avg_hr != null
        ? Math.round(s.avg_hr - historical_avg_hr)
        : null

    return {
      split_number: s.split_number,
      pace_sec_per_km: s.pace_sec_per_km,
      avg_hr: s.avg_hr,
      historical_avg_pace,
      historical_avg_hr,
      pace_diff_sec,
      hr_diff_bpm,
    }
  })
}
