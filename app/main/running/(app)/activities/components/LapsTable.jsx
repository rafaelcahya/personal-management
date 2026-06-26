'use client'

import { fmtPace, fmtDuration } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'

const TH =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

export default function LapsTable({ laps }) {
  if (!laps || laps.length === 0) return null

  const hasLapsHr = laps.some((l) => l.avg_hr != null)

  return (
    <div>
      <SectionLabel>Laps</SectionLabel>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Laps">
          <thead>
            <tr className="border-b border-slate-100">
              <th className={`${TH} text-left w-10`}>#</th>
              <th className={`${TH} text-right`}>Dist</th>
              <th className={`${TH} text-right`}>Pace</th>
              <th className={`${TH} text-right`}>Time</th>
              {hasLapsHr && <th className={`${TH} text-right`}>HR</th>}
              <th className={`${TH} text-right`}>Elev</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((l) => {
              const lapPaceSec =
                l.moving_time_sec > 0 && l.distance_m > 0
                  ? Math.round(l.moving_time_sec / (l.distance_m / 1000))
                  : null
              return (
                <tr
                  key={l.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">{l.lap_index}</td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {l.distance_m ? `${(l.distance_m / 1000).toFixed(2)} km` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {lapPaceSec ? `${fmtPace(lapPaceSec)}/km` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {l.moving_time_sec ? fmtDuration(l.moving_time_sec) : '—'}
                  </td>
                  {hasLapsHr && (
                    <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                      {l.avg_hr ? `${l.avg_hr}` : '—'}
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {l.total_elevation_gain_m != null
                      ? `${l.total_elevation_gain_m > 0 ? '+' : ''}${Math.round(l.total_elevation_gain_m)} m`
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
