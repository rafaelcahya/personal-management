'use client'
import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Controlled' }
export default meta

function ControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
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
        full control of the open state. Useful when you need to open or close the popover
        programmatically — e.g. after a form submit or from a sibling component.
      </p>

      <ControlledDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Uncontrolled (default) */}
<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>

{/* Controlled */}
const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>

{/* Open programmatically */}
<Button onClick={() => setOpen(true)}>Force open</Button>`}</code>
      </pre>
    </div>
  ),
}
