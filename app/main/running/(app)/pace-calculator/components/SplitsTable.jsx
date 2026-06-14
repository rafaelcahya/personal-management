'use client'

import { formatDuration } from '@/lib/running/pace'

export default function SplitsTable({ splits, unit }) {
  if (!splits || splits.length === 0) return null

  return (
    <div id="splitsTable_paceCalculator" className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Splits</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 pr-4 text-xs font-semibold text-slate-500">
                {unit === 'mi' ? 'Mile' : 'KM'}
              </th>
              <th className="text-left py-1.5 pr-4 text-xs font-semibold text-slate-500">
                Split Time
              </th>
              <th className="text-left py-1.5 text-xs font-semibold text-slate-500">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 pr-4 text-slate-700 font-medium">{row.label}</td>
                <td className="py-1.5 pr-4 text-slate-600">{formatDuration(row.splitSec)}</td>
                <td className="py-1.5 text-slate-500">{formatDuration(row.cumSec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
