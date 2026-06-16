import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildAnalyticsContext } from '@/lib/services/running/ai/buildAnalyticsContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildAnalyticsSummaryPrompt } from '@/lib/services/running/ai/prompts'

const ANALYTICS_SECTIONS = [
  'weekly_distance',
  'pace_trend',
  'training_load',
  'vo2max_trend',
  'ef_trend',
  'race_predictor',
]

const SECTION_TITLES = {
  weekly_distance: 'Weekly Distance Analysis',
  pace_trend: 'Pace Trend Analysis',
  training_load: 'Training Load Analysis',
  vo2max_trend: 'VO2max Trend Analysis',
  ef_trend: 'Efficiency Factor Trend',
  race_predictor: 'Race Readiness',
}

export const generateAnalyticsSummary = inngest.createFunction(
  {
    id: 'generate-analytics-summary',
    retries: 2,
    triggers: [{ event: 'ai/generate-analytics-summary' }],
  },
  async ({ event, step }) => {
    const { userId } = event.data

    // S-1: validate userId exists before any DB work
    const userExists = await step.run('check-user', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase.from('rt_users').select('id').eq('id', userId).maybeSingle()
      return !!data
    })

    if (!userExists) return { skipped: true, reason: 'user_not_found' }

    const isDuplicate = await step.run('check-duplicate', async () => {
      const supabase = createAdminClient()

      // WB-4: check for a pending row created in the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('rt_ai_insights')
        .select('id')
        .eq('user_id', userId)
        .eq('insight_type', 'analytics_summary')
        .eq('status', 'pending')
        .gte('created_at', fiveMinutesAgo)
        .limit(1)
        .maybeSingle()
      return !!data
    })

    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    // WB-3: insert pending sentinel rows so the UI can show a loading state immediately
    await step.run('insert-pending', async () => {
      const supabase = createAdminClient()
      const rows = ANALYTICS_SECTIONS.map((section) => ({
        user_id: userId,
        insight_type: 'analytics_summary',
        status: 'pending',
        is_valid: false,
        title: SECTION_TITLES[section] ?? section,
        content: null,
        data_refs: { section, triggered_by_activity_id: triggeredByActivityId ?? null },
        retry_count: 0,
      }))
      const { error } = await supabase.from('rt_ai_insights').insert(rows)
      if (error) throw new Error(`Insert pending rows failed: ${error.message}`)
    })

    const context = await step.run('build-context', async () => {
      return buildAnalyticsContext(userId)
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildAnalyticsSummaryPrompt(context)
      return generateInsight({
        systemPrompt,
        userContent: 'Generate analytics section recommendations based on the data above.',
        insightType: 'analytics_summary',
        maxTokens: 2500,
      })
    })

    await step.run('save-insights', async () => {
      console.log('[analytics-summary] isValid:', isValid, 'output length:', output?.length)
      const parsed = isValid && output ? parseJsonOutput(output) : null
      console.log('[analytics-summary] parsed sections:', parsed ? Object.keys(parsed) : null)

      const supabase = createAdminClient()
      const rows = ANALYTICS_SECTIONS.map((section) => {
        const sectionData = parsed ? parsed[section] : null
        return {
          user_id: userId,
          insight_type: 'analytics_summary',
          status: 'completed',
          is_valid: !!sectionData,
          title: SECTION_TITLES[section] ?? section,
          content: sectionData
            ? JSON.stringify({
                running_coach: sectionData.running_coach ?? null,
                performance_analyst: sectionData.performance_analyst ?? null,
                summary: sectionData.summary ?? null,
              })
            : null,
          data_refs: { section },
          retry_count: 0,
        }
      })

      // delete pending sentinel rows first, then insert completed rows
      await supabase
        .from('rt_ai_insights')
        .delete()
        .eq('user_id', userId)
        .eq('insight_type', 'analytics_summary')
        .eq('status', 'pending')

      const { error } = await supabase.from('rt_ai_insights').insert(rows)
      if (error) throw new Error('Save analytics summary failed')
    })

    return { success: true, isValid, sections: ANALYTICS_SECTIONS.length }
  }
)

function parseJsonOutput(text) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}
