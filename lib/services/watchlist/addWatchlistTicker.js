import { createClient } from '@/lib/supabase/server'

const TABLE_NAME = 'trading_watchlist'
const UNIQUE_VIOLATION_CODE = '23505'

/**
 * Adds a ticker to the authenticated user's watchlist.
 * @param {string} userId
 * @param {{ ticker: string, long_name?: string }} payload
 * @returns {Promise<{ ticker: string, long_name: string }>}
 */
export async function addWatchlistTicker(userId, payload) {
  if (!userId) throw new Error('User ID is required')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      ticker: payload.ticker.toUpperCase(),
      long_name: payload.long_name ?? null,
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
