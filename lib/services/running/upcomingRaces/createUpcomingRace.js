/**
 * Creates a new upcoming race for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createUpcomingRace(supabase, userId, payload) {
  const { title, race_date, distance_m, location = null, notes = null } = payload

  const { data, error } = await supabase
    .from('rt_upcoming_races')
    .insert({
      user_id: userId,
      title,
      race_date,
      distance_m,
      location,
      notes,
    })
    .select(
      'id, title, race_date, distance_m, location, notes, linked_activity_id, finish_position, created_at'
    )
    .single()

  if (error) throw new Error(error.message)
  return data
}
