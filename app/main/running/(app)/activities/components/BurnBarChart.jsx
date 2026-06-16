'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { fmtPace } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'

const ON_PACE_THRESHOLD_SEC = 3
const TYPICAL_HR_THRESHOLD_BPM = 2

function getChip(diff, isPace) {
  if (diff == null) return null
  const threshold = isPace ? ON_PACE_THRESHOLD_SEC : TYPICAL_HR_THRESHOLD_BPM
  if (Math.abs(diff) <= threshold) {
    return {
      label: isPace ? 'On pace' : 'Typical',
      className: 'bg-slate-100 text-slate-500',
    }
  }
  const isBetter = diff < 0
  const sign = diff > 0 ? '+' : ''
  const unit = isPace ? 's/km' : ' bpm'
  return {
    label: `${sign}${diff}${unit}`,
    className: isBetter ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
  }
}

function chipFill(chip) {
  if (chip.className.includes('green')) return '#16a34a'
  if (chip.className.includes('red')) return '#dc2626'
  return '#94a3b8'
}

export default function BurnBarChart({ burnBar, pagePrefix = 'activityDetailPage' }) {
  const [view, setView] = useState('pace')

  if (!burnBar) {
    return (
      <div id={`burnBarEmpty_${pagePrefix}`}>
        <SectionLabel>Burn Bar — vs Your Average</SectionLabel>
        <p className="text-sm text-slate-400 py-4 text-center">
          Not enough similar runs to compare yet.
        </p>
      </div>
    )
  }

  const isPace = view === 'pace'
  const hasHr = burnBar.some((b) => b.avg_hr != null && b.historical_avg_hr != null)

  const chartData = burnBar.map((b) => ({
    split: b.split_number,
    thisRun: isPace ? b.pace_sec_per_km : b.avg_hr,
    average: isPace ? b.historical_avg_pace : b.historical_avg_hr,
    diff: isPace ? b.pace_diff_sec : b.hr_diff_bpm,
  }))

  const allValues = chartData.flatMap((d) => [d.thisRun, d.average]).filter((v) => v != null)
  const minVal = allValues.length ? Math.min(...allValues) : 0
  const maxVal = allValues.length ? Math.max(...allValues) : 1
  const padding = (maxVal - minVal) * 0.15 || (isPace ? 10 : 5)
  const xDomain = [Math.max(0, minVal - padding), maxVal + padding]

  return (
    <div id={`burnBarSection_${pagePrefix}`}>
      <div className="flex items-center justify-between mb-2">
        <SectionLabel>Burn Bar — vs Your Average</SectionLabel>
        {hasHr && (
          <div className="flex items-center gap-1">
            <button
              id={`burnBarPaceBtn_${pagePrefix}`}
              type="button"
              aria-pressed={view === 'pace'}
              onClick={() => setView('pace')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                view === 'pace'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              Pace
            </button>
            <button
              id={`burnBarHrBtn_${pagePrefix}`}
              type="button"
              aria-pressed={view === 'hr'}
              onClick={() => setView('hr')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                view === 'hr'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              HR
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3">
        This run vs your average for the same split, across similar past activities.
      </p>

      <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 44)}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 56, bottom: 0, left: 16 }}
          barCategoryGap="16%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            domain={xDomain}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickFormatter={(v) => (isPace ? fmtPace(Math.round(v)) : Math.round(v))}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="split"
            tickFormatter={(v) => `#${v}`}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            width={28}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">Split #{label}</p>
                  <p className="text-violet-600">
                    This run:{' '}
                    <span className="font-semibold">
                      {d?.thisRun == null
                        ? '—'
                        : isPace
                          ? `${fmtPace(d.thisRun)}/km`
                          : `${d.thisRun} bpm`}
                    </span>
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    Your average:{' '}
                    <span className="font-semibold">
                      {d?.average == null
                        ? '—'
                        : isPace
                          ? `${fmtPace(d.average)}/km`
                          : `${d.average} bpm`}
                    </span>
                  </p>
                </div>
              )
            }}
          />
          <Bar
            dataKey="thisRun"
            name="This run"
            fill="#7c3aed"
            radius={[0, 3, 3, 0]}
            maxBarSize={14}
          >
            <LabelList
              dataKey="diff"
              content={(props) => {
                const { x, y, width, height, value } = props
                const chip = getChip(value, isPace)
                if (!chip) return null
                const px = Number(x) + Number(width) + 4
                const py = Number(y) + Number(height) / 2 + 4
                if (!isFinite(px) || !isFinite(py)) return null
                return (
                  <text x={px} y={py} fontSize={10} fontWeight={600} fill={chipFill(chip)}>
                    {chip.label}
                  </text>
                )
              }}
            />
          </Bar>
          <Bar
            dataKey="average"
            name="Your average"
            fill="#cbd5e1"
            radius={[0, 3, 3, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-violet-600 inline-block" />
          This run
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" />
          Your average
        </span>
      </div>
    </div>
  )
}
