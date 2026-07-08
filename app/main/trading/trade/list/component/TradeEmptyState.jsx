import { TrendingUp, SearchX } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'

export default function TradeEmptyState({ onAddTrade, search }) {
  if (search) {
    return (
      <EmptyState id="tradeEmptyState_tradePage" variant="search">
        <EmptyStateIcon icon={SearchX} />
        <EmptyStateTitle>No trades match &ldquo;{search}&rdquo;</EmptyStateTitle>
        <EmptyStateDescription>Try a different ticker symbol.</EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <EmptyState id="tradeEmptyState_tradePage">
      <EmptyStateIcon icon={TrendingUp} />
      <EmptyStateTitle>No trades yet</EmptyStateTitle>
      <EmptyStateDescription>
        Start tracking your performance by logging your first trade.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button id="tradeEmptyStateAddBtn_tradePage" onClick={onAddTrade}>
          Add Trade
        </Button>
      </EmptyStateActions>
    </EmptyState>
  )
}
