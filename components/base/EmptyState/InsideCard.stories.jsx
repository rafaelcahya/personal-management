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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always keep the card header visible when body is EmptyState',
                body: "The header tells users which section is empty and confirms they're in the right place. Never hide or remove the card header just because the body has no data.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use size="lg" in compact cards',
                body: 'size="lg" stretches the layout beyond the card\'s container height. Use size="default" for standard section cards and size="lg" only for prominent full-section cards that are the page\'s primary focus.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep the card header minimal when body is EmptyState',
                body: "Heavy headers — multiple actions, tabs, filters — compete visually with the EmptyState's call to action and fragment the user's attention. A simple title icon is enough.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'size="default" for standard cards, size="lg" for primary-focus sections',
                body: 'Use "default" for inventory, trades, or any card that shares the page with other cards. Use "lg" only when the card is the page\'s sole focus and EmptyState is the entire primary content area.',
              },
            ],
          },
        ]}
      />

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
