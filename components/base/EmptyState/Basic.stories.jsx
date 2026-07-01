import { PackageOpen } from 'lucide-react'
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
  title: 'EmptyState/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The default EmptyState with all sub-components composed together. Use this pattern for
        section-level empty states inside a card or panel.
      </p>

      <div className="border border-gray-200 rounded-xl w-full max-w-lg">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'

<EmptyState>
  <EmptyStateIcon icon={PackageOpen} />
  <EmptyStateTitle>No products yet</EmptyStateTitle>
  <EmptyStateDescription>
    Add your first product to start tracking inventory.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button size="sm">Add Product</Button>
    <Button size="sm" variant="ghost">Learn more</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
