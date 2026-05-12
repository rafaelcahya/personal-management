import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/ui/table'
import { format, differenceInDays } from 'date-fns'
import UsageCompletionForm from './UsageCompletionForm'

function getDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const days = differenceInDays(end, start)
  if (days === 0) return '< 1 day'
  return `${days} day${days !== 1 ? 's' : ''}`
}

export default function LogRow({ item, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = item.status === 'active'

  const duration = item.start_usage_date
    ? getDuration(item.start_usage_date, item.end_usage_date)
    : '-'

  return (
    <>
      <TableRow
        className={cn(
          'cursor-pointer transition-colors',
          isOpen && 'bg-violet-50/75',
          isActive && 'hover:bg-violet-50/75',
          !isActive && 'hover:bg-slate-50/50'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="w-8">
          <div className="flex items-center">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </TableCell>
        <TableCell className="font-mono text-sm">
          {item.start_usage_date ? format(new Date(item.start_usage_date), 'dd MMM yyyy') : '-'}
        </TableCell>
        <TableCell className="font-mono text-sm">
          {item.end_usage_date ? format(new Date(item.end_usage_date), 'dd MMM yyyy') : '-'}
        </TableCell>
        <TableCell data-testid="log-row-duration" className="text-sm">
          <span className={cn('font-medium', isActive ? 'text-violet-600' : 'text-slate-600')}>
            {duration}
          </span>
          {isActive && (
            <span data-testid="log-row-ongoing-label" className="ml-1 text-xs text-violet-400">
              (ongoing)
            </span>
          )}
        </TableCell>
        <TableCell>
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-semibold capitalize',
              isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            )}
          >
            {item.status}
          </span>
        </TableCell>
        <TableCell className="font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">{item.quantity}</span>
            {item.remaining_quantity && (
              <span className="text-xs text-muted-foreground">{item.remaining_quantity} left</span>
            )}
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-violet-50/50 hover:bg-violet-50/50">
          <TableCell colSpan={6} className="p-6">
            {item.note && (
              <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-1">Note</p>
                <p className="text-sm text-slate-700">{item.note}</p>
              </div>
            )}
            <UsageCompletionForm
              historyItem={item}
              onUpdate={onUpdate}
              onCancel={() => setIsOpen(false)}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
