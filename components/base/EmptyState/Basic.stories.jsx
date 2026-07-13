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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for section-level cards and panels with zero data',
                body: 'Default size="default" and variant="empty" are the right defaults for a card or panel body when a fetch completes with zero results. The full four-part composition (icon + title + description + action) gives the clearest signal.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never render EmptyState while data is still loading',
                body: 'Show a skeleton or spinner while the fetch is in-flight. EmptyState is only for resolved, persistently-empty states — showing it during loading creates a false impression that the section has no data.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'All sub-components are optional — title is the minimum',
                body: 'EmptyStateTitle is the only required signal. Icon, description, and actions are each optional but together produce the most complete state. Never omit the title — it is the one element that tells the user what is missing.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Adjust size and variant to match the container context',
                body: 'size="default" + variant="empty" is the starting point for cards. Use size="xs" inside dropdowns, size="sm" in table rows, and size="lg" for full-page layouts. Use variant="search" for filtered empties and variant="error" for failed fetches.',
              },
            ],
          },
        ]}
      />

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
