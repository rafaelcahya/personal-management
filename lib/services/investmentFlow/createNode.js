import { createClient } from '@/lib/supabase/server'
import { adjustCashCategoryBalance } from './adjustCashCategoryBalance'

const MAX_NODES_PER_USER = 500

/**
 * Creates a new investment flow node (category or ticker) for a user.
 * Ticker nodes accept nominal and notes. Category nodes ignore those fields.
 * @param {string} userId
 * @param {{ parent_id: string|null, node_type: string, name: string, nominal?: number|null, notes?: string|null, sort_order?: number }} payload
 * @returns {Promise<Object>}
 */
export async function createNode(userId, payload) {
  const supabase = await createClient()

  const { count, error: countError } = await supabase
    .from('investment_flow_nodes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (countError) {
    console.error('[investmentFlow/createNode] count', countError)
    throw new Error('Failed to check node count')
  }

  if ((count ?? 0) >= MAX_NODES_PER_USER) {
    const err = new Error(`Node limit reached (max ${MAX_NODES_PER_USER} nodes per portfolio)`)
    err.code = 'NODE_LIMIT_EXCEEDED'
    throw err
  }

  if (payload.parent_id) {
    const { data: parent, error: parentError } = await supabase
      .from('investment_flow_nodes')
      .select('id, node_type, nominal')
      .eq('id', payload.parent_id)
      .eq('user_id', userId)
      .single()

    if (parentError || !parent) {
      const err = new Error('Parent node not found')
      err.code = 'PARENT_NOT_FOUND'
      throw err
    }

    // Parent ticker gains a child — its own nominal is now superseded by
    // the sum of its children, so the stale stored value must be cleared.
    if (parent.node_type === 'ticker' && parent.nominal != null) {
      await supabase
        .from('investment_flow_nodes')
        .update({ nominal: null, notes: null, updated_at: new Date().toISOString() })
        .eq('id', payload.parent_id)
        .eq('user_id', userId)
    }
  }

  const isTicker = payload.node_type === 'ticker'

  // Validate cash category balance before inserting so the node is never
  // created when the pool has insufficient funds.
  if (isTicker && payload.uninvested_cash_category_id && payload.nominal) {
    const { data: cat } = await supabase
      .from('uninvested_cash_categories')
      .select('nominal, name')
      .eq('id', payload.uninvested_cash_category_id)
      .eq('user_id', userId)
      .single()

    if (!cat) {
      const err = new Error('Cash category not found')
      err.code = 'INSUFFICIENT_CASH'
      throw err
    }
    if (cat.nominal < payload.nominal) {
      const err = new Error(
        `Insufficient balance in "${cat.name}": available Rp ${cat.nominal.toLocaleString('id-ID')}, required Rp ${payload.nominal.toLocaleString('id-ID')}`
      )
      err.code = 'INSUFFICIENT_CASH'
      throw err
    }
  }

  const row = {
    user_id: userId,
    parent_id: payload.parent_id ?? null,
    node_type: payload.node_type,
    name: payload.name,
    nominal: isTicker ? (payload.nominal ?? null) : null,
    notes: isTicker ? (payload.notes ?? null) : null,
    sort_order: payload.sort_order ?? 0,
    uninvested_cash_category_id: isTicker ? (payload.uninvested_cash_category_id ?? null) : null,
  }

  const { data, error } = await supabase
    .from('investment_flow_nodes')
    .insert(row)
    .select(
      'id, parent_id, node_type, name, nominal, notes, sort_order, uninvested_cash_category_id, created_at, updated_at'
    )
    .single()

  if (error) {
    console.error('[investmentFlow/createNode]', error)
    throw new Error('Failed to create investment flow node')
  }

  if (data.uninvested_cash_category_id && data.nominal) {
    try {
      await adjustCashCategoryBalance(
        supabase,
        userId,
        data.uninvested_cash_category_id,
        data.nominal
      )
    } catch (balanceErr) {
      // Compensate: remove the just-created node so the ledger stays consistent.
      await supabase.from('investment_flow_nodes').delete().eq('id', data.id).eq('user_id', userId)
      throw balanceErr
    }
  }

  return data
}
