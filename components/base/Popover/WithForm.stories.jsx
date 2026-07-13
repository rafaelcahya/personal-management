'use client'
import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/With Form' }
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

const inputClass =
  'w-full h-8 rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600'

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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A quick-edit form inside a Popover. Uses controlled mode (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code>) so the
        parent can reset draft state when the popover opens. Changes only apply on Save — discarded
        on close.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">quick edit — click the pencil icon</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <QuickEditDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Quick-edit forms where changes apply only on Save',
                body: 'Use controlled mode with a draft state that resets on open — so the form always shows the latest saved values, not stale input from the previous session.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't rely on click-outside when the panel has unsaved data",
                body: "Click-outside silently discards the draft. Control the open state manually and either warn the user or explicitly discard on close — don't leave it to the default dismiss behavior.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use PopoverClose on Cancel buttons, not setOpen(false)',
                body: 'PopoverClose is more idiomatic and survives refactors that rename the state variable. It also fires the correct onOpenChange callback for any listeners.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reset draft state in onOpenChange when val === true',
                body: 'Always sync draft to the latest saved values on open — not on mount. If the user cancels and reopens, they should see the current saved state, not their last abandoned edit.',
              },
            ],
          },
        ]}
      />

      <Code>{`const [open, setOpen] = useState(false)

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
</Popover>`}</Code>
    </div>
  ),
}
