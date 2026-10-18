import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-3 w-40 rounded" />
      </div>

      {/* Profile, HR zones, Pace zones, Strava, Danger zone */}
      <Skeleton className="h-96 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
  )
}
