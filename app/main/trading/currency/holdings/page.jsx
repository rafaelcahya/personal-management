'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, BarChart2, Minus, Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Button from '@/components/base/Button/Button'
import Card, {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import AddTransactionSheet from './[id]/components/AddTransactionSheet'
import {
  getCurrencyInvestments,
  getCurrencyHoldings,
  getForexRates,
} from '@/lib/api/currencyInvestments'
import PageHeader from '@/app/main/components/PageHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table/Table.jsx'

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function PctChange({ pct }) {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return (
      <span className="flex items-center gap-1 text-slate-500">
        <Minus className="size-3" aria-hidden="true" />
        <span>—</span>
      </span>
    )
  }
  const isPos = pct > 0
  const isNeg = pct < 0
  return (
    <span
      className={`flex items-center gap-1 font-medium ${isPos ? 'text-emerald-600' : isNeg ? 'text-red-500' : 'text-slate-500'}`}
    >
      {isPos && <TrendingUp className="size-3" aria-hidden="true" />}
      {isNeg && <TrendingDown className="size-3" aria-hidden="true" />}
      {!isPos && !isNeg && <Minus className="size-3" aria-hidden="true" />}
      <span>
        {isPos ? '+' : ''}
        {pct.toFixed(2)}%
      </span>
    </span>
  )
}

function TableSkeleton() {
  return (
    <div aria-label="Loading holdings">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <BarChart2 className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">No currency holdings yet</p>
        <p className="text-xs text-slate-500">Add your first investment to get started</p>
      </div>
      <Button size="base" onClick={onAdd} className="bg-violet-600 hover:bg-violet-700 min-w-11">
        <Plus className="size-4 mr-1.5" aria-hidden="true" />
        Add Investment
      </Button>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Failed to load holdings</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button variant="outline" size="base" onClick={onRetry} className="min-w-11">
        Try again
      </Button>
    </div>
  )
}

export default function HoldingsPage() {
  const router = useRouter()
  const [investments, setInvestments] = useState([])
  const [rates, setRates] = useState({})
  const [holdingIds, setHoldingIds] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getCurrencyInvestments()
      const rows = data || []
      setInvestments(rows)

      const currencies = [...new Set(rows.filter((r) => r.type === 'buy').map((r) => r.currency))]
      if (currencies.length > 0) {
        const ratesData = await getForexRates(currencies.join(','))
        setRates(ratesData || {})
      }

      const holdingsList = await getCurrencyHoldings()
      const holdingIdMap = Object.fromEntries(holdingsList.map((h) => [h.currency, h.id]))
      setHoldingIds(holdingIdMap)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const holdings = useMemo(() => {
    const map = {}
    investments
      .filter((i) => i.type === 'buy')
      .forEach((inv) => {
        if (!map[inv.currency]) {
          map[inv.currency] = { currency: inv.currency, totalInvested: 0, totalForeign: 0 }
        }
        map[inv.currency].totalInvested += inv.idr_amount || 0
        map[inv.currency].totalForeign += inv.foreign_amount || 0
      })
    investments
      .filter((i) => i.type === 'sell')
      .forEach((inv) => {
        if (map[inv.currency]) {
          map[inv.currency].totalForeign -= inv.foreign_amount || 0
        }
      })

    return Object.values(map)
      .map((h) => {
        const currentRate = rates[h.currency] || 0
        const avgBuyRate = h.totalForeign > 0 ? h.totalInvested / h.totalForeign : 0
        const currentValue = h.totalForeign * currentRate
        const pctChange = avgBuyRate > 0 ? ((currentRate - avgBuyRate) / avgBuyRate) * 100 : null
        return {
          currency: h.currency,
          totalInvested: h.totalInvested,
          avgBuyRate,
          currentRate,
          pctChange,
          currentValue,
        }
      })
      .sort((a, b) => b.currentValue - a.currentValue)
  }, [investments, rates])

  return (
    <main className="space-y-6">
      <PageHeader
        title="Holdings"
        description="All currencies you have ever bought or sold, sorted by value"
        breadcrumbs={[
          { label: 'Trading' },
          { label: 'Currency', href: '/main/trading/currency' },
          { label: 'Holdings' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardIcon icon={BarChart2} />
          <CardHeaderContent>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>All currency positions</CardDescription>
          </CardHeaderContent>
          <CardAction>
            <Button
              id="addInvestmentBtn_holdingsPage"
              size="base"
              onClick={() => setSheetOpen(true)}
              className="bg-violet-600 hover:bg-violet-700 min-w-11"
            >
              <Plus className="size-4 mr-1.5" aria-hidden="true" />
              <span className="hidden sm:inline">Add Investment</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardAction>
        </CardHeader>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState onRetry={loadData} />
        ) : holdings.length === 0 ? (
          <EmptyState onAdd={() => setSheetOpen(true)} />
        ) : (
          <Table
            id="holdingsTable_holdingsPage"
            className="min-w-full"
            aria-label="Currency holdings"
          >
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead className="hidden sm:table-cell" align="right">
                  Total Invested
                </TableHead>
                <TableHead className="hidden sm:table-cell" align="right">
                  Avg Buy Rate
                </TableHead>
                <TableHead align="right">Current Rate</TableHead>
                <TableHead align="right">% Change</TableHead>
                <TableHead className="hidden sm:table-cell" align="right">
                  Current Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((row) => (
                <TableRow
                  key={row.currency}
                  id={`holdingsTableRow_${row.currency}_holdingsPage`}
                  clickable
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${row.currency} details`}
                  onClick={() =>
                    router.push(
                      `/main/trading/currency/holdings/${holdingIds[row.currency] ?? row.currency}`
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(
                        `/main/trading/currency/holdings/${holdingIds[row.currency] ?? row.currency}`
                      )
                    }
                  }}
                >
                  <TableCell className="font-semibold text-slate-900">{row.currency}</TableCell>
                  <TableCell
                    className="font-mono text-slate-700 hidden sm:table-cell"
                    align="right"
                  >
                    {formatIDR(row.totalInvested)}
                  </TableCell>
                  <TableCell
                    className="font-mono text-slate-700 hidden sm:table-cell"
                    align="right"
                  >
                    {row.avgBuyRate > 0
                      ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
                          row.avgBuyRate
                        )
                      : '—'}
                  </TableCell>
                  <TableCell className="font-mono text-slate-700" align="right">
                    {row.currentRate > 0
                      ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
                          row.currentRate
                        )
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <PctChange pct={row.pctChange} />
                  </TableCell>
                  <TableCell
                    className="font-mono text-slate-700 hidden sm:table-cell"
                    align="right"
                  >
                    {formatIDR(row.currentValue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AddTransactionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => {
          setSheetOpen(false)
          loadData()
        }}
      />
    </main>
  )
}
