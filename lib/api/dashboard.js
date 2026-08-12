const BASE_URL = '/api/trade/v1/dashboard'
const TRADE_BASE_URL = '/api/trade/v1/trade'

export async function fetchMetrics() {
  const res = await fetch(`${BASE_URL}/metrics`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch metrics')
  }

  return data.data
}

export async function fetchQuickView(limit = 5) {
  const res = await fetch(`${BASE_URL}/quick-view?limit=${limit}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch quick view data')
  }

  return data.data
}

export async function fetchDailyPnl(year, month) {
  const res = await fetch(`${TRADE_BASE_URL}/daily-pnl?year=${year}&month=${month}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch daily PnL')
  }

  return data.data
}
