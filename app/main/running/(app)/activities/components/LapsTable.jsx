'use client'

import { fmtPace, fmtDuration } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

export default function LapsTable({ laps }) {
  if (!laps || laps.length === 0) return null

  const hasLapsHr = laps.some((l) => l.avg_hr != null)

  return (
    <div>
      <SectionLabel>Laps</SectionLabel>
      <div className="overflow-x-auto">
        <Table className="min-w-max w-full" aria-label="Laps">
          <TableHeader sticky>
            <TableRow>
              <TableHead className="px-3 whitespace-nowrap">#</TableHead>
              <TableHead className="px-3 whitespace-nowrap" align="right">
                Dist
              </TableHead>
              <TableHead className="px-3 whitespace-nowrap" align="right">
                Pace
              </TableHead>
              <TableHead className="px-3 whitespace-nowrap" align="right">
                Time
              </TableHead>
              {hasLapsHr && (
                <TableHead className="px-3 whitespace-nowrap" align="right">
                  HR
                </TableHead>
              )}
              <TableHead className="px-3 whitespace-nowrap" align="right">
                Elev
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {laps.map((l) => {
              const lapPaceSec =
                l.moving_time_sec > 0 && l.distance_m > 0
                  ? Math.round(l.moving_time_sec / (l.distance_m / 1000))
                  : null
              return (
                <TableRow key={l.id}>
                  <TableCell className="px-3 whitespace-nowrap text-xs text-slate-400 font-medium">
                    {l.lap_index}
                  </TableCell>
                  <TableCell
                    className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                    align="right"
                  >
                    {l.distance_m ? `${(l.distance_m / 1000).toFixed(2)} km` : '—'}
                  </TableCell>
                  <TableCell
                    className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                    align="right"
                  >
                    {lapPaceSec ? `${fmtPace(lapPaceSec)}/km` : '—'}
                  </TableCell>
                  <TableCell
                    className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                    align="right"
                  >
                    {l.moving_time_sec ? fmtDuration(l.moving_time_sec) : '—'}
                  </TableCell>
                  {hasLapsHr && (
                    <TableCell
                      className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                      align="right"
                    >
                      {l.avg_hr ? `${l.avg_hr}` : '—'}
                    </TableCell>
                  )}
                  <TableCell
                    className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                    align="right"
                  >
                    {l.total_elevation_gain_m != null
                      ? `${l.total_elevation_gain_m > 0 ? '+' : ''}${Math.round(l.total_elevation_gain_m)} m`
                      : '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
