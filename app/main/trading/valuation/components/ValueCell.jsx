import { cn } from '@/lib/utils'

const COLOR_MATCHES_SIGNAL_ROWS = new Set(['pbv', 'per', 'roe', 'der'])
const ALWAYS_DESTRUCTIVE_ROWS = new Set(['maxdd'])

const SIGNAL_TEXT_CLASSES = {
  BUY: 'text-success-subtle-foreground',
  HOLD: 'text-warning-subtle-foreground',
  SELL: 'text-destructive-subtle-foreground',
}

function formatValue(rowKey, value) {
  if (value === null || value === undefined) return '—'
  switch (rowKey) {
    case 'pbv':
    case 'der':
      return `${value.toFixed(2)}×`
    case 'per':
      return `${value.toFixed(1)}×`
    case 'roe':
      return `${value.toFixed(1)}%`
    case 'eps':
    case 'graham':
    case 'price':
    case 'p10':
    case 'p50':
    case 'p90':
      return `Rp ${Math.round(value).toLocaleString('id-ID')}`
    case 'maxdd':
      return `-${value.toFixed(1)}%`
    case 'sharpe1y':
    case 'sharpe3y':
    case 'sharpe5y':
    case 'sortino1y':
    case 'sortino3y':
    case 'sortino5y':
    case 'calmar':
      return value.toFixed(2)
    default:
      return String(value)
  }
}

/**
 * Shared formatter for Value column cells (font-mono, per spec section 7).
 */
export default function ValueCell({ rowKey, value, signal, className }) {
  const colorClass = ALWAYS_DESTRUCTIVE_ROWS.has(rowKey)
    ? 'text-destructive-subtle-foreground'
    : COLOR_MATCHES_SIGNAL_ROWS.has(rowKey) && signal
      ? (SIGNAL_TEXT_CLASSES[signal] ?? 'text-slate-700')
      : 'text-slate-700'

  return (
    <span className={cn('font-mono text-sm', colorClass, className)}>
      {formatValue(rowKey, value)}
    </span>
  )
}
