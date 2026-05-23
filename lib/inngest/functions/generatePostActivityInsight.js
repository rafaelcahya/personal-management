import { inngest } from '@/lib/inngest/client'

export const generatePostActivityInsight = inngest.createFunction(
  { id: 'generate-post-activity-insight', retries: 2 },
  { event: 'ai/generate-post-activity-insight' },
  async ({ event, step }) => {
    const { activityId, userId } = event.data

    const isDuplicate = await step.run('check-duplicate', async () => {
      // TODO: cek apakah sudah ada insight untuk activityId ini
      return false
    })
    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    const _context = await step.run('build-context', async () => {
      // TODO: parallel fetch activity, splits, baseline, training load, health log, goals, profile
      // TODO: serialize ke plain text format
      return null
    })

    const _output = await step.run('call-claude', async () => {
      // TODO: call Claude API dengan context
      // TODO: timeout 30 detik
      return null
    })

    const _isValid = await step.run('validate-output', async () => {
      // TODO: cek panjang minimum + section headers (## Ringkasan, ## Highlight, ## Rekomendasi)
      return true
    })

    await step.run('save-insight', async () => {
      // TODO: insert ke rt_ai_insights
      // { insight_type: 'post_activity', status: 'completed', is_valid, data_refs: { activity_id } }
    })

    await step.run('send-notification', async () => {
      // TODO: kirim push notification kalau notify_post_activity = true
    })

    await step.sendEvent('trigger-anomaly-check', {
      name: 'ai/check-anomaly',
      data: { activityId, userId },
    })
  }
)
