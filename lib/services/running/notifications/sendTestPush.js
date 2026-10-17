import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'
import { savePushSubscription } from '@/lib/services/running/notifications/pushSubscriptionService'

/**
 * Sends a test push to the stored subscription, but only when the caller's browser is the
 * subscribed device — otherwise the endpoint could be used to push to some other device.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} endpoint - the calling browser's current PushSubscription endpoint
 * @returns {Promise<{ outcome: 'not_subscribed' | 'other_device' } | { outcome: 'attempted', result: object }>}
 */
export async function sendTestPush(supabase, userId, endpoint) {
  const { data, error } = await supabase
    .from('rt_user_settings')
    .select('push_notifications_enabled, push_subscription')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  const stored = data?.push_subscription
  if (!data?.push_notifications_enabled || !stored?.endpoint) return { outcome: 'not_subscribed' }
  if (stored.endpoint !== endpoint) return { outcome: 'other_device' }

  const result = await sendPushNotification(
    stored,
    {
      title: 'Test notification',
      body: 'Push notifications are working on this device.',
      url: '/main/running/settings',
    },
    { userId, source: 'test' }
  )
  if (result.expired) await savePushSubscription(supabase, userId, null)
  return { outcome: 'attempted', result }
}
