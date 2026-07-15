import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Sizes' }
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

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Five sizes available via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop — from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">xs</code> (12px) for inline use
        inside buttons and badges, up to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">xl</code> (40px) for full-page
        loading states.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">xs · sm · default · lg · xl</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-end gap-8">
            {[
              { size: 'xs', dim: '12px' },
              { size: 'sm', dim: '16px' },
              { size: 'default', dim: '20px' },
              { size: 'lg', dim: '28px' },
              { size: 'xl', dim: '40px' },
            ].map(({ size, dim }) => (
              <div key={size} className="flex flex-col items-center gap-3">
                <Spinner size={size} />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-medium text-gray-700">{size}</span>
                  <span className="text-[10px] text-gray-400">{dim}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use xs or sm inside buttons, badges, or table cells',
                body: 'Larger sizes create visual imbalance in tight layouts. xs matches the text line height without making the button taller.',
              },
              {
                title: 'Use default for standalone inline spinners',
                body: 'Next to a text label, inside a form field — default (20px) is the right size for most contexts that are not buttons or full-page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use lg or xl inside buttons",
                body: 'It creates visual imbalance and pushes the button height up unexpectedly. lg and xl are for full-page or section-level states only.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep size proportional to the surrounding context',
                body: 'A spinner that is too large steals visual focus from the surrounding content. Size communicates loading scope — small for local, large for global.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reserve lg and xl for full-page or full-section loading states',
                body: 'Use these sizes when the spinner needs to fill the visual center of a large empty area — a blank page, a full-height panel, or a card with no content yet.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<Spinner size="xs" />      {/* 12px — inside buttons */}
<Spinner size="sm" />      {/* 16px */}
<Spinner size="default" /> {/* 20px — default */}
<Spinner size="lg" />      {/* 28px */}
<Spinner size="xl" />      {/* 40px — full-page */}`}</code>
      </pre>
    </div>
  ),
}
