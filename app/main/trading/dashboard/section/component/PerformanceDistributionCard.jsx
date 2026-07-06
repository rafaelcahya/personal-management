import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'
import { Separator } from '@/components/base/Separator/Separator'
import {
  AlertTriangle,
  ArrowDownRight,
  ChartNoAxesColumn,
  CircleDollarSign,
  Star,
  Target,
  Trophy,
} from 'lucide-react'
import MetricRow from './MetricRow'
import WinRateCircle from './WinRateCircle'

export default function PerformanceDistributionCard({
  winCount,
  winRate,
  loseCount,
  loseRate,
  totalTrades,
  totalProfit,
  totalLoss,
  avgProfit,
  avgLoss,
  biggestProfit,
  lowestProfit,
  biggestLoss,
  lowestLoss,
  profitPerTrade,
  lossPerTrade,
}) {
  return (
    <Card>
      <CardHeader className="flex">
        <CardIcon icon={Target} />
        <CardHeaderContent>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Win/loss breakdown with profit and loss metrics per trade.
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Win side */}
        <div className="pb-6 md:pb-0 md:pr-6">
          <div className="flex justify-center mb-4">
            <WinRateCircle
              label="Win Rate"
              count={winCount}
              percent={winRate}
              color="#10B981"
              total={totalTrades}
            />
          </div>
          <div className="space-y-2">
            <MetricRow
              label="Biggest Win"
              value={biggestProfit}
              format="currency"
              icon={<Trophy className="size-3 text-amber-400" />}
            />
            <MetricRow
              label="Smallest Win"
              value={lowestProfit}
              format="currency"
              icon={<Star className="size-3 text-violet-400" />}
            />
            <Separator />
            <MetricRow
              label="Total Profit"
              value={totalProfit}
              format="currency"
              highlight
              icon={<CircleDollarSign className="size-3 text-green-500" />}
            />
            <MetricRow
              label="Average Profit"
              value={avgProfit}
              format="currency"
              icon={<ChartNoAxesColumn className="size-3 text-blue-400" />}
            />
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-medium text-slate-500">Per Trade Impact</span>
              <span className="text-sm font-medium text-green-600">
                +Rp {profitPerTrade.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Loss side */}
        <div className="pt-6 md:pt-0 md:pl-6">
          <div className="flex justify-center mb-4">
            <WinRateCircle
              label="Loss Rate"
              count={loseCount}
              percent={loseRate}
              color="#EF4444"
              total={totalTrades}
            />
          </div>
          <div className="space-y-2">
            <MetricRow
              label="Biggest Loss"
              value={biggestLoss}
              format="currency"
              icon={<AlertTriangle className="size-3 text-red-400" />}
            />
            <MetricRow
              label="Smallest Loss"
              value={lowestLoss}
              format="currency"
              icon={<ArrowDownRight className="size-3 text-orange-400" />}
            />
            <Separator />
            <MetricRow
              label="Total Loss"
              value={totalLoss}
              format="currency"
              highlight
              icon={<CircleDollarSign className="size-3 text-red-500" />}
            />
            <MetricRow
              label="Average Loss"
              value={avgLoss}
              format="currency"
              icon={<ChartNoAxesColumn className="size-3 text-slate-400" />}
            />
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-medium text-slate-500">Per Trade Impact</span>
              <span className="text-sm font-medium text-red-600">
                -Rp {lossPerTrade.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
