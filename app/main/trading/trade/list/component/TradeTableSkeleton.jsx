import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROW_COUNT = 15

export default function TradeTableSkeleton() {
  return (
    <div id="tradeTableSkeleton_tradePage" className="overflow-x-auto flex-1">
      <Table className="w-full table-auto">
        <TableHeader className="bg-slate-100 sticky top-0 z-20">
          <TableRow className="border-none">
            <TableHead className="py-2 text-slate-foreground rounded-l-lg">Date</TableHead>
            <TableHead className="py-2 text-slate-foreground">Ticker</TableHead>
            <TableHead className="py-2 text-slate-foreground text-right">Margin</TableHead>
            <TableHead className="py-2 text-slate-foreground text-right">Proceeds</TableHead>
            <TableHead className="py-2 text-slate-foreground">Return %</TableHead>
            <TableHead className="py-2 text-slate-foreground text-right">P/L</TableHead>
            <TableHead className="py-2 text-slate-foreground rounded-r-lg">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <TableRow key={i} className="border-none">
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
