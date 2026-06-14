'use client'

import ZoneBreakdownBars from './ZoneBreakdownBars'
import EmptyState from './EmptyState'

// Matches ZONE_COLORS in StreamCharts.jsx: Z1→Z5 light-to-dark red
const HR_ZONE_COLORS = ['#fecdd3', '#fca5a5', '#f87171', '#ef4444', '#b91c1c']

const METHOD_LABELS = {
  max_hr: 'Max HR',
  karvonen: 'Heart Rate Reserve',
  threshold: 'Lactate Threshold',
}

export default function HrZoneBreakdown({ data, error }) {
  if (error) {
    return <EmptyState message="Failed to load HR zone data" />
  }

  if (!data) return null

  if (data.missing_config) {
    return (
      <EmptyState
        message="Max HR not configured"
        details="Set your Max HR in Settings → HR Zones to enable this breakdown."
      />
    )
  }

  if (!data.has_data || !data.zones) {
    return (
      <EmptyState
        message="No HR data in this range"
        details="Activities with heart rate sensor data are needed."
      />
    )
  }

  return (
    <div id="hrZoneBreakdown_analyticsPage" className="flex flex-col gap-3">
      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
        Method: {METHOD_LABELS[data.method] ?? data.method}
      </p>
      <ZoneBreakdownBars zones={data.zones} colors={HR_ZONE_COLORS} />
    </div>
  )
}
