import { Zap } from 'lucide-react'

export default function PaceTile({ id, label, value, delta, className = '' }) {
  return (
    <div id={id} className={`px-4 py-3 ${className}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="p-1 rounded-md bg-orange-50">
          <Zap className="size-3 text-orange-600" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="text-xl font-semibold text-slate-800 tabular-nums">{value}</p>
      <div className="mt-1.5">
        <span className={`text-xs font-medium ${delta.color}`}>{delta.label}</span>
        {delta.desc && <p className="text-xs text-slate-400 mt-0.5 leading-tight">{delta.desc}</p>}
      </div>
    </div>
  )
}
