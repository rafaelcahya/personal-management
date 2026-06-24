'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { AlertTriangle, CalendarIcon, Loader2, PlusCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createRaceLog } from '@/lib/api/running'
import { createRaceLogSchema } from '@/schemas/raceLog'
import { DISTANCE_PRESETS, hmsToSecs, secsToHMSInput } from './raceLogUtils'

export default function RaceFormModal({ open, onClose, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [serverError, setServerError] = useState(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [finishTimeStr, setFinishTimeStr] = useState('')

  const form = useForm({
    resolver: zodResolver(createRaceLogSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      finish_time_sec: null,
      position_place: null,
      position_male: null,
      did_not_finish: false,
      notes: '',
    },
  })

  const { control, handleSubmit, reset, setError, formState } = form
  const dnf = form.watch('did_not_finish')

  useEffect(() => {
    if (open) {
      setDistanceMode('preset')
      setFinishTimeStr('')
      reset({
        title: '',
        race_date: '',
        distance_m: null,
        finish_time_sec: null,
        position_place: null,
        position_male: null,
        did_not_finish: false,
        notes: '',
      })
      setServerError(null)
    }
  }, [open, reset])

  async function onSubmit(data) {
    if (data.distance_m == null) {
      setError('distance_m', { message: 'Distance is required' })
      return
    }
    setServerError(null)
    try {
      const result = await createRaceLog(data)
      toast.success('Race entry added')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        id="raceLogFormModal"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="size-4 text-violet-600" aria-hidden="true" />
            Log a Race
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Record your race result, time, and placement.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Race name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="raceTitle"
                      placeholder="e.g. Jakarta Marathon 2025"
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400">
                    Name it after the official race event
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Race date */}
            <FormField
              control={control}
              name="race_date"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Race date <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="raceDate"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                            !field.value ? 'text-slate-400' : 'text-slate-900',
                            fieldState.error && 'border-rose-500'
                          )}
                        >
                          <CalendarIcon
                            className="size-4 mr-2 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                          {field.value
                            ? format(parseISO(field.value), 'd MMM yyyy')
                            : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                          setDatePickerOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs text-slate-400">
                    The date you actually ran the race
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Distance */}
            <FormField
              control={control}
              name="distance_m"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Distance <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={
                      distanceMode === 'custom'
                        ? 'custom'
                        : field.value != null
                          ? String(field.value)
                          : ''
                    }
                    onValueChange={(v) => {
                      if (v === 'custom') {
                        setDistanceMode('custom')
                        field.onChange(null)
                      } else {
                        setDistanceMode('preset')
                        field.onChange(Number(v))
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                        aria-label="Select distance"
                      >
                        <SelectValue placeholder="Select distance…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DISTANCE_PRESETS.map((p) => (
                        <SelectItem key={String(p.value)} value={String(p.value)}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {distanceMode === 'custom' && (
                    <Input
                      type="number"
                      placeholder="Distance in meters (e.g. 15000)"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                      aria-label="Custom distance in meters"
                    />
                  )}
                  <FormDescription className="text-xs text-slate-400">
                    Pick a preset or enter exact meters for custom races
                  </FormDescription>
                  <FormMessage className="text-xs">
                    {fieldState.error?.type === 'invalid_type'
                      ? 'Distance is required'
                      : fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* DNF checkbox */}
            <FormField
              control={control}
              name="did_not_finish"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5">
                    <FormControl>
                      <Checkbox id="dnf" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel
                      htmlFor="dnf"
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      Did not finish (DNF)
                    </FormLabel>
                  </div>
                  <FormDescription className="text-xs text-slate-400">
                    Check this if you did not finish the race
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Finish time — hidden when DNF */}
            {!dnf && (
              <FormField
                control={control}
                name="finish_time_sec"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Finish time (HH:MM:SS) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="finishTime"
                        placeholder="e.g. 00:45:30"
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                        value={finishTimeStr}
                        onChange={(e) => setFinishTimeStr(e.target.value)}
                        onBlur={() => {
                          const secs = hmsToSecs(finishTimeStr)
                          field.onChange(secs ?? null)
                          if (secs != null) setFinishTimeStr(secsToHMSInput(secs))
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      Your official chip or gun time (hh:mm:ss)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* Optional fields — 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="position_place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Position (place)</FormLabel>
                    <FormControl>
                      <Input
                        id="posPlace"
                        type="number"
                        placeholder="e.g. 42"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      Your overall finisher position
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="position_male"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Position (male)</FormLabel>
                    <FormControl>
                      <Input
                        id="posMale"
                        type="number"
                        placeholder="e.g. 8"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      Your position within the male category
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="raceNotes"
                      placeholder="Weather, conditions, how you felt…"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400">
                    Conditions, how you felt, lessons learned
                  </FormDescription>
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
                <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                {serverError}
              </p>
            )}

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                  disabled={formState.isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="raceLogSaveBtn"
                type="submit"
                disabled={formState.isSubmitting}
                className="min-w-[80px]"
              >
                {formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Log race'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
