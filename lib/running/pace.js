export const KM_TO_MI = 0.621371
export const MI_TO_KM = 1.60934

export const RACE_DISTANCES = [
  { label: '5K', m: 5000 },
  { label: '10K', m: 10000 },
  { label: 'Half Marathon', m: 21097.5 },
  { label: 'Marathon', m: 42195 },
]

export function formatPaceSec(secPerUnit) {
  if (!secPerUnit || secPerUnit <= 0 || !isFinite(secPerUnit)) return '—'
  const m = Math.floor(secPerUnit / 60)
  const s = Math.round(secPerUnit % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDuration(totalSec) {
  if (!totalSec || totalSec <= 0 || !isFinite(totalSec)) return '—'
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.round(totalSec % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDistance(m, unit) {
  if (!m || m <= 0) return '—'
  if (unit === 'mi') return `${(m / 1000 / MI_TO_KM).toFixed(2)} mi`
  return `${(m / 1000).toFixed(2)} km`
}

// Riegel endurance formula: T2 = T1 × (D2/D1)^1.06
export function riegelProject(t1Sec, d1M, d2M) {
  if (!t1Sec || !d1M || !d2M || d1M <= 0 || t1Sec <= 0) return null
  return t1Sec * Math.pow(d2M / d1M, 1.06)
}
