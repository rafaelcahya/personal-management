import { createClient } from '@/lib/supabase/server'

export async function updateCashCategory(userId, id, updates) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uninvested_cash_categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, name, nominal, sort_order, created_at')
    .single()

  if (error) {
    console.error('[investmentFlow/updateCashCategory]', error)
    throw new Error('Failed to update uninvested cash category')
  }

  if (!data) {
    const err = new Error('Category not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  return data
}
