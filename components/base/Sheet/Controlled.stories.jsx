'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './Sheet'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sheet/Controlled',
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
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              {open ? 'Close Sheet' : 'Open Sheet'}
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle>Controlled Sheet</SheetTitle>
                  <SheetDescription className="mt-1">
                    Open state lives outside the component.
                  </SheetDescription>
                </div>
                <SheetClose className="mt-0.5">
                  <X className="size-4" />
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="flex-1 px-6 py-4">
              <p className="text-sm text-gray-500">
                State:{' '}
                <code className="font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs">
                  open
                </code>
              </p>
            </div>
          </SheetContent>
        </Sheet>

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
        full control of the open state. Useful when you need to open/close programmatically — e.g.
        after a form save, route change, or from a sibling component.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">controlled open state with external buttons</span>
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
                title: 'Controlled mode when the sheet must close after a save',
                body: 'Call setOpen(false) inside your async submit handler after the action completes. Uncontrolled mode cannot do this — the user must manually close.',
              },
              {
                title: 'Controlled mode when form state must reset on open',
                body: 'Trigger the reset inside onOpenChange(true) so stale field values never appear when the sheet reopens after a previous submission.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use controlled mode for simple trigger-and-dismiss flows",
                body: 'Uncontrolled (no open prop) is simpler and requires less boilerplate. Only reach for controlled mode when you need programmatic open/close.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Controlled open state does not affect focus or keyboard behavior',
                body: 'Whether open is set by state or the trigger, focus management, Escape, and scroll lock all behave identically.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always handle onOpenChange — never leave it undefined in controlled mode',
                body: "Without onOpenChange, Escape and overlay clicks won't update your state, and the sheet will appear to ignore those interactions.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Uncontrolled (default) */}
<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>

{/* Controlled */}
const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>

{/* Open programmatically */}
<Button onClick={() => setOpen(true)}>Force open</Button>
<Button onClick={() => setOpen(false)}>Force close</Button>`}</code>
      </pre>
    </div>
  ),
}
