import { requireAuth } from '@/lib/auth/utils'
import ProductDetailPage from './ProductDetailPage'

export default async function ProductDetailRoute({ params }) {
  await requireAuth()
  return <ProductDetailPage productId={(await params).id} />
}
