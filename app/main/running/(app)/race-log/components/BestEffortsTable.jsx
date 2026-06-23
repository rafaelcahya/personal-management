import { Trophy } from 'lucide-react'
import { SectionLabel } from './activityShared'
import { fmtDuration } from '../../dashboard/utils/format'

const TH =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

export default function BestEffortsTable({ bestEfforts }) {
  if (bestEfforts.length === 0) return null
  return (
    <div>
      <SectionLabel>Best Efforts</SectionLabel>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Best efforts">
          <thead>
            <tr className="border-b border-slate-100">
              <th className={`${TH} text-left`}>Distance</th>
              <th className={`${TH} text-right`}>Time</th>
              <th className={`${TH} text-right`}>PR</th>
            </tr>
          </thead>
          <tbody>
            {bestEfforts.map((e) => (
              <tr
                key={e.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 text-slate-700 font-medium">{e.name}</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                  {e.elapsed_time_sec ? fmtDuration(e.elapsed_time_sec) : '—'}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {e.pr_rank === 1 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Trophy className="size-3" aria-hidden="true" />
                      PR
                    </span>
                  ) : e.pr_rank != null ? (
                    <span className="text-xs text-slate-400">#{e.pr_rank}</span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
