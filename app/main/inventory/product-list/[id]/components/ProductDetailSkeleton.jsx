import { Skeleton } from '@/components/base/Skeleton/Skeleton'

function SectionSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <Skeleton className="size-9 rounded-lg shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailSkeleton() {
  return (
    <div
      id="loadingState_productDetailPage"
      className="flex flex-col gap-5"
      aria-live="polite"
      aria-label="Loading product details"
    >
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 mb-1" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* ProductInfoCard */}
      <div className="bg-white border border-slate-200/50 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left — product details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
          {/* Right — stock overview */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-28" />
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AddStockSection + RecordUsageSection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SectionSkeleton rows={4} />
        <SectionSkeleton rows={3} />
      </div>

      {/* StockHistorySection + UsageHistorySection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SectionSkeleton rows={3} />
        <SectionSkeleton rows={3} />
      </div>
    </div>
  )
}
