'use client'

import { TrendingUp } from 'lucide-react'
import HighlightSection from './HighlightSection'
import { fetchTradingHighlights } from '@/lib/api/home'
import { useHighlightData } from '@/hooks/useHighlightData'

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function formatSignedIdr(value) {
  const n = Number(value) || 0
  const sign = n > 0 ? '+' : ''
  return `${sign}${idr.format(n)}`
}

export default function TradingHighlightCard() {
  const { data, loading, error, reload } = useHighlightData(fetchTradingHighlights)

  const isEmpty = data && data.totalTrades === 0

  const pnl = Number(data?.pnlLastMonth) || 0
  const pnlColor =
    pnl > 0 ? 'text-success-subtle-foreground' : pnl < 0 ? 'text-destructive' : 'text-foreground'

  const growth = Number(data?.portfolioGrowth) || 0
  const growthColor =
    growth > 0
      ? 'text-success-subtle-foreground'
      : growth < 0
        ? 'text-destructive'
        : 'text-foreground'

  return (
    <HighlightSection
      id="tradingHighlight_homePage"
      linkId="viewLink_tradingHighlight_homePage"
      retryId="retryBtn_tradingHighlight_homePage"
      title="Trading"
      description="Portfolio at a glance"
      icon={TrendingUp}
      href="/main/trading/dashboard"
      loading={loading}
      error={error}
      onRetry={reload}
    >
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">No trades yet.</p>
      ) : data ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">P&amp;L · last 30 days</p>
            <p className={`text-2xl font-bold tabular-nums ${pnlColor}`}>{formatSignedIdr(pnl)}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border">
            <div>
              <p className="text-muted-foreground">Growth</p>
              <p className={`font-medium tabular-nums ${growthColor}`}>
                {growth > 0 ? '+' : ''}
                {growth}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Win rate</p>
              <p className="font-medium text-foreground tabular-nums">{data.winRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Trades 30d</p>
              <p className="font-medium text-foreground tabular-nums">{data.tradesLastMonth}</p>
            </div>
          </div>
        </div>
      ) : null}
    </HighlightSection>
  )
}
