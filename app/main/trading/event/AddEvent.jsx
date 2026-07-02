'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Button from '@/components/base/Button/Button'
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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'
import { eventSchema } from '@/schemas/event'
import { createEvent } from '@/lib/api/event'
import EventLinksInput from './component/EventLinksInput'
import EventTagsInput from './component/EventTagsInput'
import MarkdownToolbar from './component/MarkdownToolbar'

const TITLE_MAX = 150
const TITLE_WARN = 130
const DESC_MAX = 2000
const DESC_WARN = 1800

export default function AddEvent({ onAdded, initialValues, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      event_description: '',
      impact_direction: 'UP',
      actual_outcome: null,
      event_date: new Date(),
      tags: [],
      links: [],
    },
  })

  const { control, handleSubmit, reset, watch } = form
  const titleValue = watch('title') ?? ''
  const descValue = watch('event_description') ?? ''
  const descriptionRef = useRef(null)
  const [descPreview, setDescPreview] = useState(false)

  useEffect(() => {
    if (open && initialValues) {
      reset({
        title: initialValues.title || '',
        event_description: initialValues.event_description || '',
        impact_direction: initialValues.impact_direction || 'UP',
        actual_outcome: initialValues.actual_outcome ?? null,
        event_date: new Date(),
        tags: Array.isArray(initialValues.tags) ? initialValues.tags : [],
        links: Array.isArray(initialValues.links) ? initialValues.links : [],
      })
    }
  }, [open, initialValues, reset])

  const handleAddEvent = async (values) => {
    setLoading(true)
    try {
      const payload = {
        title: values.title,
        event_description: values.event_description,
        impact_direction: values.impact_direction,
        actual_outcome: values.actual_outcome ?? null,
        event_date: format(values.event_date, 'yyyy-MM-dd'),
        tags: values.tags ?? [],
        links: values.links,
      }

      await createEvent(payload)
      toast.success('Event created successfully!')
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

  const handleOpenChange = (val) => {
    if (isControlled) {
      onOpenChange?.(val)
    } else {
      setInternalOpen(val)
    }
    if (!val) reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild id="addNewEventBtn_eventPage">
          <Button>
            <PlusIcon className="w-4" />
            <span>Add Event</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-3xl flex flex-col max-h-[90vh]"
        id="addNewEventForm_eventPage"
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>Add Market Event</DialogTitle>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-medium">Title</FormLabel>
                      {titleValue.length > 0 && (
                        <span
                          className={`text-xs font-medium ${
                            titleValue.length >= TITLE_WARN ? 'text-amber-500' : 'text-slate-400'
                          }`}
                        >
                          {titleValue.length}/{TITLE_MAX}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. FOMC Rate Decision"
                        id="eventTitleField_eventPage"
                        maxLength={TITLE_MAX}
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

              {/* Impact + Actual Outcome — 2-col grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
                          <SelectItem value="UP">Bullish</SelectItem>
                          <SelectItem value="DOWN">Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-medium">{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Actual Outcome */}
                <FormField
                  control={control}
                  name="actual_outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Actual Outcome
                        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                        value={field.value ?? 'none'}
                      >
                        <FormControl>
                          <SelectTrigger
                            id="actualOutcomeField_eventPage"
                            className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 text-sm"
                          >
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Pending</SelectItem>
                          <SelectItem value="UP">Bullish</SelectItem>
                          <SelectItem value="DOWN">Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs text-slate-400">
                        What actually happened after the event? Leave blank if still pending.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

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

              {/* Description */}
              <FormField
                control={control}
                name="event_description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-medium">
                        Description
                        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                      </FormLabel>
                      {descValue.length > 0 && (
                        <span
                          className={`text-xs font-medium ${descValue.length >= DESC_WARN ? 'text-amber-500' : 'text-slate-400'}`}
                        >
                          {descValue.length}/{DESC_MAX}
                        </span>
                      )}
                    </div>
                    <div>
                      <MarkdownToolbar
                        textareaRef={descriptionRef}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        previewMode={descPreview}
                        onTogglePreview={() => setDescPreview((v) => !v)}
                      />
                      {descPreview ? (
                        <div className="border border-slate-200 rounded-b-md bg-white px-3 py-2 min-h-[144px] prose prose-sm prose-slate max-w-none">
                          {field.value ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                            >
                              {field.value}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-slate-400 italic text-sm">Nothing to preview.</p>
                          )}
                        </div>
                      ) : (
                        <FormControl>
                          <Textarea
                            {...field}
                            ref={descriptionRef}
                            placeholder="e.g., Federal Reserve announces interest rate decision..."
                            id="eventDescriptionField_eventPage"
                            className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium rounded-t-none ${
                              fieldState.error ? 'border-rose-500' : ''
                            }`}
                            rows={16}
                          />
                        </FormControl>
                      )}
                    </div>
                    <FormDescription className="text-xs text-slate-400">
                      The more detailed your notes, the more relevant the AI analysis. Supports
                      markdown.
                    </FormDescription>
                    <FormMessage
                      id="eventDescriptionField_errorMessage_eventPage"
                      className="font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <EventTagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    id="tagsField_eventPage"
                  />
                )}
              />

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
                  variant="secondary"
                  className="text-violet-600 font-medium"
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
