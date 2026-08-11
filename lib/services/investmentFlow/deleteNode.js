import { createClient } from '@/lib/supabase/server'

/**
 * Deletes a node and its entire subtree using a recursive CTE.
 * Returns false if the node is not found or does not belong to the user.
 * @param {string} userId
 * @param {string} nodeId
 * @returns {Promise<boolean>}
 */
export async function deleteNode(userId, nodeId) {
  const supabase = await createClient()

  // Verify the root node belongs to the user before deletion
  const { data: existing, error: fetchError } = await supabase
    .from('investment_flow_nodes')
    .select('id')
    .eq('id', nodeId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return false
    console.error('[investmentFlow/deleteNode] fetch', fetchError)
    throw new Error('Failed to fetch node')
  }

  if (!existing) return false

  // Recursively collect all descendant IDs then delete them all.
  // Supabase JS client doesn't support recursive CTEs directly, so we
  // implement iterative BFS deletion to avoid raw SQL in service layer.
  const idsToDelete = [nodeId]
  let frontier = [nodeId]

  while (frontier.length > 0) {
    const { data: children, error: childError } = await supabase
      .from('investment_flow_nodes')
      .select('id')
      .in('parent_id', frontier)
      .eq('user_id', userId)

    if (childError) {
      console.error('[investmentFlow/deleteNode] children fetch', childError)
      throw new Error('Failed to traverse subtree')
    }

    if (!children || children.length === 0) break

    const childIds = children.map((c) => c.id)
    idsToDelete.push(...childIds)
    frontier = childIds
  }

  const { error: deleteError } = await supabase
    .from('investment_flow_nodes')
    .delete()
    .in('id', idsToDelete)
    .eq('user_id', userId)

  if (deleteError) {
    console.error('[investmentFlow/deleteNode] delete', deleteError)
    throw new Error('Failed to delete node and subtree')
  }

  return true
}
