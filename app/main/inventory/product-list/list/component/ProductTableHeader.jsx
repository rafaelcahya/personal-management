import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Package } from 'lucide-react'

export default function ProductTableHeader({ summary, loading }) {
  const activeProducts = loading ? null : (summary?.activeProducts ?? 0)
  const favoriteProducts = loading ? null : (summary?.favoriteProducts ?? 0)

  return (
    <CardHeader>
      <CardIcon icon={Package} />
      <div className="min-w-0 flex-1">
        <CardTitle className="text-sm font-semibold text-slate-900">Product Inventory</CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          Track stock levels, usage patterns, and restock timing
        </CardDescription>
      </div>
      <CardAction>
        {activeProducts !== null && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-md">
              {activeProducts} active
            </span>
            <span className="text-xs bg-yellow-50 text-yellow-700 font-medium px-2.5 py-1 rounded-md hidden sm:inline-flex">
              {favoriteProducts} {favoriteProducts === 1 ? 'favorite' : 'favorites'}
            </span>
          </div>
        )}
      </CardAction>
    </CardHeader>
  )
}
