import { createClient } from '@/lib/supabase/server'
import { adjustCashCategoryBalance } from './adjustCashCategoryBalance'

/**
 * Closes (sells) a ticker position: returns the full proceeds to a cash
 * category and deletes the node. Only leaf ticker nodes that hold a nominal
 * can be closed — category nodes, parent tickers, and autosum nodes are rejected.
 * Returns null if the node is not found or does not belong to the user.
 * @param {string} userId
 * @param {string} nodeId
 * @param {{ proceeds: number, cash_category_id: string }} payload
 * @returns {Promise<{ node_name: string, nominal: number, proceeds: number, realized_pnl: number }|null>}
 */
export async function closePosition(userId, nodeId, payload) {
  const supabase = await createClient()

  const { data: node, error: fetchError } = await supabase
    .from('investment_flow_nodes')
    .select('id, node_type, name, nominal')
    .eq('id', nodeId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return null
    console.error('[investmentFlow/closePosition] fetch', fetchError)
    throw new Error('Failed to fetch node')
  }

  if (node.node_type !== 'ticker' || node.nominal == null) {
    const err = new Error('Only ticker positions with a nominal can be closed')
    err.code = 'NODE_NOT_CLOSABLE'
    throw err
  }

  // A ticker with children has its nominal superseded by the children sum,
  // so there is no single position to close.
  const { count, error: childError } = await supabase
    .from('investment_flow_nodes')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', nodeId)
    .eq('user_id', userId)

  if (childError) {
    console.error('[investmentFlow/closePosition] children count', childError)
    throw new Error('Failed to check node children')
  }

  if ((count ?? 0) > 0) {
    const err = new Error('A position with child nodes cannot be closed')
    err.code = 'NODE_NOT_CLOSABLE'
    throw err
  }

  // Credit the full proceeds back to the pool first. A negative delta is a
  // refund, so this never trips the insufficient-balance guard.
  await adjustCashCategoryBalance(supabase, userId, payload.cash_category_id, -payload.proceeds)

  const { error: deleteError } = await supabase
    .from('investment_flow_nodes')
    .delete()
    .eq('id', nodeId)
    .eq('user_id', userId)

  if (deleteError) {
    // The node still exists — reverse the credit so the ledger stays consistent.
    await adjustCashCategoryBalance(supabase, userId, payload.cash_category_id, payload.proceeds)
    console.error('[investmentFlow/closePosition] delete', deleteError)
    throw new Error('Failed to close position')
  }

  return {
    node_name: node.name,
    nominal: node.nominal,
    proceeds: payload.proceeds,
    realized_pnl: payload.proceeds - node.nominal,
  }
}
