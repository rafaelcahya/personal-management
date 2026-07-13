import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Basic' }
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Drop <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<Spinner />'}</code>{' '}
        anywhere to show an inline loading indicator. No props required — defaults to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="default"</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="default"</code>{' '}
        (violet-600).
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">default spinner — no props</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Spinner />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Spinner for inline or button-level loading states',
                body: 'Ideal when the content shape is unknown and the wait time is short — form submits, confirmations, any short background action.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer Skeleton when the layout of incoming content is already known',
                body: 'Skeleton reserves space and prevents layout shift — it feels faster and less jarring than a Spinner that causes the page to reflow.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Renders role="status" and aria-label="Loading" automatically',
                body: 'No extra ARIA needed. Always pair with a visible text label when placed inside a button so users who cannot perceive the spinner still understand the action.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'variant="default" is the default — the prop can be omitted',
                body: 'For most white or light background loading states, just drop <Spinner /> with no props. Add size or variant only when the context requires it.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`import { Spinner } from '@/components/base/Spinner/Spinner'

<Spinner />`}</code>
      </pre>
    </div>
  ),
}
