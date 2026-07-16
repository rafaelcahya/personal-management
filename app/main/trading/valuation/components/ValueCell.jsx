import { cn } from '@/lib/utils'

const COLOR_MATCHES_SIGNAL_ROWS = new Set([
  'pbv',
  'per',
  'forwardPE',
  'roe',
  'der',
  'peg',
  'insiderOwnership',
  'institutionalOwnership',
  'upsidePercent',
  'historicalPEBase',
  'targetHistoricalPBV',
  'dcfFairValue',
])
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
    case 'dividendYield':
      return `${(value * 100).toFixed(2)}%`
    case 'forwardPE':
      return `${value.toFixed(1)}×`
    case 'peg':
      return value.toFixed(2)
    case 'insiderOwnership':
    case 'institutionalOwnership':
      return `${(value * 100).toFixed(1)}%`
    case 'upsidePercent':
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
    case 'targetMean':
    case 'targetHigh':
    case 'targetLow':
      return `Rp ${Math.round(value).toLocaleString('id-ID')}`
    case 'recommendationKey': {
      const map = {
        strong_buy: 'Strong Buy',
        buy: 'Buy',
        hold: 'Hold',
        sell: 'Sell',
        strong_sell: 'Strong Sell',
        none: 'No Coverage',
      }
      return map[value] ?? '—'
    }
    case 'numberOfAnalysts':
      return `${value} analysts`
    case 'historicalPEBear':
    case 'historicalPEBase':
    case 'historicalPEBull':
    case 'bvps':
    case 'targetHistoricalPBV':
    case 'eps':
    case 'graham':
    case 'price':
    case 'p10':
    case 'p50':
    case 'p90':
      return `Rp ${Math.round(value).toLocaleString('id-ID')}`
    case 'costOfEquity':
    case 'dcfGrowthRate':
    case 'dcfWACC':
    case 'dcfTerminalGrowth':
      return `${(value * 100).toFixed(1)}%`
    case 'dcfProjectionYears':
      return `${value} years`
    case 'dcfFCF':
      return `Rp ${Math.round(value).toLocaleString('id-ID')} B`
    case 'dcfFairValue':
      return `Rp ${Math.round(value).toLocaleString('id-ID')}`
    case 'maxdd':
      return `-${value.toFixed(1)}%`
    case 'avgHistoricalPE':
    case 'minHistoricalPE':
    case 'maxHistoricalPE':
      return `${value.toFixed(1)}×`
    case 'sharpe1y':
    case 'sharpe3y':
    case 'sharpe5y':
    case 'sortino1y':
    case 'sortino3y':
    case 'sortino5y':
    case 'calmar':
      return value.toFixed(2)
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ValueCell] No formatter for metric key: "${rowKey}"`)
      }
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
