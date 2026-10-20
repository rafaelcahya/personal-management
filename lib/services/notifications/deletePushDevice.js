/**
 * Removes one of the user's devices. Returns false when it doesn't exist or isn't theirs.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 * @param {string} deviceId
 */
export async function deletePushDevice(supabase, userId, deviceId) {
  const { data, error } = await supabase
    .from('app_push_subscriptions')
    .delete()
    .eq('id', deviceId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return !!data
}
