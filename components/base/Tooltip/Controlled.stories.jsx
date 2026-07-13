import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Controlled',
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

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Control open state externally via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> props.
          Useful for programmatic triggers like keyboard shortcuts, onboarding tours, or any case
          where hover-based logic is not sufficient.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">
              open: <code className="font-mono">{String(open)}</code>
            </span>
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
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">
              defaultOpen — starts open, then becomes uncontrolled
            </span>
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

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use controlled mode for programmatic triggers',
                  body: 'Controlled mode lets you open the tooltip from a keyboard shortcut, a guided tour step, or any other non-hover trigger. Pass open={true} to show it and onOpenChange to sync state when the user hovers away.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use controlled mode when hover behavior is sufficient",
                  body: 'Most tooltips need no controlled state — hover handles everything automatically. Controlled adds state management overhead; only introduce it when you need programmatic control.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always wire onOpenChange to sync state when the user hovers away',
                  body: 'If you pass open but omit onOpenChange, the tooltip gets stuck open when the user moves their cursor away. Both props are required for correct controlled behavior.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Use defaultOpen for onboarding — show on first visit, then let hover take over',
                  body: 'defaultOpen sets the initial state to open without making the tooltip fully controlled. It stays hover-driven after the first interaction, making it ideal for one-time contextual hints.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

{/* fully controlled */}
<Tooltip open={open} onOpenChange={setOpen}>
  <TooltipTrigger asChild>
    <button type="button">Target</button>
  </TooltipTrigger>
  <TooltipContent>Controlled tooltip</TooltipContent>
</Tooltip>

{/* starts open, uncontrolled after first interaction */}
<Tooltip defaultOpen>
  <TooltipTrigger asChild>
    <button type="button">Hint me</button>
  </TooltipTrigger>
  <TooltipContent>Visible by default</TooltipContent>
</Tooltip>`}</code>
        </pre>
      </div>
    )
  },
}
