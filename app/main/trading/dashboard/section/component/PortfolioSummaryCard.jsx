import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardIcon,
  CardHeaderContent,
} from '@/components/base/Card/Card.jsx'
import { LayoutDashboard, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

function formatRp(value) {
  return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
}

export default function PortfolioSummaryCard({
  accountValue,
  initialMargin,
  portfolioGrowth,
  pnl,
  pnlLastMonth,
  winsLastMonth,
  lossesLastMonth,
}) {
  const growthPositive = Number(portfolioGrowth) >= 0
  const pnlPositive = Number(pnl) >= 0
  const pnlLastMonthPositive = Number(pnlLastMonth) >= 0

  return (
    <Card>
      <CardHeader className="flex">
        <CardIcon icon={LayoutDashboard} />
        <CardHeaderContent>
          <CardTitle>Portfolio Summary</CardTitle>
          <CardDescription>Current account value and total realized profit/loss.</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent padding="none" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-4">
        <div className="px-5 py-3 border-r border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Wallet className="size-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-xs font-medium text-slate-500">Account Value</span>
            </div>
            <span
              className={`text-xs font-semibold tabular-nums ${growthPositive ? 'text-green-600' : 'text-red-500'}`}
            >
              {growthPositive ? '+' : ''}
              {portfolioGrowth}%
            </span>
          </div>
          <p className="text-xl font-semibold text-slate-800 tabular-nums">
            {formatRp(accountValue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Initial: {formatRp(initialMargin)}</p>
        </div>

        <div className="px-5 py-3 border-r border-slate-200">
          <div className="flex items-center gap-1.5 mb-2">
            {pnlPositive ? (
              <TrendingUp className="size-3.5 text-slate-400" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5 text-slate-400" aria-hidden="true" />
            )}
            <span className="text-xs font-medium text-slate-500">Total P/L</span>
          </div>
          <p
            className={`text-xl font-semibold tabular-nums ${pnlPositive ? 'text-green-600' : 'text-red-500'}`}
          >
            {pnlPositive ? '+' : ''}
            {formatRp(pnl)}
          </p>
          <p
            className={`text-xs mt-1 font-medium tabular-nums ${pnlLastMonthPositive ? 'text-green-500' : 'text-red-400'}`}
          >
            {pnlLastMonthPositive ? '+' : ''}
            {formatRp(pnlLastMonth)}{' '}
            <span className="text-slate-400 font-normal">last 30 days</span>
          </p>
        </div>

        <div className="px-5 py-3 border-r border-slate-200">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="size-3.5 text-slate-400" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500">Wins</span>
          </div>
          <p className="text-xl font-semibold text-green-600 tabular-nums">{winsLastMonth ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">this month</p>
        </div>

        <div className="px-5 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="size-3.5 text-slate-400" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500">Losses</span>
          </div>
          <p className="text-xl font-semibold text-red-500 tabular-nums">{lossesLastMonth ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">this month</p>
        </div>
      </CardContent>
    </Card>
  )
}
