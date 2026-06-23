import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading currency dashboard">
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
