import { Skeleton } from '@/components/ui/skeleton'

export default function AICoachLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-6 w-28 rounded" />
      </div>

      {/* Training load tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Daily insight card */}
      <Skeleton className="h-40 rounded-xl" />

      {/* Weekly review + Friday prep — 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>

      {/* Anomaly alerts */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      {/* Injury coach */}
      <Skeleton className="h-32 rounded-xl" />

      {/* Race countdown */}
      <Skeleton className="h-24 rounded-xl" />
    </div>
  )
}
