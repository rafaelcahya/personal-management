import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

const ROW_COUNT = 15

export default function TradeTableSkeleton() {
  return (
    <Table
      id="tradeTableSkeleton_tradePage"
      wrapperClassName="overflow-x-auto flex-1"
      className="min-w-full animate-pulse"
    >
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead align="right">Margin</TableHead>
          <TableHead align="right">Proceeds</TableHead>
          <TableHead>Return %</TableHead>
          <TableHead align="right">P/L</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell align="right">
              <Skeleton className="h-4 w-28 ml-auto" />
            </TableCell>
            <TableCell align="right">
              <Skeleton className="h-4 w-28 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-14" />
            </TableCell>
            <TableCell align="right">
              <Skeleton className="h-4 w-28 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
