import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Radius',
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

export const Radius = {
  name: 'Radius',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius</code> prop
          controls the border-radius of the badge. Ranges from{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">none</code> (sharp) to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code> (pill). Default
          is <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        {[
          { radius: 'none', label: 'none — rounded-none' },
          { radius: 'xs', label: 'xs — rounded-sm (2px)' },
          { radius: 'sm', label: 'sm — rounded (4px)' },
          { radius: 'base', label: 'base — rounded-md (6px)' },
          { radius: 'md', label: 'md — rounded-lg (8px)' },
          { radius: 'lg', label: 'lg — rounded-xl (12px)' },
          { radius: 'full', label: 'full — rounded-full (default)' },
        ].map(({ radius, label }) => (
          <div key={radius} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge radius={radius} variant="default">
                Active
              </Badge>
              <Badge radius={radius} variant="secondary">
                Draft
              </Badge>
              <Badge radius={radius} variant="destructive">
                Error
              </Badge>
              <Badge radius={radius} variant="outline">
                Pending
              </Badge>
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
                title: 'Use radius="full" (default) for status badges',
                body: 'The pill shape is the most recognizable badge pattern and reads instantly as a status label. Users associate rounded-full with non-interactive metadata like Active, Draft, or Published.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid radius="none" in card-based layouts',
                body: 'Sharp edges look harsh against rounded cards and soft UI. Use none only in data-dense tables where sharp edges match the surrounding grid style and no other rounded elements are nearby.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Radius has no effect on screen readers or keyboard behavior',
                body: 'Border-radius is purely visual. Both pill and square badges are announced identically by assistive technology — the label and variant carry the semantic meaning, not the shape.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use radius="md" or radius="sm" for tag-style chips',
                body: 'Chips that sit inside card footers, form fields, or filter bars look less "badge-like" with rounded corners — they blend better with surrounding UI elements and signal a different interaction pattern than pill-shaped status badges.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge radius="none">Active</Badge>
<Badge radius="xs">Active</Badge>
<Badge radius="sm">Active</Badge>
<Badge radius="base">Active</Badge>
<Badge radius="md">Active</Badge>
<Badge radius="lg">Active</Badge>
<Badge radius="full">Active</Badge>  {/* default */}`}</code>
      </pre>
    </div>
  ),
}
