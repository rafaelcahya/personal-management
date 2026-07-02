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
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        A form inside a Sheet using controlled mode (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code>) so the
        parent can reset form state each time the sheet opens.
      </p>

      <AddTradeSheet />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
    <div className="flex-1 px-6 py-4">
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
