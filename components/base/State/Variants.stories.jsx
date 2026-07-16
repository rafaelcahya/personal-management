import { AlertCircle, Inbox } from 'lucide-react'
import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State/Variants',
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

const VARIANTS = [
  {
    value: 'error',
    desc: 'Network or server failure replaces the content area',
    title: 'Failed to load data',
    description: 'Check your connection and try again.',
    action: { label: 'Try again', onClick: () => {} },
  },
  {
    value: 'empty',
    desc: 'Section resolved with zero items — neutral tone',
    title: 'No items yet',
    description: 'Add your first item to get started.',
  },
  {
    value: 'loading',
    desc: 'Content is being fetched — renders skeleton rows',
  },
]

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Three variants cover every section-level state. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> for failed
        fetches, <code className="font-mono bg-gray-100 px-1 rounded text-xs">empty</code> for
        resolved zero-data, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">loading</code> while a fetch is
        in-flight.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {VARIANTS.map(({ value, desc, ...rest }) => (
          <div key={value} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                variant=&quot;{value}&quot;
              </span>
              <span className="text-[11px] text-gray-400">{desc}</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <State variant={value} {...rest} />
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
                title: 'Match variant to the actual state — not the emotion',
                body: 'Use error only for failed fetches, empty for resolved zero-data, and loading while the fetch is in-flight. Wrong variant creates a misleading signal.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use error for empty lists",
                body: 'Reserve error for genuine failures. Misusing it for zero-data states trains users to ignore real failure signals.',
              },
              {
                title: "Don't show empty while data is still loading",
                body: 'Always use loading while in-flight. Empty implies the fetch resolved — showing it prematurely creates false expectations.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Each variant carries semantic ARIA attributes automatically',
                body: 'error → role="alert" aria-live="assertive"; empty → role="status"; loading → aria-busy="true". These are set for you — no extra work needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair error with a retry action',
                body: 'An error state with no recovery path is a dead end. Pass action={{ label: "Try again", onClick: handleRetry }} on every error variant.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* fetch failed */}
<State
  variant="error"
  title="Failed to load data"
  description="Check your connection and try again."
  action={{ label: 'Try again', onClick: handleRetry }}
/>

{/* resolved, zero data */}
<State
  variant="empty"
  title="No items yet"
  description="Add your first item to get started."
/>

{/* in-flight */}
<State variant="loading" />`}</code>
      </pre>
    </div>
  ),
}
