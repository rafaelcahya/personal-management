import { createClient } from '@/lib/supabase/server'

const STATUSES = ['active', 'inactive', 'deleted']

// Counts in the database; the paginated list would only cover the first page.
export async function getProductBrandSummary(userId) {
  const supabase = await createClient()

  const counts = await Promise.all(
    STATUSES.map(async (status) => {
      const { count, error } = await supabase
        .from('inv_product_brand')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('brand_status', status)
      if (error) throw error
      return [status, count ?? 0]
    })
  )

  const totalStatus = Object.fromEntries(counts.filter(([, count]) => count > 0))
  const totalProductBrands = counts.reduce((sum, [, count]) => sum + count, 0)

  return { totalProductBrands, totalStatus }
}
