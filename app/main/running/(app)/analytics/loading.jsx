import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-6 w-28 rounded" />
      </div>

      {/* Sync button row */}
      <Skeleton className="h-9 w-36 rounded-lg" />

      {/* Section card skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 bg-white p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-64 rounded" />
            </div>
          </div>
          <Skeleton className="h-52 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
