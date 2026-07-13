import {
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/base/Field/Field'
import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import { adjustStock } from '@/lib/api/product'

function RecordUsageForm({ product, onUpdated, onClose }) {
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    defaultValues: {
      usage_quantity: 1,
      start_usage_date: new Date(),
      note: '',
    },
  })

  const { control, handleSubmit, formState, watch } = form
  const { isSubmitting } = formState
  const watchQty = watch('usage_quantity')

  const hasActiveSession = product.usage_quantity > 0

  const onSubmit = useCallback(
    async (values) => {
      try {
        const payload = {
          usage_quantity: values.usage_quantity,
          start_usage_date: values.start_usage_date.toISOString(),
          note: values.note || '',
        }

        await adjustStock(product.id, payload)

        toast.success('Usage recorded successfully!')

        await onUpdated?.()
        onClose?.()
      } catch (err) {
        setServerError(err.message || 'Failed to record usage')
      }
    },
    [product, onUpdated, onClose]
  )

  if (!product) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="recordUsageForm">
      {/* Active session warning */}
      {hasActiveSession && (
        <div
          id="activeSessionWarning_productListPage"
          className="flex gap-2.5 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
        >
          <AlertCircle className="size-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-yellow-800">Active session in progress</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              This product already has {product.usage_quantity} unit
              {product.usage_quantity > 1 ? 's' : ''} in use. Recording a new session will add on
              top of the current one.
            </p>
          </div>
        </div>
      )}

      {/* Usage Quantity */}
      <Controller
        control={control}
        name="usage_quantity"
        rules={{
          required: 'Usage quantity is required',
          min: { value: 1, message: 'Minimum 1 unit' },
          max: {
            value: product.quantity,
            message: `Cannot exceed ${product.quantity} available unit${product.quantity !== 1 ? 's' : ''}`,
          },
        }}
        render={({ field, fieldState }) => (
          <FieldContent error={fieldState.error?.message}>
            <FieldLabel className="font-medium">Usage Quantity</FieldLabel>
            <Input
              type="number"
              id="usageQuantityField_recordUsageForm"
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value)
                field.onChange(val)
              }}
              className="font-medium font-mono text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600"
              min={1}
              max={product.quantity}
            />
            <FieldDescription className="text-xs text-slate-400">
              How many units are you opening? {product.quantity} available in stock.
            </FieldDescription>
            <FieldError />
          </FieldContent>
        )}
      />

      {/* Start Usage Date */}
      <Controller
        control={control}
        name="start_usage_date"
        render={({ field, fieldState }) => (
          <FieldContent error={fieldState.error?.message}>
            <FieldLabel className="font-medium">Start Date</FieldLabel>
            <DatePicker
              id="datePicker_recordUsageForm"
              value={field.value}
              onChange={field.onChange}
              toDate={new Date()}
            />
            <FieldDescription className="text-xs text-slate-400">
              When did you open and start using this product?
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
              id="noteField_recordUsageForm"
              {...field}
              placeholder="e.g. Where you got it, any observations..."
              className="text-sm font-medium resize-vertical min-h-[72px] focus-visible:ring-violet-200 focus-visible:border-violet-600"
              rows={3}
            />
            <FieldError />
          </FieldContent>
        )}
      />

      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <p className="text-sm font-semibold text-red-900 mb-1">⚠️ Unable to Record Usage</p>
          <p className="text-sm text-red-800" id="serverErrorMsg-recordUsageForm">
            {serverError}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          className="text-violet-600 font-medium"
          id="cancelBtn_recordUsageForm"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} id="startTrackingBtn_recordUsageForm">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Record Usage'}
        </Button>
      </div>
    </form>
  )
}

export default RecordUsageForm
