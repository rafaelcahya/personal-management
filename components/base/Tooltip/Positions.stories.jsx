import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Positions',
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
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-28 justify-center'

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Control which side the tooltip appears on with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> prop. Accepts{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">top</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">right</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">bottom</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">left</code>. Hover each button
        to preview.
      </p>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center gap-3 flex-wrap py-8">
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <Tooltip key={side} delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  {side}
                </button>
              </TooltipTrigger>
              <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Choose the side with the most available space',
                body: 'top is the default and works in most situations. For elements near the top of the page use bottom, near the right edge use left. Pick whichever keeps the tooltip fully visible.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t hardcode side="top" for all tooltips near screen edges',
                body: 'A tooltip at the top of the page with side="top" will render off-screen. Choose the side based on where the trigger lives in the layout, not as a blanket default.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use sideOffset to add breathing room between tooltip and trigger',
                body: 'The default sideOffset is 6px. Increase it for dense toolbars where the tooltip would feel cramped — e.g. sideOffset={12}. Reduce it for compact UI where space is tight.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'top is the default — only specify side when the layout requires it',
                body: 'No need to pass side="top" explicitly. Set it only when deviating — bottom for top-edge triggers, left for right-edge triggers, right for left-edge triggers.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* default is top */}
<TooltipContent>...</TooltipContent>

{/* explicit side */}
<TooltipContent side="bottom">...</TooltipContent>
<TooltipContent side="right">...</TooltipContent>
<TooltipContent side="left">...</TooltipContent>

{/* extra offset */}
<TooltipContent side="top" sideOffset={12}>...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
