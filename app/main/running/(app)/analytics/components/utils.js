export const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun'])

export const DISTANCE_BRACKETS = [
  { key: '5K', label: '5K', min: 4000, max: 6000, color: '#22c55e' },
  { key: '8K', label: '8K', min: 7000, max: 9000, color: '#84cc16' },
  { key: '10K', label: '10K', min: 9000, max: 11500, color: '#eab308' },
  { key: '15K', label: '15K', min: 11500, max: 17000, color: '#f97316' },
  { key: 'HM', label: 'Half (21K)', min: 17000, max: 23000, color: '#ef4444' },
  { key: 'FM', label: 'Marathon', min: 38000, max: 45000, color: '#a855f7' },
]

export const RIEGEL_TARGETS = [
  { label: '1K', distance_m: 1000 },
  { label: '5K', distance_m: 5000 },
  { label: '10K', distance_m: 10000 },
  { label: 'Half', distance_m: 21097.5 },
  { label: 'Marathon', distance_m: 42195 },
]

export const ACWR_COLORS = {
  no_data: '#94a3b8',
  low: '#60a5fa',
  optimal: '#22c55e',
  caution: '#eab308',
  danger: '#ef4444',
  resting: '#a78bfa',
}

export function getBracket(distance_m) {
  return DISTANCE_BRACKETS.find((b) => distance_m >= b.min && distance_m < b.max) ?? null
}

export function getWeekKey(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

export function fmtWeekLabel(weekKey) {
  const d = new Date(weekKey + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function fmtPaceTick(sec) {
  if (!sec) return ''
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

export function fmtDurationShort(sec) {
  if (!sec) return '—'
  const h = Math.floor(sec / 3600)
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return h > 0 ? `${h}h ${parseInt(m, 10)}m ${s}s` : `${parseInt(m, 10)}m ${s}s`
}

export function riegelPredict(bestTimeSec, bestDistanceM, targetDistanceM) {
  return bestTimeSec * Math.pow(targetDistanceM / bestDistanceM, 1.06)
}

export function rolling30DayAvg(pts, dateKey, valueKey) {
  return pts.map((pt, i) => {
    const cutoff = new Date(pt[dateKey])
    cutoff.setDate(cutoff.getDate() - 30)
    const window = pts.slice(0, i + 1).filter((p) => new Date(p[dateKey]) >= cutoff)
    const sum = window.reduce((s, p) => s + p[valueKey], 0)
    return { ...pt, rollingAvg: parseFloat((sum / window.length).toFixed(4)) }
  })
}
