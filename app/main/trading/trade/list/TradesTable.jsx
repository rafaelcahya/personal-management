'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUp, ArrowDown } from 'lucide-react'
import UpdateTrade from '../UpdateTrade'

const profitLossColor = (value) =>
  value < 0 ? 'text-[var(--color-trade-loss,#dc2626)]' : 'text-[var(--color-trade-profit,#16a34a)]'

function SortableHead({ column, label, sortKey, className }) {
  const isActive = sortKey === column.key
  return (
    <TableHead
      className={`py-2 text-slate-foreground cursor-pointer select-none hover:bg-slate-200 transition-colors ${className ?? ''}`}
      onClick={() => column.onSort(sortKey)}
      aria-sort={isActive ? (column.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="flex items-center gap-1">
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
    </TableHead>
  )
}

export default function TradesTable({ trades, sortKey, sortDir, onSort, onRefresh }) {
  const [selectedTrade, setSelectedTrade] = useState(null)

  const sortColumn = { key: sortKey, direction: sortDir, onSort }

  return (
    <>
      <div id="tradeTable_tradePage" className="overflow-x-auto flex-1">
        <Table className="w-full table-auto">
          <TableHeader className="bg-slate-100 sticky top-0 z-20">
            <TableRow className="border-none">
              <SortableHead
                column={sortColumn}
                label="Date"
                sortKey="trade_date"
                className="rounded-l-lg"
              />
              <TableHead className="py-2 text-slate-foreground">Ticker</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Margin</TableHead>
              <TableHead className="py-2 text-slate-foreground text-right">Proceeds</TableHead>
              <SortableHead column={sortColumn} label="Return %" sortKey="return_percent" />
              <SortableHead
                column={sortColumn}
                label="P/L"
                sortKey="realized_gain"
                className="text-right"
              />
              <TableHead className="py-2 text-slate-foreground rounded-r-lg">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow
                key={trade.id}
                id="tradeTableRow_tradePage"
                className="hover:bg-slate-100 cursor-pointer"
                onClick={() => setSelectedTrade(trade)}
              >
                <TableCell className="font-medium">
                  {new Date(trade.trade_date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="font-bold uppercase text-violet-600">
                  {trade.ticker}
                </TableCell>
                <TableCell className="text-right font-mono">
                  Rp {Number(trade.margin).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right font-mono">
                  Rp {Number(trade.proceeds).toLocaleString('id-ID')}
                </TableCell>
                <TableCell
                  className={`font-semibold ${profitLossColor(parseFloat(trade.return_percent))}`}
                >
                  {trade.return_percent}
                </TableCell>
                <TableCell
                  className={`text-right font-mono font-semibold ${profitLossColor(Number(trade.realized_gain))}`}
                >
                  Rp {Number(trade.realized_gain).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-sm">{trade.stock_type_option}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
