/**
 * Returns all upcoming races for a user ordered by race_date ASC.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUpcomingRaces(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_upcoming_races')
    .select(
      'id, title, race_date, distance_m, location, notes, linked_activity_id, finish_position, created_at'
    )
    .eq('user_id', userId)
    .order('race_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
