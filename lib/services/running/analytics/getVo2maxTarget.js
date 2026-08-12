/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {{ vo2max_target: number | null }}
 */
export async function getVo2maxTarget(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_users')
    .select('vo2max_target')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error

  return { vo2max_target: data?.vo2max_target ?? null }
}
