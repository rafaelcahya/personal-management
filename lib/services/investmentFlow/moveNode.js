import { createClient } from '@/lib/supabase/server'

/**
 * Moves a node to a new parent (drag & drop).
 * Guards against moving a node into its own subtree to prevent cycles.
 * Returns null if the node is not found or does not belong to the user.
 * @param {string} userId
 * @param {string} nodeId
 * @param {string|null} newParentId
 * @param {number} sortOrder
 * @returns {Promise<Object|null>}
 */
export async function moveNode(userId, nodeId, newParentId, sortOrder) {
  const supabase = await createClient()

  // This existence check is an early-exit optimization, not the security
  // gate — the BFS cycle-check below and the final UPDATE both re-apply
  // `.eq('user_id', userId)`, so ownership is still enforced end to end
  // even if this lookup were skipped.
  const { error: fetchError } = await supabase
    .from('investment_flow_nodes')
    .select('id')
    .eq('id', nodeId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return null
    console.error('[investmentFlow/moveNode] fetch', fetchError)
    throw new Error('Failed to fetch node')
  }

  // Guard: a node cannot become its own parent
  if (newParentId === nodeId) {
    const err = new Error('Cannot move a node into itself')
    err.code = 'CYCLE'
    throw err
  }

  // Guard: new parent must belong to the user
  if (newParentId) {
    const { data: parent, error: parentError } = await supabase
      .from('investment_flow_nodes')
      .select('id, node_type')
      .eq('id', newParentId)
      .eq('user_id', userId)
      .single()

    if (parentError || !parent) {
      const err = new Error('Parent node not found')
      err.code = 'PARENT_NOT_FOUND'
      throw err
    }
  }

  // Guard: new parent must not be a descendant of nodeId (cycle prevention)
  if (newParentId) {
    const descendantIds = new Set()
    let frontier = [nodeId]

    while (frontier.length > 0) {
      const { data: children, error: childError } = await supabase
        .from('investment_flow_nodes')
        .select('id')
        .in('parent_id', frontier)
        .eq('user_id', userId)

      if (childError) {
        console.error('[investmentFlow/moveNode] subtree check', childError)
        throw new Error('Failed to validate move target')
      }

      if (!children || children.length === 0) break

      const childIds = children.map((c) => c.id)
      childIds.forEach((id) => descendantIds.add(id))
      frontier = childIds
    }

    if (descendantIds.has(newParentId)) {
      // Would create a cycle — signal as a conflict to the route handler
      const err = new Error('Cannot move a node into its own subtree')
      err.code = 'CYCLE'
      throw err
    }
  }

  const { data, error } = await supabase
    .from('investment_flow_nodes')
    .update({
      parent_id: newParentId,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq('id', nodeId)
    .eq('user_id', userId)
    .select('id, parent_id, node_type, name, nominal, notes, sort_order, created_at, updated_at')
    .single()

  if (error) {
    // Ownership changed between the earlier lookup and this update (race
    // condition) — treat as not-found rather than an infra error.
    if (error.code === 'PGRST116') return null
    console.error('[investmentFlow/moveNode] update', error)
    throw new Error('Failed to move node')
  }

  return data
}
