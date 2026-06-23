import { createAdminClient } from '@/lib/supabase/admin'

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2'

/**
 * Fetches historical daily forex rates for a single currency in IDR.
 * Fills gaps from Frankfurter API and caches every date in forex_rate_cache.
 * @param {string} currency - 3-letter currency code, e.g. 'USD'
 * @param {string} from - Start date YYYY-MM-DD
 * @param {string} [to] - End date YYYY-MM-DD (defaults to today)
 * @returns {Promise<Array<{ date: string, rate_idr: number }>>}
 */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function getForexHistory(currency, from, to) {
  if (!DATE_RE.test(from)) throw new Error(`Invalid 'from' date: ${from}`)
  const endDate = to ?? new Date().toISOString().slice(0, 10)
  if (!DATE_RE.test(endDate)) throw new Error(`Invalid 'to' date: ${endDate}`)
  const supabase = createAdminClient()
  const currencyUpper = currency.toUpperCase()

  // Fetch from Frankfurter: base=IDR, symbols=currency
  // rates[date][currency] = how many of currency per 1 IDR → rate_idr = 1 / rates[date][currency]
  const res = await fetch(
    `${FRANKFURTER_BASE_URL}/rates?base=IDR&quotes=${currencyUpper}&from=${from}&to=${endDate}`
  )

  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status}`)
  }

  // v2 returns array: [{ date, base, quote, rate }]
  // rate = how many quote per 1 IDR → rate_idr = 1 / rate
  const json = await res.json()
  const result = []
  const upsertRows = []

  for (const row of Array.isArray(json) ? json : []) {
    if (!row.date || row.rate == null) continue
    const rate_idr = 1 / row.rate

    result.push({ date: row.date, rate_idr })
    upsertRows.push({
      currency: currencyUpper,
      rate_idr,
      rate_date: row.date,
      fetched_at: new Date().toISOString(),
    })
  }

  // Upsert all historical rates into cache
  if (upsertRows.length > 0) {
    await supabase.from('forex_rate_cache').upsert(upsertRows, { onConflict: 'currency,rate_date' })
  }

  return result.sort((a, b) => a.date.localeCompare(b.date))
}
