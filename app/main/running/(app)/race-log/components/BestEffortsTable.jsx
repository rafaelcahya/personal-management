import { Trophy } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SectionLabel } from './activityShared'
import { fmtDuration } from '../../dashboard/utils/format'

export default function BestEffortsTable({ bestEfforts }) {
  if (bestEfforts.length === 0) return null
  return (
    <div>
      <SectionLabel>Best Efforts</SectionLabel>
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          <TableHeader className="bg-slate-100">
            <TableRow className="border-none uppercase text-xs">
              <TableHead className="py-2 text-slate-foreground rounded-l-lg">Distance</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Time</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg">
                PR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestEfforts.map((e) => (
              <TableRow key={e.id} className="hover:bg-slate-50">
                <TableCell className="text-sm text-slate-700 font-medium">{e.name}</TableCell>
                <TableCell className="text-right">
                  <span className="font-mono tabular-nums text-sm text-slate-700">
                    {e.elapsed_time_sec ? fmtDuration(e.elapsed_time_sec) : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
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
    </div>
  )
}
