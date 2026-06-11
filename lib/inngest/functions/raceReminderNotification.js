import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'

const THRESHOLDS = [14, 7, 3, 1]

const MESSAGES = {
  14: {
    title: (name) => `2 weeks to ${name}`,
    body: 'Your race is in 14 days. Time to build your final fitness block.',
  },
  7: {
    title: (name) => `1 week to ${name}`,
    body: 'Race week is here. Pull back the effort, stay sharp, and grab your race pack.',
  },
  3: {
    title: (name) => `3 days to ${name}`,
    body: '72 hours. Your legs are ready — let them rest now. Race pack ready?',
  },
  1: {
    title: (name) => `Race day tomorrow — ${name}!`,
    body: 'Race day tomorrow. Lay out your bib and jersey tonight.',
  },
}

export const raceReminderNotification = inngest.createFunction(
  { id: 'race-reminder-notification', retries: 2, triggers: [{ cron: '0 8 * * *' }] },
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

    const settings = await step.run('check-settings', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_user_settings')
        .select('notify_race_reminder, push_notifications_enabled, push_subscription')
        .eq('user_id', userId)
        .maybeSingle()
      return data
    })

    if (!settings?.notify_race_reminder) return { skipped: true, reason: 'notify_disabled' }
    if (!settings?.push_notifications_enabled || !settings?.push_subscription) {
      return { skipped: true, reason: 'push_disabled' }
    }

    const today = await step.run('get-today', async () => {
      return new Date().toISOString().split('T')[0]
    })

    const races = await step.run('get-upcoming-races', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_upcoming_races')
        .select('id, title, race_date, notifications_sent')
        .eq('user_id', userId)
        .gte('race_date', today)
        .order('race_date', { ascending: true })
      return data ?? []
    })

    if (races.length === 0) return { skipped: true, reason: 'no_upcoming_races' }

    const results = []

    for (const race of races) {
      const raceDate = new Date(race.race_date)
      const todayDate = new Date(today)
      const daysUntil = Math.round((raceDate - todayDate) / (1000 * 60 * 60 * 24))

      if (!THRESHOLDS.includes(daysUntil)) continue

      const key = String(daysUntil)
      const alreadySent = race.notifications_sent?.[key]
      if (alreadySent) continue

      const msg = MESSAGES[daysUntil]
      const raceId = race.id
      const shortId = raceId.slice(0, 8)

      const pushResult = await step.run(`send-push-${shortId}-${key}d`, async () => {
        return sendPushNotification(settings.push_subscription, {
          title: msg.title(race.title),
          body: msg.body,
          url: '/main/running/race-log',
        })
      })

      await step.run(`mark-sent-${shortId}-${key}d`, async () => {
        const supabase = createAdminClient()
        const { data: current } = await supabase
          .from('rt_upcoming_races')
          .select('notifications_sent')
          .eq('id', raceId)
          .eq('user_id', userId)
          .maybeSingle()
        const updatedSent = { ...(current?.notifications_sent ?? {}), [key]: today }
        await supabase
          .from('rt_upcoming_races')
          .update({ notifications_sent: updatedSent })
          .eq('id', raceId)
          .eq('user_id', userId)
      })

      results.push({ raceId, days: daysUntil, notified: pushResult.sent })
    }

    return { success: true, results }
  }
)
