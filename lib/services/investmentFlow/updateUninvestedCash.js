import { createClient } from '@/lib/supabase/server'

/**
 * Upserts the uninvested cash amount for a user.
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<number>}
 */
export async function updateUninvestedCash(userId, amount) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('investment_flow_settings')
    .upsert(
      { user_id: userId, uninvested_cash: amount, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select('uninvested_cash')
    .single()

  if (error) {
    console.error('[investmentFlow/updateUninvestedCash]', error)
    throw new Error('Failed to update uninvested cash')
  }

  return data.uninvested_cash
}
