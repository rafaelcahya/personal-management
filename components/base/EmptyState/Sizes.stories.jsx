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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<EmptyState size="sm">...</EmptyState>
<EmptyState size="default">...</EmptyState>   {/* default */}
<EmptyState size="lg">...</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
