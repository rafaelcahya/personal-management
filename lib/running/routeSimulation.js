import { haversineDistance } from './geo'

// Minetti et al. energy cost of running (J/kg/m) as a function of gradient
// `i` (rise/run, a fraction). Cost at 0% is 3.6, so the grade-adjustment
// factor is the cost at grade `i` divided by that flat baseline.
const CR_FLAT = 3.6
const MAX_GRADE = 0.3 // clamp to keep GPS noise and cliffs from blowing up the model

function clampGrade(grade) {
  return Math.max(-MAX_GRADE, Math.min(MAX_GRADE, grade))
}

function costOfRunning(grade) {
  const i = clampGrade(grade)
  return 155.4 * i ** 5 - 30.4 * i ** 4 - 43.3 * i ** 3 + 46.3 * i ** 2 + 19.5 * i + 3.6
}

export function gradeAdjustmentFactor(grade) {
  return costOfRunning(grade) / CR_FLAT
}

function zoneForGrade(grade) {
  if (grade > 0.02) return 'climb'
  if (grade < -0.02) return 'descend'
  return 'cruise'
}

// Moving-average smoothing over a series, radius `r` on each side. Elevation
// from GPS/barometer is noisy; smoothing keeps per-segment gradients sane.
function smoothSeries(arr, r) {
  if (r <= 0) return arr.slice()
  const out = []
  for (let i = 0; i < arr.length; i++) {
    let sum = 0
    let n = 0
    for (let j = Math.max(0, i - r); j <= Math.min(arr.length - 1, i + r); j++) {
      sum += arr[j]
      n += 1
    }
    out.push(sum / n)
  }
  return out
}

/**
 * Convert GPX-style points [{ lat, lon, ele }] into a cumulative
 * distance/elevation series [{ distM, ele }] using haversine spacing.
 */
export function pointsToDistEle(points) {
  const pts = (points ?? []).filter((p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon))
  if (pts.length < 2) return []
  const series = [{ distM: 0, ele: pts[0].ele }]
  let cum = 0
  for (let i = 1; i < pts.length; i++) {
    cum += haversineDistance([pts[i - 1].lat, pts[i - 1].lon], [pts[i].lat, pts[i].lon])
    series.push({ distM: cum, ele: pts[i].ele })
  }
  return series
}

/**
 * Resample a { distM, ele } series onto a fixed-spacing grid and return the
 * per-segment gradient/GAF. Elevation is linearly interpolated then smoothed.
 */
export function buildSegments(series, { stationM = 100 } = {}) {
  const clean = (series ?? []).filter((p) => Number.isFinite(p.distM))
  if (clean.length < 2) throw new Error('Route has too few points to simulate')

  const total = clean[clean.length - 1].distM
  if (total < 100) throw new Error('Route is too short to simulate')

  const withEle = clean.filter((p) => Number.isFinite(p.ele))
  if (withEle.length < 2) throw new Error('Route has no usable elevation data')

  function eleAt(d) {
    if (d <= withEle[0].distM) return withEle[0].ele
    if (d >= withEle[withEle.length - 1].distM) return withEle[withEle.length - 1].ele
    for (let i = 1; i < withEle.length; i++) {
      if (withEle[i].distM >= d) {
        const a = withEle[i - 1]
        const b = withEle[i]
        const t = (d - a.distM) / (b.distM - a.distM || 1)
        return a.ele + t * (b.ele - a.ele)
      }
    }
    return withEle[withEle.length - 1].ele
  }

  const stationCount = Math.max(2, Math.ceil(total / stationM) + 1)
  const stationDist = []
  const rawEle = []
  for (let i = 0; i < stationCount; i++) {
    const d = Math.min(i * stationM, total)
    stationDist.push(d)
    rawEle.push(eleAt(d))
  }
  const ele = smoothSeries(rawEle, 2)

  const segments = []
  for (let i = 1; i < stationDist.length; i++) {
    const distM = stationDist[i] - stationDist[i - 1]
    if (distM <= 0) continue
    const dEle = ele[i] - ele[i - 1]
    const grade = dEle / distM
    segments.push({
      startM: stationDist[i - 1],
      endM: stationDist[i],
      distM,
      dEle,
      eleM: ele[i],
      grade,
      gaf: gradeAdjustmentFactor(grade),
    })
  }
  return { segments, total, startEle: ele[0] }
}

function computeHrBand({ effortPace, thresholdPaceSec, maxHr }) {
  if (!maxHr) return null
  let loPct
  let hiPct
  let label
  if (thresholdPaceSec) {
    const ratio = thresholdPaceSec / effortPace // > 1 means faster than threshold
    if (ratio >= 1.0) {
      loPct = 0.88
      hiPct = 0.95
      label = 'Threshold+'
    } else if (ratio >= 0.95) {
      loPct = 0.85
      hiPct = 0.92
      label = 'Threshold'
    } else if (ratio >= 0.88) {
      loPct = 0.8
      hiPct = 0.88
      label = 'Steady'
    } else {
      loPct = 0.72
      hiPct = 0.82
      label = 'Easy'
    }
  } else {
    loPct = 0.8
    hiPct = 0.9
    label = 'Steady'
  }
  return { low: Math.round(maxHr * loPct), high: Math.round(maxHr * hiPct), label }
}

function buildKmSplits(detailed, total, hrBand) {
  const splits = []
  const kmCount = Math.ceil(total / 1000)
  for (let k = 0; k < kmCount; k++) {
    const lo = k * 1000
    const hi = (k + 1) * 1000
    let dist = 0
    let time = 0
    let gain = 0
    let loss = 0
    for (const s of detailed) {
      const os = Math.max(s.startM, lo)
      const oe = Math.min(s.endM, hi)
      if (oe <= os) continue
      const frac = (oe - os) / s.distM
      dist += oe - os
      time += s.timeSec * frac
      if (s.dEle > 0) gain += s.dEle * frac
      else loss += -s.dEle * frac
    }
    if (dist <= 0) continue
    splits.push({
      km: k + 1,
      distance_m: Math.round(dist),
      pace_sec_per_km: Math.round(time / (dist / 1000)),
      ele_gain_m: Math.round(gain),
      ele_loss_m: Math.round(loss),
      target_hr_low: hrBand?.low ?? null,
      target_hr_high: hrBand?.high ?? null,
    })
  }
  return splits
}

// Keep the stored/plotted profile small regardless of route length.
function downsampleProfile(detailed, startEle, maxPoints = 250) {
  const points = [
    {
      cum_dist_m: 0,
      ele_m: Math.round(startEle),
      grade: 0,
      gaf: 1,
      pace_sec_per_km: detailed[0]?.paceSecPerKm ?? null,
      zone: 'cruise',
      energy_pct: 0,
    },
  ]
  const step = Math.max(1, Math.ceil(detailed.length / maxPoints))
  for (let i = 0; i < detailed.length; i += step) {
    const s = detailed[i]
    points.push({
      cum_dist_m: Math.round(s.endM),
      ele_m: Math.round(s.eleM),
      grade: Number((s.grade * 100).toFixed(1)),
      gaf: Number(s.gaf.toFixed(3)),
      pace_sec_per_km: Math.round(s.paceSecPerKm),
      zone: zoneForGrade(s.grade),
      energy_pct: Number(s.energyPct.toFixed(1)),
    })
  }
  const last = detailed[detailed.length - 1]
  if (last && points[points.length - 1].cum_dist_m !== Math.round(last.endM)) {
    points.push({
      cum_dist_m: Math.round(last.endM),
      ele_m: Math.round(last.eleM),
      grade: Number((last.grade * 100).toFixed(1)),
      gaf: Number(last.gaf.toFixed(3)),
      pace_sec_per_km: Math.round(last.paceSecPerKm),
      zone: zoneForGrade(last.grade),
      energy_pct: Number(last.energyPct.toFixed(1)),
    })
  }
  return points
}

/**
 * Core simulation. Given an elevation series and a target (pace or time),
 * solve for the even-effort flat-equivalent pace E and produce the full plan.
 *
 * Because the grade-adjustment factor here is speed-independent, total time is
 * linear in E, so E has a closed form: E = T_target / Σ (d_i/1000 · GAF_i).
 */
export function simulateRoute({
  series,
  targetMode,
  targetPaceSecPerKm,
  targetTimeSec,
  thresholdPaceSec = null,
  maxHr = null,
}) {
  const { segments, total, startEle } = buildSegments(series)
  const totalKm = total / 1000

  let elevGain = 0
  let elevLoss = 0
  let weighted = 0 // Σ (d/1000) · GAF
  let totalEnergy = 0
  for (const s of segments) {
    if (s.dEle > 0) elevGain += s.dEle
    else elevLoss += -s.dEle
    weighted += (s.distM / 1000) * s.gaf
    totalEnergy += costOfRunning(s.grade) * s.distM
  }

  const targetTime = targetMode === 'time' ? targetTimeSec : targetPaceSecPerKm * totalKm
  const effortPace = targetTime / weighted // sec/km on flat ground at this effort

  let cumEnergy = 0
  const detailed = segments.map((s) => {
    const paceSecPerKm = effortPace * s.gaf
    const timeSec = (s.distM / 1000) * paceSecPerKm
    cumEnergy += costOfRunning(s.grade) * s.distM
    return {
      ...s,
      paceSecPerKm,
      timeSec,
      energyPct: totalEnergy > 0 ? (cumEnergy / totalEnergy) * 100 : 0,
    }
  })

  const predictedTime = Math.round(detailed.reduce((sum, s) => sum + s.timeSec, 0))

  let isRealistic = true
  let suggestedTime = null
  if (thresholdPaceSec && effortPace < thresholdPaceSec) {
    isRealistic = false
    suggestedTime = Math.round(thresholdPaceSec * weighted)
  }

  const hrBand = computeHrBand({ effortPace, thresholdPaceSec, maxHr })

  return {
    total_distance_m: Math.round(total),
    total_elevation_gain_m: Math.round(elevGain),
    total_elevation_loss_m: Math.round(elevLoss),
    effort_flat_pace_sec_per_km: Math.round(effortPace),
    predicted_time_sec: predictedTime,
    is_realistic: isRealistic,
    suggested_time_sec: suggestedTime,
    hr_band: hrBand,
    elevation_profile: downsampleProfile(detailed, startEle),
    km_splits: buildKmSplits(detailed, total, hrBand),
  }
}
