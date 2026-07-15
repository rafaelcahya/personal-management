'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import UpdateTrade from '../UpdateTrade'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

const profitLossColor = (value) =>
  value < 0 ? 'text-destructive-subtle-foreground' : 'text-success-subtle-foreground'

function SortableHead({ column, label, sortKey, align = 'left' }) {
  const isActive = sortKey === column.key
  return (
    <TableHead
      className="cursor-pointer select-none hover:text-slate-700 transition-colors"
      align={align}
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
    </TableHead>
  )
}

export default function TradesTable({ trades, sortKey, sortDir, onSort, onRefresh }) {
  const [selectedTrade, setSelectedTrade] = useState(null)

  const sortColumn = { key: sortKey, direction: sortDir, onSort }

  return (
    <>
      <Table
        id="tradeTable_tradePage"
        wrapperClassName="overflow-x-auto flex-1"
        className="min-w-full"
        aria-label="Trades"
      >
        <TableHeader sticky>
          <TableRow>
            <SortableHead column={sortColumn} label="Date" sortKey="trade_date" />
            <TableHead>Ticker</TableHead>
            <TableHead align="right">Margin</TableHead>
            <TableHead align="right">Proceeds</TableHead>
            <SortableHead
              align="right"
              column={sortColumn}
              label="Return %"
              sortKey="return_percent"
            />
            <SortableHead column={sortColumn} label="P/L" sortKey="realized_gain" align="right" />
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody divider={false}>
          {trades.map((trade) => (
            <TableRow
              key={trade.id}
              id="tradeTableRow_tradePage"
              clickable
              onClick={() => setSelectedTrade(trade)}
            >
              <TableCell className="text-slate-700 whitespace-nowrap">
                {new Date(trade.trade_date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="font-bold uppercase text-violet-600">{trade.ticker}</TableCell>
              <TableCell className="font-mono text-slate-700 whitespace-nowrap" align="right">
                Rp {Number(trade.margin).toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="font-mono text-slate-700 whitespace-nowrap" align="right">
                Rp {Number(trade.proceeds).toLocaleString('id-ID')}
              </TableCell>
              <TableCell
                align="right"
                className={`font-semibold ${profitLossColor(parseFloat(trade.return_percent))}`}
              >
                {trade.return_percent}
              </TableCell>
              <TableCell
                className={`font-mono font-semibold whitespace-nowrap ${profitLossColor(Number(trade.realized_gain))}`}
                align="right"
              >
                Rp {Number(trade.realized_gain).toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-slate-700">{trade.stock_type_option}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
