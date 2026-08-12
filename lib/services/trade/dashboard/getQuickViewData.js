import { createClient } from '@/lib/supabase/server'

export async function getQuickViewData(userId, limit = 5) {
  const supabase = await createClient()

  const [tradesResult, eventsResult, feesResult] = await Promise.all([
    supabase
      .from('trade_list')
      .select('id,ticker,realized_gain,sell_date')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('sell_date', { ascending: false, nullsFirst: false })
      .limit(limit),
    supabase
      .from('event_list')
      .select('id,event_date,title,event_description')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('event_date', { ascending: false })
      .limit(limit),
    supabase
      .from('fee_list')
      .select('id,fee_date,fee,fee_name')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('fee_date', { ascending: false })
      .limit(limit),
  ])

  if (tradesResult.error) {
    console.error('[trade/getQuickViewData] trades:', tradesResult.error)
    throw new Error('Failed to load trades')
  }
  if (eventsResult.error) {
    console.error('[trade/getQuickViewData] events:', eventsResult.error)
    throw new Error('Failed to load events')
  }
  if (feesResult.error) {
    console.error('[trade/getQuickViewData] fees:', feesResult.error)
    throw new Error('Failed to load fees')
  }

  return {
    trades: tradesResult.data || [],
    events: eventsResult.data || [],
    fees: feesResult.data || [],
  }
}
