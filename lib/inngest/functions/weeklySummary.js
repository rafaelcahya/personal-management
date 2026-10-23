import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { notify } from '@/lib/services/notifications/notify'
import { listUserIds } from '@/lib/services/notifications/listUserIds'
import { getWeeklySummary } from '@/lib/services/home/getWeeklySummary'
import { WIB_TIMEZONE, daysAgoIso } from '@/lib/utils/wib'

// A run on Monday morning must not repeat if Inngest retries or replays the schedule.
const ALREADY_SENT_WINDOW_DAYS = 6

export const weeklySummary = inngest.createFunction(
  {
    id: 'weekly-summary',
    retries: 2,
    triggers: [{ cron: `TZ=${WIB_TIMEZONE} 0 8 * * 1` }], // Mondays 08:00 WIB
  },
  async ({ step }) => {
    const userIds = await step.run('list-users', async () => listUserIds(createAdminClient()))

    const results = []
    for (const userId of userIds) {
      const result = await step.run(`summary-${userId}`, async () => {
        const admin = createAdminClient()

        const { data: recent, error } = await admin
          .from('app_notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('type', 'weekly_summary')
          .gte('created_at', daysAgoIso(ALREADY_SENT_WINDOW_DAYS))
          .limit(1)
          .maybeSingle()
        if (error) throw new Error(error.message)
        if (recent) return { skipped: 'already_sent' }

        const summary = await getWeeklySummary(admin, userId)
        if (!summary) return { skipped: 'nothing_to_report' }

        await notify(admin, {
          userId,
          type: 'weekly_summary',
          title: 'Your week at a glance',
          message: summary.message,
          pushBody: summary.pushMessage,
          data: { url: '/main/landing', modules: summary.lines.length },
        })
        return { sent: true }
      })
      results.push(result)
    }

    return { users: userIds.length, sent: results.filter((r) => r.sent).length }
  }
)
