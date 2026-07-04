'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/base/Modal/Modal.jsx'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { eventSchema } from '@/schemas/event'
import { updateEvent } from '@/lib/api/event'
import EventLinksInput from './component/EventLinksInput'
import EventTagsInput from './component/EventTagsInput'
import MarkdownToolbar from './component/MarkdownToolbar'

const TITLE_MAX = 150
const TITLE_WARN = 130
const DESC_MAX = 2000
const DESC_WARN = 1800

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
      actual_outcome: null,
      event_date: new Date(),
      tags: [],
      links: [],
    },
  })

  const { control, reset, handleSubmit, watch } = form
  const titleValue = watch('title') ?? ''
  const descValue = watch('event_description') ?? ''
  const descriptionRef = useRef(null)
  const [descPreview, setDescPreview] = useState(false)

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || '',
        event_description: event.event_description || '',
        impact_direction: event.impact_direction || 'UP',
        actual_outcome: event.actual_outcome ?? null,
        event_date: parseDateSafe(event.event_date),
        tags: Array.isArray(event.tags) ? event.tags : [],
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
        actual_outcome: values.actual_outcome ?? null,
        event_date: format(values.event_date, 'yyyy-MM-dd'),
        tags: values.tags ?? [],
        links: values.links,
      }

      await updateEvent(event.id, payload)
      toast.success('Event updated successfully!')
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
    <Modal open={!!event} onOpenChange={onClose}>
      <ModalContent variant="bordered" borderColor="border-slate-200" className="sm:max-w-3xl flex flex-col max-h-[90vh]">
        <ModalHeader className="text-left shrink-0">
          <ModalTitle>Update Event</ModalTitle>
          <ModalDescription className="text-slate-600">Modify event details</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="flex-1 overflow-y-auto space-y-4">
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
                    id="updateEventTitle_eventPage"
                    placeholder="e.g. FOMC Rate Decision"
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="updateEventImpact_eventPage"
                        className={`w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      >
                        <SelectValue />
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
                      onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                      value={field.value ?? 'none'}
                    >
                      <SelectTrigger
                        id="updateActualOutcomeField_eventPage"
                        className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 text-sm"
                      >
                        <SelectValue />
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
                    id="updateEventDate_eventPage"
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
                      <Textarea
                        {...field}
                        ref={descriptionRef}
                        id="updateEventDescription_eventPage"
                        placeholder="Event description"
                        className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium rounded-t-none ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                        rows={16}
                      />
                    )}
                  </div>
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
                  id="updateTagsField_eventPage"
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
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1 justify-end">
              <Button
                type="button"
                id="cancelUpdateEventBtn_eventPage"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
              >
                Cancel
              </Button>
              <Button type="submit" id="submitUpdateEventBtn_eventPage" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Event'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
