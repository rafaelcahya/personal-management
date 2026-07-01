import { AlertCircle, PackageOpen, Plus } from 'lucide-react'
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from './EmptyState'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'EmptyState/With Actions',
}

export default meta

export const WithActions = {
  name: 'With Actions',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">EmptyStateActions</code> wraps
        one or more buttons in a flex row. Primary action goes first, secondary or ghost actions
        follow.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {/* Single action */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Single action
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState>
              <EmptyStateIcon icon={PackageOpen} />
              <EmptyStateTitle>No products yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add your first product to start tracking inventory.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm">
                  <Plus className="size-4" />
                  Add Product
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>

        {/* Primary + secondary */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Primary + secondary
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState>
              <EmptyStateIcon icon={PackageOpen} />
              <EmptyStateTitle>No products yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add your first product to start tracking inventory.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm">Add Product</Button>
                <Button size="sm" variant="ghost">
                  Learn more
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>

        {/* Error with retry */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Error with retry
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState variant="error">
              <EmptyStateIcon icon={AlertCircle} />
              <EmptyStateTitle>Failed to load trades</EmptyStateTitle>
              <EmptyStateDescription>
                Something went wrong while fetching your data.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm" variant="outline">
                  Retry
                </Button>
                <Button size="sm" variant="ghost">
                  Contact support
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* single action */}
<EmptyStateActions>
  <Button size="sm"><Plus />Add Product</Button>
</EmptyStateActions>

{/* primary + secondary */}
<EmptyStateActions>
  <Button size="sm">Add Product</Button>
  <Button size="sm" variant="ghost">Learn more</Button>
</EmptyStateActions>

{/* error retry */}
<EmptyStateActions>
  <Button size="sm" variant="outline">Retry</Button>
  <Button size="sm" variant="ghost">Contact support</Button>
</EmptyStateActions>`}</code>
      </pre>
    </div>
  ),
}
