'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const DISTANCE_PRESETS = [
  { label: '1K', m: 1000 },
  { label: '1 mi', m: 1609.34 },
  { label: '5K', m: 5000 },
  { label: '10K', m: 10000 },
  { label: '15K', m: 15000 },
  { label: 'Half Marathon', m: 21097.5 },
  { label: 'Marathon', m: 42195 },
  { label: '50K', m: 50000 },
  { label: 'Custom', m: null },
]

export default function DistanceSelect({
  preset,
  customValue,
  unit,
  onPresetChange,
  onCustomChange,
  selectId,
  customId,
}) {
  function handleCustomChange(e) {
    const normalized = e.target.value.replace(',', '.')
    onCustomChange(normalized)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">Distance</Label>
      <Select value={preset} onValueChange={onPresetChange}>
        <SelectTrigger
          id={selectId}
          className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
        >
          <SelectValue placeholder="Select distance" />
        </SelectTrigger>
        <SelectContent>
          {DISTANCE_PRESETS.map((p) => (
            <SelectItem key={p.label} value={p.label} className="text-sm cursor-pointer">
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {preset === 'Custom' && (
        <div className="flex items-center gap-2">
          <Input
            id={customId}
            type="text"
            inputMode="decimal"
            value={customValue}
            onChange={handleCustomChange}
            placeholder={unit === 'mi' ? 'e.g. 3.1' : 'e.g. 5.0'}
            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
          />
          <span className="text-sm text-slate-500 shrink-0">{unit}</span>
        </div>
      )}
    </div>
  )
}
