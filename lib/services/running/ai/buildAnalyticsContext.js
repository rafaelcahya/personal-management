import { createAdminClient } from '@/lib/supabase/admin'

const WEEKLY_DISTANCE_WEEKS = 12
const PACE_TREND_LIMIT = 20
const EF_TREND_LIMIT = 20
const VO2MAX_TREND_LIMIT = 20
const TRAINING_LOAD_DAYS = 30

export async function buildAnalyticsContext(userId) {
  const supabase = createAdminClient()

  const [weeklyDistances, paceTrend, trainingLoadHistory, vo2maxTrend, efTrend, goals, profile] =
    await Promise.all([
      getWeeklyDistances(supabase, userId),
      getPaceTrend(supabase, userId),
      getTrainingLoadHistory(supabase, userId),
      getVo2maxTrend(supabase, userId),
      getEfTrend(supabase, userId),
      getGoals(supabase, userId),
      getProfile(supabase, userId),
    ])

  return serializeAnalyticsContext({
    weeklyDistances,
    paceTrend,
    trainingLoadHistory,
    vo2maxTrend,
    efTrend,
    goals,
    profile,
  })
}

async function getWeeklyDistances(supabase, userId) {
  const from = new Date()
  from.setDate(from.getDate() - WEEKLY_DISTANCE_WEEKS * 7)

  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, activity_type')
    .eq('user_id', userId)
    .gte('started_at', from.toISOString())
    .order('started_at', { ascending: true })

  if (!data || data.length === 0) return []

  const byWeek = {}
  for (const a of data) {
    const d = new Date(a.started_at)
    const dayOfWeek = d.getDay()
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7))
    const weekKey = monday.toISOString().split('T')[0]
    if (!byWeek[weekKey]) byWeek[weekKey] = 0
    byWeek[weekKey] += a.distance_m ?? 0
  }

  return Object.entries(byWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, totalM]) => ({
      week_start: weekStart,
      distance_km: Math.round((totalM / 1000) * 10) / 10,
    }))
}

async function getPaceTrend(supabase, userId) {
  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, avg_pace_sec_per_km, activity_type')
    .eq('user_id', userId)
    .eq('activity_type', 'Run')
    .not('avg_pace_sec_per_km', 'is', null)
    .order('started_at', { ascending: false })
    .limit(PACE_TREND_LIMIT)

  return (data ?? []).reverse()
}

async function getTrainingLoadHistory(supabase, userId) {
  const from = new Date()
  from.setDate(from.getDate() - TRAINING_LOAD_DAYS)

  const { data } = await supabase
    .from('rt_daily_training_metrics')
    .select('date, acwr, acute_load_7d, chronic_load_28d')
    .eq('user_id', userId)
    .gte('date', from.toISOString().split('T')[0])
    .order('date', { ascending: true })

  return data ?? []
}

async function getVo2maxTrend(supabase, userId) {
  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, estimated_vo2max')
    .eq('user_id', userId)
    .eq('activity_type', 'Run')
    .not('estimated_vo2max', 'is', null)
    .order('started_at', { ascending: false })
    .limit(VO2MAX_TREND_LIMIT)

  return (data ?? []).reverse()
}

async function getEfTrend(supabase, userId) {
  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, efficiency_factor')
    .eq('user_id', userId)
    .eq('activity_type', 'Run')
    .not('efficiency_factor', 'is', null)
    .order('started_at', { ascending: false })
    .limit(EF_TREND_LIMIT)

  return (data ?? []).reverse()
}

async function getGoals(supabase, userId) {
  const { data } = await supabase
    .from('rt_goals')
    .select('goal_type, target_date, target_distance_m, target_time_sec, notes')
    .eq('user_id', userId)
    .eq('status', 'active')

  return data ?? []
}

async function getProfile(supabase, userId) {
  const { data } = await supabase
    .from('rt_users')
    .select('display_name, birth_date, max_hr, resting_hr_baseline')
    .eq('id', userId)
    .maybeSingle()

  return data
}

// ─── serialization helpers ────────────────────────────────────────────────────

function formatPace(secPerKm) {
  if (!secPerKm || secPerKm <= 0) return null
  const m = Math.floor(secPerKm / 60)
  const s = String(secPerKm % 60).padStart(2, '0')
  return `${m}:${s}`
}

function formatDate(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function acwrStatus(acwr) {
  if (acwr == null) return null
  if (acwr < 0.8) return 'Undertrained'
  if (acwr <= 1.3) return 'Optimal'
  if (acwr <= 1.5) return 'Caution'
  return 'Danger'
}

function calcAge(birthDate) {
  if (!birthDate) return null
  const now = new Date()
  const birth = new Date(birthDate)
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function serializeAnalyticsContext({
  weeklyDistances,
  paceTrend,
  trainingLoadHistory,
  vo2maxTrend,
  efTrend,
  goals,
  profile,
}) {
  const lines = []

  // Profile
  lines.push('=== ATHLETE PROFILE ===')
  if (profile) {
    const age = calcAge(profile.birth_date)
    lines.push(`Name: ${profile.display_name ?? 'Athlete'}`)
    if (age) lines.push(`Age: ${age}`)
    if (profile.max_hr) lines.push(`Max HR: ${profile.max_hr} bpm`)
  }
  if (goals.length > 0) {
    lines.push('Active goals:')
    for (const g of goals) {
      const parts = [g.goal_type]
      if (g.target_date) parts.push(`target ${g.target_date}`)
      if (g.target_distance_m) parts.push(`${(g.target_distance_m / 1000).toFixed(0)}km`)
      lines.push(`- ${parts.join(', ')}`)
    }
  } else {
    lines.push('Active goals: none')
  }

  // Weekly distance
  lines.push('')
  lines.push(`=== WEEKLY DISTANCE (last ${WEEKLY_DISTANCE_WEEKS} weeks) ===`)
  if (weeklyDistances.length > 0) {
    for (const w of weeklyDistances) {
      lines.push(`Week of ${w.week_start}: ${w.distance_km} km`)
    }
    const distances = weeklyDistances.map((w) => w.distance_km)
    const avg = Math.round((distances.reduce((a, b) => a + b, 0) / distances.length) * 10) / 10
    const max = Math.max(...distances)
    const min = Math.min(...distances)
    lines.push(`Average: ${avg} km/week | Max: ${max} km | Min: ${min} km`)
  } else {
    lines.push('No data')
  }

  // Pace trend
  lines.push('')
  lines.push(`=== PACE TREND (last ${paceTrend.length} runs) ===`)
  if (paceTrend.length > 0) {
    for (const a of paceTrend) {
      const date = formatDate(a.started_at)
      const pace = formatPace(a.avg_pace_sec_per_km)
      lines.push(`${date}: ${pace ?? 'N/A'}/km`)
    }
    const paces = paceTrend.map((a) => a.avg_pace_sec_per_km).filter(Boolean)
    if (paces.length > 0) {
      const avgPace = Math.round(paces.reduce((a, b) => a + b, 0) / paces.length)
      lines.push(`Average pace: ${formatPace(avgPace)}/km`)
      const recent = paces.slice(-5)
      const older = paces.slice(0, -5)
      if (older.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
        const delta = Math.round(recentAvg - olderAvg)
        const trend = delta < 0 ? 'faster' : delta > 0 ? 'slower' : 'stable'
        lines.push(`Trend: ${Math.abs(delta)}s/km ${trend} vs earlier runs`)
      }
    }
  } else {
    lines.push('No data')
  }

  // Training load
  lines.push('')
  lines.push(`=== TRAINING LOAD (last ${TRAINING_LOAD_DAYS} days) ===`)
  if (trainingLoadHistory.length > 0) {
    const latest = trainingLoadHistory[trainingLoadHistory.length - 1]
    lines.push(`Current ACWR: ${latest.acwr ?? 'N/A'} (${acwrStatus(latest.acwr) ?? 'N/A'})`)
    lines.push(
      `Acute 7d: ${latest.acute_load_7d ?? 'N/A'} | Chronic 28d: ${latest.chronic_load_28d ?? 'N/A'}`
    )
    const acwrValues = trainingLoadHistory.map((d) => d.acwr).filter((v) => v != null)
    if (acwrValues.length > 1) {
      const peak = Math.max(...acwrValues)
      lines.push(`Peak ACWR in period: ${Math.round(peak * 100) / 100}`)
    }
  } else {
    lines.push('No data')
  }

  // VO2max trend
  lines.push('')
  lines.push(`=== VO2MAX TREND (last ${vo2maxTrend.length} data points) ===`)
  if (vo2maxTrend.length > 0) {
    for (const a of vo2maxTrend) {
      lines.push(`${formatDate(a.started_at)}: ${a.estimated_vo2max} mL/kg/min`)
    }
    const values = vo2maxTrend.map((a) => Number(a.estimated_vo2max))
    const current = values[values.length - 1]
    const oldest = values[0]
    const delta = Math.round((current - oldest) * 10) / 10
    const trend = delta > 0.5 ? 'improving' : delta < -0.5 ? 'declining' : 'stable'
    lines.push(
      `Current: ${current} | Oldest: ${oldest} | Trend: ${trend} (${delta > 0 ? '+' : ''}${delta})`
    )
  } else {
    lines.push('No data (requires HR data on activities)')
  }

  // EF trend
  lines.push('')
  lines.push(`=== EFFICIENCY FACTOR TREND (last ${efTrend.length} data points) ===`)
  if (efTrend.length > 0) {
    for (const a of efTrend) {
      lines.push(`${formatDate(a.started_at)}: ${a.efficiency_factor}`)
    }
    const values = efTrend.map((a) => Number(a.efficiency_factor))
    const current = values[values.length - 1]
    const oldest = values[0]
    const delta = Math.round((current - oldest) * 10000) / 10000
    const trend = delta > 0.005 ? 'improving' : delta < -0.005 ? 'declining' : 'stable'
    lines.push(
      `Current: ${current} | Oldest: ${oldest} | Trend: ${trend} (${delta > 0 ? '+' : ''}${delta})`
    )
  } else {
    lines.push('No data (requires HR data on activities)')
  }

  return lines.join('\n')
}
