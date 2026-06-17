import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildInsightContext } from '@/lib/services/running/ai/buildInsightContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildFocusedPrompt } from '@/lib/services/running/ai/prompts'
import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'
import { savePushSubscription } from '@/lib/services/running/notifications/pushSubscriptionService'

const FOCUS_TITLES = {
  performance: 'Performance & Pace Analysis',
  recovery: 'Recovery & Load Analysis',
  next_race: 'Race Tips',
  next_training: 'Next Training Recommendation',
  detail_training: 'Detailed Training Plan',
  zone_analysis: 'HR Zone Analysis',
  compare_baseline: 'Baseline Comparison',
}

export const generatePostActivityInsight = inngest.createFunction(
  {
    id: 'generate-post-activity-insight',
    retries: 2,
    triggers: [{ event: 'ai/generate-post-activity-insight' }],
  },
  async ({ event, step }) => {
    const { activityId, userId, focus = 'general', perceivedEffort, userNote } = event.data

    const isDuplicate = await step.run('check-duplicate', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_ai_insights')
        .select('id, status, is_valid')
        .eq('user_id', userId)
        .eq('insight_type', 'post_activity')
        .contains('data_refs', { activity_id: activityId, focus })
        .maybeSingle()
      // Skip only if a valid completed insight exists or one is currently pending
      return !!data && (data.is_valid === true || data.status === 'pending')
    })

    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    const { context, profile } = await step.run('build-context', async () => {
      return buildInsightContext(activityId, userId, {
        perceivedEffort,
        userNote,
      })
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildFocusedPrompt(profile, focus)
      return generateInsight({
        systemPrompt,
        userContent: context,
        insightType: 'post_activity',
        maxTokens: 1500,
      })
    })

    await step.run('save-insight', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase.from('rt_ai_insights').insert({
        user_id: userId,
        insight_type: 'post_activity',
        status: 'completed',
        is_valid: isValid,
        title: FOCUS_TITLES[focus] ?? 'Activity Analysis',
        content: output || null,
        data_refs: { activity_id: activityId, focus },
        retry_count: 0,
      })
      if (error) throw new Error(`Save insight failed: ${error.message}`)
    })

    const notifyResult = await step.run('send-notification', async () => {
      const supabase = createAdminClient()
      const { data: settings } = await supabase
        .from('rt_user_settings')
        .select('notify_post_activity, push_subscription, push_notifications_enabled')
        .eq('user_id', userId)
        .maybeSingle()

      if (
        !settings?.notify_post_activity ||
        !settings?.push_notifications_enabled ||
        !settings?.push_subscription
      ) {
        return { notified: false }
      }

      const result = await sendPushNotification(settings.push_subscription, {
        title: 'Activity Insight Ready',
        body: 'Your post-activity AI analysis is ready. Tap to read.',
        url: `/main/running/activities/${activityId}`,
      })
      return { notified: result.sent, ...result }
    })

    if (notifyResult.expired) {
      await step.run('clear-expired-subscription', async () => {
        const supabase = createAdminClient()
        await savePushSubscription(supabase, userId, null)
      })
    }

    await step.sendEvent('trigger-anomaly-check', {
      name: 'ai/check-anomaly',
      data: { activityId, userId },
    })

    return { success: true, isValid, focus }
  }
)
