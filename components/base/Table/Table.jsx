'use client'
import { cn } from '@/lib/utils'

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className, sticky, ...props }) {
  return (
    <thead
      className={cn(sticky && 'sticky top-0 z-10 bg-white shadow-[0_1px_0_0_#e5e7eb]', className)}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn('divide-y divide-gray-100', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableFooter({ children, className, ...props }) {
  return (
    <tfoot className={cn('border-t border-gray-200 bg-gray-50 font-medium', className)} {...props}>
      {children}
    </tfoot>
  )
}

export function TableRow({ children, className, selected, clickable, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        selected && 'bg-violet-50',
        clickable && 'cursor-pointer hover:bg-gray-50',
        !selected && !clickable && 'hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className, align = 'left', width, ...props }) {
  return (
    <th
      style={width ? { width } : undefined}
      className={cn(
        'h-10 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500 whitespace-nowrap',
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, align = 'left', ...props }) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-sm text-gray-700 align-middle',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

export function TableCaption({ children, className, ...props }) {
  return (
    <caption className={cn('mt-2 text-xs text-gray-400 text-center', className)} {...props}>
      {children}
    </caption>
  )
}
