'use client'

export default function ProductTableHeader({ summary, loading }) {
  const activeProducts = loading ? 0 : (summary?.activeProducts ?? 0)
  const favoriteProducts = loading ? 0 : (summary?.favoriteProducts ?? 0)

  return (
    <>
      <div className="space-y-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">📦 Product Inventory</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-1.5 max-w-2xl">
            Track everything in your inventory—from stock levels to usage patterns. Star your
            favorites for instant access, monitor quantities, and never run out of essentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 pt-2">
          <span className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-md">
            <span>📦</span>
            <p className="font-semibold text-green-700">{activeProducts}</p>
            <p>active {activeProducts === 1 ? 'product' : 'products'}</p>
          </span>
          <span className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md">
            <span>⭐</span>
            <p className="font-semibold text-yellow-700">{favoriteProducts}</p>
            <p>{favoriteProducts === 1 ? 'favorite' : 'favorites'}</p>
          </span>
        </div>
      </div>
    </>
  )
}
