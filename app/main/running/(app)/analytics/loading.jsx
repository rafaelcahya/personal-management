import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-6 w-28 rounded" />
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* AI insight card */}
      <Skeleton className="h-28 rounded-xl" />

      {/* Chart sections */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
