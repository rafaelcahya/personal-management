export async function getCurrencyHoldingById(supabase, userId, id) {
  const { data, error } = await supabase
    .from('currency_holdings')
    .select('id, currency')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error('Database error')
  return data
}
