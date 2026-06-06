/**
 * Saves or clears a push subscription for a user.
 * Passing null for subscription disables push notifications.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {object|null} subscription - PushSubscription object or null to clear
 * @returns {Promise<{ push_notifications_enabled: boolean }>}
 */
export async function savePushSubscription(supabase, userId, subscription) {
  const enabled = subscription !== null

  const { data, error } = await supabase
    .from('rt_user_settings')
    .upsert(
      {
        user_id: userId,
        push_subscription: subscription,
        push_notifications_enabled: enabled,
      },
      { onConflict: 'user_id' }
    )
    .select('push_notifications_enabled')
    .single()

  if (error) throw new Error(error.message)
  return data
}
