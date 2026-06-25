'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import UpdateTrade from '../UpdateTrade'

const profitLossColor = (value) =>
  value < 0 ? 'text-destructive-subtle-foreground' : 'text-success-subtle-foreground'

const TH_BASE =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

function SortableHead({ column, label, sortKey, align = 'left' }) {
  const isActive = sortKey === column.key
  return (
    <th
      className={`${TH_BASE} text-${align} cursor-pointer select-none hover:text-slate-700 transition-colors`}
      onClick={() => column.onSort(sortKey)}
      aria-sort={isActive ? (column.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          column.direction === 'asc' ? (
            <ArrowUp className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
          )
        ) : (
          <span className="size-3.5 shrink-0" aria-hidden="true" />
        )}
      </span>
    </th>
  )
}

export default function TradesTable({ trades, sortKey, sortDir, onSort, onRefresh }) {
  const [selectedTrade, setSelectedTrade] = useState(null)

  const sortColumn = { key: sortKey, direction: sortDir, onSort }

  return (
    <>
      <div id="tradeTable_tradePage" className="overflow-x-auto flex-1">
        <table className="min-w-full text-sm" aria-label="Trades">
          <thead>
            <tr className="border-b border-slate-100">
              <SortableHead column={sortColumn} label="Date" sortKey="trade_date" />
              <th className={`${TH_BASE} text-left`}>Ticker</th>
              <th className={`${TH_BASE} text-right`}>Margin</th>
              <th className={`${TH_BASE} text-right`}>Proceeds</th>
              <SortableHead column={sortColumn} label="Return %" sortKey="return_percent" />
              <SortableHead column={sortColumn} label="P/L" sortKey="realized_gain" align="right" />
              <th className={`${TH_BASE} text-left`}>Type</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                id="tradeTableRow_tradePage"
                className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelectedTrade(trade)}
              >
                <td className="px-5 py-3.5 text-slate-700">
                  {new Date(trade.trade_date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3.5 font-bold uppercase text-violet-600">{trade.ticker}</td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  Rp {Number(trade.margin).toLocaleString('id-ID')}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  Rp {Number(trade.proceeds).toLocaleString('id-ID')}
                </td>
                <td
                  className={`px-5 py-3.5 font-semibold ${profitLossColor(parseFloat(trade.return_percent))}`}
                >
                  {trade.return_percent}
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-mono font-semibold ${profitLossColor(Number(trade.realized_gain))}`}
                >
                  Rp {Number(trade.realized_gain).toLocaleString('id-ID')}
                </td>
                <td className="px-5 py-3.5 text-slate-700">{trade.stock_type_option}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrade && (
        <UpdateTrade
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onUpdated={async () => {
            await onRefresh()
            setSelectedTrade(null)
          }}
        />
      )}
    </>
  )
}
