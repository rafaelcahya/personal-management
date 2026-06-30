import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Basic',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Hover over the trigger to show the tooltip. By default the tooltip appears above the trigger
        after a 300ms delay.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
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
          <span className="text-xs text-gray-400">no delay</span>
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
          <span className="text-xs text-gray-400">long delay (800ms)</span>
          <div className="flex items-center gap-3">
            <Tooltip delayDuration={800}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Slow trigger
                </button>
              </TooltipTrigger>
              <TooltipContent>Appears after 800ms — delayDuration=800</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">variants</span>
          <div className="flex items-center gap-3 flex-wrap py-4">
            {['default', 'info', 'success', 'warning', 'danger'].map((variant) => (
              <Tooltip key={variant} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button type="button" className={btnClass}>
                    {variant}
                  </button>
                </TooltipTrigger>
                <TooltipContent variant={variant} showArrow>
                  variant="{variant}"
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">with arrow</span>
          <div className="flex items-center gap-3 flex-wrap py-4">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Tooltip>
  <TooltipTrigger asChild>
    <button type="button">Hover me</button>
  </TooltipTrigger>
  <TooltipContent>Simple tooltip text</TooltipContent>
</Tooltip>`}</code>
      </pre>
    </div>
  ),
}
