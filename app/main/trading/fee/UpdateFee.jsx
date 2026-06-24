'use client'

import { useState, useEffect } from 'react'
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
import { Loader2, CalendarIcon, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { feeSchema } from '@/schemas/fee'
import { updateFee } from '@/lib/api/fee'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import DeleteFee from './DeleteFee'

export default function UpdateFee({ fee, onClose, onUpdated }) {
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

  useEffect(() => {
    if (fee) {
      reset({
        fee_name: fee.fee_name || '',
        fee: fee.fee?.toString() || '',
        fee_date: new Date(fee.fee_date),
      })
    }
  }, [fee, reset])

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      const payload = {
        fee_name: values.fee_name,
        fee: values.fee,
        fee_date: values.fee_date.toISOString().split('T')[0],
      }

      await updateFee(fee.id, payload)
      toast.success('Fee updated successfully! ✅')
      onUpdated?.()
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.message || 'Failed to update fee')
    } finally {
      setLoading(false)
    }
  }

  if (!fee) return null

  return (
    <Dialog open={!!fee} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Pencil className="size-4 text-violet-500" />
            Update Fee
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Adjust your fee details to keep your records accurate and reliable
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                          className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                            fieldState.error ? 'border-rose-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-400">
                        What type of fee is this?
                      </FormDescription>
                      <FormMessage className="text-xs" />
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
                        className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      How much did you pay?
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <DeleteFee fee={fee} onDeleted={onUpdated} onClose={onClose} />

              <div className="flex gap-2 flex-1 justify-end">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={form.formState.isSubmitting || loading}
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || loading}
                  className="min-w-[80px]"
                >
                  {(form.formState.isSubmitting || loading) && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting || loading ? 'Updating...' : 'Update Fee'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
