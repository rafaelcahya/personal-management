import { requireAuth } from '@/lib/auth/utils'
import ProductNamesPageClient from './ProductNamesPageClient'

export default async function ProductNamePage() {
  await requireAuth()
  return <ProductNamesPageClient />
}
