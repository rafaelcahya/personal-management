import { createClient } from '@/lib/supabase/server'

export async function updateProductDetails(userId, id, payload) {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('product_list')
    .select('id, user_id')
    .eq('id', id)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (fetchError || !current) {
    const err = new Error('Product not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  const { brand_id, product_id, type, product_status } = payload

  const { data: brandData, error: brandError } = await supabase
    .from('product_brand')
    .select('brand')
    .eq('id', brand_id)
    .eq('user_id', userId)
    .single()

  if (brandError || !brandData) {
    const err = new Error('Brand not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  const { data: productNameData, error: productNameError } = await supabase
    .from('product_name')
    .select('product_name')
    .eq('id', product_id)
    .eq('user_id', userId)
    .single()

  if (productNameError || !productNameData) {
    const err = new Error('Product name not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  const { data: updated, error: updateError } = await supabase
    .from('product_list')
    .update({
      brand_id,
      product_id,
      brand: brandData.brand,
      product: productNameData.product_name,
      type,
      product_status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) throw new Error(updateError.message)
  return updated
}
