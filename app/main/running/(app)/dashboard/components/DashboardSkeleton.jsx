'use client'

import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function DashboardSkeleton() {
  return (
    <div
      id="dashboardSkeleton"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      className="flex flex-col gap-6"
    >
      {/* Filter bar + sync bar */}
      <Skeleton className="h-10 rounded-lg" />

      {/* WeeklyStats — 5 stat columns */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      {/* TrainingLoad — large card with ACWR + stats grid */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-72 rounded-xl" />
      </div>

      {/* YtdStats — 4 stat columns */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      {/* NextRace + ShoeRotation — 2-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>

      {/* ActivitySection — calendar + recent activities */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-80 rounded-xl" />
      </div>

      {/* PerformanceTrends — tabs + chart */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-64 rounded-xl" />
      </div>

      {/* AiCoachPlaceholder */}
      <Skeleton className="h-20 rounded-xl" />
    </div>
  )
}
