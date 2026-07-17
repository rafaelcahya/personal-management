'use client'

import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/base/Table/Table'
import State from '@/components/base/State/State'
import { METRIC_SECTIONS } from './metricRows'
import SectionGroupRow from './SectionGroupRow'
import MetricRow from './MetricRow'
import OverallScoreRow from './OverallScoreRow'
import AnalystGaugeRow from './AnalystGaugeRow'
import FiftyTwoWeekRangeRow from './FiftyTwoWeekRangeRow'

const SUB_HEADER = 'py-1.5 text-violet-700 font-mono border-b border-slate-100'

export default function ValuationTable({ tickers, dataByTicker, statusByTicker, onRetry }) {
  const tickerCount = tickers.length
  const isCompare = tickerCount > 1

  const singleModeError = tickerCount === 1 && statusByTicker[tickers[0]] === 'error'

  if (singleModeError) {
    return (
      <State
        variant="error"
        title="Failed to load valuation data"
        description={`${tickers[0]} — check your connection and retry`}
        action={{ label: 'Try again', onClick: () => onRetry(tickers[0]) }}
      />
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
          <React.Fragment key={`section-${section.label}`}>
            <SectionGroupRow
              label={section.label}
              tickerCount={tickerCount}
              description={section.description}
            />
            {section.gauge && !isCompare && (
              <AnalystGaugeRow
                tickers={tickers}
                dataByTicker={dataByTicker}
                statusByTicker={statusByTicker}
                tickerCount={tickerCount}
              />
            )}
            {section.rangeGauge && !isCompare && (
              <FiftyTwoWeekRangeRow
                tickers={tickers}
                dataByTicker={dataByTicker}
                statusByTicker={statusByTicker}
                tickerCount={tickerCount}
              />
            )}
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
          </React.Fragment>
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
