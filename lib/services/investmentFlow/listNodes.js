import { createClient } from '@/lib/supabase/server'

/**
 * Fetches all investment flow nodes for a user as a flat adjacency list.
 * The frontend is responsible for reconstructing the tree from this flat list.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function listNodes(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('investment_flow_nodes')
    .select('id, parent_id, node_type, name, nominal, notes, sort_order, created_at, updated_at')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[investmentFlow/listNodes]', error)
    throw new Error('Failed to fetch investment flow nodes')
  }

  return data
}
