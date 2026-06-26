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
import { Loader2, CalendarIcon } from 'lucide-react'
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
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>✏️ Update Fee</DialogTitle>
          <DialogDescription className="text-slate-600">
            Adjust your fee details to keep your records accurate and reliable
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Fee Date & Fee Name Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Date */}
                <FormField
                  control={control}
                  name="fee_date"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Fee Date</FormLabel>
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
                      <FormDescription className="text-xs">
                        When was this fee charged? 📅
                      </FormDescription>
                      <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Fee Name */}
                <FormField
                  control={control}
                  name="fee_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Fee Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Admin Fee"
                          className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                            fieldState.error ? 'border-rose-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        What type of fee is this? 🏷️
                      </FormDescription>
                      <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
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
                    <FormDescription className="text-xs">How much did you pay? 💸</FormDescription>
                    <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
              <DeleteFee fee={fee} onDeleted={onUpdated} onClose={onClose} />

              <div className="flex gap-2 flex-1 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Updating...' : 'Update Fee'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
