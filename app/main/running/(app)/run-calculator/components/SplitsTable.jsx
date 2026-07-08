'use client'

import { formatDuration } from '@/lib/running/pace'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

export default function SplitsTable({ splits, unit }) {
  if (!splits || splits.length === 0) return null

  return (
    <div id="splitsTable_runCalculator" className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Splits</p>
      <Table className="min-w-full" aria-label="Pace splits per kilometre or mile">
        <TableHeader sticky>
          <TableRow>
            <TableHead>{unit === 'mi' ? 'Mile' : 'KM'}</TableHead>
            <TableHead>Split Time</TableHead>
            <TableHead>Cumulative</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="font-semibold text-slate-900">{row.label}</TableCell>
              <TableCell className="font-mono text-slate-700">
                {formatDuration(row.splitSec)}
              </TableCell>
              <TableCell className="font-mono text-slate-500">
                {formatDuration(row.cumSec)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
