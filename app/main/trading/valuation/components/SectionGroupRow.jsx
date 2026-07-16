import { TableRow, TableCell } from '@/components/base/Table/Table'

export default function SectionGroupRow({ label, tickerCount }) {
  return (
    <TableRow className="hover:bg-slate-50">
      <TableCell
        colSpan={1 + tickerCount * 3}
        className="py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100"
      >
        {label}
      </TableCell>
    </TableRow>
  )
}
