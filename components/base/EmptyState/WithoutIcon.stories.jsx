import { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle } from './EmptyState'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'EmptyState/Without Icon',
}

export default meta

export const WithoutIcon = {
  name: 'Without Icon',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        All sub-components are optional — omit{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">EmptyStateIcon</code> when a
        compact or text-only state is preferred, such as inside a small dropdown or inline list.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {/* Title only */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Title only
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState size="sm">
              <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
            </EmptyState>
          </div>
        </div>

        {/* Title + description */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Title + description
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState>
              <EmptyStateTitle>No products yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add your first product to start tracking inventory.
              </EmptyStateDescription>
            </EmptyState>
          </div>
        </div>

        {/* Title + description + action */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Title + description + action
          </span>
          <div className="border border-gray-200 rounded-xl">
            <EmptyState>
              <EmptyStateTitle>No trades recorded</EmptyStateTitle>
              <EmptyStateDescription>
                Log your first trade to start building your portfolio history.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm">Add Trade</Button>
                <Button size="sm" variant="ghost">
                  Import CSV
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* minimal — title only */}
<EmptyState size="sm">
  <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
</EmptyState>

{/* without icon */}
<EmptyState>
  <EmptyStateTitle>No products yet</EmptyStateTitle>
  <EmptyStateDescription>
    Add your first product to start tracking inventory.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button size="sm">Add Product</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
