'use client'

import { useState, useEffect } from 'react'
import { PackagePlus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { getLastPurchasePrice } from '@/lib/api/product'
import { createQuantityUpdate } from '@/lib/api/productQuantity'
import {
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContainer,
} from '@/components/base/Field/Field'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import Button from '@/components/base/Button/Button'

export default function AddStockSection({ product, onAdded }) {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [lastPrice, setLastPrice] = useState(null)
  const [lastPriceLoading, setLastPriceLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      quantity_added: 1,
      price: 0,
      purchase_date: new Date(),
      note: '',
    },
  })

  useEffect(() => {
    setLastPriceLoading(true)
    getLastPurchasePrice(product.id)
      .then(setLastPrice)
      .catch(() => setLastPrice(null))
      .finally(() => setLastPriceLoading(false))
  }, [product.id])

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError(null)
    try {
      await createQuantityUpdate({
        product_list_id: product.id,
        quantity_added: values.quantity_added,
        price: values.price,
        purchase_date: values.purchase_date.toISOString(),
        note: values.note,
      })
      toast.success('Stock added successfully!')
      reset({ quantity_added: 1, price: 0, purchase_date: new Date(), note: '' })
      onAdded?.()
    } catch (err) {
      setServerError(err.message || 'Failed to add stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="addStockSection_productDetailPage"
      className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      aria-labelledby="add-stock-heading"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <PackagePlus className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p id="add-stock-heading" className="text-sm font-semibold text-slate-900">
            Add More Stock
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Restocking {product.brand} {product.type} {product.product}
          </p>
        </div>
      </div>

      <div className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldContainer>
            <div className="flex flex-col gap-4">
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
                      id="quantityToAddField_productDetailPage"
                      className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                      min={1}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      Current stock: {product.quantity} units
                    </FieldDescription>
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="price"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Price (Rp)</FieldLabel>
                    <Input
                      type="number"
                      id="priceField_productDetailPage"
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
                        Last price: Rp {lastPrice.last_purchase_price.toLocaleString('id-ID')}
                        {lastPrice.last_purchase_date && (
                          <>
                            {' '}
                            &mdash; {format(new Date(lastPrice.last_purchase_date), 'd MMM yyyy')}
                          </>
                        )}
                      </FieldDescription>
                    ) : (
                      <FieldDescription className="text-xs text-slate-400">
                        No previous purchase data
                      </FieldDescription>
                    )}
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="purchase_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Purchase Date</FieldLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="note"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Note (Optional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="noteField_productDetailPage"
                      placeholder="e.g. Where'd you buy it? Any special deals?"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none min-h-[80px]"
                      rows={3}
                    />
                    <FieldError />
                  </FieldContent>
                )}
              />
            </div>

            {serverError && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4">
                <p className="text-sm font-semibold text-red-900 mb-1">Unable to Add Stock</p>
                <p className="text-sm text-red-800">{serverError}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                id="submitAddStockBtn_productDetailPage"
                disabled={loading}
                className="text-sm font-medium"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Stock'}
              </Button>
            </div>
          </FieldContainer>
        </form>
      </div>
    </section>
  )
}
