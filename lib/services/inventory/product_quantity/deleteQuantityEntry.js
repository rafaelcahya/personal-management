import { createClient } from '@/lib/supabase/server'

export async function deleteQuantityEntry(userId, entryId) {
  const supabase = await createClient()

  const { data: entry, error: entryError } = await supabase
    .from('product_quantity')
    .select('id, product_list_id, quantity_added')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single()

  if (entryError || !entry) {
    throw new Error('Stock entry not found')
  }

  const { data: product, error: productError } = await supabase
    .from('product_list')
    .select('id, quantity')
    .eq('id', entry.product_list_id)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (productError || !product) {
    throw new Error('Product not found')
  }

  const entryQty = Number(entry.quantity_added)
  const currentProductQty = Number(product.quantity)
  const projectedQty = currentProductQty - entryQty

  if (projectedQty < 0) {
    throw new Error(
      `Cannot delete this entry: current stock is ${currentProductQty} and removing ${entryQty} units would make it negative`
    )
  }

  // Update product_list.quantity FIRST with optimistic lock.
  // If this fails (concurrent modification or DB error), the entry row is still intact — no data loss.
  const { data: syncedProduct, error: productUpdateError } = await supabase
    .from('product_list')
    .update({ quantity: projectedQty, updated_at: new Date().toISOString() })
    .eq('id', entry.product_list_id)
    .eq('user_id', userId)
    .eq('quantity', currentProductQty)
    .select('id')
    .single()

  if (productUpdateError || !syncedProduct) {
    if (!syncedProduct && !productUpdateError) {
      throw new Error('Stock was modified by another action — please try again')
    }
    throw new Error(`Failed to sync product quantity: ${productUpdateError?.message}`)
  }

  // Delete the entry only after the quantity sync succeeds.
  const { error: deleteError } = await supabase
    .from('product_quantity')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)

  if (deleteError) {
    // Rollback the quantity update so both tables stay consistent
    await supabase
      .from('product_list')
      .update({ quantity: currentProductQty, updated_at: new Date().toISOString() })
      .eq('id', entry.product_list_id)
      .eq('user_id', userId)
    throw new Error(`Failed to delete stock entry: ${deleteError.message}`)
  }

  return { deleted: true, quantity_removed: entryQty }
}
