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
    <div className="border rounded-lg">
      <Table>
        <TableHeader className="bg-slate-100 sticky top-0 z-20">
          <TableRow className="border-none">
            <TableHead className="py-2 text-slate-foreground rounded-l-lg">⚙️</TableHead>
            <TableHead className="py-2 text-slate-foreground">Start Usage Date</TableHead>
            <TableHead className="py-2 text-slate-foreground">End Usage Date</TableHead>
            <TableHead className="py-2 text-slate-foreground">Status</TableHead>
            <TableHead className="py-2 text-slate-foreground rounded-r-lg">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!log || log.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                <p className="font-semibold">📭 Nothing tracked yet!</p>
                <p>Hit "Record New Usage" to get started! 🚀</p>
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
