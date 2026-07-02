'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { CalendarIcon, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/base/Button/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { createQuantityUpdate } from '@/lib/api/productQuantity'
import { getLastPurchasePrice, getStockHistory } from '@/lib/api/product'

export default function AddStockForm({ product, onAdded }) {
  const [open, setOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [lastPrice, setLastPrice] = useState(null)
  const [lastPriceLoading, setLastPriceLoading] = useState(false)
  const [stockHistory, setStockHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      quantity_added: 1,
      price: 0,
      purchase_date: new Date(),
      note: '',
    },
  })

  const { control, handleSubmit, reset } = form

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError(null)

    try {
      const payload = {
        product_list_id: product.id,
        quantity_added: values.quantity_added,
        price: values.price,
        purchase_date: values.purchase_date.toISOString(),
        note: values.note,
      }

      await createQuantityUpdate(payload)

      toast.success('Quantity updated successfully!')
      setOpen(false)
      reset()
      onAdded?.()
    } catch (err) {
      console.error('Add stock error:', err)
      setServerError(err.message || 'Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      setLastPriceLoading(true)
      getLastPurchasePrice(product.id)
        .then((data) => setLastPrice(data))
        .catch(() => setLastPrice(null))
        .finally(() => setLastPriceLoading(false))

      setHistoryLoading(true)
      getStockHistory(product.id)
        .then((data) => setStockHistory(data?.slice(0, 3) ?? []))
        .catch(() => setStockHistory([]))
        .finally(() => setHistoryLoading(false))
    }
    if (!isOpen) {
      setServerError(null)
      setLastPrice(null)
      setStockHistory([])
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          fullWidth
          className="justify-start px-2 py-1.5 text-sm hover:bg-violet-50 rounded-sm"
          id="addStockBtn-productList"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md flex flex-col max-h-[90vh]"
        id="addStockPopup"
        onPointerDownOutside={(e) => {
          if (e.target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>📦 Add More Stock</DialogTitle>
          <DialogDescription>
            Restocking {product.brand} {product.type} {product.product}. Let's add it to your
            inventory and keep things organized! 🎯
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-5">
              {/* Recent Purchases */}
              {(historyLoading || stockHistory.length > 0) && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Recent Purchases</p>
                  {historyLoading ? (
                    <p className="text-xs text-muted-foreground">Loading history...</p>
                  ) : (
                    <div className="space-y-1.5">
                      {stockHistory.map((h, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono">
                            {h.purchase_date
                              ? format(new Date(h.purchase_date), 'd MMM yyyy')
                              : '-'}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-600">
                              qty: <span className="font-medium font-mono">{h.quantity_added}</span>
                            </span>
                            <span className="text-slate-700 font-medium font-mono">
                              Rp {Number(h.price || 0).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity to Add */}
              <FormField
                control={control}
                name="quantity_added"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Quantity to Add</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id="quantityToAddField"
                        className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                        min={1}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-400">
                      Right now you've got {product.quantity} units in on hand 📦
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Price (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="priceField"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                        min={0}
                      />
                    </FormControl>
                    {lastPriceLoading ? (
                      <p className="text-xs text-slate-400">Loading last price...</p>
                    ) : lastPrice?.last_purchase_price != null ? (
                      <p className="text-xs text-slate-400">
                        Last purchase price: Rp{' '}
                        {lastPrice.last_purchase_price.toLocaleString('id-ID')}
                        {lastPrice.last_purchase_date && (
                          <>
                            {' '}
                            &mdash; {format(new Date(lastPrice.last_purchase_date), 'd MMM yyyy')}
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">No previous purchase data available</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Purchase Date */}
              <FormField
                control={control}
                name="purchase_date"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-medium">Purchase Date</FormLabel>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-medium',
                            fieldState.error && 'border-rose-500',
                            !field.value && 'text-slate-500'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        onInteractOutside={(e) => e.preventDefault()}
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onFocusOutside={(e) => e.preventDefault()}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setDatePickerOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-slate-400">When did you buy this? 📅</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note */}
              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="noteField"
                        placeholder="e.g. Where'd you buy it? Any special deals? Jot it down here ✍️"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                        rows={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {serverError && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 mb-1">
                        ⚠️ Unable to Add Stock
                      </p>
                      <p className="text-sm text-red-800">{serverError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="shrink-0 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-violet-600 font-medium"
                  id="cancelBtn-addStockPopup"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} id="submitBtn-addStockPopup">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Stock'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
