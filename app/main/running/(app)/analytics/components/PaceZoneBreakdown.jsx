'use client'

import { Settings } from 'lucide-react'
import ZoneBreakdownBars from './ZoneBreakdownBars'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'

// Z1 (Easy/slowest) → Z5 (VO2max/fastest): blue shades → violet
const PACE_ZONE_COLORS = ['#bfdbfe', '#93c5fd', '#60a5fa', '#818cf8', 'var(--color-violet-600)']

export default function PaceZoneBreakdown({ data, error }) {
  if (error) {
    return (
      <EmptyState size="sm" variant="error">
        <EmptyStateTitle>Failed to load pace zone data</EmptyStateTitle>
      </EmptyState>
    )
  }

  if (!data) return null

  if (!data.has_threshold) {
    return (
      <EmptyState id="paceZoneNoThreshold_analyticsPage" size="sm">
        <EmptyStateIcon icon={Settings} />
        <EmptyStateTitle>Threshold pace not set</EmptyStateTitle>
        <EmptyStateDescription>
          Set your threshold pace in Settings to enable pace zone breakdown.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  if (!data.has_data || !data.zones) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No pace data in this range</EmptyStateTitle>
        <EmptyStateDescription>Activities with GPS pace data are needed.</EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div id="paceZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <ZoneBreakdownBars zones={data.zones} colors={PACE_ZONE_COLORS} />
    </div>
  )
}
