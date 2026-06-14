'use client'

import ZoneBreakdownBars from './ZoneBreakdownBars'
import EmptyState from './EmptyState'

// Matches StreamCharts.jsx CADENCE_BANDS colors
const CADENCE_COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981']

export default function CadenceZoneBreakdown({ data, error }) {
  if (error) {
    return <EmptyState message="Failed to load cadence data" />
  }

  if (!data) return null

  if (!data.has_data || !data.bands) {
    return (
      <EmptyState
        message="No cadence data in this range"
        details="Activities with cadence sensor data are needed."
      />
    )
  }

  return (
    <div id="cadenceZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <ZoneBreakdownBars zones={data.bands} colors={CADENCE_COLORS} />
    </div>
  )
}
