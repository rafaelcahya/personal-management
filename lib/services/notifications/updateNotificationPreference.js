/**
 * Turns push on or off for one notification type.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 * @param {{ type: string, push_enabled: boolean }} payload
 */
export async function updateNotificationPreference(supabase, userId, { type, push_enabled }) {
  const { data, error } = await supabase
    .from('app_notification_preferences')
    .upsert(
      { user_id: userId, type, push_enabled, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,type' }
    )
    .select('type, push_enabled')
    .single()
  if (error) throw new Error(error.message)
  return data
}
