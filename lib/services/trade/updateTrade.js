import { createClient } from '@/lib/supabase/server'

const TEXT_FIELDS = [
  'buy_date',
  'sell_date',
  'ticker',
  'return_percent',
  'stock_type_option',
  'entry_session_option',
  'entry_occasion_option',
  'buy_reason_option',
  'sell_reason_option',
  'notes',
]
const NUMERIC_FIELDS = ['margin', 'proceeds', 'realized_gain']

export async function updateTrade(userId, tradeId, tradeData) {
  const supabase = await createClient()

  // Whitelist: spreading the body would let callers write user_id, id or unknown columns
  const updateData = { updated_at: new Date().toISOString() }
  for (const field of TEXT_FIELDS) {
    if (tradeData[field] !== undefined) updateData[field] = tradeData[field]
  }
  for (const field of NUMERIC_FIELDS) {
    if (tradeData[field] !== undefined) updateData[field] = parseFloat(tradeData[field])
  }

  const { data, error } = await supabase
    .from('trd_trade_list')
    .update(updateData)
    .eq('id', tradeId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update trade:', error)
    throw new Error(error.message)
  }

  return data
}
