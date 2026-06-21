import { TrendingUp, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TradeEmptyState({ onAddTrade, search }) {
  if (search) {
    return (
      <div
        id="tradeEmptyState_tradePage"
        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      >
        <div className="p-3 rounded-full bg-slate-50">
          <SearchX className="size-8 text-slate-400" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-slate-700">
            No trades match &ldquo;{search}&rdquo;
          </p>
          <p className="text-sm text-slate-500">Try a different ticker symbol.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="tradeEmptyState_tradePage"
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <div className="p-3 rounded-full bg-violet-50">
        <TrendingUp className="size-8 text-violet-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-700">No trades yet</p>
        <p className="text-sm text-slate-500">
          Start tracking your performance by logging your first trade.
        </p>
      </div>
      <Button id="tradeEmptyStateAddBtn_tradePage" onClick={onAddTrade} className="min-h-11">
        Add Trade
      </Button>
    </div>
  )
}
