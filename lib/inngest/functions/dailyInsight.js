import { inngest } from '@/lib/inngest/client'

export const dailyInsight = inngest.createFunction(
  { id: 'daily-insight', retries: 2, triggers: [{ cron: '0 6 * * *' }] }, // setiap hari 06:00
  async ({ step }) => {
    const shouldGenerate = await step.run('check-preconditions', async () => {
      // TODO: cek apakah sudah ada daily insight hari ini → return false kalau sudah
      // TODO: cek apakah user punya >= 3 aktivitas → return false kalau belum
      return true
    })
    if (!shouldGenerate) return { skipped: true }

    const _focus = await step.run('determine-focus', async () => {
      // TODO: logic penentuan fokus:
      // - ada race dalam 14 hari? → 'taper'
      // - ACWR > 1.3? → 'recovery'
      // - gap > 5 hari tanpa lari? → 'motivational'
      // - default → 'general'
      return 'general'
    })

    await step.run('build-context', async () => {
      // TODO: fetch recent activities + metrics + profile + goals
    })

    await step.run('call-claude', async () => {
      // TODO: call Claude dengan daily insight prompt sesuai focus
    })

    await step.run('save-insight', async () => {
      // TODO: insert ke rt_ai_insights (insight_type: 'daily')
      // Daily insight tidak kirim push notification
    })
  }
)
