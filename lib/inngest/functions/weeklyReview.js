import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWeeklyContext } from '@/lib/services/running/ai/buildWeeklyContext'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildWeeklyReviewPrompt } from '@/lib/services/running/ai/prompts'
import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'

function serializeWeeklyContext({
  profile,
  goals,
  weekActivities,
  prevWeeksActivities,
  healthLogs,
}) {
  const lines = []

  lines.push('=== ATHLETE PROFILE ===')
  if (profile) {
    lines.push(`Name: ${profile.display_name ?? 'Athlete'}`)
    if (profile.max_hr) lines.push(`Max HR: ${profile.max_hr} bpm`)
  }
  if (goals.length > 0) {
    for (const g of goals) {
      const parts = [g.goal_type]
      if (g.target_date) parts.push(`target ${g.target_date}`)
      if (g.target_distance_m) parts.push(`${(g.target_distance_m / 1000).toFixed(0)}km`)
      lines.push(`Active goal: ${parts.join(', ')}`)
    }
  } else {
    lines.push('Active goals: none')
  }

  lines.push('')
  lines.push("=== THIS WEEK'S ACTIVITIES ===")
  if (weekActivities.length > 0) {
    let totalDistM = 0
    let totalDurSec = 0
    for (const a of weekActivities) {
      const date = new Date(a.started_at).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
      const dist = a.distance_m ? `${(a.distance_m / 1000).toFixed(1)}km` : null
      const hr = a.avg_hr ? `HR ${a.avg_hr}bpm` : null
      const type = a.activity_type ?? 'Run'
      lines.push([date, type, dist, hr].filter(Boolean).join(' | '))
      totalDistM += a.distance_m ?? 0
      totalDurSec += a.duration_sec ?? 0
    }
    const totalKm = (totalDistM / 1000).toFixed(1)
    const totalHr = Math.floor(totalDurSec / 3600)
    const totalMin = Math.floor((totalDurSec % 3600) / 60)
    lines.push(
      `Total: ${weekActivities.length} sessions | ${totalKm}km | ${totalHr}h${totalMin}min`
    )
  } else {
    lines.push('No activities this week')
  }

  if (prevWeeksActivities.length > 0) {
    lines.push('')
    lines.push('=== PREVIOUS 4 WEEKS (for comparison) ===')
    const byWeek = {}
    for (const a of prevWeeksActivities) {
      const d = new Date(a.started_at)
      const dayOfWeek = d.getDay()
      const monday = new Date(d)
      monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7))
      const weekKey = monday.toISOString().split('T')[0]
      if (!byWeek[weekKey]) byWeek[weekKey] = { distM: 0, sessions: 0 }
      byWeek[weekKey].distM += a.distance_m ?? 0
      byWeek[weekKey].sessions += 1
    }
    for (const [week, data] of Object.entries(byWeek).sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`Week of ${week}: ${(data.distM / 1000).toFixed(1)}km (${data.sessions} sessions)`)
    }
  }

  if (healthLogs.length > 0) {
    lines.push('')
    lines.push('=== HEALTH LOG THIS WEEK ===')
    for (const h of healthLogs) {
      const parts = [`${h.log_date}:`]
      if (h.sleep_hours) parts.push(`Sleep ${h.sleep_hours}h`)
      if (h.sleep_quality) parts.push(`Q${h.sleep_quality}/5`)
      if (h.morning_energy) parts.push(`Energy ${h.morning_energy}/5`)
      if (h.mood) parts.push(`Mood ${h.mood}/5`)
      if (h.soreness_level) parts.push(`Soreness ${h.soreness_level}/5`)
      lines.push(parts.join(' '))
    }
  }

  return lines.join('\n')
}

export const weeklyReview = inngest.createFunction(
  { id: 'weekly-review', retries: 2, triggers: [{ cron: '0 19 * * 0' }] },
  async ({ event, step }) => {
    const weekRange = await step.run('determine-week-range', async () => {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
      weekStart.setHours(0, 0, 0, 0)
      return {
        weekStart: weekStart.toISOString().split('T')[0],
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
        .eq('insight_type', 'weekly_review')
        .contains('data_refs', { week_start: weekRange.weekStart })
        .limit(1)
        .maybeSingle()
      return !!data
    })

    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    const { context, profile } = await step.run('build-context', async () => {
      const data = await buildWeeklyContext(userId, weekRange.weekStart, weekRange.weekEnd)
      if (!data.profile) return { context: null, profile: null }
      return { context: serializeWeeklyContext(data), profile: data.profile }
    })

    if (!context) return { skipped: true, reason: 'no_context' }

    const { output, isValid } = await step.run('call-claude', async () => {
      const systemPrompt = buildWeeklyReviewPrompt(profile)
      return generateInsight({
        systemPrompt,
        userContent: context,
        insightType: 'weekly_review',
        maxTokens: 500,
      })
    })

    await step.run('save-insight', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase.from('rt_ai_insights').insert({
        user_id: userId,
        insight_type: 'weekly_review',
        status: 'completed',
        is_valid: isValid,
        title: 'Weekly Training Review',
        content: output || null,
        data_refs: { week_start: weekRange.weekStart },
        retry_count: 0,
      })
      if (error) throw new Error(`Save weekly review failed: ${error.message}`)
    })

    await step.run('send-notification', async () => {
      const supabase = createAdminClient()
      const { data: settings } = await supabase
        .from('rt_user_settings')
        .select('notify_weekly_review, push_subscription, push_notifications_enabled')
        .eq('user_id', userId)
        .maybeSingle()

      if (
        !settings?.notify_weekly_review ||
        !settings?.push_notifications_enabled ||
        !settings?.push_subscription
      ) {
        return { notified: false }
      }

      const result = await sendPushNotification(settings.push_subscription, {
        title: 'Weekly Training Review',
        body: 'Your weekly running summary is ready. Tap to read.',
        url: '/main/running/ai',
      })
      return { notified: result.sent, ...result }
    })

    return { success: true, isValid }
  }
)
