'use client'
import { useState } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Controlled',
}

export default meta

function ControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <HoverCard open={open} onOpenChange={setOpen}>
          <HoverCardTrigger asChild>
            <span className="text-sm underline decoration-dotted cursor-default text-slate-700">
              BBCA
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="start" className="p-3 w-48">
            <p className="text-sm text-gray-700">Controlled — open state lives outside.</p>
          </HoverCardContent>
        </HoverCard>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Force open
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-gray-50 transition-colors"
        >
          Force close
        </button>
      </div>

      <p className="text-xs text-gray-400">
        State:{' '}
        <code
          className={`font-mono px-1.5 py-0.5 rounded text-xs ${open ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
        >
          {open ? 'open' : 'closed'}
        </code>
      </p>
    </div>
  )
}

export const Controlled = {
  name: 'Controlled',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl min-h-48">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to take
        full control of the open state. Useful for programmatic show/hide — guided tours, keyboard
        shortcuts, or opening from a sibling component.
      </p>

      <ControlledDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Uncontrolled (default — hover triggers open/close) */}
<HoverCard>
  <HoverCardTrigger asChild>
    <span>Hover me</span>
  </HoverCardTrigger>
  <HoverCardContent>...</HoverCardContent>
</HoverCard>

{/* Controlled */}
const [open, setOpen] = useState(false)

<HoverCard open={open} onOpenChange={setOpen}>
  <HoverCardTrigger asChild>
    <span>Target</span>
  </HoverCardTrigger>
  <HoverCardContent>...</HoverCardContent>
</HoverCard>

{/* Open programmatically */}
<button onClick={() => setOpen(true)}>Force open</button>`}</code>
      </pre>
    </div>
  ),
}
