import RcAssessmentLabel from './RcAssessmentLabel'
import SignalBadge from './SignalBadge'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import TickerErrorCells from './TickerErrorCells'

export default function OverallScoreRow({ tickers, dataByTicker, statusByTicker, onRetry }) {
  const cells = tickers.map((ticker) => {
    const status = statusByTicker[ticker]
    if (status === 'loading' || status === undefined) return { ticker, status: 'loading' }
    if (status === 'error') return { ticker, status: 'error' }
    return { ticker, status: 'success', overall: dataByTicker[ticker]?.overall }
  })

  return (
    <tr className="bg-slate-50 font-semibold border-t-2 border-slate-200">
      <td className="px-4 py-3 text-sm text-slate-700">OVERALL SCORE</td>

      {cells.map((cell) => (
        <td key={`${cell.ticker}-score`} className="px-3 py-3 font-mono text-right text-slate-800">
          {cell.status === 'loading' && <Skeleton className="h-4 w-14 ml-auto" />}
          {cell.status === 'error' && (
            <TickerErrorCells ticker={cell.ticker} onRetry={onRetry} className="p-0" />
          )}
          {cell.status === 'success' && (cell.overall ? `${cell.overall.score}/100` : '—')}
        </td>
      ))}

      {cells.map((cell) => (
        <td key={`${cell.ticker}-label`} className="px-3 py-3">
          {cell.status === 'loading' && <Skeleton className="h-4 w-20" />}
          {cell.status === 'success' && (
            <RcAssessmentLabel label={cell.overall?.label} signal={cell.overall?.signal} />
          )}
        </td>
      ))}

      {cells.map((cell) => (
        <td key={`${cell.ticker}-signal`} className="px-3 py-3 text-center">
          {cell.status === 'loading' && <Skeleton className="h-5 w-12 mx-auto rounded-full" />}
          {cell.status === 'success' && <SignalBadge signal={cell.overall?.signal} />}
        </td>
      ))}
    </tr>
  )
}
