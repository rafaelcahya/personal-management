import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import LogRow from './LogRow'

export default function ProductUsageLog({ log, onUpdate }) {
  return (
    <div data-testid="product-usage-log" className="border rounded-lg">
      <Table>
        <TableHeader className="bg-slate-100 sticky top-0 z-20">
          <TableRow className="border-none">
            <TableHead className="py-2 text-slate-foreground rounded-l-lg w-8" />
            <TableHead className="py-2 text-slate-foreground">Start Date</TableHead>
            <TableHead className="py-2 text-slate-foreground">End Date</TableHead>
            <TableHead data-testid="usage-log-duration-col" className="py-2 text-slate-foreground">
              Duration
            </TableHead>
            <TableHead className="py-2 text-slate-foreground">Status</TableHead>
            <TableHead className="py-2 text-slate-foreground rounded-r-lg">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!log || log.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                <p className="font-semibold">No usage recorded yet</p>
                <p className="text-xs mt-1">Switch to "Record Usage" to get started.</p>
              </TableCell>
            </TableRow>
          ) : (
            log.map((item) => <LogRow key={item.id} item={item} onUpdate={onUpdate} />)
          )}
        </TableBody>
      </Table>
    </div>
  )
}
