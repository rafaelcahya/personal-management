import { inngest } from '@/lib/inngest/client'

export const weeklyReview = inngest.createFunction(
  { id: 'weekly-review', retries: 2, triggers: [{ cron: '0 19 * * 0' }] }, // setiap Minggu 19:00
  async ({ step }) => {
    // TODO: get all users dengan notify_weekly_review = true
    // Untuk single user app, langsung ambil user dari rt_users

    const _weekRange = await step.run('determine-week-range', async () => {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay() + 1) // Senin
      weekStart.setHours(0, 0, 0, 0)
      return { weekStart: weekStart.toISOString(), weekEnd: now.toISOString() }
    })

    const isDuplicate = await step.run('check-duplicate', async () => {
      // TODO: cek apakah sudah ada weekly review untuk weekStart ini
      return false
    })
    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    await step.run('build-context', async () => {
      // TODO: fetch activities minggu ini + metrics + health log + prev 4 weeks + goals + profile
    })

    await step.run('call-claude', async () => {
      // TODO: call Claude API dengan weekly review prompt
    })

    await step.run('save-insight', async () => {
      // TODO: insert ke rt_ai_insights (insight_type: 'weekly_review')
    })

    await step.run('send-notification', async () => {
      // TODO: kirim push notification kalau notify_weekly_review = true
    })
  }
)
