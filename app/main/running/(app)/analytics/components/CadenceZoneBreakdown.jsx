'use client'

import ZoneBreakdownBars from './ZoneBreakdownBars'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'

// Matches StreamCharts.jsx CADENCE_BANDS colors
const CADENCE_COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981']

export default function CadenceZoneBreakdown({ data, error }) {
  if (error) {
    return (
      <EmptyState size="sm" variant="error">
        <EmptyStateTitle>Failed to load cadence data</EmptyStateTitle>
      </EmptyState>
    )
  }

  if (!data) return null

  if (!data.has_data || !data.bands) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No cadence data in this range</EmptyStateTitle>
        <EmptyStateDescription>
          Activities with cadence sensor data are needed.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div id="cadenceZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <ZoneBreakdownBars zones={data.bands} colors={CADENCE_COLORS} />
    </div>
  )
}
