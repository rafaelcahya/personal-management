'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/base/Sheet/Sheet'
import { FieldContent, FieldError, FieldContainer } from '@/components/base/Field/Field'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { watchlistAddTickerSchema } from '@/schemas/valuation'

export default function ManageWatchlistSheet({ open, onOpenChange, watchlist, onAdd, onRemove }) {
  const [confirmingTicker, setConfirmingTicker] = useState(null)
  const [removingTicker, setRemovingTicker] = useState(null)

  const form = useForm({
    resolver: zodResolver(watchlistAddTickerSchema),
    defaultValues: { ticker: '' },
  })

  useEffect(() => {
    if (open) {
      form.reset({ ticker: '' })
      setConfirmingTicker(null)
    }
  }, [open, form])

  async function onSubmit(values) {
    try {
      await onAdd(values.ticker)
      form.reset({ ticker: '' })
      toast.success(`${values.ticker} added to watchlist`)
    } catch (err) {
      form.setError('ticker', { message: err.message || 'Failed to add ticker' })
    }
  }

  async function handleRemove(ticker) {
    setRemovingTicker(ticker)
    try {
      await onRemove(ticker)
      toast.success(`${ticker} removed from watchlist`)
    } catch (err) {
      toast.error(err.message || 'Failed to remove ticker')
    } finally {
      setRemovingTicker(null)
      setConfirmingTicker(null)
    }
  }

  const { formState } = form

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="manageWatchlistSheet_valuationPage"
        side="right"
        size="sm"
        aria-label="Manage Watchlist"
      >
        <SheetHeader>
          <SheetTitle>Manage Watchlist</SheetTitle>
          <SheetDescription>Add or remove IDX tickers you want to track.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 pb-6 flex-1 min-h-0">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-2"
            noValidate
          >
            <FieldContainer className="flex-1">
              <Controller
                control={form.control}
                name="ticker"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <Input
                      id="tickerInput_valuationPage"
                      type="text"
                      placeholder="e.g. BBCA"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={!!fieldState.error}
                      aria-label="IDX ticker code"
                      className="text-sm font-medium font-mono uppercase focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    />
                    <FieldError className="text-xs" />
                  </FieldContent>
                )}
              />
            </FieldContainer>
            <Button
              id="addTickerBtn_valuationPage"
              type="submit"
              disabled={formState.isSubmitting}
              className="min-w-11 shrink-0"
            >
              {formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                'Add'
              )}
            </Button>
          </form>

          <ul className="flex flex-col gap-1 overflow-y-auto" aria-label="Watchlist tickers">
            {watchlist.length === 0 && (
              <li className="text-sm text-slate-400 text-center py-6">No tickers yet</li>
            )}
            {watchlist.map((item) => (
              <li
                key={item.ticker}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-slate-50"
              >
                <span className="text-sm text-slate-700 truncate">
                  <span className="font-mono font-semibold">{item.ticker}</span>
                  {item.long_name && <span className="text-slate-400"> — {item.long_name}</span>}
                </span>

                {confirmingTicker === item.ticker ? (
                  <span className="flex items-center gap-1.5 shrink-0 text-xs">
                    <span className="text-slate-500">Remove?</span>
                    <Button
                      type="button"
                      id={`removeTickerConfirmYes_${item.ticker}_valuationPage`}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.ticker)}
                      disabled={removingTicker === item.ticker}
                      className="h-auto px-1 py-0 text-xs text-destructive-subtle-foreground underline"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingTicker(null)}
                      className="h-auto px-1 py-0 text-xs text-slate-500 underline"
                    >
                      No
                    </Button>
                  </span>
                ) : (
                  <Button
                    id={`removeTickerBtn_${item.ticker}_valuationPage`}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${item.ticker} from watchlist`}
                    onClick={() => setConfirmingTicker(item.ticker)}
                    className="shrink-0 text-slate-400 hover:text-destructive-subtle-foreground"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
