import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildInsightContext } from '@/lib/services/running/ai/buildInsightContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildFocusedPrompt } from '@/lib/services/running/ai/prompts'

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
    const { activityId, userId, focus = 'general' } = event.data

    const isDuplicate = await step.run('check-duplicate', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_ai_insights')
        .select('id')
        .eq('user_id', userId)
        .eq('insight_type', 'post_activity')
        .contains('data_refs', { activity_id: activityId, focus })
        .maybeSingle()
      return !!data
    })

    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    const { context, profile } = await step.run('build-context', async () => {
      return buildInsightContext(activityId, userId)
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildFocusedPrompt(profile, focus)
      return generateInsight({
        systemPrompt,
        userContent: context,
        insightType: 'post_activity',
        maxTokens: 700,
      })
    })

    await step.run('save-insight', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase.from('rt_ai_insights').insert({
        user_id: userId,
        insight_type: 'post_activity',
        status: 'completed',
        is_valid: isValid,
        title: FOCUS_TITLES[focus] ?? 'Analisis Aktivitas',
        content: output || null,
        data_refs: { activity_id: activityId, focus },
        retry_count: 0,
      })
      if (error) throw new Error(`Save insight failed: ${error.message}`)
    })

    await step.sendEvent('trigger-anomaly-check', {
      name: 'ai/check-anomaly',
      data: { activityId, userId },
    })

    return { success: true, isValid, focus }
  }
)
