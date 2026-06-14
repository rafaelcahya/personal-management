'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const RANGE_OPTIONS = [
  { value: '4w', label: 'Last 4 weeks' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last 1 year' },
  { value: 'all', label: 'All time' },
]

const TYPE_OPTIONS = [
  { value: 'All', label: 'All types' },
  { value: 'Run', label: 'Run' },
  { value: 'TrailRun', label: 'Trail Run' },
  { value: 'VirtualRun', label: 'Virtual Run' },
  { value: 'Walk', label: 'Walk' },
  { value: 'Hike', label: 'Hike' },
]

export default function ZoneFilterBar({ range, activityType, onRangeChange, onTypeChange }) {
  return (
    <div id="zoneFilterBar_analyticsPage" className="flex flex-wrap items-center gap-2">
      <Select value={range} onValueChange={onRangeChange}>
        <SelectTrigger
          id="zoneRangeSelect_analyticsPage"
          className="h-8 w-40 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={activityType} onValueChange={onTypeChange}>
        <SelectTrigger
          id="zoneTypeSelect_analyticsPage"
          className="h-8 w-36 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
