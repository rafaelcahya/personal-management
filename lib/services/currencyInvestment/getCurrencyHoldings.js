export async function getCurrencyHoldings(supabase, userId) {
  const { data, error } = await supabase
    .from('currency_holdings')
    .select('id, currency')
    .eq('user_id', userId)
    .order('currency', { ascending: true })

  if (error) throw new Error('Database error')
  return data
}
