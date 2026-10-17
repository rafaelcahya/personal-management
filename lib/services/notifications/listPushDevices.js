/**
 * The user's subscribed devices, newest first. Keys are never returned.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 */
export async function listPushDevices(supabase, userId) {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, user_agent, created_at, last_seen_at, last_success_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
