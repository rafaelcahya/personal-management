import { Info, TrendingUp, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Rich Content',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

export const RichContent = {
  name: 'Rich Content',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TooltipContent</code> accepts
        any ReactNode — icon + text, multi-line, or structured layouts.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">icon + text</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <Info className="size-4 mr-2" />
                  Help
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1.5">
                  <Info className="size-3 shrink-0" />
                  Click to open the help center
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">multi-line</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Portfolio Value
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-56">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Total Portfolio Value</span>
                  <span className="text-slate-500">
                    Sum of all open positions at current market price, excluding cash balance.
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">key-value pairs</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <TrendingUp className="size-4 mr-2 text-green-600" />
                  BBCA +2.4%
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1 min-w-36">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Open</span>
                    <span>9.250</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Current</span>
                    <span>9.472</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Change</span>
                    <span className="text-green-600">+2.4%</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">warning style</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <AlertTriangle className="size-4 mr-2 text-amber-500" />
                  Low Stock
                </button>
              </TooltipTrigger>
              <TooltipContent variant="warning">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3 shrink-0 text-amber-600" />
                  Only 2 units remaining — restock soon
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  ),
}
