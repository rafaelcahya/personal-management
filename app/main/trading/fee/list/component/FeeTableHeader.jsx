import { Receipt } from 'lucide-react'

export default function FeeTableHeader({ action }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
      <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
        <Receipt className="size-4 text-violet-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Fee List</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Track commissions, admin fees, and trading costs that impact your bottom line
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
