import { createClient } from '@/lib/supabase/server'

export async function createCashCategory(userId, { name, nominal, sort_order = 0 }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uninvested_cash_categories')
    .insert({ user_id: userId, name, nominal, sort_order })
    .select('id, name, nominal, sort_order, created_at')
    .single()

  if (error) {
    console.error('[investmentFlow/createCashCategory]', error)
    throw new Error('Failed to create uninvested cash category')
  }

  return data
}
