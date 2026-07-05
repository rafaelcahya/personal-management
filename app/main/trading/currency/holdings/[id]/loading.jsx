import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-5 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-28" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
