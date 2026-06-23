import { Zap } from 'lucide-react'

export default function EventTableHeader() {
  return (
    <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
      <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
        <Zap className="size-4 text-violet-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Market Events</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Track political decisions, central bank announcements, and global events that impact your
          positions
        </p>
      </div>
    </div>
  )
}
