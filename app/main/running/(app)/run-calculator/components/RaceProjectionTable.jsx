'use client'

import {
  formatDuration,
  formatPaceSec,
  riegelProject,
  RACE_DISTANCES,
  MI_TO_KM,
} from '@/lib/running/pace'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

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
      <Table className="min-w-full" aria-label="Race time projections">
        <TableHeader>
          <TableRow>
            <TableHead>Race</TableHead>
            <TableHead>Finish Time</TableHead>
            <TableHead>Avg Pace</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-semibold text-slate-900">{row.label}</TableCell>
              <TableCell className="font-mono text-slate-700">
                {formatDuration(row.projSec)}
              </TableCell>
              <TableCell className="font-mono text-slate-500">{row.paceDisplay}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
