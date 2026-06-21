'use client'

import { useMemo } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 67.5

export default function WinRateCircle({ label, count, percent, color, total }) {
  const strokeDashoffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  const gradientId = useMemo(() => `gradient-${label.replace(/\s/g, '')}`, [label])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="180" height="180" className="transform -rotate-90">
          <circle cx="90" cy="90" r="67.5" fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle
            cx="90"
            cy="90"
            r="67.5"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg font-bold" style={{ color }}>
            {percent}%
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">
          {count} of {total} trades
        </p>
      </div>
    </div>
  )
}
