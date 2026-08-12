import { createClient } from '@/lib/supabase/server'

export async function updateQuantityEntry(userId, entryId, payload) {
  const supabase = await createClient()

  // fetch full entry for ownership check + complete rollback data
  const { data: entry, error: entryError } = await supabase
    .from('product_quantity')
    .select('id, product_list_id, quantity_added, price, purchase_date, note')
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

  const oldQty = Number(entry.quantity_added)
  const newQty = payload.quantity_added !== undefined ? Number(payload.quantity_added) : oldQty
  const currentProductQty = Number(product.quantity)
  const quantityChanged = newQty !== oldQty

  if (quantityChanged) {
    const projectedQty = currentProductQty - oldQty + newQty
    if (projectedQty < 0) {
      throw new Error(
        `Cannot reduce quantity: current stock is ${currentProductQty} and removing ${oldQty - newQty} units would make it negative`
      )
    }
  }

  const updateData = {}
  if (payload.quantity_added !== undefined) updateData.quantity_added = newQty
  if (payload.price !== undefined) updateData.price = Number(payload.price)
  if (payload.purchase_date !== undefined) updateData.purchase_date = payload.purchase_date
  if ('note' in payload) updateData.note = payload.note || null

  const { data: updated, error: updateError } = await supabase
    .from('product_quantity')
    .update(updateData)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select('id, product_list_id, quantity_added, price, purchase_date, note, user_id, created_at')
    .single()

  if (updateError) {
    throw new Error(`Failed to update stock entry: ${updateError.message}`)
  }

  if (quantityChanged) {
    const newProductQty = currentProductQty - oldQty + newQty

    // optimistic concurrency: .eq('quantity', currentProductQty) ensures another
    // concurrent write hasn't changed the value between our read and this write
    const { data: syncedProduct, error: productUpdateError } = await supabase
      .from('product_list')
      .update({ quantity: newProductQty, updated_at: new Date().toISOString() })
      .eq('id', entry.product_list_id)
      .eq('user_id', userId)
      .eq('quantity', currentProductQty)
      .select('id')
      .single()

    if (productUpdateError || !syncedProduct) {
      // full rollback: restore all original fields, not just quantity_added
      await supabase
        .from('product_quantity')
        .update({
          quantity_added: entry.quantity_added,
          price: entry.price,
          purchase_date: entry.purchase_date,
          note: entry.note,
        })
        .eq('id', entryId)
        .eq('user_id', userId)

      if (!syncedProduct && !productUpdateError) {
        throw new Error('Stock was modified by another action — please try again')
      }
      throw new Error(`Failed to sync product quantity: ${productUpdateError?.message}`)
    }
  }

  return updated
}
