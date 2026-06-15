import { Skeleton } from '@/components/ui/skeleton'

export default function ActivitiesLoading() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>

      {/* Filter + search bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-48 rounded-md ml-auto" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 bg-slate-50">
          <Skeleton className="h-3 w-32 rounded" />
          <Skeleton className="h-3 w-16 rounded ml-auto" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-36 rounded" />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
            </div>
            <Skeleton className="h-3 w-14 rounded ml-auto" />
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  )
}
