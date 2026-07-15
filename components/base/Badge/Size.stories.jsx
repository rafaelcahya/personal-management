import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Size',
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

export const Size = {
  name: 'Size',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
          padding and font size. Ranges from{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">xs</code> to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">xl</code>. Default is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        {[
          { size: 'xs', label: 'xs — px-1.5 py-0 text-[10px]' },
          { size: 'sm', label: 'sm — px-2 py-px text-xs' },
          { size: 'base', label: 'base — px-2 py-0.5 text-xs (default)' },
          { size: 'lg', label: 'lg — px-2.5 py-0.5 text-sm' },
          { size: 'xl', label: 'xl — px-3 py-1 text-sm' },
        ].map(({ size, label }) => (
          <div key={size} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size={size} variant="default">
                Active
              </Badge>
              <Badge size={size} variant="secondary">
                Draft
              </Badge>
              <Badge size={size} variant="destructive">
                Error
              </Badge>
              <Badge size={size} variant="outline">
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
                title: 'Use size="base" (default) for most cases',
                body: 'It balances readability and compactness in lists, tables, and cards. Only deviate when the surrounding context has a specific density constraint.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid size="lg" or size="xl" inside dense list rows',
                body: 'Larger sizes are for standalone status chips in detail panels, not inside compact table cells. An xl badge in a table row overwhelms the surrounding content and breaks visual rhythm.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Avoid size="xs" when the badge is the sole status indicator',
                body: 'At 10px font size, xs badges are hard to read for users with low vision. Use xs only for count overlays on icons where the number is supplemental, not the primary indicator.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use size="xs" or size="sm" for tight spaces like table cells and icon overlays',
                body: 'Compact sizes work well as notification count badges on nav icons, in tag lists inside card footers, or in any layout where a standard-size badge would overwhelm surrounding content.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge size="xs">Active</Badge>
<Badge size="sm">Active</Badge>
<Badge size="base">Active</Badge>   {/* default */}
<Badge size="lg">Active</Badge>
<Badge size="xl">Active</Badge>`}</code>
      </pre>
    </div>
  ),
}
