const RANGE_DAYS = { '4w': 28, '3m': 90, '6m': 180, '1y': 365 }

export function getFromDate(range) {
  if (!range || range === 'all') return null
  const days = RANGE_DAYS[range]
  if (!days) return null
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
