import { createClient } from '@/lib/supabase/server'

export async function listCashCategories(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uninvested_cash_categories')
    .select('id, name, nominal, sort_order, created_at')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[investmentFlow/listCashCategories]', error)
    throw new Error('Failed to fetch uninvested cash categories')
  }

  return data ?? []
}
