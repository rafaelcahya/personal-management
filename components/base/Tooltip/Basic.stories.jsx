import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Basic',
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

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Hover over the trigger to show the tooltip. By default the tooltip appears above the trigger
        after a 700ms delay. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">delayDuration</code> to
        customize the delay, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">showArrow</code> to add a
        directional arrow.
      </p>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">button trigger</span>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Hover me
                </button>
              </TooltipTrigger>
              <TooltipContent>Simple tooltip text</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">text trigger (span)</span>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm underline decoration-dotted cursor-default text-slate-700">
                  What is P&L?
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Profit and Loss — the difference between buy and sell price
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">no delay — delayDuration=0</span>
          <div className="flex items-center gap-3">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Instant
                </button>
              </TooltipTrigger>
              <TooltipContent>Appears immediately — delayDuration=0</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">long delay — delayDuration=800</span>
          <div className="flex items-center gap-3">
            <Tooltip delayDuration={800}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Slow trigger
                </button>
              </TooltipTrigger>
              <TooltipContent>Appears after 800ms</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">with arrow — showArrow</span>
          <div className="flex items-center gap-3 flex-wrap py-2">
            {['top', 'right', 'bottom', 'left'].map((side) => (
              <Tooltip key={side} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button type="button" className={btnClass}>
                    {side}
                  </button>
                </TooltipTrigger>
                <TooltipContent side={side} showArrow>
                  Arrow on {side}
                </TooltipContent>
              </Tooltip>
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
                title: 'Use Tooltip for brief supplemental labels on icon-only buttons',
                body: 'When a button has no visible text, a tooltip provides the accessible name and helps mouse users understand the action without adding permanent UI noise.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use Tooltip for critical info — it's invisible until hover",
                body: 'If the information is essential to complete the task, place it inline. Tooltips are invisible until hover and completely inaccessible on touch devices.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always use asChild when the trigger is a real element',
                body: 'asChild merges hover/focus handlers directly onto your button or span. Without it, an extra span wrapper is inserted, which can break flex layouts or add unintended spacing.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use delayDuration={0} in toolbars — keep the default elsewhere',
                body: 'The 700ms default prevents tooltips from appearing when users quickly move their cursor across the page. Set it to 0 only in dense UI areas where quick scanning is expected.',
              },
              {
                title:
                  'Use showArrow when the tooltip could be ambiguous about which element it belongs to',
                body: 'In grids or tightly packed layouts, an arrow helps users understand which element owns the tooltip. Skip it for isolated, clearly connected triggers.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Tooltip>
  <TooltipTrigger asChild>
    <button type="button">Hover me</button>
  </TooltipTrigger>
  <TooltipContent>Simple tooltip text</TooltipContent>
</Tooltip>

{/* no delay */}
<Tooltip delayDuration={0}>...</Tooltip>

{/* with arrow */}
<TooltipContent showArrow>...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
