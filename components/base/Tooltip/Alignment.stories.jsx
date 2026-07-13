import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Alignment',
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
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-32 justify-center'

export const Alignment = {
  name: 'Alignment',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Control how the tooltip aligns relative to the trigger with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> prop. Works on all
        four sides. Hover each button to preview.
      </p>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-5">
        {['top', 'bottom', 'right', 'left'].map((side) => (
          <div key={side} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">side=&quot;{side}&quot;</span>
            <div className="flex items-center gap-3 flex-wrap py-4">
              {['start', 'center', 'end'].map((align) => (
                <Tooltip key={align} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button type="button" className={btnClass}>
                      {align}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={side} align={align}>
                    side=&quot;{side}&quot; align=&quot;{align}&quot;
                  </TooltipContent>
                </Tooltip>
              ))}
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
                title: 'center alignment works for most isolated triggers',
                body: 'center is the default and is appropriate for most standalone buttons and elements. The tooltip is symmetrically balanced over the trigger, making it easy to read without visual tension.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use center for triggers near the left or right viewport edge",
                body: 'center alignment can cause the tooltip to overflow the viewport when the trigger is at the edge. Switch to start for left-edge elements and end for right-edge elements.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use start or end alignment for elements near screen edges',
                body: 'align="start" keeps the tooltip within the viewport for left-edge triggers; align="end" does the same for right-edge triggers. Never let the tooltip overflow off-screen.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'No need to pass align="center" explicitly — it\'s the default',
                body: 'Omit the align prop for center behavior. Only specify it when deviating — start for left-edge triggers, end for right-edge triggers.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* default — center */}
<TooltipContent side="top">...</TooltipContent>

{/* start-aligned */}
<TooltipContent side="top" align="start">...</TooltipContent>

{/* end-aligned */}
<TooltipContent side="top" align="end">...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
