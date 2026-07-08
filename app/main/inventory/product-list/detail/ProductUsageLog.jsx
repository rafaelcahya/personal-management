import { AlertCircle } from 'lucide-react'
import LogRow from './LogRow'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/components/base/Table/Table.jsx'
import Card, { CardContent } from '@/components/base/Card/Card'

export default function ProductUsageLog({ log, onUpdate }) {
  if (!log || log.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <AlertCircle className="size-8 text-slate-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">No usage recorded yet</p>
          <p className="text-xs text-slate-500">Switch to "Record Usage" to get started</p>
        </div>
      </div>
    )
  }

  return (
    <Card
      id="usageLog_productListPage"
      className="overflow-x-auto rounded-xl border border-slate-200"
    >
      <CardContent padding="none">
        <Table
          id="usageLogTable_productListPage"
          className="min-w-full"
          aria-label="Product usage log"
        >
          <TableHeader sticky>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead id="durationCol_usageLogTable">Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {log.map((item) => (
              <LogRow key={item.id} item={item} onUpdate={onUpdate} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
