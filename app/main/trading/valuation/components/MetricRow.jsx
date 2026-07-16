import { Info } from 'lucide-react'
import { TableRow, TableCell } from '@/components/base/Table/Table'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'
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
    <TableRow className="border-b border-slate-50">
      <TableCell className="text-slate-600">
        <div className="flex items-center gap-1.5">
          <span>{row.label}</span>
          {row.description && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-slate-300 hover:text-violet-500 transition-colors flex-shrink-0"
                  aria-label={`Info: ${row.label}`}
                >
                  <Info className="size-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-64 p-3">
                <p className="text-xs text-slate-600 leading-relaxed">{row.description}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </TableCell>

      {cells.map((cell) => (
        <TableCell key={`${cell.ticker}-value`} align="right" className="px-3 py-3">
          {cell.status === 'loading' && <Skeleton className="h-4 w-16 ml-auto" />}
          {cell.status === 'error' && <TickerErrorCells ticker={cell.ticker} onRetry={onRetry} />}
          {cell.status === 'success' && (
            <ValueCell rowKey={row.key} value={cell.value} signal={cell.assessment?.signal} />
          )}
        </TableCell>
      ))}

      {cells.map((cell) => (
        <TableCell key={`${cell.ticker}-rc`} className="px-3 py-3">
          {cell.status === 'loading' && <Skeleton className="h-4 w-20" />}
          {cell.status === 'success' && (
            <RcAssessmentLabel label={cell.assessment?.label} signal={cell.assessment?.signal} />
          )}
        </TableCell>
      ))}

      {cells.map((cell) => (
        <TableCell key={`${cell.ticker}-signal`} align="center" className="px-3 py-3">
          {cell.status === 'loading' && <Skeleton className="h-5 w-12 mx-auto rounded-full" />}
          {cell.status === 'success' && <SignalBadge signal={cell.assessment?.signal} />}
        </TableCell>
      ))}
    </TableRow>
  )
}
