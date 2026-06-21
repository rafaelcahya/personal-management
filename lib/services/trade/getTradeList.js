const TRADE_COLUMNS =
  'id, trade_date, ticker, margin, proceeds, return_percent, realized_gain, stock_type_option, entry_session_option, entry_occasion_option, buy_reason_option, sell_reason_option, notes, uuid, created_at'

/**
 * Fetches a paginated list of trades for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ page?: number, limit?: number, ticker?: string }} options
 * @returns {Promise<{ trades: object[], total: number, page: number, limit: number }>}
 */
export async function getTradeList(supabase, userId, { page = 1, limit = 15, ticker } = {}) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('trade_list')
    .select(TRADE_COLUMNS, { count: 'exact' })
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('trade_date', { ascending: false })

  if (ticker) {
    query = query.ilike('ticker', `%${ticker}%`)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('[trade/getTradeList]', error)
    throw new Error(error.message)
  }

  return { trades: data ?? [], total: count ?? 0, page, limit }
}
