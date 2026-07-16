'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, { CardContent } from '@/components/base/Card/Card'
import PageHeader from '@/app/main/components/PageHeader'
import ValuationHeader from './components/ValuationHeader'
import ValuationTable from './components/ValuationTable'
import ValuationEmptyState from './components/ValuationEmptyState'
import ManageWatchlistSheet from './components/ManageWatchlistSheet'
import { useValuationWatchlist } from './hooks/useValuationWatchlist'
import { useValuationData } from './hooks/useValuationData'

export default function ValuationPage() {
  const [sheetOpen, setSheetOpen] = useState(false)

  const {
    watchlist,
    loading: watchlistLoading,
    error: watchlistError,
    reload,
    addTicker,
    removeTicker,
    selected,
    setPrimary,
    setCompareSlot,
    addCompareSlot,
    removeCompareSlot,
    maxTickers,
  } = useValuationWatchlist()

  const activeTickers = selected.filter(Boolean)
  const { dataByTicker, statusByTicker, retry } = useValuationData(activeTickers)

  const pageHeader = (
    <PageHeader
      title="Valuation"
      description="Compare IDX stocks side by side — fundamentals, Monte Carlo, and risk metrics"
      breadcrumbs={[{ label: 'Trading' }, { label: 'Valuation' }]}
    />
  )

  return (
    <main id="valuationPage" className="space-y-6">
      {pageHeader}

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {watchlistLoading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-400" aria-live="polite">
            Loading watchlist...
          </div>
        ) : watchlistError ? (
          <Card className="border-0 shadow-none">
            <CardContent
              className="flex flex-col items-center justify-center py-16 gap-4 text-center"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700">Failed to load watchlist</p>
                <p className="text-xs text-slate-500">Check your connection and try again</p>
              </div>
              <Button variant="outline" onClick={reload} className="min-w-11">
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : watchlist.length === 0 ? (
          <div className="px-6">
            <ValuationEmptyState onManageWatchlist={() => setSheetOpen(true)} />
          </div>
        ) : (
          <>
            <ValuationHeader
              watchlist={watchlist}
              selected={selected}
              onPrimaryChange={setPrimary}
              onCompareChange={setCompareSlot}
              onAddCompare={addCompareSlot}
              onRemoveCompare={removeCompareSlot}
              onManageWatchlist={() => setSheetOpen(true)}
              maxTickers={maxTickers}
            />
            {activeTickers.length > 0 && (
              <ValuationTable
                tickers={activeTickers}
                dataByTicker={dataByTicker}
                statusByTicker={statusByTicker}
                onRetry={retry}
              />
            )}
          </>
        )}
      </section>

      <ManageWatchlistSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        watchlist={watchlist}
        onAdd={addTicker}
        onRemove={removeTicker}
      />
    </main>
  )
}
