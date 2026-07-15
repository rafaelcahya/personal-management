'use client'
import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Controlled' }
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

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

function ControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">{open ? 'Close popover' : 'Open popover'}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              This popover is fully controlled. The open state lives outside the component.
            </p>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Force open
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Force close
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        State:{' '}
        <code
          className={`font-mono px-1.5 py-0.5 rounded text-xs ${
            open ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
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
        full control of the open state. Useful when sibling components need to open or close the
        popover — e.g. after a form submit, on route change, or from a toolbar action.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          controlled — use Force open / Force close to drive state externally
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ControlledDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Drive open state from outside the trigger',
                body: 'Use controlled mode when sibling components, form submits, route changes, or any external event need to open or close the panel — not just the trigger button itself.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer uncontrolled for simple cases',
                body: 'If no external component needs to read or set the open state, omit open and onOpenChange entirely. Uncontrolled is less boilerplate and the same visual result.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always pass onOpenChange alongside open',
                body: 'Without onOpenChange, Escape and click-outside cannot update the external state. The popover becomes impossible for the user to close — a critical accessibility failure.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use controlled mode for quick-edit and filter patterns',
                body: 'Controlled mode lets you reset draft state in onOpenChange on every open — so the panel never shows stale data from the previous session.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* Uncontrolled (default) — no props needed */}
<Popover>
  <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>

{/* Controlled — drive open state from outside */}
const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>

{/* Open / close programmatically */}
<Button onClick={() => setOpen(true)}>Force open</Button>
<Button onClick={() => setOpen(false)}>Force close</Button>`}</Code>
    </div>
  ),
}
