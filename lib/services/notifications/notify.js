import { createNotification } from '@/lib/services/notification'
import { sendPushNotification } from '@/lib/services/notifications/sendPushNotification'

async function pushToDevices(supabase, { userId, type, title, body, url }) {
  const { data: pref, error: prefError } = await supabase
    .from('app_notification_preferences')
    .select('push_enabled')
    .eq('user_id', userId)
    .eq('type', type)
    .maybeSingle()
  // Can't tell what the user chose → don't push (the in-app row is already saved).
  if (prefError) throw new Error(prefError.message)
  // No row means the default: push is on.
  if (pref && pref.push_enabled === false) return { skipped: 'preference_off' }

  const { data: devices, error } = await supabase
    .from('app_push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  if (!devices?.length) return { skipped: 'no_devices' }

  const results = await Promise.all(
    devices.map(async (device) => {
      const subscription = {
        endpoint: device.endpoint,
        keys: { p256dh: device.p256dh, auth: device.auth },
      }
      const result = await sendPushNotification(
        subscription,
        { title, body, url },
        { userId, source: type }
      )
      if (result.expired) {
        await supabase
          .from('app_push_subscriptions')
          .delete()
          .eq('id', device.id)
          .eq('user_id', userId)
      } else if (result.sent) {
        await supabase
          .from('app_push_subscriptions')
          .update({ last_success_at: new Date().toISOString() })
          .eq('id', device.id)
          .eq('user_id', userId)
      }
      return result
    })
  )

  return {
    devices: devices.length,
    sent: results.filter((r) => r.sent).length,
    failed: results.filter((r) => !r.sent).length,
  }
}

/**
 * The one way to notify a user: saves the in-app notification, then pushes it to every device
 * the user subscribed, unless they turned push off for this type.
 * The in-app row is always written; a push problem never throws or undoes it.
 * Needs the admin client (jobs have no user session) — every query below filters by user_id.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - admin client
 * @param {{ userId: string, type: string, title: string, message: string, pushBody?: string, data?: object|null }} payload
 *   `pushBody` replaces `message` in the push only (e.g. to keep amounts off the lock screen)
 * @param {{ defer?: (task: () => Promise<void>) => void }} [options] - inside an HTTP request pass
 *   next/server `after` so a slow push service can't hold the response open
 * @returns {Promise<{ success: true, push: object }>}
 */
export async function notify(
  supabase,
  { userId, type, title, message, pushBody, data = null },
  { defer } = {}
) {
  await createNotification(supabase, { userId, type, title, message, data })

  const send = async () => {
    try {
      return await pushToDevices(supabase, {
        userId,
        type,
        title,
        body: pushBody ?? message,
        url: data?.url,
      })
    } catch (err) {
      console.error('[notify] push failed', err?.message)
      return { error: 'push_failed' }
    }
  }

  if (defer) {
    try {
      defer(async () => {
        await send()
      })
      return { success: true, push: { deferred: true } }
    } catch {
      // Not inside a request scope — send inline instead.
    }
  }
  return { success: true, push: await send() }
}
