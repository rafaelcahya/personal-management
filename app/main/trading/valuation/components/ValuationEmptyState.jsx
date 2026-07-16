import { BarChart2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'

export default function ValuationEmptyState({ onManageWatchlist }) {
  return (
    <EmptyState size="lg">
      <EmptyStateIcon icon={BarChart2} />
      <EmptyStateTitle>No stocks in your watchlist</EmptyStateTitle>
      <EmptyStateDescription>
        Add an IDX ticker to start comparing fundamentals, Monte Carlo, and risk metrics.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button id="emptyStateManageWatchlistBtn_valuationPage" onClick={onManageWatchlist}>
          Manage Watchlist
        </Button>
      </EmptyStateActions>
    </EmptyState>
  )
}
