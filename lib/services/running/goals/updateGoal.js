/**
 * Updates an upcoming race goal. Ownership is enforced via user_id filter.
 * Returns null if the goal is not found or does not belong to the user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} goalId
 * @param {object} payload — any subset of { title, description, target_date, target_distance_m, target_time_sec }
 * @returns {Promise<object|null>}
 */
export async function updateGoal(supabase, userId, goalId, payload) {
  const { data, error } = await supabase
    .from('rt_goals')
    .update(payload)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select(
      'id, goal_type, title, description, target_date, target_distance_m, target_time_sec, status, notes, created_at'
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null
  return data
}
