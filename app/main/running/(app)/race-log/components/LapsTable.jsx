import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SectionLabel } from './activityShared'
import { fmtPace, fmtDuration } from '../../dashboard/utils/format'

export default function LapsTable({ laps }) {
  if (laps.length === 0) return null
  const hasLapsHr = laps.some((l) => l.avg_hr != null)
  return (
    <div>
      <SectionLabel>Laps</SectionLabel>
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          <TableHeader className="bg-slate-100">
            <TableRow className="border-none uppercase text-xs">
              <TableHead className="py-2 text-slate-foreground rounded-l-lg w-10">#</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Dist</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Pace</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Time</TableHead>
              {hasLapsHr && (
                <TableHead className="py-2 text-slate-foreground text-right">HR</TableHead>
              )}
              <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg">
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
                <TableRow key={l.id} className="hover:bg-slate-50">
                  <TableCell className="text-xs text-slate-400 font-medium">
                    {l.lap_index}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono tabular-nums text-sm text-slate-700">
                      {l.distance_m ? `${(l.distance_m / 1000).toFixed(2)} km` : '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono tabular-nums text-sm text-slate-700">
                      {lapPaceSec ? `${fmtPace(lapPaceSec)}/km` : '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono tabular-nums text-sm text-slate-700">
                      {l.moving_time_sec ? fmtDuration(l.moving_time_sec) : '—'}
                    </span>
                  </TableCell>
                  {hasLapsHr && (
                    <TableCell className="text-right">
                      <span className="font-mono tabular-nums text-sm text-slate-700">
                        {l.avg_hr ? `${l.avg_hr}` : '—'}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <span className="font-mono tabular-nums text-sm text-slate-700">
                      {l.total_elevation_gain_m != null
                        ? `${l.total_elevation_gain_m > 0 ? '+' : ''}${Math.round(l.total_elevation_gain_m)} m`
                        : '—'}
                    </span>
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
