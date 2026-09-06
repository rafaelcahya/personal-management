import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'
import { savePushSubscription } from '@/lib/services/running/notifications/pushSubscriptionService'
import { createNotification } from '@/lib/services/notification'
import { getGearMileageAlerts } from '@/lib/services/running/notifications/getGearMileageAlerts'

const GEAR_URL = '/main/running/dashboard'

export const gearMileageNotification = inngest.createFunction(
  { id: 'gear-mileage-notification', retries: 2, triggers: [{ cron: '0 9 * * *' }] },
  async ({ event, step }) => {
    const userId = await step.run('get-user', async () => {
      const { userId: uid } = event.data ?? {}
      const supabase = createAdminClient()
      let query = supabase.from('rt_users').select('id').order('id')
      if (uid) query = query.eq('id', uid)
      const { data } = await query.limit(1).maybeSingle()
      return data?.id ?? null
    })

    if (!userId) return { skipped: true, reason: 'no_user' }

    const alerts = await step.run('get-gear-alerts', async () => {
      const supabase = createAdminClient()
      return getGearMileageAlerts(supabase, userId)
    })

    if (alerts.length === 0) return { skipped: true, reason: 'no_gear_over_threshold' }

    const settings = await step.run('check-push-settings', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_user_settings')
        .select('push_notifications_enabled, push_subscription')
        .eq('user_id', userId)
        .maybeSingle()
      return data
    })

    const pushEnabled = !!(settings?.push_notifications_enabled && settings?.push_subscription)

    const results = []

    for (const gear of alerts) {
      const km = Math.round(gear.distance_m / 1000)
      const title = `Time to check your ${gear.name}`
      const message = `Your ${gear.name} have logged ${km} km — around their usual replacement range. Consider inspecting or retiring them.`
      const shortId = String(gear.id).slice(0, 8)

      await step.run(`save-notification-${shortId}`, async () => {
        const supabase = createAdminClient()
        await createNotification(supabase, {
          userId,
          type: 'gear_mileage',
          title,
          message,
          data: { gear_id: gear.id, distance_m: gear.distance_m, url: GEAR_URL },
        })
      })

      if (pushEnabled) {
        const pushResult = await step.run(`send-push-${shortId}`, async () => {
          return sendPushNotification(settings.push_subscription, {
            title,
            body: message,
            url: GEAR_URL,
          })
        })

        if (pushResult.expired) {
          await step.run('clear-expired-subscription', async () => {
            const supabase = createAdminClient()
            await savePushSubscription(supabase, userId, null)
          })
          break
        }
      }

      // Mark last so a failure earlier retries the whole gear instead of silently skipping it.
      await step.run(`mark-notified-${shortId}`, async () => {
        const supabase = createAdminClient()
        await supabase
          .from('rt_gear')
          .update({ mileage_notified_at: new Date().toISOString() })
          .eq('id', gear.id)
          .eq('user_id', userId)
      })

      results.push({ gearId: gear.id, km })
    }

    return { success: true, results }
  }
)
