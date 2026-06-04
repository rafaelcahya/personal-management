'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserProfile, updateUserProfile } from '@/lib/api/running'

const schema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  height_cm: z.coerce.number().positive().optional().or(z.literal('')),
  weight_kg: z.coerce.number().positive().optional().or(z.literal('')),
  max_hr: z.coerce.number().int().min(60).max(250).optional().or(z.literal('')),
  resting_hr_baseline: z.coerce.number().int().min(30).max(120).optional().or(z.literal('')),
  sex: z.enum(['male', 'female', '']).optional(),
})

export default function ProfileSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserProfile()
        if (!cancelled) reset(data ?? {})
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [reset])

  async function onSubmit(values) {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => {
        if (k === 'sex') return true
        return v !== '' && v != null
      })
    )
    if (cleaned.sex === '') cleaned.sex = null
    try {
      await updateUserProfile(cleaned)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-label="Profile">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Profile</h2>

      {loading ? (
        <Card className="border border-slate-200/70 py-0">
          <CardContent id="profileLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="border border-red-200 py-0 bg-red-50">
          <CardContent className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/70 py-0">
          <CardContent className="px-5 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="displayNameInput_settingsPage" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="displayNameInput_settingsPage"
                    {...register('display_name')}
                    placeholder="Your name"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  {errors.display_name && (
                    <p className="text-xs text-red-600">{errors.display_name.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => {
                      const selected = field.value ? parseISO(field.value) : undefined
                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="birthDateInput_settingsPage"
                              variant="outline"
                              className="w-full justify-start text-sm font-medium text-left focus-visible:ring-violet-200 focus-visible:border-violet-600"
                            >
                              <CalendarIcon
                                className="mr-2 h-4 w-4 shrink-0 text-slate-400"
                                aria-hidden="true"
                              />
                              {selected ? (
                                format(selected, 'dd MMM yyyy')
                              ) : (
                                <span className="text-slate-400">Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selected}
                              onSelect={(date) =>
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                              }
                              captionLayout="dropdown"
                              defaultMonth={selected ?? new Date(1990, 0, 1)}
                              fromYear={1940}
                              toYear={new Date().getFullYear() - 10}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )
                    }}
                  />
                  {errors.birth_date && (
                    <p className="text-xs text-red-600">{errors.birth_date.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="heightInput_settingsPage" className="text-sm font-medium">
                    Height (cm)
                  </Label>
                  <Input
                    id="heightInput_settingsPage"
                    type="number"
                    {...register('height_cm')}
                    placeholder="e.g. 170"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  {errors.height_cm && (
                    <p className="text-xs text-red-600">{errors.height_cm.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="weightInput_settingsPage" className="text-sm font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weightInput_settingsPage"
                    type="number"
                    step="0.1"
                    {...register('weight_kg')}
                    placeholder="e.g. 65"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  {errors.weight_kg && (
                    <p className="text-xs text-red-600">{errors.weight_kg.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="maxHrInput_settingsPage" className="text-sm font-medium">
                    Max HR (bpm)
                  </Label>
                  <Input
                    id="maxHrInput_settingsPage"
                    type="number"
                    {...register('max_hr')}
                    placeholder="e.g. 190"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  {errors.max_hr && <p className="text-xs text-red-600">{errors.max_hr.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="restingHrInput_settingsPage" className="text-sm font-medium">
                    Resting HR (bpm)
                  </Label>
                  <Input
                    id="restingHrInput_settingsPage"
                    type="number"
                    {...register('resting_hr_baseline')}
                    placeholder="e.g. 55"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  {errors.resting_hr_baseline && (
                    <p className="text-xs text-red-600">{errors.resting_hr_baseline.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Sex</Label>
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger
                          id="sexSelect_settingsPage"
                          className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                        >
                          <SelectValue placeholder="Prefer not to say" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Prefer not to say</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                {saveSuccess && (
                  <div
                    id="profileSaveSuccess_settingsPage"
                    className="flex items-center gap-1.5 text-sm text-green-700"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Profile saved
                  </div>
                )}
                {saveError && (
                  <div
                    id="profileSaveError_settingsPage"
                    className="flex items-center gap-1.5 text-sm text-red-600"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {saveError}
                  </div>
                )}
                <Button id="profileSaveBtn_settingsPage" type="submit" disabled={saving} size="sm">
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
