import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Page title */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-3 w-40 rounded" />
      </div>

      {/* Profile section */}
      <Skeleton className="h-48 rounded-xl" />

      {/* HR zones section */}
      <Skeleton className="h-56 rounded-xl" />

      {/* Notifications section */}
      <Skeleton className="h-32 rounded-xl" />

      {/* Strava connection section */}
      <Skeleton className="h-32 rounded-xl" />

      {/* Strava integration section */}
      <Skeleton className="h-28 rounded-xl" />

      {/* Danger zone section */}
      <Skeleton className="h-24 rounded-xl" />
    </div>
  )
}
