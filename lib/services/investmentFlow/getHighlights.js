import { createClient } from '@/lib/supabase/server'

/**
 * Fetches the node highlight map for a user.
 * Returns {} when the user has no settings row yet.
 * @param {string} userId
 * @returns {Promise<Record<string, string>>}
 */
export async function getHighlights(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('investment_flow_settings')
    .select('node_highlights')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[investmentFlow/getHighlights]', error)
    throw new Error('Failed to fetch highlights')
  }

  return data?.node_highlights ?? {}
}
