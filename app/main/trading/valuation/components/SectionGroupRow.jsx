import { Info } from 'lucide-react'
import { TableRow, TableCell } from '@/components/base/Table/Table'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'

export default function SectionGroupRow({ label, tickerCount, description }) {
  return (
    <TableRow className="hover:bg-slate-50">
      <TableCell
        colSpan={1 + tickerCount * 3}
        className="py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100"
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {description && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-slate-300 hover:text-violet-500 transition-colors flex-shrink-0"
                  aria-label={`Info: ${label}`}
                >
                  <Info className="size-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-72 p-3">
                <p className="text-xs text-slate-600 leading-relaxed normal-case tracking-normal font-normal">
                  {description}
                </p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
