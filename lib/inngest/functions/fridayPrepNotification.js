import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  buildFridayPrepContext,
  serializeFridayPrepContext,
} from '@/lib/services/running/ai/buildFridayPrepContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildFridayPrepPrompt } from '@/lib/services/running/ai/prompts'

export const fridayPrepNotification = inngest.createFunction(
  { id: 'friday-prep-notification', retries: 2, triggers: [{ cron: '0 15 * * 5' }] },
  async ({ event, step }) => {
    const weekRange = await step.run('determine-week-range', async () => {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const monday = new Date(now)
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
      monday.setHours(0, 0, 0, 0)
      return {
        weekStart: monday.toISOString().split('T')[0],
        weekEnd: now.toISOString(),
      }
    })

    const userId = await step.run('get-user', async () => {
      const { userId: uid } = event.data ?? {}
      const supabase = createAdminClient()
      const query = supabase.from('rt_users').select('id')
      if (uid) query.eq('id', uid)
      const { data } = await query.limit(1).maybeSingle()
      return data?.id ?? null
    })

    if (!userId) return { skipped: true, reason: 'no_user' }

    const isDuplicate = await step.run('check-duplicate', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_ai_insights')
        .select('id')
        .eq('user_id', userId)
        .eq('insight_type', 'friday_prep')
        .contains('data_refs', { week_start: weekRange.weekStart })
        .limit(1)
        .maybeSingle()
      return !!data
    })

    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    const { context, profile, mode } = await step.run('build-context', async () => {
      const data = await buildFridayPrepContext(userId, weekRange.weekStart, weekRange.weekEnd)
      if (!data.profile) return { context: null, profile: null, mode: null }
      return {
        context: serializeFridayPrepContext(data),
        profile: data.profile,
        mode: data.computed.mode,
      }
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildFridayPrepPrompt(profile, mode)
      return generateInsight({
        systemPrompt,
        userContent: context,
        insightType: 'friday_prep',
        maxTokens: 700,
      })
    })

    await step.run('save-insight', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase.from('rt_ai_insights').insert({
        user_id: userId,
        insight_type: 'friday_prep',
        status: 'completed',
        is_valid: isValid,
        title: 'Weekend Training Plan',
        content: output || null,
        data_refs: { week_start: weekRange.weekStart, mode },
        retry_count: 0,
      })
      if (error) throw new Error(`Save friday prep failed: ${error.message}`)
    })

    await step.run('send-notification', async () => {
      // Push notification deferred — requires VAPID setup
      return { notified: false, reason: 'push_not_implemented' }
    })

    return { success: true, isValid, mode }
  }
)
