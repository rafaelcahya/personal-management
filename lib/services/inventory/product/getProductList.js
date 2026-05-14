import { createClient } from '@/lib/supabase/server'

export async function getProductList(userId) {
  const supabase = await createClient()

  // product and brand are denormalized at insert time, no extra lookups needed
  const { data, error } = await supabase
    .from('product_list')
    .select(
      'id,uuid,user_id,product,brand,type,product_id,brand_id,product_status,quantity,usage_quantity,usage_date,product_image,note,is_favorite,created_at,updated_at,deleted_at'
    )
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_favorite', { ascending: false })
    .order('created_at', { ascending: false })
    .range(0, 9999)

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(error.message)
  }

  return data || []
}
