/**
 * Deletes a race log entry. Ownership is enforced via user_id filter.
 * Returns true if deleted, false if not found or not owned by user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} raceLogId
 * @returns {Promise<boolean>}
 */
export async function deleteRaceLog(supabase, userId, raceLogId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .delete()
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (error || !data) return false
  return true
}
