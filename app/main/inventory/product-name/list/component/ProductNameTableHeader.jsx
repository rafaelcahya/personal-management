import { FileText } from 'lucide-react'

export default function ProductNameTableHeader() {
  return (
    <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
      <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
        <FileText className="size-4 text-violet-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Product Names</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage product name statuses and notes for your inventory
        </p>
      </div>
    </div>
  )
}
