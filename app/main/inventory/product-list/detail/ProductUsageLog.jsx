import { AlertCircle } from 'lucide-react'
import LogRow from './LogRow'

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
    <div
      id="usageLog_productListPage"
      className="overflow-x-auto rounded-xl border border-slate-200"
    >
      <table
        id="usageLogTable_productListPage"
        className="min-w-full text-sm"
        aria-label="Product usage log"
      >
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-8" />
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Start Date
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              End Date
            </th>
            <th
              id="durationCol_usageLogTable"
              className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap"
            >
              Duration
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Status
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Qty
            </th>
          </tr>
        </thead>
        <tbody>
          {log.map((item) => (
            <LogRow key={item.id} item={item} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
