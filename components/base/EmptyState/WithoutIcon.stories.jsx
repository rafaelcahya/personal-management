import { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle } from './EmptyState'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'EmptyState/Without Icon',
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Omit the icon when space is tight or context is self-evident',
                body: 'A compact dropdown or inline list doesn\'t need an icon to convey "nothing here" — the surrounding context already implies absence. Icon-free is also appropriate for size="sm" or smaller.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't omit both icon and description at the same time",
                body: 'A lone title with no supporting context is too sparse. If you omit the icon, keep at least a short description so the user understands what the empty state means and what to do next.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon-free works best at size="sm" or smaller',
                body: 'At size="default" or "lg", the missing icon leaves too much empty vertical space that looks unfinished. For larger sizes, include an icon or pair with a description to fill the visual weight.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The context sometimes already says "nothing here"',
                body: 'A compact searchable dropdown with a query that returns no results does not need an icon — the user already knows they typed a query. Reserve icon + description for section-level empty states where context is less obvious.',
              },
            ],
          },
        ]}
      />

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
