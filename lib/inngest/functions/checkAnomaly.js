import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { buildAnomalyPrompt } from '@/lib/services/running/ai/prompts'
import { sendPushNotification } from '@/lib/services/running/notifications/sendPushNotification'

const ACWR_SPIKE_THRESHOLD = 1.5
const HR_DRIFT_FACTOR = 1.1
const PACE_DROP_FACTOR = 1.08
const CONSISTENCY_GAP_DAYS = 10
const MIN_WEEKLY_SESSIONS = 3

const ANOMALY_TITLES = {
  acwr_spike: 'Training Load Spike Detected',
  hr_drift: 'Heart Rate Drift Detected',
  pace_drop: 'Pace Drop Detected',
  consistency_gap: 'Consistency Gap Detected',
}

export const checkAnomaly = inngest.createFunction(
  { id: 'check-anomaly', retries: 2, triggers: [{ event: 'ai/check-anomaly' }] },
  async ({ event, step }) => {
    const { activityId, userId } = event.data

    const { activity, baseline, trainingMetrics, prevActivity } = await step.run(
      'load-data',
      async () => {
        const supabase = createAdminClient()
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const [activityResult, baselineResult, metricsResult] = await Promise.all([
          supabase
            .from('rt_activities')
            .select('id, avg_hr, avg_pace_sec_per_km, started_at, activity_type, distance_m')
            .eq('id', activityId)
            .eq('user_id', userId)
            .maybeSingle(),
          supabase
            .from('rt_activities')
            .select('avg_hr, avg_pace_sec_per_km, started_at')
            .eq('user_id', userId)
            .gte('started_at', thirtyDaysAgo.toISOString())
            .neq('id', activityId)
            .order('started_at', { ascending: false }),
          supabase
            .from('rt_daily_training_metrics')
            .select('acwr, acute_load_7d, chronic_load_28d')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])

        const baselineActivities = baselineResult.data ?? []
        const hrValues = baselineActivities.map((a) => a.avg_hr).filter(Boolean)
        const paceValues = baselineActivities.map((a) => a.avg_pace_sec_per_km).filter(Boolean)

        const avg_hr =
          hrValues.length > 0 ? hrValues.reduce((a, b) => a + b, 0) / hrValues.length : null
        const avg_pace =
          paceValues.length > 0 ? paceValues.reduce((a, b) => a + b, 0) / paceValues.length : null

        const currentStartedAt = activityResult.data?.started_at ?? null
        let prevActivityData = null
        if (currentStartedAt && baselineActivities.length >= MIN_WEEKLY_SESSIONS) {
          const { data: prev } = await supabase
            .from('rt_activities')
            .select('started_at')
            .eq('user_id', userId)
            .neq('id', activityId)
            .lt('started_at', currentStartedAt)
            .order('started_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          prevActivityData = prev
        }

        return {
          activity: activityResult.data,
          baseline: { avg_hr, avg_pace, sessionCount: baselineActivities.length },
          trainingMetrics: metricsResult.data,
          prevActivity: prevActivityData,
        }
      }
    )

    if (!activity) return { anomalies: 0, reason: 'activity_not_found' }

    const anomalies = await step.run('evaluate-conditions', async () => {
      const found = []

      if (trainingMetrics?.acwr != null && trainingMetrics.acwr > ACWR_SPIKE_THRESHOLD) {
        found.push({
          type: 'acwr_spike',
          severity: 'warning',
          data: { acwr: trainingMetrics.acwr, threshold: ACWR_SPIKE_THRESHOLD },
        })
      }

      if (
        activity.avg_hr != null &&
        baseline.avg_hr != null &&
        activity.avg_hr > baseline.avg_hr * HR_DRIFT_FACTOR
      ) {
        found.push({
          type: 'hr_drift',
          severity: 'attention',
          data: { current_hr: activity.avg_hr, baseline_hr: Math.round(baseline.avg_hr) },
        })
      }

      if (
        activity.avg_pace_sec_per_km != null &&
        baseline.avg_pace != null &&
        activity.avg_pace_sec_per_km > baseline.avg_pace * PACE_DROP_FACTOR
      ) {
        found.push({
          type: 'pace_drop',
          severity: 'attention',
          data: {
            current_pace: activity.avg_pace_sec_per_km,
            baseline_pace: Math.round(baseline.avg_pace),
          },
        })
      }

      if (activity.started_at && baseline.sessionCount >= MIN_WEEKLY_SESSIONS) {
        if (prevActivity?.started_at) {
          const daysSinceLast = Math.floor(
            (new Date(activity.started_at) - new Date(prevActivity.started_at)) /
              (1000 * 60 * 60 * 24)
          )
          if (daysSinceLast > CONSISTENCY_GAP_DAYS) {
            found.push({
              type: 'consistency_gap',
              severity: 'info',
              data: { days_gap: daysSinceLast },
            })
          }
        }
      }

      return found
    })

    if (anomalies.length === 0) return { anomalies: 0 }

    const profile = await step.run('load-profile', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_users')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle()
      return data
    })

    for (const anomaly of anomalies) {
      await step.run(`handle-anomaly-${anomaly.type}`, async () => {
        const systemPrompt = buildAnomalyPrompt(profile ?? { display_name: 'Athlete' })
        const userContent = `Anomaly detected: ${anomaly.type}\nData: ${JSON.stringify(anomaly.data)}\nActivity: distance ${activity.distance_m ? (activity.distance_m / 1000).toFixed(1) + 'km' : 'N/A'}, HR avg ${activity.avg_hr ?? 'N/A'}bpm`

        const { output, isValid } = await generateInsight({
          systemPrompt,
          userContent,
          insightType: 'anomaly',
          maxTokens: 250,
        })

        const supabase = createAdminClient()
        const { error } = await supabase.from('rt_ai_insights').insert({
          user_id: userId,
          insight_type: 'anomaly',
          severity: anomaly.severity,
          status: 'completed',
          is_valid: isValid,
          title: ANOMALY_TITLES[anomaly.type] ?? 'Anomaly Detected',
          content: output || null,
          data_refs: { activity_id: activityId, anomaly_type: anomaly.type, ...anomaly.data },
          retry_count: 0,
        })
        if (error) throw new Error(`Save anomaly insight failed: ${error.message}`)

        if (anomaly.severity !== 'info') {
          const { data: settings } = await supabase
            .from('rt_user_settings')
            .select('notify_anomaly, push_subscription, push_notifications_enabled')
            .eq('user_id', userId)
            .maybeSingle()

          if (
            settings?.notify_anomaly &&
            settings?.push_notifications_enabled &&
            settings?.push_subscription
          ) {
            await sendPushNotification(settings.push_subscription, {
              title: ANOMALY_TITLES[anomaly.type] ?? 'Anomaly Detected',
              body: 'A training anomaly was detected. Tap to review your recent activity.',
              url: `/main/running/activities/${activityId}`,
            })
          }
        }
      })
    }

    return { anomalies: anomalies.length }
  }
)
