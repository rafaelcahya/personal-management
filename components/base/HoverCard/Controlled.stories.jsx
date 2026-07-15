'use client'
import { useState } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Controlled',
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to take
        full control of the open state. Useful for programmatic show/hide — guided tours, keyboard
        shortcuts, or opening from a sibling component.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          controlled open state — force open/close via buttons
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-32">
          <ControlledDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use controlled mode when open state must sync with external logic',
                body: 'Keyboard shortcuts (press I to inspect), guided tours, or sibling components that programmatically open the card. Controlled mode gives you full ownership of when the card opens and closes.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer uncontrolled for standard hover preview use cases',
                body: 'Without the open prop, hover handles everything automatically. Uncontrolled is simpler — no state, no handler — and is the right default for any standard hover-triggered preview.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'onOpenChange fires on all state transitions including hover-driven ones',
                body: 'Use it for analytics tracking or syncing card state with a parent — not for replacing the built-in hover behavior. In controlled mode, you take full responsibility for opening and closing.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'In controlled mode the built-in hover is disabled — own the full lifecycle',
                body: 'Once you pass open + onOpenChange, hover no longer controls the card. Make sure your trigger still communicates interactivity to the user and that there is always a way to close the card.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
