import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import Button from '@/components/base/Button/Button'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'
import PnLChart from './PnLChart'

const FILTERS = [
  { label: '7D', days: 7, id: 'pnlFilter_7d_currencyPage' },
  { label: '30D', days: 30, id: 'pnlFilter_30d_currencyPage' },
  { label: '3M', days: 90, id: 'pnlFilter_3m_currencyPage' },
  { label: '6M', days: 180, id: 'pnlFilter_6m_currencyPage' },
  { label: '1Y', days: 365, id: 'pnlFilter_1y_currencyPage' },
]

export default function PnLCard({
  historyData,
  activeFilter,
  customStart,
  customEnd,
  onFilterChange,
  onCustomStartChange,
  onCustomEndChange,
}) {
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={TrendingUp} />
        <CardHeaderContent>
          <CardTitle>Unrealized P&L</CardTitle>
          <CardDescription>Portfolio performance over time</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {FILTERS.map((f) => (
            <Button
              key={f.label}
              id={f.id}
              variant="ghost"
              onClick={() => {
                onFilterChange(f.days)
                onCustomStartChange(null)
                onCustomEndChange(null)
              }}
              aria-pressed={activeFilter === f.days && !customStart}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium min-w-11',
                activeFilter === f.days && !customStart
                  ? 'bg-violet-600 text-white hover:bg-violet-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {f.label}
            </Button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <DatePicker
              value={customStart}
              onChange={onCustomStartChange}
              placeholder="Start date"
              displayFormat="d MMM yyyy"
              toDate={customEnd ?? undefined}
              className="text-xs h-8 min-w-[110px]"
            />
            <span className="text-xs text-slate-400">–</span>
            <DatePicker
              value={customEnd}
              onChange={onCustomEndChange}
              placeholder="End date"
              displayFormat="d MMM yyyy"
              fromDate={customStart ?? undefined}
              className="text-xs h-8 min-w-[110px]"
            />
          </div>
        </div>
        <PnLChart data={historyData} />
      </CardContent>
    </Card>
  )
}
