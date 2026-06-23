/**
 * Lists currency investment transactions for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ currency?: string, page?: number, limit?: number }} options
 */
export async function listCurrencyInvestments(
  supabase,
  userId,
  { currency, page = 1, limit = 50 } = {}
) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('currency_investments')
    .select(
      'id, currency, type, idr_amount, rate, foreign_amount, transacted_at, notes, created_at',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('transacted_at', { ascending: false })
    .range(from, to)

  if (currency) {
    query = query.eq('currency', currency.toUpperCase())
  }

  const { data, error, count } = await query

  if (error) throw new Error('Database error')
  return { items: data, total: count, page, limit }
}
