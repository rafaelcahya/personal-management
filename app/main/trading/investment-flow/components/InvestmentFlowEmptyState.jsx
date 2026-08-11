import { GitBranch, Plus } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'

export default function InvestmentFlowEmptyState({ onAddCategory }) {
  return (
    <div
      id="investmentFlowEmptyState_investmentFlowPage"
      className="border border-slate-200 rounded-xl"
    >
      <EmptyState size="lg">
        <EmptyStateIcon icon={GitBranch} />
        <EmptyStateTitle>No allocation tree yet</EmptyStateTitle>
        <EmptyStateDescription>
          Start by adding a top-level category, like &quot;Saham IDX&quot; or &quot;Reksa
          Dana&quot;.
        </EmptyStateDescription>
        <EmptyStateActions>
          <Button
            id="investmentFlowEmptyStateAddCategoryBtn_investmentFlowPage"
            onClick={onAddCategory}
          >
            <Plus className="size-4" />
            Add Category
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </div>
  )
}
