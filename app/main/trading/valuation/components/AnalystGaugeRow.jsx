import { TableRow, TableCell } from '@/components/base/Table/Table'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'

function clampPercent(value, low, high) {
  if (high === low) return 50
  return Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100))
}

function GaugeBar({ currentPrice, targetMean, targetHigh, targetLow }) {
  if (!targetHigh || !targetLow || !currentPrice) {
    return <p className="text-xs text-slate-400 text-center py-2">No analyst target data</p>
  }

  const currentPct = clampPercent(currentPrice, targetLow, targetHigh)
  const meanPct = clampPercent(targetMean, targetLow, targetHigh)

  return (
    <div className="px-2 py-3">
      <div className="relative h-1.5 bg-slate-100 rounded-full mx-4">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white shadow-sm z-10"
          style={{ left: `${currentPct}%`, transform: 'translate(-50%, -50%)' }}
          title={`Current: Rp ${Math.round(currentPrice).toLocaleString('id-ID')}`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-white shadow-sm z-10"
          style={{ left: `${meanPct}%`, transform: 'translate(-50%, -50%)' }}
          title={`Target Mean: Rp ${Math.round(targetMean).toLocaleString('id-ID')}`}
        />
      </div>

      <div className="flex justify-between mt-2.5 text-[10px] text-slate-400 font-mono px-1">
        <span>Rp {Math.round(targetLow).toLocaleString('id-ID')}</span>
        <span className="text-violet-500">
          ◆ Rp {Math.round(targetMean).toLocaleString('id-ID')}
        </span>
        <span>Rp {Math.round(targetHigh).toLocaleString('id-ID')}</span>
      </div>
      <div className="flex justify-between text-[10px] text-slate-300 px-1">
        <span>Target Low</span>
        <span className="text-slate-400">
          ● Rp {Math.round(currentPrice).toLocaleString('id-ID')} current
        </span>
        <span>Target High</span>
      </div>
    </div>
  )
}

export default function AnalystGaugeRow({ tickers, dataByTicker, statusByTicker, tickerCount }) {
  const ticker = tickers[0]
  const status = statusByTicker[ticker]
  const data = dataByTicker[ticker]

  const colSpan = 1 + tickerCount * 3

  return (
    <TableRow className="border-b border-slate-50">
      <TableCell colSpan={colSpan} className="px-4 py-0">
        {status === 'loading' || status === undefined ? (
          <div className="px-2 py-4">
            <Skeleton className="h-1.5 w-full rounded-full mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : status === 'success' ? (
          <GaugeBar
            currentPrice={data?.monteCarlo?.price}
            targetMean={data?.analystConsensus?.targetMean}
            targetHigh={data?.analystConsensus?.targetHigh}
            targetLow={data?.analystConsensus?.targetLow}
          />
        ) : null}
      </TableCell>
    </TableRow>
  )
}
