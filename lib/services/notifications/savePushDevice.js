const USER_AGENT_MAX = 300

/**
 * Registers or refreshes one device. An endpoint is one physical browser, so if it was
 * registered under another account (shared browser) it moves to the signed-in user — that
 * reassignment is why this needs the admin client. It only moves when the caller sends the
 * same keys the browser registered with; knowing the endpoint URL alone isn't enough.
 * Returns { conflict: true } and leaves the row alone when the keys don't match.
 * @param {import('@supabase/supabase-js').SupabaseClient} admin - admin client
 * @param {string} userId - the signed-in user
 * @param {{ endpoint: string, keys: { p256dh: string, auth: string } }} subscription
 * @param {string|null} userAgent
 */
export async function savePushDevice(admin, userId, subscription, userAgent) {
  const { data: existing, error: lookupError } = await admin
    .from('push_subscriptions')
    .select('user_id, p256dh, auth')
    .eq('endpoint', subscription.endpoint)
    .maybeSingle()
  if (lookupError) throw new Error(lookupError.message)

  if (
    existing &&
    existing.user_id !== userId &&
    (existing.p256dh !== subscription.keys.p256dh || existing.auth !== subscription.keys.auth)
  ) {
    return { conflict: true }
  }

  const { data, error } = await admin
    .from('push_subscriptions')
    .upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_agent: userAgent ? userAgent.slice(0, USER_AGENT_MAX) : null,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    )
    .select('id, endpoint, user_agent, created_at, last_seen_at, last_success_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}
