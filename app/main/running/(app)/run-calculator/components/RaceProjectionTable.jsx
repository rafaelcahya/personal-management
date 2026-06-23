'use client'

import {
  formatDuration,
  formatPaceSec,
  riegelProject,
  RACE_DISTANCES,
  MI_TO_KM,
} from '@/lib/running/pace'

export default function RaceProjectionTable({ refTimeSec, refDistM, unit }) {
  if (!refTimeSec || !refDistM || refTimeSec <= 0 || refDistM <= 0) return null

  const rows = RACE_DISTANCES.map((d) => {
    const projSec = riegelProject(refTimeSec, refDistM, d.m)
    const paceSecPerKm = projSec != null ? projSec / (d.m / 1000) : null
    const paceDisplay =
      unit === 'mi'
        ? `${formatPaceSec(paceSecPerKm * MI_TO_KM)} /mi`
        : `${formatPaceSec(paceSecPerKm)} /km`
    return {
      label: d.label,
      m: d.m,
      projSec,
      paceDisplay,
    }
  })

  return (
    <div id="raceProjectionTable_runCalculator" className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Race Projections
      </p>
      <p className="text-[11px] text-slate-400">
        Estimated via Riegel formula — accuracy decreases for distances far from your reference.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Race time projections">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Race
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Finish Time
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Avg Pace
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-slate-900">{row.label}</td>
                <td className="px-5 py-3.5 font-mono text-slate-700">
                  {formatDuration(row.projSec)}
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{row.paceDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
