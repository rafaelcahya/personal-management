import { requireAuth } from '@/lib/auth/utils'
import ProductHistoryPageClient from './ProductHistoryPageClient'

export default async function ProductHistoryPage() {
  const user = await requireAuth()

  if (!user || !user.id) {
    throw new Error('User ID is missing after authentication')
  }

  return <ProductHistoryPageClient />
}
