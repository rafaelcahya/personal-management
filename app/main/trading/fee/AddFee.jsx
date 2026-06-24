'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { Loader2, PlusIcon, CalendarIcon, Receipt } from 'lucide-react'
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
          <PlusIcon />
          <span>Add Fee</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
        id="addNewFeeForm_feePage"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Receipt className="size-4 text-violet-500" />
            Add New Fee
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Log commissions and fees to keep your performance calculations accurate
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            <div className="flex flex-col gap-5">
              {/* Fee Date & Fee Name Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Date */}
                <FormField
                  control={control}
                  name="fee_date"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Fee Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
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
                          </FormControl>
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
                      <FormDescription className="text-xs text-slate-400">
                        When was this fee charged?
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Fee Name */}
                <FormField
                  control={control}
                  name="fee_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Fee Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Admin Fee"
                          id="feeNameField_feePage"
                          className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                            fieldState.error ? 'border-rose-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-400">
                        What type of fee is this?
                      </FormDescription>
                      <FormMessage id="feeNameField_errorMessage_feePage" className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fee Amount */}
              <FormField
                control={control}
                name="fee"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Fee Amount</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      How much did you pay?
                    </FormDescription>
                    <FormMessage id="feeAmountField_errorMessage_feePage" className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting || loading}
                className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                id="cancelNewFeeBtn_feePage"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loading}
                id="submitNewFeeBtn_feePage"
                className="min-w-[80px]"
              >
                {(form.formState.isSubmitting || loading) && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {form.formState.isSubmitting || loading ? 'Adding...' : 'Add Fee'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
