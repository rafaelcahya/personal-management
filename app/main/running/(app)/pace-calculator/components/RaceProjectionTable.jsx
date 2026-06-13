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
    const paceSecPerKm = projSec / (d.m / 1000)
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
    <div id="raceProjectionTable_paceCalculator" className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Race Projections
      </p>
      <p className="text-[11px] text-slate-400">
        Estimated via Riegel formula — accuracy decreases for distances far from your reference.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 pr-4 text-xs font-semibold text-slate-500">Race</th>
              <th className="text-left py-1.5 pr-4 text-xs font-semibold text-slate-500">
                Finish Time
              </th>
              <th className="text-left py-1.5 text-xs font-semibold text-slate-500">Avg Pace</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 pr-4 text-slate-700 font-medium">{row.label}</td>
                <td className="py-1.5 pr-4 text-slate-600">{formatDuration(row.projSec)}</td>
                <td className="py-1.5 text-slate-500">{row.paceDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
