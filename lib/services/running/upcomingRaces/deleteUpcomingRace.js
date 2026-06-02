/**
 * Deletes an upcoming race. Ownership is enforced via user_id filter.
 * Returns true if deleted, false if not found or not owned by user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} raceId
 * @returns {Promise<boolean>}
 */
export async function deleteUpcomingRace(supabase, userId, raceId) {
  const { data, error } = await supabase
    .from('rt_upcoming_races')
    .delete()
    .eq('id', raceId)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (error || !data) return false
  return true
}
