import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function RouteSimulationDetailLoading() {
  return (
    <div
      id="routeSimulationDetailLoading_routeSimulationDetailPage"
      role="status"
      className="space-y-6"
    >
      <div className="space-y-2 pt-6 lg:pt-0">
        <Skeleton className="h-3 w-56 rounded" />
        <Skeleton className="h-7 w-64 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <span className="sr-only">Loading simulation</span>
    </div>
  )
}
