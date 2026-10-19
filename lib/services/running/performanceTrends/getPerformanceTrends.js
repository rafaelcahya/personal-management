/**
 * Most recent paced activities, returned oldest to newest for left-to-right charts.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ limit?: number, activityType?: string|null }} [options]
 * @returns {Promise<Array<object>>}
 */
export async function getPerformanceTrends(
  supabase,
  userId,
  { limit = 25, activityType = null } = {}
) {
  let q = supabase
    .from('rt_activities')
    .select(
      'id, started_at, activity_type, distance_m, avg_pace_sec_per_km, avg_hr, max_hr, relative_effort, avg_watts, weighted_avg_watts, device_watts'
    )
    .eq('user_id', userId)
    .not('avg_pace_sec_per_km', 'is', null)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (activityType) q = q.eq('activity_type', activityType)

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).reverse()
}
