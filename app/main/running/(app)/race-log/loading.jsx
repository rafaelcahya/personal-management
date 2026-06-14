import { Skeleton } from '@/components/ui/skeleton'

export default function RaceLogLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>

      {/* Upcoming races section */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-full" />
        ))}
        <Skeleton className="h-9 w-48 rounded-md ml-auto" />
      </div>

      {/* Race log table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 bg-slate-50">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded ml-auto" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
            </div>
            <Skeleton className="h-3 w-16 rounded ml-auto" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
