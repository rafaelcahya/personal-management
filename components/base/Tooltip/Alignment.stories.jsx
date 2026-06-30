import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Alignment',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-32 justify-center'

export const Alignment = {
  name: 'Alignment',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Control how the tooltip aligns relative to the trigger with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> prop. Works on all
        four sides.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {['top', 'bottom', 'right', 'left'].map((side) => (
          <div key={side} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">side="{side}"</span>
            <div className="flex items-center gap-3 flex-wrap py-4">
              {['start', 'center', 'end'].map((align) => (
                <Tooltip key={align} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button type="button" className={btnClass}>
                      {align}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={side} align={align}>
                    side="{side}" align="{align}"
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
