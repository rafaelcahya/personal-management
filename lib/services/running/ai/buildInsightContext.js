import { createAdminClient } from '@/lib/supabase/admin'

export async function buildInsightContext(activityId, userId, options = {}) {
  const { compareActivityId, perceivedEffort, userNote } = options
  const supabase = createAdminClient()

  const activity = await getActivity(supabase, activityId, userId)
  if (!activity) return { context: null, profile: null }

  const [splits, recentActivities, trainingLoad, healthLog, goals, profile, compareActivity] =
    await Promise.all([
      getSplits(supabase, activityId),
      getRecentActivities(supabase, userId, activity.activity_type),
      getTrainingLoad(supabase, userId),
      getHealthLog(supabase, userId, activity.started_at),
      getGoals(supabase, userId),
      getProfile(supabase, userId),
      compareActivityId ? getActivity(supabase, compareActivityId, userId) : Promise.resolve(null),
    ])

  const comparisonDeltas = compareActivity ? buildComparisonDeltas(activity, compareActivity) : null

  const context = serializeToPlainText({
    activity,
    splits,
    recentActivities,
    trainingLoad,
    healthLog,
    goals,
    profile,
    perceivedEffort: perceivedEffort ?? activity.perceived_effort ?? null,
    userNote: userNote ?? activity.user_note ?? null,
    compareActivity,
    comparisonDeltas,
  })

  return { context, profile }
}

function buildComparisonDeltas(current, compare) {
  const distDelta =
    current.distance_m != null && compare.distance_m != null
      ? ((current.distance_m - compare.distance_m) / 1000).toFixed(2)
      : null
  const paceDelta =
    current.avg_pace_sec_per_km != null && compare.avg_pace_sec_per_km != null
      ? current.avg_pace_sec_per_km - compare.avg_pace_sec_per_km
      : null
  const hrDelta =
    current.avg_hr != null && compare.avg_hr != null ? current.avg_hr - compare.avg_hr : null
  const durationDelta =
    current.duration_sec != null && compare.duration_sec != null
      ? current.duration_sec - compare.duration_sec
      : null

  return { distDelta, paceDelta, hrDelta, durationDelta }
}

async function getActivity(supabase, activityId, userId) {
  const { data } = await supabase
    .from('rt_activities')
    .select('*')
    .eq('id', activityId)
    .eq('user_id', userId)
    .single()
  return data
}

async function getSplits(supabase, activityId) {
  const { data } = await supabase
    .from('rt_activity_splits')
    .select('*')
    .eq('activity_id', activityId)
    .order('split_number')
  return data ?? []
}

async function getRecentActivities(supabase, userId, activityType, limit = 5) {
  if (!activityType) return []
  const from = new Date()
  from.setDate(from.getDate() - 28)

  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, avg_pace_sec_per_km, avg_hr, activity_type')
    .eq('user_id', userId)
    .eq('activity_type', activityType)
    .gte('started_at', from.toISOString())
    .order('started_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

async function getTrainingLoad(supabase, userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('rt_daily_training_metrics')
    .select('acwr, acute_load_7d, chronic_load_28d, training_load')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()
  return data
}

async function getHealthLog(supabase, userId, startedAt) {
  if (!startedAt) return null
  const logDate = new Date(startedAt).toISOString().split('T')[0]
  const { data } = await supabase
    .from('rt_subjective_health_logs')
    .select('sleep_hours, sleep_quality, morning_energy, mood, soreness_level, notes')
    .eq('user_id', userId)
    .eq('log_date', logDate)
    .maybeSingle()
  return data
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
  const { data: profile } = await supabase
    .from('rt_users')
    .select('display_name, birth_date, max_hr, resting_hr_baseline, height_cm, weight_kg')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) return null

  const { count } = await supabase
    .from('rt_activities')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  return { ...profile, activityCount: count ?? 0 }
}

// ─── serialization helpers ────────────────────────────────────────────────────

function formatPace(secPerKm) {
  if (!secPerKm || secPerKm <= 0) return null
  const m = Math.floor(secPerKm / 60)
  const s = String(secPerKm % 60).padStart(2, '0')
  return `${m}:${s}`
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDate(isoString) {
  if (!isoString) return null
  const date = new Date(isoString)
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function acwrStatus(acwr) {
  if (!acwr) return 'Tidak ada data'
  if (acwr < 0.8) return 'Rendah'
  if (acwr <= 1.3) return 'Optimal'
  return 'Tinggi'
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

function serializeToPlainText({
  activity,
  splits,
  recentActivities,
  trainingLoad,
  healthLog,
  goals,
  profile,
  perceivedEffort,
  userNote,
  compareActivity,
  comparisonDeltas,
}) {
  const lines = []

  // Profile section
  lines.push('=== PROFIL ATLET ===')
  if (profile) {
    const age = calcAge(profile.birth_date)
    lines.push(`Nama: ${profile.display_name ?? 'Atlet'}`)
    if (age) lines.push(`Umur: ${age} tahun`)
    const hrParts = []
    if (profile.max_hr) hrParts.push(`Max HR: ${profile.max_hr} bpm`)
    if (profile.resting_hr_baseline) hrParts.push(`Resting HR: ${profile.resting_hr_baseline} bpm`)
    if (hrParts.length > 0) lines.push(hrParts.join(' | '))
  }
  if (goals.length > 0) {
    const goalsSummary = goals
      .map((g) => [g.goal_type, g.target_date].filter(Boolean).join(' '))
      .join(', ')
    lines.push(`Goal aktif: ${goalsSummary}`)
  } else {
    lines.push('Goal aktif: Belum ada goal aktif')
  }

  // Health log section
  lines.push('')
  lines.push('=== KONDISI HARI INI ===')
  if (healthLog) {
    const parts = []
    if (healthLog.sleep_hours) parts.push(`Tidur: ${healthLog.sleep_hours}j`)
    if (healthLog.sleep_quality) parts.push(`(${healthLog.sleep_quality}/5)`)
    if (healthLog.morning_energy) parts.push(`Energi: ${healthLog.morning_energy}/5`)
    if (healthLog.mood) parts.push(`Mood: ${healthLog.mood}/5`)
    if (healthLog.soreness_level) parts.push(`Soreness: ${healthLog.soreness_level}/5`)
    lines.push(parts.join(' | '))
    if (healthLog.notes) lines.push(healthLog.notes)
  } else {
    lines.push('Tidak ada data subjektif untuk hari ini')
  }

  // Activity section
  lines.push('')
  lines.push('=== AKTIVITAS HARI INI ===')
  if (activity) {
    const distKm = activity.distance_m ? (activity.distance_m / 1000).toFixed(2) : null
    const pace = formatPace(activity.avg_pace_sec_per_km)
    const maxPace = formatPace(activity.max_pace_sec_per_km)
    const duration = formatDuration(activity.duration_sec)
    const movingTime = formatDuration(activity.moving_time_sec)

    lines.push(`Tipe: ${activity.activity_type ?? 'Run'}`)
    lines.push(`Tanggal: ${formatDate(activity.started_at)}`)

    const distLine = [
      distKm ? `Jarak: ${distKm} km` : null,
      duration ? `Durasi: ${duration}` : null,
      movingTime ? `Moving time: ${movingTime}` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (distLine) lines.push(distLine)

    const paceLine = [
      pace ? `Pace avg: ${pace}/km` : null,
      maxPace ? `Pace max: ${maxPace}/km` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (paceLine) lines.push(paceLine)

    const hrLine = [
      activity.avg_hr ? `HR avg: ${activity.avg_hr} bpm` : null,
      activity.max_hr ? `HR max: ${activity.max_hr} bpm` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (hrLine) lines.push(hrLine)

    const extraLine = [
      activity.avg_cadence ? `Cadence avg: ${activity.avg_cadence} spm` : null,
      activity.elevation_gain_m ? `Elevation gain: ${activity.elevation_gain_m}m` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (extraLine) lines.push(extraLine)

    if (activity.notes) lines.push(`Catatan: "${activity.notes}"`)

    if (perceivedEffort != null || userNote) {
      lines.push('')
      lines.push('=== SUBJECTIVE FEEDBACK FROM RUNNER ===')
      if (perceivedEffort != null) lines.push(`Perceived effort: ${perceivedEffort}/10`)
      if (userNote) lines.push(`<user_note>${userNote}</user_note>`)
    }

    // Splits
    if (splits.length > 0) {
      const splitParts = splits
        .map((s) => {
          const p = formatPace(s.pace_sec_per_km)
          const km = s.split_number
          return p ? `km ${km}: ${p}/km${s.avg_hr ? `, HR ${s.avg_hr}` : ''}` : null
        })
        .filter(Boolean)
      if (splitParts.length > 0) {
        lines.push('')
        lines.push('Splits:')
        lines.push(splitParts.join(' | '))
      }
    }
  }

  // Baseline section
  if (recentActivities.length > 0) {
    lines.push('')
    lines.push(`=== BASELINE (${activity?.activity_type ?? 'Run'}, 4 minggu terakhir) ===`)
    lines.push(`${recentActivities.length} sesi tercatat:`)
    for (const a of recentActivities) {
      const date = a.started_at
        ? new Date(a.started_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : ''
      const dist = a.distance_m ? `${(a.distance_m / 1000).toFixed(1)}km` : null
      const pace = formatPace(a.avg_pace_sec_per_km)
      const hr = a.avg_hr ? `HR avg ${a.avg_hr}` : null
      const parts = [dist, pace ? `pace ${pace}/km` : null, hr].filter(Boolean).join(' | ')
      lines.push(`${date}: ${parts}`)
    }

    const avgPaceSec = recentActivities.map((a) => a.avg_pace_sec_per_km).filter(Boolean)
    const avgHr = recentActivities.map((a) => a.avg_hr).filter(Boolean)
    const avgPaceFormatted =
      avgPaceSec.length > 0
        ? formatPace(Math.round(avgPaceSec.reduce((a, b) => a + b, 0) / avgPaceSec.length))
        : null
    const avgHrFormatted =
      avgHr.length > 0 ? Math.round(avgHr.reduce((a, b) => a + b, 0) / avgHr.length) : null
    const baselineParts = [
      avgPaceFormatted ? `pace ${avgPaceFormatted}/km` : null,
      avgHrFormatted ? `HR avg ${avgHrFormatted} bpm` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (baselineParts) lines.push(`Rata-rata baseline: ${baselineParts}`)
  }

  // Comparison activity section
  if (compareActivity && comparisonDeltas) {
    lines.push('')
    lines.push('=== COMPARISON ACTIVITY ===')
    const cDistKm = compareActivity.distance_m
      ? (compareActivity.distance_m / 1000).toFixed(2)
      : null
    const cPace = formatPace(compareActivity.avg_pace_sec_per_km)
    const cDuration = formatDuration(compareActivity.duration_sec)
    const cDate = compareActivity.started_at
      ? new Date(compareActivity.started_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null

    if (cDate) lines.push(`Date: ${cDate}`)
    const cLine = [
      cDistKm ? `Distance: ${cDistKm} km` : null,
      cDuration ? `Duration: ${cDuration}` : null,
      cPace ? `Avg pace: ${cPace}/km` : null,
      compareActivity.avg_hr ? `Avg HR: ${compareActivity.avg_hr} bpm` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (cLine) lines.push(cLine)

    lines.push('')
    lines.push('=== DELTAS (current vs comparison) ===')
    const { distDelta, paceDelta, hrDelta, durationDelta } = comparisonDeltas
    if (distDelta != null) lines.push(`Distance: ${distDelta > 0 ? '+' : ''}${distDelta} km`)
    if (paceDelta != null) {
      const sign = paceDelta > 0 ? '+' : ''
      lines.push(`Avg pace: ${sign}${paceDelta}s/km (${paceDelta > 0 ? 'slower' : 'faster'})`)
    }
    if (hrDelta != null) lines.push(`Avg HR: ${hrDelta > 0 ? '+' : ''}${hrDelta} bpm`)
    if (durationDelta != null) {
      const sign = durationDelta > 0 ? '+' : ''
      lines.push(
        `Duration: ${sign}${formatDuration(Math.abs(durationDelta))} (${durationDelta > 0 ? 'longer' : 'shorter'})`
      )
    }
  }

  // Training load section
  if (trainingLoad) {
    lines.push('')
    lines.push('=== TRAINING LOAD ===')
    if (trainingLoad.acwr != null) {
      lines.push(`ACWR sekarang: ${trainingLoad.acwr} (${acwrStatus(trainingLoad.acwr)})`)
    }
    const loadParts = [
      trainingLoad.acute_load_7d != null ? `Acute load 7d: ${trainingLoad.acute_load_7d}` : null,
      trainingLoad.chronic_load_28d != null
        ? `Chronic load 28d: ${trainingLoad.chronic_load_28d}`
        : null,
    ]
      .filter(Boolean)
      .join(' | ')
    if (loadParts) lines.push(loadParts)
  }

  return lines.join('\n')
}
