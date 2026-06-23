/**
 * Fetches all currency investment transactions for the current user.
 * @param {string} [currency] - Optional 3-letter currency code to filter by
 * @param {{ page?: number, limit?: number }} [options]
 */
export async function getCurrencyInvestments(currency, options = {}) {
  const params = new URLSearchParams()
  if (currency) params.set('currency', currency)
  if (options.page) params.set('page', String(options.page))
  if (options.limit) params.set('limit', String(options.limit))

  const query = params.toString() ? `?${params}` : ''
  const res = await fetch(`/api/currency-investments/v1/list${query}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch currency investments')
  const result = data.data
  return Array.isArray(result) ? result : (result?.items ?? [])
}

/**
 * Creates a new currency investment transaction.
 * @param {{ currency: string, type: string, idr_amount: number, rate: number, transacted_at: string, notes?: string }} payload
 */
export async function createCurrencyInvestment(payload) {
  const res = await fetch('/api/currency-investments/v1/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to create investment')
  return data.data
}

/**
 * Soft-deletes a currency investment transaction.
 * @param {string} id - UUID of the investment to delete
 */
export async function deleteCurrencyInvestment(id) {
  const res = await fetch(`/api/currency-investments/v1/delete/${id}`, { method: 'DELETE' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete investment')
  return data
}

/**
 * Fetches all available currency codes and names from Frankfurter via the server.
 * @returns {Promise<Record<string, string>>} - Map of currency code to full name
 */
export async function getForexCurrencies() {
  const res = await fetch('/api/forex/v1/currencies')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch currencies')
  return data.data
}

/**
 * Fetches current forex rates in IDR for the given currency symbols.
 * @param {string} [symbols] - Comma-separated currency codes, e.g. 'USD,CHF,SGD'
 * @returns {Promise<Record<string, number>>} - Map of currency code to IDR rate
 */
export async function getForexRates(symbols) {
  const query = symbols ? `?symbols=${symbols}` : ''
  const res = await fetch(`/api/forex/v1/rates${query}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch forex rates')
  return data.data
}

export async function getCurrencyHoldings() {
  const res = await fetch('/api/currency-investments/v1/holdings')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch holdings')
  return data.data
}

export async function getCurrencyHoldingById(id) {
  const res = await fetch(`/api/currency-investments/v1/holdings/${id}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch holding')
  return data.data
}

/**
 * Same as getForexRates but also returns fetchedAt timestamps per currency.
 * @param {string} [symbols]
 * @returns {Promise<{ rates: Record<string, number>, fetchedAt: Record<string, string> }>}
 */
export async function getForexRatesWithMeta(symbols) {
  const query = symbols ? `?symbols=${symbols}` : ''
  const res = await fetch(`/api/forex/v1/rates${query}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch forex rates')
  return { rates: data.data, fetchedAt: data.fetchedAt ?? {} }
}

/**
 * Fetches historical daily forex rates for a single currency.
 * @param {string} currency - 3-letter currency code, e.g. 'USD'
 * @param {string} from - Start date YYYY-MM-DD
 * @param {string} [to] - End date YYYY-MM-DD (defaults to today on server)
 * @returns {Promise<Array<{ date: string, rate_idr: number }>>}
 */
export async function getForexHistory(currency, from, to) {
  const params = new URLSearchParams({ currency, from })
  if (to) params.set('to', to)
  const res = await fetch(`/api/forex/v1/history?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch forex history')
  return data.data
}
