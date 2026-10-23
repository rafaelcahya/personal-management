import { createClient } from '@/lib/supabase/server'

export async function deleteCashCategory(userId, id) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('trd_uninvested_cash_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('[investmentFlow/deleteCashCategory]', error)
    throw new Error('Failed to delete uninvested cash category')
  }
}
