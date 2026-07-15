import { AlertCircle, PackageOpen, SearchX } from 'lucide-react'
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
  title: 'EmptyState/Variants',
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

const variants = [
  {
    value: 'empty',
    label: 'empty',
    desc: 'No data exists yet — neutral tone, default variant',
    icon: PackageOpen,
    title: 'No products yet',
    description: 'Add your first product to start tracking inventory.',
    action: 'Add Product',
  },
  {
    value: 'search',
    label: 'search',
    desc: 'No results for a query — neutral tone, messaging cue differs',
    icon: SearchX,
    title: 'No results for "BBCA"',
    description: 'Try a different symbol or check for typos.',
    action: 'Clear search',
  },
  {
    value: 'error',
    label: 'error',
    desc: 'Failed to load data — red/destructive tone',
    icon: AlertCircle,
    title: 'Failed to load trades',
    description: 'Something went wrong. Please try again.',
    action: 'Retry',
  },
]

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Three semantic variants signal different situations to the user. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> variant applies a
        red/destructive color tone throughout.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {variants.map(({ value, label, desc, icon, title, description, action }) => (
          <div key={value} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                variant=&quot;{label}&quot;{value === 'empty' ? ' (default)' : ''}
              </span>
              <span className="text-[11px] text-gray-400">{desc}</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <EmptyState variant={value}>
                <EmptyStateIcon icon={icon} />
                <EmptyStateTitle>{title}</EmptyStateTitle>
                <EmptyStateDescription>{description}</EmptyStateDescription>
                <EmptyStateActions>
                  <Button size="sm" variant={value === 'error' ? 'outline' : 'default'}>
                    {action}
                  </Button>
                </EmptyStateActions>
              </EmptyState>
            </div>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Match variant to the situation — not the emotion',
                body: 'Use empty for zero data, search when a filter or query produced no results, and error when a network or server failure occurred. The wrong variant sends a misleading signal.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use error for zero-data situations",
                body: 'Reserve error exclusively for failed fetches or server errors. Red tone carries weight — misusing it for empty lists trains users to ignore real failure states.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Error variant applies red throughout — the tone carries weight',
                body: 'The error variant colors the icon, title, and description red. Only use it when the system has genuinely failed — not for validation errors, user mistakes, or empty lists.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair error variant with a Retry action',
                body: 'An error state with no recovery path is a dead end. Users expect to be able to retry when something goes wrong — add a Retry button in EmptyStateActions whenever variant="error".',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* no data — default */}
<EmptyState variant="empty">
  <EmptyStateIcon icon={PackageOpen} />
  <EmptyStateTitle>No products yet</EmptyStateTitle>
</EmptyState>

{/* no search results */}
<EmptyState variant="search">
  <EmptyStateIcon icon={SearchX} />
  <EmptyStateTitle>No results for "BBCA"</EmptyStateTitle>
</EmptyState>

{/* load error */}
<EmptyState variant="error">
  <EmptyStateIcon icon={AlertCircle} />
  <EmptyStateTitle>Failed to load trades</EmptyStateTitle>
</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
