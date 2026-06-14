'use client'

import { Settings } from 'lucide-react'
import ZoneBreakdownBars from './ZoneBreakdownBars'
import EmptyState from './EmptyState'

// Z1 (Easy/slowest) → Z5 (VO2max/fastest): blue shades → violet
const PACE_ZONE_COLORS = ['#bfdbfe', '#93c5fd', '#60a5fa', '#818cf8', '#7c3aed']

export default function PaceZoneBreakdown({ data, error }) {
  if (error) {
    return <EmptyState message="Failed to load pace zone data" />
  }

  if (!data) return null

  if (!data.has_threshold) {
    return (
      <div
        id="paceZoneNoThreshold_analyticsPage"
        className="flex flex-col items-center justify-center h-[180px] gap-2 text-center px-4"
      >
        <Settings className="size-4 text-slate-300" aria-hidden="true" />
        <p className="text-sm text-slate-400">Threshold pace not set</p>
        <p className="text-xs text-slate-300">
          Set your threshold pace in Settings to enable pace zone breakdown.
        </p>
      </div>
    )
  }

  if (!data.has_data || !data.zones) {
    return (
      <EmptyState
        message="No pace data in this range"
        details="Activities with GPS pace data are needed."
      />
    )
  }

  return (
    <div id="paceZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <ZoneBreakdownBars zones={data.zones} colors={PACE_ZONE_COLORS} />
    </div>
  )
}
