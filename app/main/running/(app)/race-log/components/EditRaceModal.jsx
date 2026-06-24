'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { AlertTriangle, CalendarIcon, Loader2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { updateRaceLog } from '@/lib/api/running'
import { updateRaceLogSchema } from '@/schemas/raceLog'

const DISTANCE_PRESETS = [
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: 'Half Marathon (21.1K)', value: 21097.5 },
  { label: 'Marathon (42.2K)', value: 42195 },
  { label: 'Custom', value: 'custom' },
]

function hmsToSecs(str) {
  if (!str) return null
  const parts = str.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return null
}

function secsToHMSInput(s) {
  if (!s) return ''
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function EditRaceModal({ open, onClose, entry, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [serverError, setServerError] = useState(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [finishTimeStr, setFinishTimeStr] = useState('')

  const form = useForm({
    resolver: zodResolver(updateRaceLogSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      finish_time_sec: null,
      avg_hr: null,
      elevation_gain_m: null,
      position_place: null,
      position_male: null,
      did_not_finish: false,
      notes: '',
    },
  })

  const { control, handleSubmit, reset, formState } = form
  const dnf = form.watch('did_not_finish')

  useEffect(() => {
    if (open && entry) {
      const presetMatch = DISTANCE_PRESETS.find(
        (p) => p.value !== 'custom' && p.value === Number(entry.distance_m)
      )
      setDistanceMode(presetMatch ? 'preset' : 'custom')
      setFinishTimeStr(entry.finish_time_sec ? secsToHMSInput(entry.finish_time_sec) : '')
      reset({
        title: entry.title || '',
        race_date: entry.race_date ? entry.race_date.slice(0, 10) : '',
        distance_m: entry.distance_m ? Number(entry.distance_m) : null,
        finish_time_sec: entry.finish_time_sec ?? null,
        avg_hr: entry.avg_hr ?? null,
        elevation_gain_m: entry.elevation_gain_m ? Number(entry.elevation_gain_m) : null,
        position_place: entry.position_place ?? null,
        position_male: entry.position_male ?? null,
        did_not_finish: entry.did_not_finish ?? false,
        notes: entry.notes ?? '',
      })
    }
    setServerError(null)
  }, [open, entry, reset])

  async function onSubmit(data) {
    setServerError(null)
    try {
      const result = await updateRaceLog(entry.id, data)
      toast.success('Race entry updated')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        id="editRaceModal_raceDetailPage"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-4 text-violet-600" aria-hidden="true" />
            Edit Race Entry
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update your race result, time, and placement details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            {/* Race name */}
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
                      id="editRaceTitle"
                      placeholder="e.g. Jakarta Marathon 2025"
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                      {...field}
                    />
                  </FormControl>
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
                          id="editRaceDate"
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
                      placeholder="Distance in meters"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* DNF */}
            <FormField
              control={control}
              name="did_not_finish"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5">
                    <FormControl>
                      <Checkbox
                        id="editDnf"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="editDnf"
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      Did not finish (DNF)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Finish time */}
            {!dnf && (
              <FormField
                control={control}
                name="finish_time_sec"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Finish time (HH:MM:SS)</FormLabel>
                    <FormControl>
                      <Input
                        id="editFinishTime"
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="avg_hr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Avg HR (bpm)</FormLabel>
                    <FormControl>
                      <Input
                        id="editAvgHr"
                        type="number"
                        placeholder="e.g. 165"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="elevation_gain_m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Elevation gain (m)</FormLabel>
                    <FormControl>
                      <Input
                        id="editElevation"
                        type="number"
                        placeholder="e.g. 250"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="position_place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Position (place)</FormLabel>
                    <FormControl>
                      <Input
                        id="editPosPlace"
                        type="number"
                        placeholder="e.g. 42"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
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
                        id="editPosMale"
                        type="number"
                        placeholder="e.g. 8"
                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
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
                      id="editNotes"
                      placeholder="Weather, conditions, how you felt…"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                id="editRaceSaveBtn_raceDetailPage"
                type="submit"
                disabled={formState.isSubmitting}
                className="min-w-[80px]"
              >
                {formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
