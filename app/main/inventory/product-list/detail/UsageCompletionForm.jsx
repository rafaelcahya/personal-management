'use client'

import {
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/base/Field/Field'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { updateProductUsage } from '@/lib/api/productHistory'
import { useState } from 'react'

export default function UsageCompletionForm({ historyItem, onUpdate, onCancel }) {
  const [serverError, setServerError] = useState(null)

  const remainingQty =
    Number(historyItem.remaining_quantity) === 0 && historyItem.status === 'active'
      ? Number(historyItem.quantity)
      : Number(historyItem.remaining_quantity)

  const form = useForm({
    defaultValues: {
      depleted_quantity: '',
      end_usage_date: historyItem.end_usage_date
        ? new Date(historyItem.end_usage_date)
        : new Date(),
    },
  })

  const { control, handleSubmit, formState } = form
  const { isSubmitting } = formState

  const onSubmit = async (values) => {
    try {
      setServerError(null)
      await updateProductUsage(historyItem.id, {
        depleted_quantity: Number(values.depleted_quantity),
        end_usage_date: values.end_usage_date.toISOString(),
      })

      toast.success('Usage record updated successfully')
      await onUpdate?.()
      onCancel?.()
    } catch (err) {
      setServerError(err.message || 'Failed to update usage record.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-900">
          {historyItem.status === 'active'
            ? 'Mark Product as Depleted'
            : 'Product Already Depleted'}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 whitespace-normal">
          {historyItem.status === 'active'
            ? `Currently ${remainingQty} ${remainingQty === 1 ? 'unit' : 'units'} remaining. How many have been depleted?`
            : 'This product usage has already been marked as depleted. You can update the details below.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="usageCompletionForm">
        <div className="grid grid-cols-2 gap-4">
          {/* Depleted Quantity */}
          <Controller
            control={control}
            name="depleted_quantity"
            rules={{
              required: 'Depleted quantity is required',
              min: {
                value: 1,
                message: 'Minimum 1 unit',
              },
              max: {
                value: remainingQty,
                message: `Cannot exceed ${remainingQty} ${remainingQty === 1 ? 'unit' : 'units'}`,
              },
            }}
            render={({ field, fieldState }) => (
              <FieldContent error={fieldState.error?.message}>
                <FieldLabel className="text-xs font-medium">
                  Depleted Quantity
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  id="depletedQuantityField-usageCompletionForm"
                  {...field}
                  placeholder={remainingQty}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(val)
                  }}
                  className="font-mono bg-white focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                  min={1}
                  max={remainingQty}
                />
                <FieldDescription className="text-xs text-slate-400">
                  Max: {remainingQty} {remainingQty === 1 ? 'unit' : 'units'}
                </FieldDescription>
                <FieldError />
              </FieldContent>
            )}
          />

          {/* End Usage Date */}
          <Controller
            control={control}
            name="end_usage_date"
            render={({ field, fieldState }) => (
              <FieldContent error={fieldState.error?.message}>
                <FieldLabel className="text-xs font-medium">
                  End Usage Date <span className="text-red-500">*</span>
                </FieldLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  fromDate={new Date(historyItem.start_usage_date)}
                />
                <FieldDescription className="text-xs text-slate-400">
                  When did this run out?
                </FieldDescription>
                <FieldError />
              </FieldContent>
            )}
          />
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">⚠️ Unable to Record Usage</p>
                <p className="text-sm text-red-800" id="serverErrorMsg-usageCompletionForm">
                  {serverError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting} id="updateRecordBtn-usageCompletionForm">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Updating...' : 'Update Record'}
          </Button>
        </div>
      </form>
    </div>
  )
}
