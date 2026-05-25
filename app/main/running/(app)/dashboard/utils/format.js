export function fmtDistance(m) {
  return (m / 1000).toFixed(2)
}

export function fmtDuration(s) {
  const h = Math.floor(s / 3600)
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(Math.floor(s % 60)).padStart(2, '0')
  return h > 0 ? `${h}:${m}:${sec}` : `${parseInt(m, 10)}:${sec}`
}

export function fmtPace(s) {
  if (s == null) return '—'
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
