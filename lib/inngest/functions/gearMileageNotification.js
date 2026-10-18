import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { notify } from '@/lib/services/notifications/notify'
import { WIB_TIMEZONE } from '@/lib/utils/wib'
import { getGearMileageAlerts } from '@/lib/services/running/notifications/getGearMileageAlerts'

const GEAR_URL = '/main/running/dashboard'

export const gearMileageNotification = inngest.createFunction(
  {
    id: 'gear-mileage-notification',
    retries: 2,
    triggers: [{ cron: `TZ=${WIB_TIMEZONE} 0 9 * * *` }],
  },
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

    const results = []

    for (const gear of alerts) {
      const km = Math.round(gear.distance_m / 1000)
      const title = `Time to check your ${gear.name}`
      const message = `Your ${gear.name} have logged ${km} km — around their usual replacement range. Consider inspecting or retiring them.`
      const shortId = String(gear.id).slice(0, 8)

      await step.run(`notify-${shortId}`, async () => {
        const supabase = createAdminClient()
        return notify(supabase, {
          userId,
          type: 'gear_mileage',
          title,
          message,
          data: { gear_id: gear.id, distance_m: gear.distance_m, url: GEAR_URL },
        })
      })

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
