'use client'

import { AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/base/Table/Table'
import { METRIC_SECTIONS } from './metricRows'
import SectionGroupRow from './SectionGroupRow'
import MetricRow from './MetricRow'
import OverallScoreRow from './OverallScoreRow'

const SUB_HEADER = 'py-1.5 text-violet-700 font-mono border-b border-slate-100'

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
    <Table
      id="valuationTable_valuationPage"
      aria-label="Stock valuation analysis"
      className="min-w-full"
    >
      <TableHeader>
        {!isCompare ? (
          <TableRow>
            <TableHead width="200px">Metric</TableHead>
            <TableHead align="right" width="140px">
              Value
            </TableHead>
            <TableHead width="180px">RC Assessment</TableHead>
            <TableHead align="center" width="100px">
              Signal
            </TableHead>
          </TableRow>
        ) : (
          <>
            <TableRow>
              <TableHead rowSpan={2} className="align-bottom w-[200px]">
                Metric
              </TableHead>
              <TableHead colSpan={tickerCount} align="center">
                Value
              </TableHead>
              <TableHead colSpan={tickerCount} align="center">
                RC Assessment
              </TableHead>
              <TableHead colSpan={tickerCount} align="center">
                Signal
              </TableHead>
            </TableRow>
            <TableRow>
              {tickers.map((ticker) => (
                <TableHead key={`value-${ticker}`} align="right" className={SUB_HEADER}>
                  {ticker}
                </TableHead>
              ))}
              {tickers.map((ticker) => (
                <TableHead key={`rc-${ticker}`} className={SUB_HEADER}>
                  {ticker}
                </TableHead>
              ))}
              {tickers.map((ticker) => (
                <TableHead key={`signal-${ticker}`} align="center" className={SUB_HEADER}>
                  {ticker}
                </TableHead>
              ))}
            </TableRow>
          </>
        )}
      </TableHeader>
      <TableBody divider={false}>
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
      </TableBody>
    </Table>
  )
}
