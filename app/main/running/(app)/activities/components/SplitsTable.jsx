'use client'

import { Heart, Info } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { fmtPace, fmtDuration } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'

const TH =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

export default function SplitsTable({ splits }) {
  if (!splits || splits.length === 0) return null

  const hasSplitsHr = splits.some((s) => s.avg_hr != null)
  const splitsWithHr = splits.filter((s) => s.avg_hr != null)
  const cardiacDrift =
    hasSplitsHr && splitsWithHr.length >= 2
      ? splitsWithHr[splitsWithHr.length - 1].avg_hr - splitsWithHr[0].avg_hr
      : null

  return (
    <div>
      <SectionLabel>Splits (per km)</SectionLabel>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Splits">
          <thead>
            <tr className="border-b border-slate-100">
              <th className={`${TH} text-left w-10`}>#</th>
              <th className={`${TH} text-right`}>Dist</th>
              <th className={`${TH} text-right`}>Pace</th>
              <th className={`${TH} text-right`}>Time</th>
              {hasSplitsHr && <th className={`${TH} text-right`}>HR</th>}
              <th className={`${TH} text-right`}>Elev</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((s) => (
              <tr
                key={s.id ?? s.split_number}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">{s.split_number}</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                  {s.distance_m ? `${(s.distance_m / 1000).toFixed(2)} km` : '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                  {s.pace_sec_per_km ? `${fmtPace(s.pace_sec_per_km)}/km` : '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                  {s.duration_sec ? fmtDuration(s.duration_sec) : '—'}
                </td>
                {hasSplitsHr && (
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {s.avg_hr ? `${s.avg_hr}` : '—'}
                  </td>
                )}
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                  {s.elevation_gain_m != null
                    ? `${s.elevation_gain_m > 0 ? '+' : ''}${Math.round(s.elevation_gain_m)} m`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cardiacDrift !== null && (
        <div id="cardiacDrift_activityDetailPage" className="flex items-center gap-2 mt-2 px-1">
          <Heart className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-xs text-slate-400">Cardiac drift:</span>
          <span
            className={`text-xs font-semibold ${cardiacDrift > 0 ? 'text-red-500' : 'text-blue-500'}`}
          >
            {cardiacDrift > 0 ? '+' : ''}
            {cardiacDrift} bpm
          </span>
          <span className="text-xs text-slate-300">(split 1 → last split)</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" aria-label="Cardiac drift information">
                  <Info className="size-3.5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                <p className="font-semibold mb-1">What is Cardiac Drift?</p>
                <p>
                  HR increase from your first split to your last split at the same pace — a sign of
                  fatigue or dehydration.
                </p>
                <p className="mt-1.5 text-slate-300">
                  <span className="text-green-400 font-medium">0–5 bpm</span> Good ·{' '}
                  <span className="text-amber-400 font-medium">6–10</span> Moderate ·{' '}
                  <span className="text-red-400 font-medium">&gt;10</span> High
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
