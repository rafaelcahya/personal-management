/**
 * Creates a new currency investment transaction.
 * Computes foreign_amount = idr_amount / rate.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ currency: string, type: string, idr_amount: number, rate: number, transacted_at: string, notes?: string }} payload
 */
export async function createCurrencyInvestment(supabase, userId, payload) {
  const { currency, type, idr_amount, rate, transacted_at, notes } = payload

  const foreign_amount = idr_amount / rate

  const { data, error } = await supabase
    .from('currency_investments')
    .insert({
      user_id: userId,
      currency: currency.toUpperCase(),
      type,
      idr_amount,
      rate,
      foreign_amount,
      transacted_at,
      notes: notes ?? null,
    })
    .select(
      'id, currency, type, idr_amount, rate, foreign_amount, transacted_at, notes, created_at'
    )
    .single()

  if (error) throw new Error('Database error')

  const { error: holdingError } = await supabase
    .from('currency_holdings')
    .upsert(
      { user_id: userId, currency: currency.toUpperCase() },
      { onConflict: 'user_id,currency', ignoreDuplicates: true }
    )

  if (holdingError) throw new Error('Database error')

  return data
}
