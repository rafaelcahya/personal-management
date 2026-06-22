import { requireAuth } from '@/lib/auth/utils'
import FeesPageClient from './FeesPageClient'

export default async function FeesPage() {
  await requireAuth()
  return <FeesPageClient />
}
