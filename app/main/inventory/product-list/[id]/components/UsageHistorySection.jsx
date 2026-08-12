import { Package } from 'lucide-react'
import ProductUsageLog from '@/app/main/inventory/product-list/detail/ProductUsageLog'

export default function UsageHistorySection({ usageHistory, onRefresh }) {
  return (
    <section
      id="usageSection_productDetailPage"
      className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      aria-labelledby="usage-history-heading"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <Package className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p id="usage-history-heading" className="text-sm font-semibold text-slate-900">
            Usage History
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Recorded usage sessions</p>
        </div>
      </div>
      <ProductUsageLog log={usageHistory} onUpdate={onRefresh} />
    </section>
  )
}
