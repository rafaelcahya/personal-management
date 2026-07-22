'use client'
import { cn } from '@/lib/utils'

export function Table({ children, className, wrapperClassName, ...props }) {
  return (
    <div className={cn('w-full overflow-auto', wrapperClassName)}>
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className, sticky, bordered, ...props }) {
  return (
    <thead
      className={cn(
        sticky && 'sticky top-0 z-10 bg-card shadow-[0_1px_0_0_hsl(var(--border))]',
        bordered && 'border-b border-border',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className, divider = true, ...props }) {
  return (
    <tbody className={cn(divider && 'divide-y divide-border', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableFooter({ children, className, ...props }) {
  return (
    <tfoot className={cn('border-t border-border bg-muted font-medium', className)} {...props}>
      {children}
    </tfoot>
  )
}

export function TableRow({ children, className, selected, clickable, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        selected && 'bg-primary/5',
        clickable && 'cursor-pointer hover:bg-muted/50',
        !selected && !clickable && 'hover:bg-muted/50',
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
        'h-10 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap',
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
        'px-4 py-3 text-sm text-foreground align-middle',
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
    <caption className={cn('my-2 text-xs text-muted-foreground text-center', className)} {...props}>
      {children}
    </caption>
  )
}
