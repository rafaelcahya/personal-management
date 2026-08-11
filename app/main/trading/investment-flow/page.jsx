import { requireAuth } from '@/lib/auth/utils'
import InvestmentFlowPageClient from './InvestmentFlowPageClient'

export default async function InvestmentFlowPage() {
  await requireAuth()
  return <InvestmentFlowPageClient />
}
