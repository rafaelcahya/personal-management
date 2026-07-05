'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CalendarCheck, Loader2 } from 'lucide-react'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { format, parseISO } from 'date-fns'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from '@/components/base/Modal/Modal.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import { toast } from 'sonner'
import { createUpcomingRace, updateUpcomingRace } from '@/lib/api/running'
import { createUpcomingRaceSchema, updateUpcomingRaceSchema } from '@/schemas/upcomingRace'
import { DISTANCE_PRESETS } from './raceLogUtils'

function secondsToHms(totalSec) {
  if (!totalSec) return { h: '', m: '', s: '' }
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return { h: h > 0 ? String(h) : '', m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') }
}

function hmsToSeconds(h, m, s) {
  const total = (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)
  return total > 0 ? total : null
}

export default function UpcomingRaceFormModal({ open, onClose, onSaved, race }) {
  const isEdit = race != null
  const [distanceMode, setDistanceMode] = useState('preset')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [targetH, setTargetH] = useState('')
  const [targetM, setTargetM] = useState('')
  const [targetS, setTargetS] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateUpcomingRaceSchema : createUpcomingRaceSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      location: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      setServerError(null)
      if (isEdit) {
        const presetValues = DISTANCE_PRESETS.map((p) => p.value)
        const isPreset = presetValues.includes(race.distance_m)
        setDistanceMode(isPreset ? 'preset' : 'custom')
        reset({
          title: race.title ?? '',
          race_date: race.race_date ?? '',
          distance_m: race.distance_m ?? null,
          location: race.location ?? '',
          notes: race.notes ?? '',
        })
        const hms = secondsToHms(race.target_time_sec)
        setTargetH(hms.h)
        setTargetM(hms.m)
        setTargetS(hms.s)
      } else {
        setDistanceMode('preset')
        reset({
          title: '',
          race_date: '',
          distance_m: null,
          location: '',
          notes: '',
        })
        setTargetH('')
        setTargetM('')
        setTargetS('')
      }
    }
  }, [open, isEdit, race, reset])

  async function onSubmit(data) {
    if (data.distance_m == null) {
      setError('distance_m', { message: 'Distance is required' })
      return
    }
    setSaving(true)
    setServerError(null)
    try {
      const payload = {
        title: data.title,
        race_date: data.race_date,
        distance_m: data.distance_m,
        location: data.location || null,
        notes: data.notes || null,
        target_time_sec: hmsToSeconds(targetH, targetM, targetS),
      }
      let result
      if (isEdit) {
        result = await updateUpcomingRace(race.id, payload)
        toast.success('Upcoming race updated')
      } else {
        result = await createUpcomingRace(payload)
        toast.success('Upcoming race added')
      }
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent
        variant="bordered"
        borderColor="border-slate-200"
        id="upcomingRaceFormModal_raceLogPage"
        className="max-w-lg max-h-[90vh] flex flex-col"
      >
        <ModalHeader layout="beside" padding={{ x: 4 }}>
          <ModalIcon icon={CalendarCheck} />
          <ModalHeaderContent>
            <ModalTitle>{isEdit ? 'Edit Upcoming Race' : 'Add Upcoming Race'}</ModalTitle>
            <ModalDescription>
              {isEdit
                ? 'Update your upcoming race details'
                : 'Plan and add an upcoming race to your schedule'}
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <ModalBody className="flex-1 overflow-y-auto" padding={{ x: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-1">
            {/* Title */}
            <FieldContent error={errors.title?.message}>
              <FieldLabel htmlFor="upcomingRaceTitle" required>
                Race name
              </FieldLabel>
              <Input
                id="upcomingRaceTitle"
                placeholder="e.g. Bali Marathon 2026"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                {...register('title')}
              />
              <FieldDescription className="text-xs text-slate-400">
                Name it after the official race event 🏁
              </FieldDescription>
              <FieldError />
            </FieldContent>

            {/* Race date */}
            <Controller
              name="race_date"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel required>Race date</FieldLabel>
                  <DatePicker
                    id="upcomingRaceDate"
                    value={field.value ? parseISO(field.value) : null}
                    onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    The day of the race, not the racepack pickup date 📅
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />

            {/* Distance */}
            <FieldContent
              error={
                errors.distance_m
                  ? errors.distance_m.type === 'invalid_type'
                    ? 'Distance is required'
                    : errors.distance_m.message
                  : undefined
              }
            >
              <FieldLabel required>Distance</FieldLabel>
              <Controller
                name="distance_m"
                control={control}
                render={({ field }) => (
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
                    <SelectTrigger
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      aria-label="Select distance"
                    >
                      <SelectValue placeholder="Select distance…" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_PRESETS.map((p) => (
                        <SelectItem key={String(p.value)} value={String(p.value)}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {distanceMode === 'custom' && (
                <Controller
                  name="distance_m"
                  control={control}
                  render={({ field }) => (
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
                />
              )}
              <FieldDescription className="text-xs text-slate-400">
                Pick a preset or enter exact meters for custom races 📏
              </FieldDescription>
              <FieldError />
            </FieldContent>

            {/* Location (optional) */}
            <FieldContent error={errors.location?.message}>
              <FieldLabel htmlFor="upcomingRaceLocation">Location</FieldLabel>
              <Input
                id="upcomingRaceLocation"
                placeholder="e.g. Bali, Indonesia"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                {...register('location')}
              />
              <FieldDescription className="text-xs text-slate-400">
                City or venue — helps you remember where you raced 📍
              </FieldDescription>
            </FieldContent>

            {/* Notes (optional) */}
            <FieldContent error={errors.notes?.message}>
              <FieldLabel htmlFor="upcomingRaceNotes">Notes</FieldLabel>
              <Textarea
                id="upcomingRaceNotes"
                placeholder="Goals, target time, anything else…"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                rows={3}
                {...register('notes')}
              />
              <FieldDescription className="text-xs text-slate-400">
                Goals, pacing strategy, anything you want to remember 📝
              </FieldDescription>
            </FieldContent>

            {/* Target time (optional) */}
            <FieldContent>
              <FieldLabel>
                Target time <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </FieldLabel>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 flex-1">
                  <Input
                    id="targetTimeHoursInput_upcomingRacePage"
                    type="number"
                    min={0}
                    max={23}
                    placeholder="0"
                    value={targetH}
                    onChange={(e) => setTargetH(e.target.value)}
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                    aria-label="Hours"
                  />
                  <span className="text-[10px] text-slate-400 text-center">hrs</span>
                </div>
                <span className="text-slate-400 font-medium mb-3">:</span>
                <div className="flex flex-col gap-0.5 flex-1">
                  <Input
                    id="targetTimeMinutesInput_upcomingRacePage"
                    type="number"
                    min={0}
                    max={59}
                    placeholder="00"
                    value={targetM}
                    onChange={(e) => setTargetM(e.target.value)}
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                    aria-label="Minutes"
                  />
                  <span className="text-[10px] text-slate-400 text-center">min</span>
                </div>
                <span className="text-slate-400 font-medium mb-3">:</span>
                <div className="flex flex-col gap-0.5 flex-1">
                  <Input
                    id="targetTimeSecondsInput_upcomingRacePage"
                    type="number"
                    min={0}
                    max={59}
                    placeholder="00"
                    value={targetS}
                    onChange={(e) => setTargetS(e.target.value)}
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                    aria-label="Seconds"
                  />
                  <span className="text-[10px] text-slate-400 text-center">sec</span>
                </div>
              </div>
              <FieldDescription className="text-xs text-slate-400">
                Your goal finish time for this race ⏱️
              </FieldDescription>
            </FieldContent>

            {serverError && (
              <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
                <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                {serverError}
              </p>
            )}
          </form>
        </ModalBody>

        <ModalFooter className="gap-2">
          <ModalClose asChild>
            <Button
              className="text-violet-600 font-medium"
              type="button"
              variant="secondary"
              disabled={saving}
            >
              Cancel
            </Button>
          </ModalClose>
          <Button
            id="upcomingRaceSaveBtn_raceLogPage"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : isEdit ? (
              'Save changes'
            ) : (
              'Add race'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
