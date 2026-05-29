import { TableRow, TableCell } from '@/components/ui/table'

export default function TableSkeletonRows({ rows = 5, metricWidths = [] }) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i} className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 bg-slate-100 rounded w-36" />
            <div className="h-2.5 bg-slate-100 rounded w-20" />
          </div>
        </div>
      </TableCell>
      {metricWidths.map((w, j) => (
        <TableCell key={j}>
          <div className="h-3 bg-slate-100 rounded ml-auto" style={{ width: w }} />
        </TableCell>
      ))}
    </TableRow>
  ))
}
