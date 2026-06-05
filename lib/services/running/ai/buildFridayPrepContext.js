import { buildWeeklyContext } from './buildWeeklyContext'

function computeACWR(weekActivities, prevWeeksActivities) {
  const acuteKm = weekActivities.reduce((sum, a) => sum + (a.distance_m ?? 0), 0) / 1000
  const chronicKm = prevWeeksActivities.reduce((sum, a) => sum + (a.distance_m ?? 0), 0) / 1000
  const avgWeeklyChronicKm = chronicKm / 4
  if (avgWeeklyChronicKm === 0) return acuteKm > 0 ? 1.0 : null
  return Math.round((acuteKm / avgWeeklyChronicKm) * 100) / 100
}

function computeEFDelta(weekActivities, prevWeeksActivities) {
  function avgEF(activities) {
    const valid = activities.filter(
      (a) => a.avg_hr && a.avg_hr > 0 && a.distance_m && a.duration_sec
    )
    if (valid.length === 0) return null
    const efs = valid.map((a) => ((a.distance_m / a.duration_sec) * 60) / a.avg_hr)
    return efs.reduce((s, v) => s + v, 0) / efs.length
  }
  const currentEF = avgEF(weekActivities)
  const prevEF = avgEF(prevWeeksActivities)
  if (currentEF == null || prevEF == null) return { currentEF, prevEF, delta: null }
  const delta = Math.round(((currentEF - prevEF) / prevEF) * 1000) / 10
  return {
    currentEF: Math.round(currentEF * 100) / 100,
    prevEF: Math.round(prevEF * 100) / 100,
    delta,
  }
}

function computeZoneDistribution(activities) {
  const totals = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 }
  let totalSec = 0
  for (const a of activities) {
    if (!a.zones) continue
    const z = a.zones
    totals.z1 += z.z1_sec ?? 0
    totals.z2 += z.z2_sec ?? 0
    totals.z3 += z.z3_sec ?? 0
    totals.z4 += z.z4_sec ?? 0
    totals.z5 += z.z5_sec ?? 0
    totalSec +=
      (z.z1_sec ?? 0) + (z.z2_sec ?? 0) + (z.z3_sec ?? 0) + (z.z4_sec ?? 0) + (z.z5_sec ?? 0)
  }
  if (totalSec === 0) return null
  return {
    z1: Math.round((totals.z1 / totalSec) * 100),
    z2: Math.round((totals.z2 / totalSec) * 100),
    z3: Math.round((totals.z3 / totalSec) * 100),
    z4: Math.round((totals.z4 / totalSec) * 100),
    z5: Math.round((totals.z5 / totalSec) * 100),
  }
}

function daysSinceLastActivity(activities) {
  if (activities.length === 0) return null
  const sorted = [...activities].sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
  const last = new Date(sorted[0].started_at)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today - last) / 86400000)
}

function daysUntilRace(goals) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const raceGoals = goals.filter((g) => g.target_date)
  if (raceGoals.length === 0) return null
  const upcoming = raceGoals
    .map((g) => {
      const d = new Date(g.target_date)
      d.setHours(0, 0, 0, 0)
      return Math.ceil((d - today) / 86400000)
    })
    .filter((d) => d >= 0)
    .sort((a, b) => a - b)
  return upcoming[0] ?? null
}

function selectMode(goals, gapDays) {
  const raceDays = daysUntilRace(goals)
  if (raceDays != null && raceDays <= 7) return 'race_week'
  if (raceDays != null && raceDays <= 14) return 'taper'
  if (gapDays != null && gapDays >= 5) return 'comeback'
  return 'normal'
}

export async function buildFridayPrepContext(userId, weekStart, weekEnd) {
  const base = await buildWeeklyContext(userId, weekStart, weekEnd)
  const { profile, goals, weekActivities, prevWeeksActivities, healthLogs } = base

  // Last 3 days of health logs only
  const last3HealthLogs = [...healthLogs]
    .sort((a, b) => b.log_date.localeCompare(a.log_date))
    .slice(0, 3)

  // All recent activities (week + prev) for gap computation
  const allActivities = [...weekActivities, ...prevWeeksActivities]
  const gapDays = daysSinceLastActivity(allActivities)

  const acwr = computeACWR(weekActivities, prevWeeksActivities)
  const efDelta = computeEFDelta(weekActivities, prevWeeksActivities)
  const zoneDist = computeZoneDistribution(weekActivities)
  const mode = selectMode(goals, gapDays)
  const raceDays = daysUntilRace(goals)

  const weekKm = weekActivities.reduce((s, a) => s + (a.distance_m ?? 0), 0) / 1000

  return {
    profile,
    goals,
    weekActivities,
    prevWeeksActivities,
    healthLogs: last3HealthLogs,
    computed: {
      acwr,
      efDelta,
      zoneDist,
      gapDays,
      mode,
      raceDays,
      weekKm: Math.round(weekKm * 10) / 10,
    },
  }
}

export function serializeFridayPrepContext({
  profile,
  goals,
  weekActivities,
  prevWeeksActivities,
  healthLogs,
  computed,
}) {
  const lines = []

  lines.push('=== ATHLETE PROFILE ===')
  if (profile) {
    lines.push(`Name: ${profile.display_name ?? 'Athlete'}`)
    if (profile.max_hr) lines.push(`Max HR: ${profile.max_hr} bpm`)
    if (profile.resting_hr_baseline) lines.push(`Resting HR: ${profile.resting_hr_baseline} bpm`)
  }

  if (goals.length > 0) {
    for (const g of goals) {
      const parts = [g.goal_type]
      if (g.target_date) parts.push(`race date ${g.target_date}`)
      if (computed.raceDays != null) parts.push(`${computed.raceDays} days away`)
      if (g.target_distance_m) parts.push(`${(g.target_distance_m / 1000).toFixed(0)}km`)
      lines.push(`Active goal: ${parts.join(', ')}`)
    }
  } else {
    lines.push('Active goals: none')
  }

  lines.push('')
  lines.push('=== TRAINING LOAD ===')
  lines.push(`Prompt mode: ${computed.mode.toUpperCase()}`)
  lines.push(`This week (Mon–Fri): ${weekActivities.length} sessions, ${computed.weekKm}km`)
  if (computed.acwr != null) {
    lines.push(`ACWR: ${computed.acwr} (acute / chronic weekly load ratio)`)
  } else {
    lines.push('ACWR: insufficient data')
  }
  if (computed.gapDays != null) {
    lines.push(`Days since last run: ${computed.gapDays}`)
  }

  if (computed.efDelta.currentEF != null) {
    lines.push(`Current EF: ${computed.efDelta.currentEF}`)
    if (computed.efDelta.prevEF != null) {
      const sign = computed.efDelta.delta >= 0 ? '+' : ''
      lines.push(`EF vs previous 4 weeks: ${sign}${computed.efDelta.delta}%`)
    }
  }

  if (computed.zoneDist) {
    const z = computed.zoneDist
    lines.push(
      `Zone distribution this week: Z1 ${z.z1}% | Z2 ${z.z2}% | Z3 ${z.z3}% | Z4 ${z.z4}% | Z5 ${z.z5}%`
    )
  }

  lines.push('')
  lines.push("=== THIS WEEK'S SESSIONS (Mon–Fri) ===")
  if (weekActivities.length > 0) {
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
    }
  } else {
    lines.push('No sessions logged this week yet')
  }

  if (prevWeeksActivities.length > 0) {
    lines.push('')
    lines.push('=== PREVIOUS 4 WEEKS (weekly summary) ===')
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
    lines.push('=== RECENT HEALTH LOG (last 3 days) ===')
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
