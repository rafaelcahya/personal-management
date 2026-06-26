'use client'

import { useState } from 'react'
import EmptyState from './EmptyState'

function fmtTime(sec) {
  if (!sec || sec <= 0) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtDistKm(m) {
  if (!m || m <= 0) return '—'
  return `${(m / 1000).toFixed(1)} km`
}

function gearDisplayName(g) {
  if (g.name) return g.name
  const parts = [g.brand_name, g.model_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown gear'
}

export default function GearUsageBreakdown({ gear, error }) {
  const [showRetired, setShowRetired] = useState(false)

  if (error) {
    return <EmptyState message="Failed to load gear data" />
  }

  if (!gear) return null

  const visible = showRetired ? gear : gear.filter((g) => !g.retired)
  const hasRetired = gear.some((g) => g.retired)

  if (!visible.length) {
    return (
      <div id="gearUsageBreakdown_analyticsPage" className="flex flex-col gap-3">
        <EmptyState
          message={
            gear.length === 0 ? 'No gear usage in this range' : 'No active gear in this range'
          }
          details={gear.length > 0 && !showRetired ? 'Toggle to include retired gear.' : undefined}
        />
        {hasRetired && (
          <RetiredToggle showRetired={showRetired} onToggle={() => setShowRetired((v) => !v)} />
        )}
      </div>
    )
  }

  return (
    <div id="gearUsageBreakdown_analyticsPage" className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table
          id="gearUsageTable_analyticsPage"
          className="min-w-full text-sm"
          aria-label="Gear usage breakdown"
        >
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Gear
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Activities
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Time
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Distance
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((g) => (
              <tr
                key={g.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-900 leading-tight">
                      {gearDisplayName(g)}
                    </span>
                    {g.retired && (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full w-fit">
                        Retired
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-700">
                  {g.total_activities}
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-700">
                  {fmtTime(g.total_moving_time_sec)}
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-700">
                  {fmtDistKm(g.total_distance_m)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasRetired && (
        <RetiredToggle showRetired={showRetired} onToggle={() => setShowRetired((v) => !v)} />
      )}
    </div>
  )
}

function RetiredToggle({ showRetired, onToggle }) {
  return (
    <button
      type="button"
      id="gearRetiredToggle_analyticsPage"
      onClick={onToggle}
      className="self-start text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
    >
      {showRetired ? 'Hide retired gear' : 'Show retired gear'}
    </button>
  )
}
