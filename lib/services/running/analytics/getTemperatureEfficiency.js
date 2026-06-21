const RUN_TYPES = ['Run', 'TrailRun', 'VirtualRun']

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

function classifyTimeOfDay(startedAt) {
  const wibHour = new Date(new Date(startedAt).getTime() + WIB_OFFSET_MS).getUTCHours()
  // pagi = 05–11 WIB, malam = everything else
  return wibHour >= 5 && wibHour <= 11 ? 'pagi' : 'malam'
}

function avg(arr) {
  if (!arr.length) return null
  return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 100) / 100
}

function fmtPaceAvg(arr) {
  if (!arr.length) return null
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
}

export async function getTemperatureEfficiency(supabase, userId) {
  const { data: rows, error } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, avg_pace_sec_per_km, avg_hr, avg_temp_c')
    .eq('user_id', userId)
    .in('activity_type', RUN_TYPES)
    .not('avg_hr', 'is', null)
    .not('avg_pace_sec_per_km', 'is', null)
    .not('avg_temp_c', 'is', null)
    .order('started_at', { ascending: true })

  if (error) throw new Error(`[getTemperatureEfficiency] DB query failed: ${error.message}`)

  const runs = (rows ?? []).map((r) => ({
    started_at: r.started_at,
    distance_km: Math.round((r.distance_m / 1000) * 10) / 10,
    avg_pace_sec: r.avg_pace_sec_per_km,
    avg_hr: r.avg_hr,
    avg_temp_c: r.avg_temp_c,
    pace_hr_ratio: Math.round((r.avg_pace_sec_per_km / r.avg_hr) * 1000) / 1000,
    time_of_day: classifyTimeOfDay(r.started_at),
  }))

  // Group runs into 1-degree temperature buckets
  const bucketMap = {}
  for (const run of runs) {
    const key = Math.round(run.avg_temp_c)
    if (!bucketMap[key]) bucketMap[key] = []
    bucketMap[key].push(run.pace_hr_ratio)
  }

  const tempGroups = Object.entries(bucketMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([temp, ratios]) => {
      const sorted = [...ratios].sort((a, b) => a - b)
      const n = sorted.length
      const q1 = sorted[Math.floor(n * 0.25)]
      const median =
        n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
      const q3 = sorted[Math.floor(n * 0.75)]
      return {
        temp_c: Number(temp),
        n,
        q1: Math.round(q1 * 1000) / 1000,
        median: Math.round(median * 1000) / 1000,
        q3: Math.round(q3 * 1000) / 1000,
        min: Math.round(sorted[0] * 1000) / 1000,
        max: Math.round(sorted[n - 1] * 1000) / 1000,
      }
    })

  // Pagi vs malam summary
  const pagiRuns = runs.filter((r) => r.time_of_day === 'pagi')
  const malamRuns = runs.filter((r) => r.time_of_day === 'malam')

  const summary = {
    morning: {
      count: pagiRuns.length,
      avg_temp_c: avg(pagiRuns.map((r) => r.avg_temp_c)),
      avg_pace_sec: fmtPaceAvg(pagiRuns.map((r) => r.avg_pace_sec)),
      avg_hr: avg(pagiRuns.map((r) => r.avg_hr)),
      avg_ratio: avg(pagiRuns.map((r) => r.pace_hr_ratio)),
    },
    evening: {
      count: malamRuns.length,
      avg_temp_c: avg(malamRuns.map((r) => r.avg_temp_c)),
      avg_pace_sec: fmtPaceAvg(malamRuns.map((r) => r.avg_pace_sec)),
      avg_hr: avg(malamRuns.map((r) => r.avg_hr)),
      avg_ratio: avg(malamRuns.map((r) => r.pace_hr_ratio)),
    },
    overall_avg_ratio: avg(runs.map((r) => r.pace_hr_ratio)),
    hr_run_count: runs.length,
  }

  // Reference band: p25–p75 of all ratios (user's own efficiency zone)
  const allRatios = [...runs.map((r) => r.pace_hr_ratio)].sort((a, b) => a - b)
  const refBand =
    allRatios.length >= 3
      ? {
          low: Math.round(allRatios[Math.floor(allRatios.length * 0.25)] * 1000) / 1000,
          high: Math.round(allRatios[Math.floor(allRatios.length * 0.75)] * 1000) / 1000,
        }
      : null

  return { runs, temp_groups: tempGroups, summary, ref_band: refBand }
}
