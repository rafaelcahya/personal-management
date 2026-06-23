'use client'

import { formatDuration } from '@/lib/running/pace'

export default function SplitsTable({ splits, unit }) {
  if (!splits || splits.length === 0) return null

  return (
    <div id="splitsTable_runCalculator" className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Splits</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Pace splits per kilometre or mile">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                {unit === 'mi' ? 'Mile' : 'KM'}
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Split Time
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Cumulative
              </th>
            </tr>
          </thead>
          <tbody>
            {splits.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-slate-900">{row.label}</td>
                <td className="px-5 py-3.5 font-mono text-slate-700">
                  {formatDuration(row.splitSec)}
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-500">
                  {formatDuration(row.cumSec)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
