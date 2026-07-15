'use client'

import {
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContainer,
} from '@/components/base/Field/Field'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Loader2, PackagePlus, Plus } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalTrigger,
} from '@/components/base/Modal/Modal.jsx'
import { createQuantityUpdate } from '@/lib/api/productQuantity'
import { getLastPurchasePrice, getStockHistory } from '@/lib/api/product'
import Card, { CardContent } from '@/components/base/Card/Card'

export default function AddStockForm({
  product,
  onAdded,
  open: controlledOpen,
  onOpenChange: onControlledChange,
}) {
  const isControlled = controlledOpen !== undefined
  const [open, setOpen] = useState(false)

  const effectiveOpen = isControlled ? controlledOpen : open
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

  useEffect(() => {
    if (!effectiveOpen) {
      setServerError(null)
      setLastPrice(null)
      setStockHistory([])
      reset()
      return
    }

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
  }, [effectiveOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (isOpen) => {
    if (!isControlled) setOpen(isOpen)
    onControlledChange?.(isOpen)
  }

  return (
    <Modal open={effectiveOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <ModalTrigger asChild>
          <Button
            variant="ghost"
            fullWidth
            className="justify-start px-2 py-1.5 text-sm hover:bg-violet-50 rounded-sm"
            id="addStockBtn-productList"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </ModalTrigger>
      )}
      <ModalContent
        className="max-h-[90vh]"
        id="addStockPopup"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={PackagePlus} />
          <ModalHeaderContent>
            <ModalTitle>Add More Stock</ModalTitle>
            <ModalDescription>
              Restocking{' '}
              <span className="text-violet-700">
                {product.brand} {product.type} {product.product}
              </span>
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              {/* Recent Purchases */}
              <Card>
                {(historyLoading || stockHistory.length > 0) && (
                  <CardContent className="p-3">
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
                                qty:{' '}
                                <span className="font-medium font-mono">{h.quantity_added}</span>
                              </span>
                              <span className="text-slate-700 font-medium font-mono">
                                Rp {Number(h.price || 0).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Quantity to Add */}
              <Controller
                control={control}
                name="quantity_added"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Quantity to Add</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      id="quantityToAddField"
                      className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                      min={1}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      Right now you've got {product.quantity} units in on hand 📦
                    </FieldDescription>
                    <FieldError />
                  </FieldContent>
                )}
              />

              {/* Price */}
              <Controller
                control={control}
                name="price"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Price (Rp)</FieldLabel>
                    <Input
                      type="number"
                      id="priceField"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                      min={0}
                    />
                    {lastPriceLoading ? (
                      <FieldDescription className="text-xs text-slate-400">
                        Loading last price...
                      </FieldDescription>
                    ) : lastPrice?.last_purchase_price != null ? (
                      <FieldDescription className="text-xs text-slate-400">
                        Last purchase price: Rp{' '}
                        {lastPrice.last_purchase_price.toLocaleString('id-ID')}
                        {lastPrice.last_purchase_date && (
                          <>
                            {' '}
                            &mdash; {format(new Date(lastPrice.last_purchase_date), 'd MMM yyyy')}
                          </>
                        )}
                      </FieldDescription>
                    ) : (
                      <FieldDescription className="text-xs text-slate-400">
                        No previous purchase data available
                      </FieldDescription>
                    )}
                    <FieldError />
                  </FieldContent>
                )}
              />

              {/* Purchase Date */}
              <Controller
                control={control}
                name="purchase_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Purchase Date</FieldLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FieldDescription className="text-xs text-slate-400">
                      When did you buy this? 📅
                    </FieldDescription>
                    <FieldError />
                  </FieldContent>
                )}
              />

              {/* Note */}
              <Controller
                control={control}
                name="note"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Note (Optional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="noteField"
                      placeholder="e.g. Where'd you buy it? Any special deals? Jot it down here ✍️"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                      rows={3}
                    />
                  </FieldContent>
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
            </FieldContainer>
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="text-violet-600 font-medium"
                id="cancelBtn-addStockPopup"
                disabled={loading}
              >
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={loading} id="submitBtn-addStockPopup">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Stock'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
