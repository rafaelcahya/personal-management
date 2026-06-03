import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildDailyContext } from '@/lib/services/running/ai/buildDailyContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildDailyInsightPrompt } from '@/lib/services/running/ai/prompts'

const MIN_ACTIVITY_COUNT = 3
const RACE_TAPER_DAYS = 14
const ACWR_RECOVERY_THRESHOLD = 1.3
const CONSISTENCY_GAP_DAYS = 5

export const dailyInsight = inngest.createFunction(
  { id: 'daily-insight', retries: 2, triggers: [{ event: 'ai/generate-daily-insight' }] },
  async ({ event, step }) => {
    const { userId, force = false } = event.data

    const shouldGenerate = await step.run('check-preconditions', async () => {
      const supabase = createAdminClient()

      if (!force) {
        const todayStr = new Date().toISOString().split('T')[0]
        const { data: existing } = await supabase
          .from('rt_ai_insights')
          .select('id')
          .eq('user_id', userId)
          .eq('insight_type', 'daily')
          .gte('created_at', `${todayStr}T00:00:00.000Z`)
          .limit(1)
          .maybeSingle()

        if (existing) return false
      }

      const { count } = await supabase
        .from('rt_activities')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

      return (count ?? 0) >= MIN_ACTIVITY_COUNT
    })

    if (!shouldGenerate) return { skipped: true }

    const focus = await step.run('determine-focus', async () => {
      const supabase = createAdminClient()
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      const { data: goal } = await supabase
        .from('rt_goals')
        .select('target_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .not('target_date', 'is', null)
        .order('target_date', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (goal?.target_date) {
        const daysToRace = Math.ceil((new Date(goal.target_date) - today) / (1000 * 60 * 60 * 24))
        if (daysToRace >= 0 && daysToRace <= RACE_TAPER_DAYS) return 'taper'
      }

      const { data: metrics } = await supabase
        .from('rt_daily_training_metrics')
        .select('acwr')
        .eq('user_id', userId)
        .eq('date', todayStr)
        .maybeSingle()

      if (metrics?.acwr != null && metrics.acwr > ACWR_RECOVERY_THRESHOLD) return 'recovery'

      const { data: lastActivity } = await supabase
        .from('rt_activities')
        .select('started_at')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastActivity?.started_at) {
        const daysSinceLast = Math.floor(
          (today - new Date(lastActivity.started_at)) / (1000 * 60 * 60 * 24)
        )
        if (daysSinceLast >= CONSISTENCY_GAP_DAYS) return 'motivational'
      }

      return 'general'
    })

    const { context } = await step.run('build-context', async () => {
      const data = await buildDailyContext(userId)
      if (!data.profile) return { context: null, profile: null }
      return { context: serializeDailyContext(data), profile: data.profile }
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildDailyInsightPrompt(focus)
      return generateInsight({
        systemPrompt,
        userContent: context,
        insightType: 'daily',
        maxTokens: 400,
      })
    })

    await step.run('save-insight', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase.from('rt_ai_insights').insert({
        user_id: userId,
        insight_type: 'daily',
        status: 'completed',
        is_valid: isValid,
        title: 'Daily Coaching Note',
        content: output || null,
        data_refs: { focus },
        retry_count: 0,
      })
      if (error) throw new Error(`Save daily insight failed: ${error.message}`)
    })

    return { success: true, isValid, focus }
  }
)

function serializeDailyContext({
  profile: p,
  goals,
  trainingMetrics,
  recentActivities,
  healthLog,
}) {
  const lines = []

  lines.push('=== ATHLETE PROFILE ===')
  lines.push(`Name: ${p.display_name ?? 'Athlete'}`)
  if (p.max_hr) lines.push(`Max HR: ${p.max_hr} bpm`)
  if (goals.length > 0) {
    for (const g of goals) {
      const parts = [g.goal_type]
      if (g.target_date) parts.push(`target ${g.target_date}`)
      lines.push(`Active goal: ${parts.join(', ')}`)
    }
  } else {
    lines.push('Active goals: none')
  }

  if (healthLog) {
    lines.push('')
    lines.push("=== TODAY'S HEALTH ===")
    const parts = []
    if (healthLog.sleep_hours) parts.push(`Sleep: ${healthLog.sleep_hours}h`)
    if (healthLog.sleep_quality) parts.push(`Quality: ${healthLog.sleep_quality}/5`)
    if (healthLog.morning_energy) parts.push(`Energy: ${healthLog.morning_energy}/5`)
    if (healthLog.mood) parts.push(`Mood: ${healthLog.mood}/5`)
    if (healthLog.soreness_level) parts.push(`Soreness: ${healthLog.soreness_level}/5`)
    if (parts.length > 0) lines.push(parts.join(' | '))
  }

  if (trainingMetrics) {
    lines.push('')
    lines.push('=== TRAINING LOAD ===')
    if (trainingMetrics.acwr != null) lines.push(`ACWR: ${trainingMetrics.acwr}`)
    if (trainingMetrics.acute_load_7d != null)
      lines.push(`Acute 7d: ${trainingMetrics.acute_load_7d}`)
    if (trainingMetrics.chronic_load_28d != null)
      lines.push(`Chronic 28d: ${trainingMetrics.chronic_load_28d}`)
  }

  if (recentActivities.length > 0) {
    lines.push('')
    lines.push('=== RECENT ACTIVITIES (last 4 weeks) ===')
    for (const a of recentActivities) {
      const date = new Date(a.started_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      })
      const dist = a.distance_m ? `${(a.distance_m / 1000).toFixed(1)}km` : null
      const hr = a.avg_hr ? `HR avg ${a.avg_hr}bpm` : null
      lines.push([date, dist, hr].filter(Boolean).join(' | '))
    }
  }

  return lines.join('\n')
}
