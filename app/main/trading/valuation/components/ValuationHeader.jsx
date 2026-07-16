'use client'

import { BarChart2, X } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/base/Select/Select'

function tickerOptions(watchlist, selected, currentValue) {
  return watchlist.filter((item) => item.ticker === currentValue || !selected.includes(item.ticker))
}

export default function ValuationHeader({
  watchlist,
  selected,
  onPrimaryChange,
  onCompareChange,
  onAddCompare,
  onRemoveCompare,
  onManageWatchlist,
  maxTickers,
}) {
  const [primary, ...compares] = selected
  const canAddCompare = selected.length < maxTickers && watchlist.length > selected.length

  const subtitle =
    selected.length <= 1 ? 'Fundamental & risk analysis' : `Comparing ${selected.length} stocks`

  return (
    <div className="flex flex-col gap-3 px-4 py-4 md:px-6 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center size-9 rounded-lg bg-violet-50 text-violet-600 shrink-0">
          <BarChart2 className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Stock Valuation</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={primary ?? ''} onValueChange={onPrimaryChange}>
          <SelectTrigger id="tickerSelect_valuationPage" className="min-w-11 w-[150px]">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {tickerOptions(watchlist, compares, primary).map((item) => (
              <SelectItem key={item.ticker} value={item.ticker}>
                {item.ticker}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {compares.map((compareTicker, index) => (
          <span key={`compare-${index}`} className="flex items-center gap-1">
            <Button
              id={`removeCompareBtn_${index + 1}_valuationPage`}
              variant="ghost"
              size="icon-sm"
              aria-label="Remove compare ticker"
              onClick={() => onRemoveCompare(index + 1)}
              className="text-slate-400 hover:text-destructive-subtle-foreground shrink-0"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
            <Select
              value={compareTicker ?? ''}
              onValueChange={(value) => onCompareChange(index + 1, value)}
            >
              <SelectTrigger
                id={`compareSelect_${index + 1}_valuationPage`}
                className="min-w-11 w-[180px]"
              >
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent>
                {tickerOptions(watchlist, [primary, ...compares], compareTicker).map((item) => (
                  <SelectItem key={item.ticker} value={item.ticker}>
                    {item.ticker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        ))}

        {canAddCompare && (
          <Button
            id="addCompareBtn_valuationPage"
            variant="outline"
            size="sm"
            onClick={onAddCompare}
            className="min-w-11"
          >
            + Compare
          </Button>
        )}

        <Button
          id="manageWatchlistBtn_valuationPage"
          variant="ghost"
          size="sm"
          onClick={onManageWatchlist}
          className="min-w-11"
        >
          Manage Watchlist
        </Button>
      </div>
    </div>
  )
}
