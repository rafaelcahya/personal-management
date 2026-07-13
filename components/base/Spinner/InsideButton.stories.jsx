import { Spinner } from './Spinner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Inside Button' }
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

export const InsideButton = {
  name: 'Inside Button',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place the spinner inside a button alongside a label to indicate an in-progress action.
        Always disable the button while loading to prevent double submission. Match the spinner
        variant to the button background for correct contrast.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">button variants — disabled while loading</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-wrap gap-3">
            <Button disabled>
              <Spinner size="xs" variant="white" />
              Saving...
            </Button>
            <Button variant="outline" disabled>
              <Spinner size="xs" />
              Loading...
            </Button>
            <Button variant="secondary" disabled>
              <Spinner size="xs" variant="muted" />
              Processing
            </Button>
            <Button variant="destructive" disabled>
              <Spinner size="xs" variant="white" />
              Deleting...
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon-only button</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" disabled>
              <Spinner size="xs" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <Spinner size="sm" />
            </Button>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always set disabled on the button while the spinner is showing',
                body: 'Prevents double submission and gives the button the correct visual disabled state. Never show a spinner in an enabled, clickable button.',
              },
              {
                title: 'Use size="xs" inside buttons',
                body: 'It matches the text line height without increasing button height. sm for icon-only buttons where the slightly larger size fits better.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use spinner sizes larger than xs inside regular buttons",
                body: 'It creates visual imbalance and increases button height unexpectedly. Keep size="xs" as the standard for all labeled buttons.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include a visible text label next to the spinner',
                body: '"Saving...", "Loading...", "Deleting..." — users who cannot perceive the spinner must still understand what action is in progress.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match the spinner variant to the button background',
                body: 'variant="white" for filled buttons, variant="default" for outline buttons, variant="muted" for secondary buttons. The rule is: spinner must contrast against its immediate background.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* primary button — white spinner on dark bg */}
<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving...
</Button>

{/* outline button — default spinner on light bg */}
<Button variant="outline" disabled>
  <Spinner size="xs" />
  Loading...
</Button>`}</code>
      </pre>
    </div>
  ),
}
