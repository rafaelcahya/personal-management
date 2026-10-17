import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { notify } from '@/lib/services/notifications/notify'

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

      const notified = await step.run(`notify-${shortId}-${key}d`, async () => {
        const supabase = createAdminClient()
        return notify(supabase, {
          userId,
          type: 'race_reminder',
          title: msg.title(race.title),
          message: msg.body,
          data: { race_id: raceId, days_until: daysUntil, url: '/main/running/race-log' },
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

      results.push({ raceId, days: daysUntil, pushed: notified.push?.sent ?? 0 })
    }

    return { success: true, results }
  }
)
