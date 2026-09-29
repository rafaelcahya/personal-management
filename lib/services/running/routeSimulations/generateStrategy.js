import { generateInsight } from '@/lib/services/running/ai/generateInsight'
import { getSimulation } from './getSimulation'

function fmtPace(sec) {
  if (sec == null) return '—'
  return `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}/km`
}

function fmtTime(sec) {
  if (sec == null) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

function buildContext(sim) {
  const splits = Array.isArray(sim.km_splits) ? sim.km_splits : []
  const target =
    sim.target_mode === 'time'
      ? `finish in ${fmtTime(sim.target_time_sec)}`
      : `average pace ${fmtPace(sim.target_pace_sec_per_km)}`

  const hardestClimb = splits.reduce((a, b) => (b.ele_gain_m > (a?.ele_gain_m ?? -1) ? b : a), null)
  const bestDescent = splits.reduce((a, b) => (b.ele_loss_m > (a?.ele_loss_m ?? -1) ? b : a), null)

  const lines = [
    '=== ROUTE PACING PLAN ===',
    `Distance: ${(sim.total_distance_m / 1000).toFixed(2)} km`,
    `Elevation: +${sim.total_elevation_gain_m} m / -${sim.total_elevation_loss_m} m`,
    `Target: ${target}`,
    `Planned finish: ${fmtTime(sim.predicted_time_sec)}`,
    `Even-effort flat-equivalent pace: ${fmtPace(sim.effort_flat_pace_sec_per_km)}`,
    sim.is_realistic
      ? 'The target is within a sustainable effort.'
      : `The target is likely too aggressive; a realistic finish is about ${fmtTime(sim.suggested_time_sec)}.`,
  ]

  if (hardestClimb)
    lines.push(`Hardest climb: km ${hardestClimb.km} (+${hardestClimb.ele_gain_m} m)`)
  if (bestDescent)
    lines.push(`Biggest descent: km ${bestDescent.km} (-${bestDescent.ele_loss_m} m)`)

  lines.push('', '=== PER-KM PLAN ===')
  for (const s of splits) {
    lines.push(`km ${s.km}: ${fmtPace(s.pace_sec_per_km)} (+${s.ele_gain_m}/-${s.ele_loss_m} m)`)
  }
  return lines.join('\n')
}

const SYSTEM_PROMPT = `You are an experienced running coach writing a race-day pacing strategy for one athlete's specific route.
The plan already keeps effort even — pace is slower on climbs and faster on descents so the overall target still holds.
Explain how to run this route in plain, encouraging language. In 2 short paragraphs (no headings, no bullet lists):
- Where to hold back and stay patient (the climbs) and why fighting the pace there wastes energy.
- Where to press and let it roll (descents and flats) to make the time back.
- One sentence on effort/breathing feel to hold throughout.
If the target is flagged as too aggressive, gently say so and point to the realistic finish.
Keep it under 180 words. Do not invent data beyond what is given.`

export async function generateStrategy(supabase, userId, id) {
  const sim = await getSimulation(supabase, userId, id)

  const { output } = await generateInsight({
    systemPrompt: SYSTEM_PROMPT,
    userContent: buildContext(sim),
    insightType: 'route_strategy',
    maxTokens: 500,
  })

  const strategy = output.trim()

  const { error } = await supabase
    .from('rt_route_simulations')
    .update({ ai_strategy: strategy })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return strategy
}
