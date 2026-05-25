/**
 * Returns all gear rows for a user ordered by retired status then name.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getGear(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_gear')
    .select(
      'id, name, brand_name, model_name, distance_m, retired, category, retirement_km, notification_distance_m, last_fetched_at'
    )
    .eq('user_id', userId)
    .order('retired', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
