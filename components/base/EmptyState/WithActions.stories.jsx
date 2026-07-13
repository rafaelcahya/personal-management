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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Add an action when there is a clear next step',
                body: 'Add Product, Import CSV, Retry — these move the user forward. If there is no meaningful action available, omit EmptyStateActions entirely rather than adding a placeholder.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never add more than two actions',
                body: 'Limit to one primary and one ghost or secondary. More than two creates decision paralysis and dilutes the call to action. Never use Dismiss or Skip as a primary — those are not meaningful next steps.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Primary action goes first in EmptyStateActions',
                body: 'The first button in EmptyStateActions is the most prominent. Place the main CTA first so keyboard and screen reader users reach it before secondary options.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use variant="outline" on Retry for error variant',
                body: 'A filled primary button on a red empty state looks alarming. The outline keeps the recovery tone calm while still providing a clear action. Use ghost for a secondary support link.',
              },
            ],
          },
        ]}
      />

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
