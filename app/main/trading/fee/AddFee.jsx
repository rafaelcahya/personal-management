'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Button from '@/components/base/Button/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import Input from '@/components/base/Input/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { Loader2, PlusIcon, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { feeSchema } from '@/schemas/fee'
import { createFee } from '@/lib/api/fee'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

export default function AddFee({ onAdded }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      fee_name: '',
      fee: '',
      fee_date: new Date(),
    },
  })

  const { control, reset, handleSubmit } = form

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      const payload = {
        fee_name: values.fee_name,
        fee: values.fee,
        fee_date: values.fee_date.toISOString().split('T')[0],
      }

      await createFee(payload)
      toast.success('Fee added successfully! 💰')
      setOpen(false)
      reset()
      onAdded?.()
    } catch (err) {
      console.error('Submit error:', err)
      toast.error(err.message || 'Failed to create fee')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild id="addNewFeeBtn_feePage">
        <Button>
          <PlusIcon className="w-4" />
          <span>Add Fee</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]" id="addNewFeeForm_feePage">
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>💳 Add New Fee</DialogTitle>
          <DialogDescription className="text-slate-600">
            Log commissions and fees to keep your performance calculations accurate
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Fee Date & Fee Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fee Date */}
              <Controller
                control={control}
                name="fee_date"
                render={({ field, fieldState }) => (
                  <FieldContent className="flex flex-col" error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Fee Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          id="feeDateField_feePage"
                          className={cn(
                            'w-full pl-3 text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                            fieldState.error && 'border-rose-500',
                            !field.value && 'text-slate-500'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        id="feeDatePicker_feePage"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldDescription className="text-xs text-slate-400">
                      When was this fee charged? 📅
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Fee Name */}
              <Controller
                control={control}
                name="fee_name"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Fee Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Admin Fee"
                      id="feeNameField_feePage"
                      className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      What type of fee is this? 🏷️
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </div>

            {/* Fee Amount */}
            <Controller
              control={control}
              name="fee"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Fee Amount</FieldLabel>
                  <Input
                    type="text"
                    value={field.value ? formatRupiah(field.value) : ''}
                    placeholder="e.g., 10000"
                    id="feeAmountField_feePage"
                    className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                      fieldState.error ? 'border-rose-500' : ''
                    }`}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    How much did you pay? 💸
                  </FieldDescription>
                  <FieldError className="font-medium" />
                </FieldContent>
              )}
            />
          </div>

          <DialogFooter className="shrink-0 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
              id="cancelNewFeeBtn_feePage"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} id="submitNewFeeBtn_feePage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Fee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
