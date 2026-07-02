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
    <div className="flex flex-col gap-6 w-full max-w-xl min-h-48">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to take
        full control of the open state. Useful when you need to open/close programmatically — e.g.
        after a form save, route change, or from a sibling component.
      </p>

      <ControlledDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
