/**
 * Push state for the settings screen: whether push is on, which endpoint is subscribed,
 * and the latest success and failure from push_delivery_log.
 * user_id is the caller's own id — the browser uses it to tell whose opt-in it holds.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 */
export async function getPushStatus(supabase, userId) {
  const [settingsRes, successRes, failureRes] = await Promise.all([
    supabase
      .from('rt_user_settings')
      .select('push_notifications_enabled, push_subscription')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('push_delivery_log')
      .select('source, created_at')
      .eq('user_id', userId)
      .eq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('push_delivery_log')
      .select('source, status, status_code, error, endpoint_hash, created_at')
      .eq('user_id', userId)
      .neq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  for (const res of [settingsRes, successRes, failureRes]) {
    if (res.error) throw new Error(res.error.message)
  }

  const settings = settingsRes.data
  return {
    user_id: userId,
    enabled: !!settings?.push_notifications_enabled,
    endpoint: settings?.push_subscription?.endpoint ?? null,
    last_success: successRes.data ?? null,
    last_failure: failureRes.data ?? null,
  }
}
