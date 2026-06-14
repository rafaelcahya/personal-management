const RANGE_DAYS = { '4w': 28, '3m': 90, '6m': 180, '1y': 365 }

export function getFromDate(range) {
  if (!range || range === 'all' || range === 'custom') return null
  if (range === 'today') {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }
  const days = RANGE_DAYS[range]
  if (!days) return null
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export function getDateRange(range, startDate, endDate) {
  if (range === 'custom') {
    return {
      // Use explicit UTC boundaries to avoid Date constructor timezone ambiguity
      fromDate: startDate ? `${startDate}T00:00:00.000Z` : null,
      toDate: endDate ? `${endDate}T23:59:59.999Z` : null,
    }
  }
  if (range === 'today') {
    return { fromDate: getFromDate('today'), toDate: null }
  }
  return { fromDate: getFromDate(range), toDate: null }
}
