import ValueCell from './ValueCell'
import RcAssessmentLabel from './RcAssessmentLabel'
import SignalBadge from './SignalBadge'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import TickerErrorCells from './TickerErrorCells'

function cellsFor(ticker, group, row, dataByTicker, statusByTicker) {
  const status = statusByTicker[ticker]
  if (status === 'loading' || status === undefined) return { ticker, status: 'loading' }
  if (status === 'error') return { ticker, status: 'error' }

  const data = dataByTicker[ticker]
  const value = data?.[group]?.[row.key] ?? null
  const assessment = data?.assessments?.[row.key]
  return { ticker, status: 'success', value, assessment }
}

/**
 * Sub-columns are grouped by category to match the compare-mode header
 * (all Values, then all RC Assessments, then all Signals — spec section 3),
 * not interleaved per ticker. Only Section header cells (A) and Metric
 * column always render; per-ticker loading/error is scoped to that
 * ticker's cell within each group.
 */
export default function MetricRow({ row, group, tickers, dataByTicker, statusByTicker, onRetry }) {
  const cells = tickers.map((ticker) => cellsFor(ticker, group, row, dataByTicker, statusByTicker))

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-3 text-sm text-slate-600">{row.label}</td>

      {cells.map((cell) => (
        <td key={`${cell.ticker}-value`} className="px-3 py-3 text-right">
          {cell.status === 'loading' && <Skeleton className="h-4 w-16 ml-auto" />}
          {cell.status === 'error' && (
            <TickerErrorCells ticker={cell.ticker} onRetry={onRetry} className="p-0" />
          )}
          {cell.status === 'success' && (
            <ValueCell rowKey={row.key} value={cell.value} signal={cell.assessment?.signal} />
          )}
        </td>
      ))}

      {cells.map((cell) => (
        <td key={`${cell.ticker}-rc`} className="px-3 py-3 text-left">
          {cell.status === 'loading' && <Skeleton className="h-4 w-20" />}
          {cell.status === 'success' && (
            <RcAssessmentLabel label={cell.assessment?.label} signal={cell.assessment?.signal} />
          )}
        </td>
      ))}

      {cells.map((cell) => (
        <td key={`${cell.ticker}-signal`} className="px-3 py-3 text-center">
          {cell.status === 'loading' && <Skeleton className="h-5 w-12 mx-auto rounded-full" />}
          {cell.status === 'success' && <SignalBadge signal={cell.assessment?.signal} />}
        </td>
      ))}
    </tr>
  )
}
