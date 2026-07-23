'use client'

import {
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContainer,
} from '@/components/base/Field/Field'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalTrigger,
} from '@/components/base/Modal/Modal.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import MarkdownEditor from '@/components/base/MarkdownEditor/MarkdownEditor'
import { toast } from 'sonner'
import { CalendarDays, Loader2, PlusIcon } from 'lucide-react'
import { eventSchema } from '@/schemas/event'
import { createEvent } from '@/lib/api/event'
import EventLinksInput from './component/EventLinksInput'
import EventTagsInput from './component/EventTagsInput'

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
      handleOpenChange(false)
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
    <Modal open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <ModalTrigger asChild id="addNewEventBtn_eventPage">
          <Button>
            <PlusIcon className="w-4" />
            <span>Add Event</span>
          </Button>
        </ModalTrigger>
      )}
      <ModalContent
        variant="bordered"
        borderColor="border-slate-200"
        className="max-h-[85vh]"
        size="lg"
        id="addNewEventForm_eventPage"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={CalendarDays} />
          <ModalHeaderContent>
            <ModalTitle>Add Market Event</ModalTitle>
            <ModalDescription>Track events that may impact market movements</ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(handleAddEvent)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="overflow-y-auto">
            <FieldContainer>
              {/* Title */}
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="font-medium">Title</FieldLabel>
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
                    <Input
                      {...field}
                      placeholder="e.g. FOMC Rate Decision"
                      id="eventTitleField_eventPage"
                      maxLength={TITLE_MAX}
                      className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Impact + Actual Outcome — 2-col grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Impact Direction */}
                <Controller
                  control={control}
                  name="impact_direction"
                  render={({ field, fieldState }) => (
                    <FieldContent error={fieldState.error?.message}>
                      <FieldLabel className="font-medium">Impact</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="impactDirectionField_eventPage"
                          className={`font-medium ${fieldState.error ? 'border-rose-500' : ''}`}
                        >
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UP">Bullish</SelectItem>
                          <SelectItem value="DOWN">Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError className="font-medium" />
                    </FieldContent>
                  )}
                />

                {/* Actual Outcome */}
                <Controller
                  control={control}
                  name="actual_outcome"
                  render={({ field, fieldState }) => (
                    <FieldContent error={fieldState.error?.message}>
                      <FieldLabel className="font-medium">
                        Actual Outcome
                        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                      </FieldLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={(val) => field.onChange(val === 'none' ? null : val)}
                      >
                        <SelectTrigger id="actualOutcomeField_eventPage" className="font-medium">
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Pending</SelectItem>
                          <SelectItem value="UP">Bullish</SelectItem>
                          <SelectItem value="DOWN">Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription className="text-xs text-slate-400">
                        What actually happened after the event? Leave blank if still pending.
                      </FieldDescription>
                    </FieldContent>
                  )}
                />
              </div>

              {/* Event Date */}
              <Controller
                control={control}
                name="event_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Date</FieldLabel>
                    <DatePicker
                      id="eventDateField_eventPage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Description */}
              <Controller
                control={control}
                name="event_description"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="font-medium">
                        Description
                        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
                      </FieldLabel>
                      {descValue.length > 0 && (
                        <span
                          className={`text-xs font-medium ${descValue.length >= DESC_WARN ? 'text-amber-500' : 'text-slate-400'}`}
                        >
                          {descValue.length}/{DESC_MAX}
                        </span>
                      )}
                    </div>
                    <MarkdownEditor
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="e.g., Federal Reserve announces interest rate decision..."
                      minHeight="384px"
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      The more detailed your notes, the more relevant the AI analysis. Supports
                      markdown.
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
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
            </FieldContainer>
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4">
            <ModalClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="text-violet-600 font-medium"
                id="cancelNewEventBtn_eventPage"
                disabled={loading}
              >
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={loading} id="submitNewEventBtn_eventPage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
