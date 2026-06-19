export async function bulkUpdateProductNameStatus(supabase, userId, ids, status) {
  const { error } = await supabase
    .from('product_name')
    .update({ product_name_status: status })
    .in('id', ids)
    .eq('user_id', userId)

  if (error) {
    console.error('[product-name/bulk-update-status] error:', error)
    throw new Error(error.message)
  }
}
