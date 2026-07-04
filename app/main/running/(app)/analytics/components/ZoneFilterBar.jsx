'use client'

import { format } from 'date-fns'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import Button from '@/components/base/Button/Button'
import { cn } from '@/lib/utils'

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '4w', label: 'Last 4 weeks' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last 1 year' },
  { value: 'all', label: 'All time' },
]

const TYPE_LABELS = {
  TrailRun: 'Trail Run',
  VirtualRun: 'Virtual Run',
}

function buildTypeOptions(types) {
  const options = [{ value: 'All', label: 'All types' }]
  for (const t of types) {
    options.push({ value: t, label: TYPE_LABELS[t] ?? t })
  }
  return options
}

function toDate(str) {
  return str ? new Date(str + 'T00:00:00') : undefined
}

function DatePickerButton({ id, label, value, onChange, maxDate, minDate }) {
  const date = toDate(value)
  const fromDate = minDate ? toDate(minDate) : undefined
  const upperBound = maxDate ? toDate(maxDate) : new Date()
  const toBound = upperBound < new Date() ? upperBound : new Date()

  return (
    <div className="flex items-center gap-0.5">
      <DatePicker
        id={id}
        value={date}
        onChange={(d) => onChange(d ? format(d, 'yyyy-MM-dd') : null)}
        placeholder={label}
        displayFormat="d MMM yyyy"
        size="sm"
        fromDate={fromDate}
        toDate={toBound}
        className={cn(
          'h-8 gap-1.5 border-slate-200',
          value ? 'text-slate-700 pr-1' : 'text-slate-400'
        )}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange(null)}
          className="size-5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label={`Clear ${label}`}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}

export default function ZoneFilterBar({
  range,
  activityType,
  activityTypes = [],
  startDate,
  endDate,
  onRangeChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
}) {
  const typeOptions = buildTypeOptions(activityTypes)
  return (
    <div id="zoneFilterBar_analyticsPage" className="flex flex-wrap items-center gap-2">
      <DatePickerButton
        id="zoneStartDate_analyticsPage"
        label="Start date"
        value={startDate}
        onChange={onStartDateChange}
        maxDate={endDate}
      />

      <DatePickerButton
        id="zoneEndDate_analyticsPage"
        label="End date"
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
      />

      <div className="w-px h-4 bg-slate-200" aria-hidden="true" />

      <Select value={range} onValueChange={onRangeChange} disabled={!!(startDate && endDate)}>
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
          {typeOptions.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
