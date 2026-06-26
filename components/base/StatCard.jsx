import { createElement } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Card from './Card'

export default function StatCard({ label, value, trend, icon, className = '', id }) {
  const isPositive = typeof trend === 'number' && trend > 0
  const isNegative = typeof trend === 'number' && trend < 0
  const hasTrend = typeof trend === 'number'

  return (
    <Card variant="shell" id={id} className={['p-5', className].filter(Boolean).join(' ')}>
      {icon && (
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 mb-3 shrink-0">
          {createElement(icon, { className: 'size-4 text-violet-600', 'aria-hidden': 'true' })}
        </div>
      )}
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {hasTrend && (
          <span
            className={[
              'flex items-center gap-0.5 text-xs font-medium mb-0.5',
              isPositive && 'text-green-600',
              isNegative && 'text-red-500',
              !isPositive && !isNegative && 'text-slate-400',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isPositive && <TrendingUp className="size-3" aria-hidden="true" />}
            {isNegative && <TrendingDown className="size-3" aria-hidden="true" />}
            {isPositive ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
    </Card>
  )
}
