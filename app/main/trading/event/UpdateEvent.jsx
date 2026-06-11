'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { Loader2, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventSchema } from '@/schemas/event'
import { updateEvent } from '@/lib/api/event'
import DeleteEvent from './DeleteEvent'
import EventLinksInput from './component/EventLinksInput'

const EVENT_TYPES = [
  'Earnings',
  'Central Bank',
  'Macro',
  'Corporate Action',
  'Geopolitical',
  'Personal',
  'Other',
]

function parseDateSafe(val) {
  if (!val) return new Date()
  if (val instanceof Date) return val
  const s = String(val)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(s)
}

export default function UpdateEvent({ event, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      event_description: '',
      impact_direction: 'UP',
      event_date: new Date(),
      event_type: null,
      links: [],
    },
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || '',
        event_description: event.event_description || '',
        impact_direction: event.impact_direction || 'UP',
        event_date: parseDateSafe(event.event_date),
        event_type: event.event_type ?? null,
        links: Array.isArray(event.links) ? event.links : [],
      })
    }
  }, [event, reset])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const payload = {
        title: values.title,
        event_description: values.event_description,
        impact_direction: values.impact_direction,
        event_date: format(values.event_date, 'yyyy-MM-dd'),
        event_type: values.event_type || null,
        links: values.links,
      }

      await updateEvent(event.id, payload)
      toast.success('Event updated successfully! ✅')
      onUpdated?.()
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.message || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  if (!event) return null

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>✏️ Update Event</DialogTitle>
          <DialogDescription className="text-slate-600">
            Modify event details or mark as important
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Title */}
              <FormField
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="updateEventTitle_eventPage"
                        placeholder="e.g. FOMC Rate Decision"
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormMessage
                      id="updateEventTitle_errorMessage_eventPage"
                      className="font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* Event Description */}
              <FormField
                control={control}
                name="event_description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Description
                      <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="updateEventDescription_eventPage"
                        placeholder="Event description"
                        className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                        rows={10}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Max 2000 characters</FormDescription>
                    <FormMessage
                      id="updateEventDescription_errorMessage_eventPage"
                      className="font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* Event Type, Impact Direction, Date grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Event Type */}
                <FormField
                  control={control}
                  name="event_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Type
                        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                        value={field.value ?? 'none'}
                      >
                        <FormControl>
                          <SelectTrigger
                            id="updateEventType_eventPage"
                            className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 text-sm"
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {EVENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                {/* Impact Direction */}
                <FormField
                  control={control}
                  name="impact_direction"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Impact</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id="updateEventImpact_eventPage"
                            className={`w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${
                              fieldState.error ? 'border-rose-500' : ''
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UP">📈 Bullish</SelectItem>
                          <SelectItem value="DOWN">📉 Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={control}
                  name="event_date"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              id="updateEventDate_eventPage"
                              className={cn(
                                'w-full pl-3 text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                                fieldState.error && 'border-rose-500',
                                !field.value && 'text-slate-500'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'd MMM yyyy')
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                      <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Links */}
              <Controller
                control={control}
                name="links"
                render={({ field, fieldState }) => (
                  <EventLinksInput
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <DialogFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
              <DeleteEvent event={event} onDeleted={onUpdated} onClose={onClose} />

              <div className="flex gap-2 flex-1 justify-end">
                <Button
                  type="button"
                  id="cancelUpdateEventBtn_eventPage"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground border-none"
                >
                  Cancel
                </Button>
                <Button type="submit" id="submitUpdateEventBtn_eventPage" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
