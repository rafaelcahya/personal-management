import { requireAuth } from '@/lib/auth/utils'
import ProductBrandsPageClient from './ProductBrandsPageClient'

export default async function ProductBrandPage() {
  await requireAuth()
  return <ProductBrandsPageClient />
}
