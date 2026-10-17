import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/services/notifications/sendPushNotification'

/**
 * Sends a test push to ONE of the caller's own devices, found by the endpoint their browser
 * reports. A device that isn't registered under the caller can't be targeted.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 * @param {string} endpoint - the calling browser's current PushSubscription endpoint
 * @returns {Promise<{ outcome: 'not_found' } | { outcome: 'attempted', result: object }>}
 */
export async function sendTestPush(supabase, userId, endpoint) {
  const { data: device, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!device) return { outcome: 'not_found' }

  const result = await sendPushNotification(
    { endpoint: device.endpoint, keys: { p256dh: device.p256dh, auth: device.auth } },
    {
      title: 'Test notification',
      body: 'Push notifications are working on this device.',
      url: '/main/settings',
    },
    { userId, source: 'test' }
  )

  const admin = createAdminClient()
  if (result.expired) {
    await admin.from('push_subscriptions').delete().eq('id', device.id).eq('user_id', userId)
  } else if (result.sent) {
    await admin
      .from('push_subscriptions')
      .update({ last_success_at: new Date().toISOString() })
      .eq('id', device.id)
      .eq('user_id', userId)
  }
  return { outcome: 'attempted', result }
}
