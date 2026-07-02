import Link from 'next/link'
import Button from '@/components/base/Button/Button'

export default function EmptyState({
  title = 'No data available',
  description = 'Get started by adding new items',
  actionLabel = 'Add Item',
  actionHref = '#',
  compact = false,
}) {
  return (
    <div className={`text-center ${compact ? 'py-6' : 'py-8'}`}>
      <p className="text-slate-500 text-sm mb-1.5">{title}</p>
      <p className="text-slate-400 text-xs mb-3">{description}</p>
      <Link href={actionHref}>
        <Button variant="outline" size="base" className="h-8 text-xs">
          {actionLabel}
        </Button>
      </Link>
    </div>
  )
}
