'use client'

import { useRef, useEffect } from 'react'
import { clsx } from 'clsx'

// ─── Field metadata ────────────────────────────────────────────────────────────

export const FIELD_LABELS = {
  hour: 'Hour',
  minute: 'Min',
  second: 'Sec',
}

export const FIELD_MAX = {
  hour: 23,
  minute: 59,
  second: 59,
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function generateOptions(max, step = 1) {
  const options = []
  for (let i = 0; i <= max; i += step) options.push(i)
  return options
}

export function parseTimeValue(value, fields) {
  const result = { hour: null, minute: null, second: null }
  if (!value) return result
  const parts = value.split(':').map(Number)
  fields.forEach((field, i) => {
    result[field] = isNaN(parts[i]) ? null : parts[i]
  })
  return result
}

export function formatTimeValue(parts, fields) {
  return fields.map((f) => String(parts[f] ?? 0).padStart(2, '0')).join(':')
}

// ─── TimeScrollColumn ──────────────────────────────────────────────────────────

export function TimeScrollColumn({ label, options, value, onChange }) {
  const listRef = useRef(null)
  const selectedRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    const container = listRef.current
    const target = selectedRef.current
    if (target) {
      container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2
    }
  }, [])

  return (
    <div className="flex flex-col items-center px-1">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide text-center pb-1.5 w-full">
        {label}
      </div>
      <div ref={listRef} className="overflow-y-auto h-44 w-12">
        {options.map((opt) => (
          <button
            key={opt}
            ref={opt === value ? selectedRef : null}
            type="button"
            onClick={() => onChange(opt)}
            className={clsx(
              'w-full py-1.5 text-sm font-medium rounded text-center transition-colors',
              opt === value ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {String(opt).padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )
}
