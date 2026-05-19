import { createAdminClient } from '@/lib/supabase/admin'

export async function getProductHistoryByProductListId(productId, userId) {
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from('product_history')
    .select('*')
    .eq('product_list_id', Number(productId))
    .eq('user_id', userId)
    .order('start_usage_date', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Query error:', error)
    throw new Error(error.message)
  }

  return data || []
}
