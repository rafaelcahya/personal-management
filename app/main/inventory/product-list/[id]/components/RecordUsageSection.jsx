import { Activity } from 'lucide-react'
import RecordUsageForm from '@/app/main/inventory/product-list/detail/RecordUsageForm'

export default function RecordUsageSection({ product, onUpdated }) {
  return (
    <section
      id="recordUsageSection_productDetailPage"
      className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      aria-labelledby="record-usage-heading"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <Activity className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p id="record-usage-heading" className="text-sm font-semibold text-slate-900">
            Record Usage
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Log when you open and start using this product
          </p>
        </div>
      </div>
      <div className="p-5">
        <RecordUsageForm product={product} onUpdated={onUpdated} />
      </div>
    </section>
  )
}
