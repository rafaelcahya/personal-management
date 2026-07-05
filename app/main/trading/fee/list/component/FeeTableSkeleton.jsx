'use client'

import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function FeeTableSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading fees">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-1">
          <Skeleton className="h-5 w-[20%]" />
          <Skeleton className="h-5 w-[45%]" />
          <Skeleton className="h-5 w-[25%] ml-auto" />
        </div>
      ))}
    </div>
  )
}
