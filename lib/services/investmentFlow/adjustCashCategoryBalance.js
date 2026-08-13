/**
 * Adjusts an uninvested cash category balance.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} categoryId
 * @param {number} delta  positive = deduct (allocating), negative = refund (releasing)
 */
export async function adjustCashCategoryBalance(supabase, userId, categoryId, delta) {
  if (!categoryId || delta === 0) return

  const { data: cat, error } = await supabase
    .from('uninvested_cash_categories')
    .select('id, name, nominal')
    .eq('id', categoryId)
    .eq('user_id', userId)
    .single()

  if (error || !cat) {
    const err = new Error('Cash category not found')
    err.code = 'CASH_CATEGORY_NOT_FOUND'
    throw err
  }

  const newNominal = cat.nominal - delta
  if (newNominal < 0) {
    const err = new Error(
      `Insufficient balance in "${cat.name}": available Rp ${cat.nominal.toLocaleString('id-ID')}, required Rp ${delta.toLocaleString('id-ID')}`
    )
    err.code = 'INSUFFICIENT_CASH'
    throw err
  }

  const { error: updateError } = await supabase
    .from('uninvested_cash_categories')
    .update({ nominal: newNominal, updated_at: new Date().toISOString() })
    .eq('id', categoryId)
    .eq('user_id', userId)

  if (updateError) {
    console.error('[adjustCashCategoryBalance] update', updateError)
    throw new Error('Failed to update cash category balance')
  }
}
