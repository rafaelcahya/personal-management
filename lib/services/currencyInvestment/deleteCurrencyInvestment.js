/**
 * Soft-deletes a currency investment transaction.
 * Sets deleted_at = now() for the row owned by the user.
 * Returns true if deleted, false if not found.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} id
 */
export async function deleteCurrencyInvestment(supabase, userId, id) {
  const { data, error } = await supabase
    .from('currency_investments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .select('id')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return false
    throw new Error('Database error')
  }

  return !!data
}
