import { Package } from 'lucide-react'

export default function ProductTableHeader({ summary, loading }) {
  const activeProducts = loading ? null : (summary?.activeProducts ?? 0)
  const favoriteProducts = loading ? null : (summary?.favoriteProducts ?? 0)

  return (
    <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
      <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
        <Package className="size-4 text-violet-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Product Inventory</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Track stock levels, usage patterns, and restock timing
        </p>
      </div>
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
    </div>
  )
}
