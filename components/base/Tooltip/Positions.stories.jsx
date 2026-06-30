import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Positions',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-28 justify-center'

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Control which side the tooltip appears on with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> prop.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">all sides</span>
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
      </div>
    </div>
  ),
}
