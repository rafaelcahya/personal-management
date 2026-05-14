import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function ProductSummary({ product }) {
  if (!product) return null

  const hasActiveSession = product.usage_quantity > 0

  return (
    <div
      id="summarySection_productListPage"
      className="space-y-3 p-3 bg-violet-50/75 rounded-lg border border-violet-100 text-sm w-full sm:w-1/3 self-start"
    >
      <div className="space-y-1">
        <p className="text-slate-500 text-xs">Product</p>
        <p className="font-medium text-slate-800 leading-snug">
          {product.brand} {product.type} {product.product}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-slate-500 text-xs">In Stock</p>
          <p className="font-mono font-semibold text-slate-900">{product.quantity}</p>
        </div>
        <div className="space-y-1">
          <p className="text-slate-500 text-xs">In Use</p>
          <p
            className={cn(
              'font-mono font-semibold',
              hasActiveSession ? 'text-violet-700' : 'text-slate-900'
            )}
          >
            {product.usage_quantity}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-xs">Last Used</p>
        <p className="font-medium text-slate-900">
          {product.usage_date ? format(new Date(product.usage_date), 'dd MMM yyyy') : 'Never'}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-xs">Status</p>
        <span
          className={cn(
            'px-2 py-0.5 rounded-md text-xs font-semibold capitalize',
            product.product_status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          )}
        >
          {product.product_status}
        </span>
      </div>
      {hasActiveSession && (
        <div id="activeSessionSummary_productListPage" className="pt-1 border-t border-violet-200">
          <p className="text-xs text-violet-600 font-medium">Active session in progress</p>
        </div>
      )}
    </div>
  )
}
