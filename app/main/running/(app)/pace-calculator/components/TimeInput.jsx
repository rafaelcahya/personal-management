'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TimeInput({ hours, minutes, seconds, onChange, idPrefix }) {
  function handleBlur(field, value) {
    let n = parseInt(value, 10)
    if (isNaN(n) || n < 0) n = 0
    if (field === 'seconds' && n >= 60) n = 59
    if (field === 'minutes' && n >= 60) n = 59
    if (field === 'hours' && n > 99) n = 99
    onChange(field, String(n))
  }

  const fieldClass =
    'w-16 text-center text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">Time</Label>
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-center gap-0.5">
          <Input
            id={`${idPrefix}Hours`}
            type="number"
            min={0}
            max={99}
            value={hours}
            onChange={(e) => onChange('hours', e.target.value)}
            onBlur={(e) => handleBlur('hours', e.target.value)}
            placeholder="00"
            className={fieldClass}
          />
          <span className="text-[10px] text-slate-400">HH</span>
        </div>
        <span className="text-slate-400 font-medium pb-3">:</span>
        <div className="flex flex-col items-center gap-0.5">
          <Input
            id={`${idPrefix}Minutes`}
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => onChange('minutes', e.target.value)}
            onBlur={(e) => handleBlur('minutes', e.target.value)}
            placeholder="00"
            className={fieldClass}
          />
          <span className="text-[10px] text-slate-400">MM</span>
        </div>
        <span className="text-slate-400 font-medium pb-3">:</span>
        <div className="flex flex-col items-center gap-0.5">
          <Input
            id={`${idPrefix}Seconds`}
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => onChange('seconds', e.target.value)}
            onBlur={(e) => handleBlur('seconds', e.target.value)}
            placeholder="00"
            className={fieldClass}
          />
          <span className="text-[10px] text-slate-400">SS</span>
        </div>
      </div>
    </div>
  )
}
