'use client'

import { Trophy } from 'lucide-react'
import { fmtDuration } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

export default function BestEffortsTable({ bestEfforts }) {
  if (!bestEfforts || bestEfforts.length === 0) return null

  return (
    <div>
      <SectionLabel>Best Efforts</SectionLabel>
      <Table className="min-w-full" aria-label="Best efforts">
        <TableHeader sticky>
          <TableRow>
            <TableHead>Distance</TableHead>
            <TableHead align="right">Time</TableHead>
            <TableHead align="right">PR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestEfforts.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="text-slate-700 font-medium">{e.name}</TableCell>
              <TableCell className="font-mono tabular-nums text-slate-700" align="right">
                {e.elapsed_time_sec ? fmtDuration(e.elapsed_time_sec) : '—'}
              </TableCell>
              <TableCell align="right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
