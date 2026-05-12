export async function getLatestProductQuantityFromDb(supabase, productListId, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('*')
    .eq('product_list_id', productListId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function getProductQuantityCountFromDb(supabase, productListId, userId) {
  const { count, error } = await supabase
    .from('product_quantity')
    .select('*', { count: 'exact', head: true })
    .eq('product_list_id', productListId)
    .eq('user_id', userId)

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return count
}

export async function getProductQuantityListFromDb(supabase, productListId, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('*')
    .eq('product_list_id', productListId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function getProductQuantityHistoryFromDb(supabase, productListId, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('*')
    .eq('product_list_id', productListId)
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data || []
}

export async function getLastPurchasePriceFromDb(supabase, productListId, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('price, purchase_date')
    .eq('product_list_id', productListId)
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function getActiveProductsWithHistoryFromDb(supabase, userId) {
  const { data: products, error: pError } = await supabase
    .from('product_list')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_status', 'active')
    .is('deleted_at', null)

  if (pError) throw new Error(`DB query failed: ${pError.message}`)

  const { data: history, error: hError } = await supabase
    .from('product_history')
    .select('product_list_id, start_usage_date')
    .in(
      'product_list_id',
      (products || []).map((p) => p.id)
    )
    .order('start_usage_date')

  if (hError) throw new Error(`DB query failed: ${hError.message}`)

  return { products: products || [], history: history || [] }
}
