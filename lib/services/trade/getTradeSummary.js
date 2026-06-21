import { stringToNumber } from '@/lib/utils/common'

const SUMMARY_COLUMNS =
  'realized_gain, stock_type_option, entry_session_option, entry_occasion_option'

/**
 * Computes aggregate trade statistics for a user across all trades.
 * Fetches all non-deleted trades without pagination since summary needs the full dataset.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 */
export async function getTradeSummary(supabase, userId) {
  if (!userId) throw new Error('User ID is required')

  const { data: trades, error } = await supabase
    .from('trade_list')
    .select(SUMMARY_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) {
    console.error('[trade/getTradeSummary]', error)
    throw new Error(error.message)
  }

  const tradeList = trades ?? []
  const totalTrades = tradeList.length

  const realizedGains = tradeList.map((trade) => stringToNumber(trade.realized_gain))

  const totalWins = realizedGains.filter((g) => g > 0).length
  const totalLosses = realizedGains.filter((g) => g < 0).length
  const netPnL = realizedGains.reduce((sum, g) => sum + g, 0)

  const stockTypeSummary = tradeList.reduce((acc, trade) => {
    const type = trade.stock_type_option
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const entrySessionSummary = tradeList.reduce((acc, trade) => {
    const type = trade.entry_session_option
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const entryOccasionSummary = tradeList.reduce((acc, trade) => {
    const type = trade.entry_occasion_option
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return {
    totalTrades,
    totalWins,
    totalLosses,
    netPnL,
    stockTypeSummary,
    entrySessionSummary,
    entryOccasionSummary,
  }
}
