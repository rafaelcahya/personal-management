import { createClient } from '@/lib/supabase/server'

/**
 * Upserts the node highlight map for a user.
 * @param {string} userId
 * @param {Record<string, string>} highlights - map of nodeId → hex color
 * @returns {Promise<Record<string, string>>}
 */
export async function updateHighlights(userId, highlights) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('investment_flow_settings')
    .upsert(
      { user_id: userId, node_highlights: highlights, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select('node_highlights')
    .single()

  if (error) {
    console.error('[investmentFlow/updateHighlights]', error)
    throw new Error('Failed to update highlights')
  }

  return data.node_highlights
}
