import { createAdminClient } from '@/lib/supabase/admin'

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2'
const CACHE_TTL_HOURS = 1

/**
 * Fetches current forex rates in IDR for the requested currencies.
 * Checks forex_rate_cache first; falls back to Frankfurter API on cache miss or stale data.
 * @param {string[]} currencies - Array of 3-letter currency codes, e.g. ['USD','CHF']
 * @returns {Promise<Record<string, number>>} - Map of currency code → rate in IDR
 */
export async function getForexRates(currencies) {
  const today = new Date().toISOString().slice(0, 10)
  const supabase = createAdminClient()

  // Check cache for all requested currencies
  const { data: cached } = await supabase
    .from('forex_rate_cache')
    .select('currency, rate_idr, fetched_at')
    .in('currency', currencies)
    .eq('rate_date', today)

  const cachedMap = {}
  const cachedFetchedAt = {}
  const staleOrMissing = []

  for (const code of currencies) {
    const hit = cached?.find((r) => r.currency === code)
    const fetchedAtDate = hit ? new Date(hit.fetched_at) : null
    const ageHours = fetchedAtDate
      ? (Date.now() - fetchedAtDate.getTime()) / (1000 * 60 * 60)
      : Infinity

    if (hit && ageHours < CACHE_TTL_HOURS) {
      cachedMap[code] = Number(hit.rate_idr)
      cachedFetchedAt[code] = hit.fetched_at
    } else {
      staleOrMissing.push(code)
    }
  }

  if (staleOrMissing.length === 0) {
    return { rates: cachedMap, fetchedAt: cachedFetchedAt }
  }

  // Fetch from Frankfurter: base=IDR gives rates per 1 IDR
  // rates.USD = how many USD per 1 IDR → rate_idr = 1 / rates.USD
  const symbols = staleOrMissing.join(',')
  const res = await fetch(`${FRANKFURTER_BASE_URL}/rates?base=IDR&quotes=${symbols}`)

  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status}`)
  }

  // v2 returns array: [{ date, base, quote, rate }]
  // rate = how many quote per 1 IDR → rate_idr = 1 / rate
  const json = await res.json()
  const freshRates = {}
  const now = new Date().toISOString()
  const freshFetchedAt = {}

  for (const row of Array.isArray(json) ? json : []) {
    if (!row.quote || row.rate == null) continue
    freshRates[row.quote] = 1 / row.rate
    freshFetchedAt[row.quote] = now
  }

  // Upsert fresh rates into cache
  if (Object.keys(freshRates).length > 0) {
    const rows = Object.entries(freshRates).map(([currency, rate_idr]) => ({
      currency,
      rate_idr,
      rate_date: today,
      fetched_at: now,
    }))

    await supabase.from('forex_rate_cache').upsert(rows, { onConflict: 'currency,rate_date' })
  }

  return {
    rates: { ...cachedMap, ...freshRates },
    fetchedAt: { ...cachedFetchedAt, ...freshFetchedAt },
  }
}
