/**
 * Fetches the current user's stock watchlist (IDX tickers).
 * @returns {Promise<Array<{ ticker: string, long_name: string }>>}
 */
export async function getWatchlist() {
  const res = await fetch('/api/watchlist/v1/list')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch watchlist')
  return data.data
}

/**
 * Adds a ticker to the current user's watchlist.
 * @param {{ ticker: string }} payload
 * @returns {Promise<{ ticker: string, long_name: string }>}
 */
export async function addWatchlistTicker(payload) {
  const res = await fetch('/api/watchlist/v1/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to add ticker')
  return data.data
}

/**
 * Removes a ticker from the current user's watchlist.
 * @param {string} ticker
 */
export async function removeWatchlistTicker(ticker) {
  const res = await fetch(`/api/watchlist/v1/delete/${ticker}`, { method: 'DELETE' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to remove ticker')
  return data
}

/**
 * Fetches full valuation analysis for a single IDX ticker — fundamentals,
 * Monte Carlo fair value range, risk metrics, RC Assessment, and OVERALL SCORE.
 * Backed by cached Supabase data with daily/weekly TTL refresh (see PRD notes).
 * @param {string} ticker
 * @returns {Promise<{
 *   ticker: string,
 *   longName: string,
 *   fetchedAt: string,
 *   fundamentals: { pbv: number, per: number, roe: number, der: number, eps: number, graham: number },
 *   monteCarlo: { price: number, p10: number, p50: number, p90: number },
 *   risk: { sharpe1y: number, sharpe3y: number, sharpe5y: number, sortino1y: number, sortino3y: number, sortino5y: number, calmar: number, maxdd: number },
 *   assessments: Record<string, { label: string, signal: 'BUY'|'HOLD'|'SELL'|null }>,
 *   overall: { score: number, label: string, signal: 'BUY'|'HOLD'|'SELL' }
 * }>}
 */
export async function getValuation(ticker) {
  const res = await fetch(`/api/valuation/v1/detail/${ticker}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch valuation')
  return data.data
}
