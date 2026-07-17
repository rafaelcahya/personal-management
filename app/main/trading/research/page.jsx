import { requireAuth } from '@/lib/auth/utils'
import { createClient } from '@/lib/supabase/server'
import ResearchPageClient from './ResearchPageClient'

export default async function ResearchPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: trades } = await supabase
    .from('trade_list')
    .select('ticker')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .not('ticker', 'is', null)

  const tickers = [...new Set((trades ?? []).map((t) => t.ticker).filter(Boolean))].sort()

  return <ResearchPageClient tickers={tickers} />
}
