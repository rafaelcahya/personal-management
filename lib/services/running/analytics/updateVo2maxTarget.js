/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {number | null} vo2maxTarget - null clears the target
 * @returns {{ vo2max_target: number | null }}
 */
export async function updateVo2maxTarget(supabase, userId, vo2maxTarget) {
  const { data, error } = await supabase
    .from('rt_users')
    .update({ vo2max_target: vo2maxTarget })
    .eq('id', userId)
    .select('vo2max_target')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('User profile not found. Please complete onboarding first.')

  return { vo2max_target: data.vo2max_target }
}
