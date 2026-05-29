'use client'

import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function StatTile({ icon: Icon, label, value, unit, sub, tooltip }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />}
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                  aria-label={`Info about ${label}`}
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-slate-800 leading-tight">{value ?? '—'}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      {sub && <span className="text-[10px] text-slate-400">{sub}</span>}
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{children}</p>
  )
}
