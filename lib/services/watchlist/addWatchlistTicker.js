import { createClient } from '@/lib/supabase/server'
import { fetchFundamentals } from '@/lib/utils/yahooFinance'

const TABLE_NAME = 'trading_watchlist'
const UNIQUE_VIOLATION_CODE = '23505'

/**
 * Adds a ticker to the authenticated user's watchlist.
 * Validates the ticker exists on Yahoo Finance before inserting.
 * @param {string} userId
 * @param {{ ticker: string }} payload
 * @returns {Promise<{ ticker: string, long_name: string }>}
 */
export async function addWatchlistTicker(userId, payload) {
  if (!userId) throw new Error('User ID is required')

  const upperTicker = payload.ticker.toUpperCase()

  let longName = null
  try {
    const fundamentals = await fetchFundamentals(upperTicker)
    longName = fundamentals.longName ?? null
  } catch {
    const err = new Error(`Ticker "${upperTicker}" not found on Yahoo Finance`)
    err.status = 422
    throw err
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      ticker: upperTicker,
      long_name: longName,
    })
    .select('ticker, long_name')
    .single()

  if (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      const conflict = new Error('Ticker is already in your watchlist')
      conflict.status = 409
      throw conflict
    }
    throw new Error(error.message || 'Failed to add ticker to watchlist')
  }

  return data
}
