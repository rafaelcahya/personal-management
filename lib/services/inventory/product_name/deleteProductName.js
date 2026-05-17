import { createClient } from '@/lib/supabase/server'

export async function deleteProductName(id, userId) {
  const supabase = await createClient()

  const { data: activeProducts, error: guardError } = await supabase
    .from('product_list')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', Number(id))
    .is('deleted_at', null)

  if (guardError) {
    console.error('[product-name/delete] guard check error:', guardError)
    throw new Error(guardError.message)
  }

  const activeCount = (activeProducts || []).length
  if (activeCount > 0) {
    const err = new Error(
      `Product name is still used by ${activeCount} product(s) and cannot be deleted`
    )
    err.code = 'CONFLICT'
    throw err
  }

  const { data, error } = await supabase
    .from('product_name')
    .update({
      product_name_status: 'deleted',
      deleted_at: new Date().toISOString(),
    })
    .eq('id', Number(id))
    .eq('user_id', userId)
    .select('id, product_name, product_name_status, deleted_at')

  if (error) {
    throw new Error(error.message)
  }

  if (!data || data.length === 0) {
    throw new Error('Product name not found or unauthorized')
  }

  return data[0]
}
