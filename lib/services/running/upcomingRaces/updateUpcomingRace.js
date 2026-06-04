/**
 * Updates an upcoming race. Ownership is enforced via user_id filter.
 * If linked_activity_id is being set (non-null), copies distance_m and race_date
 * from the linked activity (scoped to the same user).
 * Returns null if the race is not found or does not belong to the user.
 * Returns { error: 'activity_not_found' } if the linked activity does not exist.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} raceId
 * @param {object} payload
 * @returns {Promise<object|null|{ error: string }>}
 */
export async function updateUpcomingRace(supabase, userId, raceId, payload) {
  const { data: existing, error: fetchError } = await supabase
    .from('rt_upcoming_races')
    .select('id')
    .eq('id', raceId)
    .eq('user_id', userId)
    .single()

  if (fetchError || !existing) return null

  const updatePayload = { ...payload }

  if (payload.linked_activity_id != null) {
    const { data: activity, error: activityError } = await supabase
      .from('rt_activities')
      .select('started_at, distance_m')
      .eq('id', payload.linked_activity_id)
      .eq('user_id', userId)
      .single()

    if (activityError || !activity) {
      return { error: 'activity_not_found' }
    }

    updatePayload.race_date = activity.started_at.slice(0, 10)
    updatePayload.distance_m = activity.distance_m
  }

  const { data, error } = await supabase
    .from('rt_upcoming_races')
    .update(updatePayload)
    .eq('id', raceId)
    .eq('user_id', userId)
    .select(
      'id, title, race_date, distance_m, location, notes, target_time_sec, linked_activity_id, finish_position, created_at'
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null
  return data
}
