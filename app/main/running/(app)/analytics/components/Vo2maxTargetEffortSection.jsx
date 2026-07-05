'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { getTargetEffort } from '@/lib/api/running'
import Vo2maxGapCard from './Vo2maxGapCard'
import Vo2maxProjectionChart from './Vo2maxProjectionChart'

export default function Vo2maxTargetEffortSection({ activities }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getTargetEffort()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load target effort data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div
        id="vo2maxTargetEffortLoading_analyticsPage"
        className="flex flex-col lg:flex-row gap-6"
        aria-label="Loading VO2max target effort"
      >
        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-3">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="vo2maxTargetEffortError_analyticsPage"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-4"
        role="alert"
      >
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  const showChart =
    data && data.status === 'ok' && data.statusBadge !== 'Goal Expired' && data.weeksToGoal != null

  return (
    <div id="vo2maxTargetEffortSection_analyticsPage" className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[340px] shrink-0">
        <Vo2maxGapCard data={data} />
      </div>

      {showChart && (
        <div className="flex-1 min-w-0">
          <Vo2maxProjectionChart data={data} activities={activities ?? []} />
        </div>
      )}
    </div>
  )
}
