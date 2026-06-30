import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Controlled',
}

export default meta

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Control open state externally via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> props.
          Useful for programmatic triggers like keyboard shortcuts or guided tours.
        </p>

        <div className="flex flex-col gap-5 w-full max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">external toggle</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {open ? 'Hide Tooltip' : 'Show Tooltip'}
              </button>

              <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Target
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Controlled — open state is {open ? 'true' : 'false'}
                </TooltipContent>
              </Tooltip>

              <span className="text-xs text-gray-400">
                open: <code className="font-mono">{String(open)}</code>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">defaultOpen (uncontrolled, starts open)</span>
            <div>
              <Tooltip defaultOpen>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Starts open
                  </button>
                </TooltipTrigger>
                <TooltipContent>Visible by default — defaultOpen=true</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

<Tooltip open={open} onOpenChange={setOpen}>
  <TooltipTrigger asChild>
    <button type="button">Target</button>
  </TooltipTrigger>
  <TooltipContent>Controlled tooltip</TooltipContent>
</Tooltip>`}</code>
        </pre>
      </div>
    )
  },
}
