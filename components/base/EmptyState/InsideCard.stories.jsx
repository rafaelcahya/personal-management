import { AlertCircle, BarChart2, PackageOpen, Plus, TrendingUp } from 'lucide-react'
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
  title: 'EmptyState/Inside Card',
}

export default meta

export const InsideCard = {
  name: 'Inside Card',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">EmptyState</code> as the
        body of a card when the section has no data. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;default&quot;</code>{' '}
        for standard cards and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;lg&quot;</code> for
        prominent full-section cards.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {/* Standard card */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Standard card — size=&quot;default&quot;
          </span>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <PackageOpen className="size-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">Inventory</span>
            </div>
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

        {/* Large prominent card */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Large card — size=&quot;lg&quot;
          </span>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <TrendingUp className="size-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">Portfolio</span>
            </div>
            <EmptyState size="lg">
              <EmptyStateIcon icon={BarChart2} />
              <EmptyStateTitle>No trades recorded</EmptyStateTitle>
              <EmptyStateDescription>
                Log your first trade to start building your portfolio history and track P&L.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button>Add Trade</Button>
                <Button variant="ghost">Import CSV</Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>

        {/* Error card */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Error state — variant=&quot;error&quot;
          </span>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <PackageOpen className="size-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">Inventory</span>
            </div>
            <EmptyState variant="error">
              <EmptyStateIcon icon={AlertCircle} />
              <EmptyStateTitle>Failed to load inventory</EmptyStateTitle>
              <EmptyStateDescription>
                We couldn&apos;t fetch your products. Please try again.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm" variant="outline">
                  Retry
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="border rounded-xl overflow-hidden">
  {/* card header */}
  <div className="px-5 py-4 border-b">
    <span className="font-semibold">Inventory</span>
  </div>

  {/* empty state body */}
  <EmptyState>
    <EmptyStateIcon icon={PackageOpen} />
    <EmptyStateTitle>No products yet</EmptyStateTitle>
    <EmptyStateDescription>
      Add your first product to start tracking inventory.
    </EmptyStateDescription>
    <EmptyStateActions>
      <Button size="sm">Add Product</Button>
    </EmptyStateActions>
  </EmptyState>
</div>`}</code>
      </pre>
    </div>
  ),
}
