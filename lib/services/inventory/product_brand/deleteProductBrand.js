import { createClient } from '@/lib/supabase/server'

export async function deleteProductBrand(id, userId) {
  const supabase = await createClient()

  const { data: usedBy, error: usageError } = await supabase
    .from('product_list')
    .select('id')
    .eq('brand_id', id)
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (usageError) throw new Error(usageError.message)

  if (usedBy && usedBy.length > 0) {
    const conflict = new Error(
      `Brand is still used by ${usedBy.length} product(s) and cannot be deleted`
    )
    conflict.status = 409
    throw conflict
  }

  const { data, error } = await supabase
    .from('product_brand')
    .update({
      brand_status: 'deleted',
      deleted_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  if (!data || data.length === 0) {
    throw new Error('Product brand not found or unauthorized')
  }

  return data[0]
}
