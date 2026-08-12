import { createClient } from '@/lib/supabase/server'

/**
 * Fetches the uninvested cash amount for a user.
 * Returns 0 when the user has not set one yet (no row).
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getUninvestedCash(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('investment_flow_settings')
    .select('uninvested_cash')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[investmentFlow/getUninvestedCash]', error)
    throw new Error('Failed to fetch uninvested cash')
  }

  return data?.uninvested_cash ?? 0
}
