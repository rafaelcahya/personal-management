import { createClient } from '@/lib/supabase/server'

export async function getLastPurchasePrice(userId, productListId) {
  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from('product_list')
    .select('id')
    .eq('id', productListId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  if (productError || !product) throw new Error('Product not found')

  const { data, error } = await supabase
    .from('product_quantity')
    .select('price, purchase_date')
    .eq('product_list_id', productListId)
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data
    ? { last_purchase_price: data.price, last_purchase_date: data.purchase_date }
    : { last_purchase_price: null, last_purchase_date: null }
}
