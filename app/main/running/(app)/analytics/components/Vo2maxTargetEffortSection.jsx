'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { getTargetEffort, getVo2maxTarget, updateVo2maxTarget } from '@/lib/api/running'
import Vo2maxGapCard from './Vo2maxGapCard'
import Vo2maxProjectionChart from './Vo2maxProjectionChart'
import { RUN_TYPES } from './utils'

function computeCurrentVo2max(activities) {
  const qualifying = (activities ?? []).filter(
    (a) => RUN_TYPES.has(a.activity_type) && a.estimated_vo2max != null && a.avg_hr != null
  )
  if (!qualifying.length) return null
  const sum = qualifying.reduce((acc, a) => acc + Number(a.estimated_vo2max), 0)
  return Math.round((sum / qualifying.length) * 10) / 10
}

export default function Vo2maxTargetEffortSection({ activities }) {
  const [data, setData] = useState(null)
  const [manualTarget, setManualTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [effortResult, targetResult] = await Promise.allSettled([
          getTargetEffort(),
          getVo2maxTarget(),
        ])
        if (cancelled) return
        if (effortResult.status === 'fulfilled') setData(effortResult.value)
        else setError(effortResult.reason?.message || 'Failed to load target effort data')
        if (targetResult.status === 'fulfilled') {
          setManualTarget(targetResult.value?.vo2max_target ?? null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSaveTarget(value) {
    const saved = await updateVo2maxTarget(value)
    setManualTarget(saved.vo2max_target)
  }

  async function handleClearTarget() {
    const saved = await updateVo2maxTarget(null)
    setManualTarget(saved.vo2max_target)
  }

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

  const hasRaceGoal = data && data.status !== 'no_goal'
  const currentVo2max = computeCurrentVo2max(activities)
  const useManualTarget = manualTarget != null

  function computeManualWeeksToGoal(current, required) {
    if (current == null || current >= required) return null
    const rates = { realistic: 0.025, optimistic: 0.04, pessimistic: 0.015 }
    const calc = (rate) => {
      const weeklyRate = rate / 4
      return Math.ceil(Math.log(required / current) / Math.log(1 + weeklyRate))
    }
    return {
      optimistic: calc(rates.optimistic),
      realistic: calc(rates.realistic),
      pessimistic: calc(rates.pessimistic),
    }
  }

  const manualWeeksToGoal = useManualTarget
    ? computeManualWeeksToGoal(currentVo2max, manualTarget)
    : null

  const manualCardData = useManualTarget
    ? {
        status: 'manual_target',
        currentVo2max,
        requiredVo2max: manualTarget,
        gapMlKgMin:
          currentVo2max != null ? Math.round((currentVo2max - manualTarget) * 10) / 10 : null,
        weeksToGoal: manualWeeksToGoal,
      }
    : null

  const activeData = useManualTarget ? manualCardData : data

  const showChart = useManualTarget
    ? currentVo2max != null && manualTarget != null && manualWeeksToGoal != null
    : hasRaceGoal &&
      data.status === 'ok' &&
      data.statusBadge !== 'Goal Expired' &&
      data.weeksToGoal != null

  return (
    <div id="vo2maxTargetEffortSection_analyticsPage" className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[340px] shrink-0">
        <Vo2maxGapCard
          data={activeData}
          manualTarget={manualTarget}
          onSaveTarget={handleSaveTarget}
          onClearTarget={handleClearTarget}
        />
      </div>

      {showChart && (
        <div className="flex-1 min-w-0">
          <Vo2maxProjectionChart data={activeData} activities={activities ?? []} />
        </div>
      )}
    </div>
  )
}
