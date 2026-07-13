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
  SheetFooter,
  SheetClose,
} from './Sheet'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sheet/With Form',
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

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

const labelClass = 'text-sm font-medium text-gray-700'

function AddTradeSheet() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ticker: '', shares: '', price: '', note: '' })
  const [saved, setSaved] = useState(null)

  function handleOpen(val) {
    if (val) setForm({ ticker: '', shares: '', price: '', note: '' })
    setOpen(val)
  }

  function handleSave() {
    if (!form.ticker || !form.shares || !form.price) return
    setSaved({ ...form })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <Sheet open={open} onOpenChange={handleOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Add Trade
          </button>
        </SheetTrigger>
        <SheetContent side="right" size="default">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle>Add Trade</SheetTitle>
                <SheetDescription className="mt-1">
                  Log a new buy or sell transaction.
                </SheetDescription>
              </div>
              <SheetClose className="mt-0.5">
                <X className="size-4" />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 px-6 py-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Ticker</label>
              <input
                className={inputClass}
                placeholder="e.g. BBCA"
                value={form.ticker}
                onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase() }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shares</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder="100"
                  value={form.shares}
                  onChange={(e) => setForm((f) => ({ ...f, shares: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Price (IDR)</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder="9250"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
            </div>

            {form.shares && form.price && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
                <p className="text-xs text-gray-500">Total value</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  IDR {(Number(form.shares) * Number(form.price)).toLocaleString('id-ID')}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Note (optional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Reason for this trade..."
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </SheetClose>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.ticker || !form.shares || !form.price}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Save Trade
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          Saved: <strong>{saved.ticker}</strong> — {saved.shares} shares @ IDR{' '}
          {Number(saved.price).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  )
}

export const WithForm = {
  name: 'With Form',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A form inside a Sheet using controlled mode (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code>) so the
        parent can reset form state each time the sheet opens.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">add trade form — controlled, resets on open</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <AddTradeSheet />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Sheet for forms that are secondary to the main page',
                body: 'Use a Sheet when the form overlays the current context rather than replacing it — e.g. adding a trade while viewing the trades list.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t put multi-step wizards in a sheet without size="full"',
                body: 'Multi-step flows need space. In a default-sized sheet they feel cramped — use size="lg" or size="full", or navigate to a dedicated page.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Make the body scrollable so the footer stays visible',
                body: 'Wrap form fields in overflow-y-auto between the header and SheetFooter — tall forms should scroll inside the panel, not push the footer off-screen.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reset form state in onOpenChange(true), not on close',
                body: 'Resetting on open (not on close) means the previous values stay available until the sheet is fully gone — and fresh values are guaranteed the moment it reopens.',
              },
              {
                title: 'Disable submit while required fields are empty',
                body: 'Immediate visual feedback via a disabled button is less friction than a generic error on submit. Only enable the button when the minimum required fields are filled.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [open, setOpen] = useState(false)

function handleOpen(val) {
  if (val) resetForm()   // reset on open
  setOpen(val)
}

<Sheet open={open} onOpenChange={handleOpen}>
  <SheetTrigger asChild>
    <Button>+ Add Trade</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Add Trade</SheetTitle>
    </SheetHeader>
    <div className="flex-1 px-6 py-4 overflow-y-auto">
      {/* form fields */}
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Cancel</Button>
      </SheetClose>
      <Button onClick={handleSave}>Save Trade</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}</code>
      </pre>
    </div>
  ),
}
