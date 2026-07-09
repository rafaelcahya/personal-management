'use client'

import ZoneBreakdownBars from './ZoneBreakdownBars'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'

// Matches ZONE_COLORS in StreamCharts.jsx: Z1→Z5 light-to-dark red
const HR_ZONE_COLORS = ['#fecdd3', '#fca5a5', '#f87171', '#ef4444', '#b91c1c']

export default function HrZoneBreakdown({ data, error }) {
  if (error) {
    return (
      <EmptyState size="sm" variant="error">
        <EmptyStateTitle>Failed to load HR zone data</EmptyStateTitle>
      </EmptyState>
    )
  }

  if (!data) return null

  if (data.missing_config) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>Max HR not configured</EmptyStateTitle>
        <EmptyStateDescription>
          Set your Max HR in Settings → HR Zones to enable this breakdown.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  if (!data.has_data || !data.zones) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No HR data in this range</EmptyStateTitle>
        <EmptyStateDescription>
          Activities with heart rate sensor data are needed.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div id="hrZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <ZoneBreakdownBars zones={data.zones} colors={HR_ZONE_COLORS} />
    </div>
  )
}
