'use client'

import { AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { METRIC_SECTIONS } from './metricRows'
import SectionGroupRow from './SectionGroupRow'
import MetricRow from './MetricRow'
import OverallScoreRow from './OverallScoreRow'

const SUB_HEADER_RIGHT =
  'px-3 py-1.5 text-xs font-semibold text-violet-700 font-mono border-b border-slate-100 text-right'
const SUB_HEADER_LEFT =
  'px-3 py-1.5 text-xs font-semibold text-violet-700 font-mono border-b border-slate-100 text-left'
const SUB_HEADER_CENTER =
  'px-3 py-1.5 text-xs font-semibold text-violet-700 font-mono border-b border-slate-100 text-center'

export default function ValuationTable({ tickers, dataByTicker, statusByTicker, onRetry }) {
  const tickerCount = tickers.length
  const isCompare = tickerCount > 1

  const singleModeError = tickerCount === 1 && statusByTicker[tickers[0]] === 'error'

  if (singleModeError) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">Failed to load valuation data</p>
          <p className="text-xs text-slate-500">{tickers[0]} — check your connection and retry</p>
        </div>
        <Button variant="outline" onClick={() => onRetry(tickers[0])} className="min-w-11">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table
        id="valuationTable_valuationPage"
        aria-label="Stock valuation analysis"
        className="min-w-full text-sm"
      >
        <thead>
          {!isCompare ? (
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-[200px]">
                Metric
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide w-[140px]">
                Value
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-[180px]">
                RC Assessment
              </th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide w-[100px]">
                Signal
              </th>
            </tr>
          ) : (
            <>
              <tr>
                <th
                  rowSpan={2}
                  className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide align-bottom w-[200px]"
                >
                  Metric
                </th>
                <th
                  colSpan={tickerCount}
                  className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  Value
                </th>
                <th
                  colSpan={tickerCount}
                  className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  RC Assessment
                </th>
                <th
                  colSpan={tickerCount}
                  className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  Signal
                </th>
              </tr>
              <tr>
                {tickers.map((ticker) => (
                  <th key={`value-${ticker}`} className={SUB_HEADER_RIGHT}>
                    {ticker}
                  </th>
                ))}
                {tickers.map((ticker) => (
                  <th key={`rc-${ticker}`} className={SUB_HEADER_LEFT}>
                    {ticker}
                  </th>
                ))}
                {tickers.map((ticker) => (
                  <th key={`signal-${ticker}`} className={SUB_HEADER_CENTER}>
                    {ticker}
                  </th>
                ))}
              </tr>
            </>
          )}
        </thead>
        <tbody>
          {METRIC_SECTIONS.map((section) => (
            <>
              <SectionGroupRow
                key={`section-${section.label}`}
                label={section.label}
                tickerCount={tickerCount}
              />
              {section.rows.map((row) => (
                <MetricRow
                  key={row.key}
                  row={row}
                  group={section.group}
                  tickers={tickers}
                  dataByTicker={dataByTicker}
                  statusByTicker={statusByTicker}
                  onRetry={onRetry}
                />
              ))}
            </>
          ))}
          <OverallScoreRow
            tickers={tickers}
            dataByTicker={dataByTicker}
            statusByTicker={statusByTicker}
            onRetry={onRetry}
          />
        </tbody>
      </table>
    </div>
  )
}
