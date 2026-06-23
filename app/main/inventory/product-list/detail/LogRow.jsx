import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      <tr
        className={cn(
          'border-b border-slate-50 cursor-pointer transition-colors',
          isOpen && 'bg-violet-50/75',
          isActive && !isOpen && 'hover:bg-violet-50/75',
          !isActive && !isOpen && 'hover:bg-slate-50'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="px-5 py-3.5 w-8">
          <div className="flex items-center">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </td>
        <td className="px-5 py-3.5 font-mono text-slate-700">
          {item.start_usage_date ? format(new Date(item.start_usage_date), 'dd MMM yyyy') : '-'}
        </td>
        <td className="px-5 py-3.5 font-mono text-slate-700">
          {item.end_usage_date ? format(new Date(item.end_usage_date), 'dd MMM yyyy') : '-'}
        </td>
        <td id="logRowDuration_usageLogTable" className="px-5 py-3.5">
          <span
            className={cn('font-medium text-sm', isActive ? 'text-violet-600' : 'text-slate-600')}
          >
            {duration}
          </span>
          {isActive && (
            <span id="ongoingLabel_usageLogTable" className="ml-1 text-xs text-violet-400">
              (ongoing)
            </span>
          )}
        </td>
        <td className="px-5 py-3.5">
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-semibold capitalize',
              isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            )}
          >
            {item.status}
          </span>
        </td>
        <td className="px-5 py-3.5 text-right font-mono">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-slate-700">{item.quantity}</span>
            {item.remaining_quantity && (
              <span className="text-xs text-slate-400">{item.remaining_quantity} left</span>
            )}
          </div>
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-violet-50/50">
          <td colSpan={6} className="px-5 py-4">
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
          </td>
        </tr>
      )}
    </>
  )
}
