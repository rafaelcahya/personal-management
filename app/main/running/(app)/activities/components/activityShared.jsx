'use client'

import { Info } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function StatTile({
  id,
  icon: Icon,
  label,
  value,
  unit,
  sub,
  tooltip,
  valueClassName,
  footer,
}) {
  return (
    <div id={id} className="flex flex-col gap-0.5 p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />}
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Info about ${label}`}
                  className="text-slate-300 hover:text-slate-500"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold leading-tight ${valueClassName ?? 'text-slate-800'}`}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      {sub && <span className="text-[10px] text-slate-400">{sub}</span>}
      {footer}
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{children}</p>
  )
}
