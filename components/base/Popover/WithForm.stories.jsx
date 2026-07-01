'use client'
import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/With Form' }
export default meta

function QuickEditDemo() {
  const [name, setName] = useState('Bank Central Asia')
  const [ticker, setTicker] = useState('BBCA')
  const [draft, setDraft] = useState({ name, ticker })
  const [open, setOpen] = useState(false)

  function handleSave() {
    setName(draft.name)
    setTicker(draft.ticker)
    setOpen(false)
  }

  function handleOpen(val) {
    if (val) setDraft({ name, ticker })
    setOpen(val)
  }

  const inputClass =
    'w-full h-8 rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600'

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        <span className="text-xs text-gray-400 font-mono">{ticker}</span>
      </div>
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <Pencil className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" side="bottom" align="start">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Quick edit</p>
            <PopoverClose>
              <X className="size-4" />
            </PopoverClose>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Name</label>
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Ticker</label>
              <input
                className={inputClass}
                value={draft.ticker}
                onChange={(e) => setDraft((d) => ({ ...d, ticker: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} className="flex-1">
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const WithForm = {
  name: 'With Form',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl min-h-56">
      <p className="text-sm text-gray-500 leading-relaxed">
        A quick-edit form inside a Popover. Uses controlled mode (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code>) so the
        parent can reset draft state when the popover opens.
      </p>

      <QuickEditDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [open, setOpen] = useState(false)

function handleOpen(val) {
  if (val) setDraft({ name, ticker })  // reset draft on open
  setOpen(val)
}

<Popover open={open} onOpenChange={handleOpen}>
  <PopoverTrigger asChild>
    <button><Pencil className="size-3.5" /></button>
  </PopoverTrigger>
  <PopoverContent className="w-64 p-4">
    <input value={draft.name} onChange={...} />
    <Button onClick={handleSave}>Save</Button>
    <PopoverClose asChild>
      <Button variant="ghost">Cancel</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>`}</code>
      </pre>
    </div>
  ),
}
