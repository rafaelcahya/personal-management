import { createClient } from '@/lib/supabase/server'

const TABLE_NAME = 'trading_watchlist'

/**
 * Fetches the authenticated user's stock watchlist, ordered oldest-first.
 * @param {string} userId
 * @returns {Promise<Array<{ ticker: string, long_name: string }>>}
 */
export async function getWatchlist(userId) {
  if (!userId) throw new Error('User ID is required')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('ticker, long_name')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to fetch watchlist')
  }

  return data || []
}
