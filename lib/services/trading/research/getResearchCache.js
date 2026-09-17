import { createAdminClient } from '@/lib/supabase/admin'
import { RESEARCH_CACHE_TTL_MS } from '@/lib/utils/constants/trading'

const TABLE_NAME = 'trading_research_cache'

async function getCached(admin, ticker, endpointType) {
  const { data, error } = await admin
    .from(TABLE_NAME)
    .select('data, fetched_at')
    .eq('ticker', ticker)
    .eq('endpoint_type', endpointType)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}

function isFresh(cached) {
  if (!cached) return false
  return Date.now() - new Date(cached.fetched_at).getTime() < RESEARCH_CACHE_TTL_MS
}

/**
 * Cache-first wrapper for the Finnhub research endpoints. Serves a fresh cache
 * entry when available, otherwise runs `compute`, stores the result, and
 * returns it. Falls back to a stale cache entry when the live fetch fails so a
 * Finnhub outage never leaves the Research tab empty.
 * @param {string} ticker
 * @param {'overview'|'technicals'|'corporate-events'} endpointType
 * @param {() => Promise<object>} compute
 */
export async function getCachedResearch(ticker, endpointType, compute) {
  const normalizedTicker = ticker.toUpperCase()
  const admin = createAdminClient()

  const cached = await getCached(admin, normalizedTicker, endpointType)
  if (isFresh(cached)) return cached.data

  try {
    const result = await compute()
    await admin.from(TABLE_NAME).upsert(
      {
        ticker: normalizedTicker,
        endpoint_type: endpointType,
        data: result,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: 'ticker,endpoint_type' }
    )
    return result
  } catch (err) {
    if (cached) return cached.data
    throw err
  }
}
