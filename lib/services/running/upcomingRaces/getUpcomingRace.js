/**
 * Returns a single upcoming race by id scoped to the user.
 * Returns null if not found or not owned by the user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getUpcomingRace(supabase, userId, id) {
  const { data, error } = await supabase
    .from('rt_upcoming_races')
    .select(
      'id, title, race_date, distance_m, location, notes, target_time_sec, linked_activity_id, finish_position, created_at'
    )
    .eq('user_id', userId)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }
  return data
}
