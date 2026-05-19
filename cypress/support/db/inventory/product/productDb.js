export async function getSingleProductFromDb(supabase, productId, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('*')
    .eq('id', productId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function getProductListFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_favorite', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data || []
}

export async function getTotalProductsFromDb(supabase, userId) {
  const { count, error } = await supabase
    .from('product_list')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return count || 0
}

export async function getProductSummaryFromDb(supabase, userId) {
  const [r1, r2, r3, r4, r5] = await Promise.all([
    supabase
      .from('product_list')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null),
    supabase
      .from('product_list')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('product_status', 'active')
      .is('deleted_at', null),
    supabase
      .from('product_list')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('product_status', 'inactive')
      .is('deleted_at', null),
    supabase
      .from('product_list')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .is('deleted_at', null),
    supabase
      .from('product_list')
      .select('quantity, usage_quantity')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .range(0, 9999),
  ])

  const err = r1.error || r2.error || r3.error || r4.error || r5.error
  if (err) throw new Error(`DB query failed: ${err.message}`)

  const rows = r5.data || []
  const totalQuantity = rows.reduce((s, p) => s + (Number(p.quantity) || 0), 0)
  const totalUsageQuantity = rows.reduce((s, p) => s + (Number(p.usage_quantity) || 0), 0)

  return {
    totalProducts: r1.count,
    activeProducts: r2.count,
    inactiveProducts: r3.count,
    favoriteProducts: r4.count,
    totalQuantity,
    totalUsageQuantity,
  }
}

export async function getSingleProductIncludeDeletedFromDb(supabase, productId, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('*')
    .eq('id', productId)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function getProductWithQuantityFromDb(supabase, productId, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('id, quantity, usage_quantity, product_status, usage_date, note, updated_at')
    .eq('id', productId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function getLatestProductHistoryFromDb(supabase, productListId, userId) {
  const { data, error } = await supabase
    .from('product_history')
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

export async function setProductQuantityInDb(supabase, productId, quantity) {
  const { data, error } = await supabase
    .from('product_list')
    .update({ quantity })
    .eq('id', productId)
    .select()
    .single()

  if (error) throw new Error(`Failed to set quantity: ${error.message}`)
  return data
}

export async function getProductHistoryCountFromDb(supabase, productId, userId) {
  const { count, error } = await supabase
    .from('product_history')
    .select('*', { count: 'exact', head: true })
    .eq('product_list_id', productId)
    .eq('user_id', userId)

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return count
}

export async function getProductFavoriteStatusFromDb(supabase, productId, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('id, is_favorite, updated_at')
    .eq('id', productId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function insertProductHistoryFromDb(
  supabase,
  productListId,
  userId,
  startUsageDate,
  depletedQuantity
) {
  // Fetch denormalized fields from product_list so the history row satisfies NOT NULL constraints
  const { data: pl, error: plErr } = await supabase
    .from('product_list')
    .select('product, brand, type, quantity, product_status')
    .eq('id', productListId)
    .single()

  if (plErr) throw new Error(`Failed to fetch product_list for history insert: ${plErr.message}`)

  const remainingQty = Math.max(0, Number(pl.quantity) - Number(depletedQuantity))

  const { data, error } = await supabase
    .from('product_history')
    .insert({
      product_list_id: productListId,
      user_id: userId,
      product: pl.product,
      brand: pl.brand,
      type: pl.type ?? null,
      status: pl.product_status ?? 'active',
      quantity: pl.quantity,
      depleted_quantity: depletedQuantity,
      remaining_quantity: remainingQty,
      start_usage_date: startUsageDate,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to insert product history: ${error.message}`)
  return data
}

/**
 * Insert a fully-denormalized product_history record for UI test seeding.
 * Allows setting all display fields (product, brand, type, status, quantity, dates, note)
 * without requiring a real product_list row.
 */
export async function insertFullProductHistoryFromDb(supabase, record) {
  const { data, error } = await supabase
    .from('product_history')
    .insert({
      user_id: record.userId,
      product_list_id: record.productListId ?? null,
      product: record.product,
      brand: record.brand ?? null,
      type: record.type ?? null,
      status: record.status ?? 'active',
      quantity: record.quantity ?? 1,
      depleted_quantity: record.depletedQuantity ?? 0,
      remaining_quantity: record.remainingQuantity ?? record.quantity ?? 1,
      start_usage_date: record.startUsageDate ?? new Date().toISOString(),
      end_usage_date: record.endUsageDate ?? null,
      note: record.note ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to insert full product history: ${error.message}`)
  return data
}

/**
 * Delete all product_history records seeded for a given userId during UI tests.
 * Pass an array of ids to only remove specific rows.
 */
export async function deleteProductHistoryFromDb(supabase, userId, ids = []) {
  let query = supabase.from('product_history').delete().eq('user_id', userId)

  if (ids.length > 0) {
    query = query.in('id', ids)
  }

  const { error } = await query

  if (error) throw new Error(`Failed to delete product history: ${error.message}`)
  return null
}
