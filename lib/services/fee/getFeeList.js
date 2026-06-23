import { createClient } from '@/lib/supabase/server'

export async function getFeeList(userId, { page = 1, limit = 15 } = {}) {
  if (!userId) {
    throw new Error('User ID is required')
  }

  const supabase = await createClient()

  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('fee_list')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('fee_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch fees:', error)
    throw new Error(error.message || 'Failed to fetch fees')
  }

  return {
    fees: data || [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}
