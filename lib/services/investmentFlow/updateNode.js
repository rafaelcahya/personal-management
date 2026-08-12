import { createClient } from '@/lib/supabase/server'

const NODE_TYPE_TICKER = 'ticker'
const NODE_TYPE_CATEGORY = 'category'

/**
 * Updates an investment flow node. Category nodes: name only. Ticker nodes: name, nominal, notes.
 * Also supports converting node_type between 'ticker' and 'category':
 * - ticker -> category clears nominal/notes
 * - category -> ticker allows nominal/notes to be set
 * If a ticker node already has children, nominal/notes are silently ignored
 * (children sum supersedes the stored nominal).
 * Returns null if the node is not found or does not belong to the user.
 * @param {string} userId
 * @param {string} nodeId
 * @param {{ name?: string, node_type?: string, nominal?: number|null, notes?: string|null }} payload
 * @returns {Promise<Object|null>}
 */
export async function updateNode(userId, nodeId, payload) {
  const supabase = await createClient()

  // node_type is still needed up front to decide how to shape `updates`
  // (e.g. whether nominal/notes should be cleared), so we look it up once.
  // This SELECT is an early-exit optimization only — the final UPDATE below
  // re-applies `.eq('user_id', userId)` as the actual ownership gate.
  const { data: existing, error: fetchError } = await supabase
    .from('investment_flow_nodes')
    .select('id, node_type')
    .eq('id', nodeId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return null
    console.error('[investmentFlow/updateNode] fetch', fetchError)
    throw new Error('Failed to fetch node')
  }

  const targetNodeType = payload.node_type ?? existing.node_type

  // Category nodes (staying category) must not receive ticker-only fields
  if (targetNodeType === NODE_TYPE_CATEGORY && (payload.nominal != null || payload.notes != null)) {
    const err = new Error('Category nodes must not have nominal or notes')
    err.code = 'INVALID_FIELD'
    throw err
  }

  const updates = { name: payload.name, updated_at: new Date().toISOString() }

  if (payload.node_type !== undefined) {
    updates.node_type = payload.node_type
  }

  if (targetNodeType === NODE_TYPE_TICKER) {
    // A ticker with existing children has its nominal superseded by the
    // children sum — silently ignore nominal/notes instead of storing stale data.
    const hasChildren = await nodeHasChildren(supabase, nodeId, userId)

    if (!hasChildren) {
      if (payload.nominal !== undefined) updates.nominal = payload.nominal
      if (payload.notes !== undefined) updates.notes = payload.notes
    }
  } else {
    // Converting ticker -> category (or staying category): clear stored values
    updates.nominal = null
    updates.notes = null
  }

  const { data, error } = await supabase
    .from('investment_flow_nodes')
    .update(updates)
    .eq('id', nodeId)
    .eq('user_id', userId)
    .select('id, parent_id, node_type, name, nominal, notes, sort_order, created_at, updated_at')
    .single()

  if (error) {
    // Ownership changed between the earlier lookup and this update (race
    // condition) — treat as not-found rather than an infra error.
    if (error.code === 'PGRST116') return null
    console.error('[investmentFlow/updateNode] update', error)
    throw new Error('Failed to update node')
  }

  return data
}

/**
 * Checks whether a node has at least one child.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} nodeId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
async function nodeHasChildren(supabase, nodeId, userId) {
  const { count, error } = await supabase
    .from('investment_flow_nodes')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', nodeId)
    .eq('user_id', userId)

  if (error) {
    console.error('[investmentFlow/updateNode] children count', error)
    throw new Error('Failed to check node children')
  }

  return (count ?? 0) > 0
}
