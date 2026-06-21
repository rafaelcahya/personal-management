import { requireAuth } from '@/lib/auth/utils'
import { createClient } from '@/lib/supabase/server'
import { getTradeList } from '@/lib/services/trade/getTradeList'
import TradesPageClient from './TradesPageClient'

export default async function TradesPage() {
  const user = await requireAuth()

  if (!user || !user.id) {
    throw new Error('User ID is missing after authentication')
  }

  const supabase = await createClient()
  const result = await getTradeList(supabase, user.id, { page: 1, limit: 15 })

  return (
    <TradesPageClient
      initialTrades={result.trades}
      initialTotal={result.total}
      initialPage={result.page}
      initialLimit={result.limit}
    />
  )
}
