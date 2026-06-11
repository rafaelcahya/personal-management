'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Loader2, PlusIcon, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventSchema } from '@/schemas/event'
import { createEvent } from '@/lib/api/event'
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

export default function AddEvent({ onAdded }) {
  const [open, setOpen] = useState(false)
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

  const { control, handleSubmit, reset } = form

  const handleAddEvent = async (values) => {
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

      await createEvent(payload)
      toast.success('Event created successfully! 🎉')
      setOpen(false)
      reset()
      onAdded?.()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild id="addNewEventBtn_eventPage">
        <Button>
          <PlusIcon />
          <span>Add Event</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl flex flex-col max-h-[90vh]"
        id="addNewEventForm_eventPage"
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>📅 Add Market Event</DialogTitle>
          <DialogDescription className="text-slate-600">
            Track events that may impact market movements
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleAddEvent)} className="flex flex-col flex-1 min-h-0">
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
                        placeholder="e.g. FOMC Rate Decision"
                        id="eventTitleField_eventPage"
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormMessage
                      id="eventTitleField_errorMessage_eventPage"
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
                        placeholder="e.g., Federal Reserve announces interest rate decision, impacting USD strength and global equity markets"
                        id="eventDescriptionField_eventPage"
                        className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                        rows={10}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Max 2000 characters</FormDescription>
                    <FormMessage
                      id="eventDescriptionField_errorMessage_eventPage"
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
                            id="eventTypeField_eventPage"
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
                            id="impactDirectionField_eventPage"
                            className={`w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${
                              fieldState.error ? 'border-rose-500' : ''
                            }`}
                          >
                            <SelectValue placeholder="Select impact" />
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
                              id="eventDateField_eventPage"
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
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          id="eventDatePicker_eventPage"
                        >
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

            <DialogFooter className="shrink-0 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                  id="cancelNewEventBtn_eventPage"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} id="submitNewEventBtn_eventPage">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
