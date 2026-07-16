import { createClient } from '@/lib/supabase/server'

const TABLE_NAME = 'trading_watchlist'

/**
 * Removes a ticker from the authenticated user's watchlist.
 * @param {string} userId
 * @param {string} ticker
 */
export async function removeWatchlistTicker(userId, ticker) {
  if (!userId) throw new Error('User ID is required')
  if (!ticker) throw new Error('Ticker is required')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', userId)
    .eq('ticker', ticker.toUpperCase())
    .select('ticker')

  if (error) {
    throw new Error(error.message || 'Failed to remove ticker from watchlist')
  }

  if (!data || data.length === 0) {
    const notFound = new Error('Ticker not found in watchlist')
    notFound.status = 404
    throw notFound
  }

  return { success: true }
}
