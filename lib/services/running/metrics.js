import { createAdminClient } from '@/lib/supabase/admin'

const GATE_DURATION_SEC = 20 * 60

/**
 * Computes and persists derived metrics (EF, aerobic decoupling, VO2max)
 * for a single activity. Safe to call multiple times — always overwrites.
 *
 * @param {string} activityId - rt_activities.id (UUID)
 * @param {string} userId - auth user id, used for rt_users max_hr lookup
 * @returns {{ updated: boolean, fields: string[] }}
 */
export async function computeAndSaveDerivedMetrics(activityId, userId) {
  const supabase = createAdminClient()

  const { data: act } = await supabase
    .from('rt_activities')
    .select('avg_hr, moving_time_sec, duration_sec, raw_data')
    .eq('id', activityId)
    .single()

  if (!act) return { updated: false, fields: [] }

  const durationSec = act.moving_time_sec ?? act.duration_sec ?? 0
  const avgHr = act.avg_hr

  if (durationSec <= GATE_DURATION_SEC || !avgHr) {
    return { updated: false, fields: [] }
  }

  const updates = {}

  // ── Efficiency Factor ──────────────────────────────────────────────────────
  const avgSpeedMs = act.raw_data?.average_speed ?? null
  if (avgSpeedMs != null && avgHr > 0) {
    updates.efficiency_factor = parseFloat((avgSpeedMs / avgHr).toFixed(4))
  }

  // ── Aerobic Decoupling (Pa:Hr) ─────────────────────────────────────────────
  const { data: streams } = await supabase
    .from('rt_activity_streams')
    .select('pace_sec_per_km, heart_rate')
    .eq('activity_id', activityId)
    .not('pace_sec_per_km', 'is', null)
    .not('heart_rate', 'is', null)
    .order('timestamp', { ascending: true })

  if (Array.isArray(streams) && streams.length >= 4) {
    const midpoint = Math.floor(streams.length / 2)
    const firstHalf = streams.slice(0, midpoint)
    const secondHalf = streams.slice(midpoint)

    // Wrap in Number() to handle Postgres numeric-as-string from PostgREST
    const avg = (arr, key) => arr.reduce((s, r) => s + Number(r[key]), 0) / arr.length

    const firstPace = avg(firstHalf, 'pace_sec_per_km')
    const firstHr = avg(firstHalf, 'heart_rate')
    const secondPace = avg(secondHalf, 'pace_sec_per_km')
    const secondHr = avg(secondHalf, 'heart_rate')

    if (firstPace > 0 && firstHr > 0 && secondPace > 0 && secondHr > 0) {
      const firstRatio = 1 / firstPace / firstHr
      const secondRatio = 1 / secondPace / secondHr
      const decoupling = (firstRatio / secondRatio - 1) * 100

      if (Number.isFinite(decoupling)) {
        updates.aerobic_decoupling = parseFloat(decoupling.toFixed(2))
      }
    }
  }

  // ── Estimated VO2max (Daniels formula) ────────────────────────────────────
  if (avgSpeedMs != null && avgHr > 0) {
    const { data: userRow } = await supabase
      .from('rt_users')
      .select('max_hr')
      .eq('id', userId)
      .single()

    if (userRow?.max_hr) {
      const avgSpeedMPerMin = avgSpeedMs * 60
      const durationMin = durationSec / 60
      const vo2AtPace = -4.6 + 0.182258 * avgSpeedMPerMin + 0.000104 * avgSpeedMPerMin ** 2
      const percentVO2max =
        0.8 +
        0.1894393 * Math.exp(-0.012778 * durationMin) +
        0.2989558 * Math.exp(-0.1932605 * durationMin)
      const raw = vo2AtPace / percentVO2max
      if (raw >= 20 && raw <= 90) {
        updates.estimated_vo2max = parseFloat(raw.toFixed(2))
      }
    }
  }

  if (Object.keys(updates).length === 0) return { updated: false, fields: [] }

  const { error } = await supabase.from('rt_activities').update(updates).eq('id', activityId)

  if (error) throw new Error(`Derived metrics update failed: ${error.message}`)

  return { updated: true, fields: Object.keys(updates) }
}
