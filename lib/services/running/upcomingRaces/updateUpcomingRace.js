/**
 * Updates an upcoming race. Ownership is enforced via user_id filter.
 * If linked_activity_id is being set (non-null), validates that the activity
 * exists and belongs to the same user, but does NOT overwrite race_date —
 * race_date always represents the user's planned race date, not the activity date.
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

  // Only allow known-safe columns — prevents mass-assignment if the service
  // is ever called without upstream Zod validation.
  const ALLOWED_COLUMNS = [
    'title',
    'race_date',
    'distance_m',
    'location',
    'notes',
    'target_time_sec',
    'linked_activity_id',
    'finish_position',
  ]
  const updatePayload = Object.fromEntries(
    Object.entries(payload).filter(([k]) => ALLOWED_COLUMNS.includes(k))
  )

  if (payload.linked_activity_id != null) {
    const { data: activity, error: activityError } = await supabase
      .from('rt_activities')
      .select('id')
      .eq('id', payload.linked_activity_id)
      .eq('user_id', userId)
      .single()

    if (activityError || !activity) {
      return { error: 'activity_not_found' }
    }
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
