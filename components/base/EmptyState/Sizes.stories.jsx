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
  title: 'EmptyState/Sizes',
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

const sizes = [
  {
    value: 'xs',
    label: 'xs',
    desc: 'Dropdowns & popovers — fits inside max-h-60 constrained containers',
  },
  {
    value: 'sm',
    label: 'sm',
    desc: 'Compact inline — for table rows or small lists',
  },
  {
    value: 'default',
    label: 'default',
    desc: 'Section-level — for cards, panels, or SectionCard',
  },
  {
    value: 'lg',
    label: 'lg',
    desc: 'Full-page — when the entire page has no data',
  },
]

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Three sizes control vertical padding, icon size, and typography scale. Pick the size that
        matches the containing context.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {sizes.map(({ value, label, desc }) => (
          <div key={value} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                size=&quot;{label}&quot;{value === 'default' ? ' (default)' : ''}
              </span>
              <span className="text-[11px] text-gray-400">{desc}</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <EmptyState size={value}>
                <EmptyStateIcon icon={PackageOpen} />
                <EmptyStateTitle>No products yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Add your first product to start tracking inventory.
                </EmptyStateDescription>
                <EmptyStateActions>
                  <Button size="sm">Add Product</Button>
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
                title: 'Match size to the container type',
                body: 'xs for dropdowns and popovers, sm for compact table rows, default for cards and panels, lg for full-page content areas where EmptyState is the primary view content.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use lg inside a card",
                body: 'size="lg" stretches the layout beyond the card container height. Reserve it for page-level layouts where EmptyState is the primary content of the entire view.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: "Don't mix sizes within the same page",
                body: 'Each container type has one correct size. Inconsistent sizing creates visual hierarchy noise across sections and makes the page feel unfinished.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'size="lg" is for page-level empty states only',
                body: 'Use it when the entire page has no data and EmptyState occupies the primary viewport space — not inside sidebars, modals, or cards where the container constrains the height.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<EmptyState size="sm">...</EmptyState>
<EmptyState size="default">...</EmptyState>   {/* default */}
<EmptyState size="lg">...</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
