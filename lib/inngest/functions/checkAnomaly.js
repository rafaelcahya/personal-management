import { inngest } from '@/lib/inngest/client'

export const checkAnomaly = inngest.createFunction(
  { id: 'check-anomaly', retries: 2 },
  { event: 'ai/check-anomaly' },
  async ({ event, step }) => {
    const { activityId: _activityId, userId: _userId } = event.data

    const {
      activity: _activity,
      baseline: _baseline,
      trainingMetrics: _trainingMetrics,
    } = await step.run('load-data', async () => {
      // TODO: fetch activity terbaru + baseline 30 hari + training metrics
      return {}
    })

    const anomalies = await step.run('evaluate-conditions', async () => {
      const found = []

      // Condition A: ACWR spike
      // if (trainingMetrics.acwr > 1.5) found.push({ type: 'acwr_spike', severity: 'warning', data: {...} })

      // Condition B: HR drift
      // if (activity.avg_hr > baseline.avg_hr * 1.10) found.push({ type: 'hr_drift', severity: 'attention', data: {...} })

      // Condition C: Pace drop
      // if (activity.avg_pace > baseline.avg_pace * 1.08) found.push({ type: 'pace_drop', severity: 'attention', data: {...} })

      // Condition D: Consistency gap
      // if (daysSinceLastActivity > 10 && baseline.avg_freq >= 3) found.push({ type: 'consistency_gap', severity: 'info', data: {...} })

      return found
    })

    if (anomalies.length === 0) return { anomalies: 0 }

    for (const anomaly of anomalies) {
      await step.run(`handle-anomaly-${anomaly.type}`, async () => {
        // TODO: call Claude untuk generate pesan personal
        // TODO: insert ke rt_ai_insights (insight_type: 'anomaly')
        // TODO: kirim push notification kalau severity >= 'attention' dan notify_anomaly = true
      })
    }

    return { anomalies: anomalies.length }
  }
)
