import { Heart } from 'lucide-react'
import { SectionLabel } from './activityShared'
import { fmtPace, fmtDuration } from '../../dashboard/utils/format'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

export default function SplitsTable({ splits }) {
  if (splits.length === 0) return null

  const hasSplitsHr = splits.some((s) => s.avg_hr != null)
  const splitsWithHr = splits.filter((s) => s.avg_hr != null)
  const cardiacDrift =
    hasSplitsHr && splitsWithHr.length >= 2
      ? splitsWithHr[splitsWithHr.length - 1].avg_hr - splitsWithHr[0].avg_hr
      : null

  return (
    <div>
      <SectionLabel>Splits (per km)</SectionLabel>
      <Table className="min-w-full" aria-label="Splits">
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead align="right">Dist</TableHead>
            <TableHead align="right">Pace</TableHead>
            <TableHead align="right">Time</TableHead>
            {hasSplitsHr && <TableHead align="right">HR</TableHead>}
            <TableHead align="right">Elev</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((s) => (
            <TableRow key={s.id ?? s.split_number}>
              <TableCell className="text-xs text-slate-400 font-medium">{s.split_number}</TableCell>
              <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                {s.distance_m ? `${(s.distance_m / 1000).toFixed(2)} km` : '—'}
              </TableCell>
              <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                {s.pace_sec_per_km ? `${fmtPace(s.pace_sec_per_km)}/km` : '—'}
              </TableCell>
              <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                {s.duration_sec ? fmtDuration(s.duration_sec) : '—'}
              </TableCell>
              {hasSplitsHr && (
                <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                  {s.avg_hr ? `${s.avg_hr}` : '—'}
                </TableCell>
              )}
              <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                {s.elevation_gain_m != null
                  ? `${s.elevation_gain_m > 0 ? '+' : ''}${Math.round(s.elevation_gain_m)} m`
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {cardiacDrift !== null && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <Heart className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-xs text-slate-400">Cardiac drift:</span>
          <span
            className={`text-xs font-semibold ${cardiacDrift > 0 ? 'text-red-500' : 'text-blue-500'}`}
          >
            {cardiacDrift > 0 ? '+' : ''}
            {cardiacDrift} bpm
          </span>
          <span className="text-xs text-slate-300">(split 1 → last split)</span>
        </div>
      )}
    </div>
  )
}
