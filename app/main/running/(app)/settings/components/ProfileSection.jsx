'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  CalendarIcon,
  RulerIcon,
  UserIcon,
  HeartPulseIcon,
  CheckCircle2,
  AlertCircle,
  LoaderIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { getProfile, updateProfile } from '@/lib/api/running'

const profileSchema = z.object({
  birth_date: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const d = new Date(val)
      return !isNaN(d.getTime()) && d < new Date()
    }, 'Enter a valid birth date in the past'),
  height_cm: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const n = Number(val)
      return !isNaN(n) && n >= 100 && n <= 250
    }, 'Height must be between 100 and 250 cm'),
  weight_kg: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const n = Number(val)
      return !isNaN(n) && n >= 30 && n <= 300
    }, 'Weight must be between 30 and 300 kg'),
  max_hr: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const n = Number(val)
      return !isNaN(n) && n >= 100 && n <= 250
    }, 'Max HR must be between 100 and 250 bpm'),
  resting_hr_baseline: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const n = Number(val)
      return !isNaN(n) && n >= 30 && n <= 120
    }, 'Resting HR must be between 30 and 120 bpm'),
  sex: z.enum(['male', 'female', 'unspecified']).optional(),
})

function toFormValues(profile) {
  return {
    birth_date: profile?.birth_date ?? '',
    height_cm: profile?.height_cm != null ? String(profile.height_cm) : '',
    weight_kg: profile?.weight_kg != null ? String(profile.weight_kg) : '',
    max_hr: profile?.max_hr != null ? String(profile.max_hr) : '',
    resting_hr_baseline:
      profile?.resting_hr_baseline != null ? String(profile.resting_hr_baseline) : '',
    sex: profile?.sex ?? 'unspecified',
  }
}

export default function ProfileSection() {
  const [profile, setProfile] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      birth_date: '',
      height_cm: '',
      weight_kg: '',
      max_hr: '',
      resting_hr_baseline: '',
      sex: 'unspecified',
    },
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getProfile()
        if (!cancelled) {
          setProfile(data)
          form.reset(toFormValues(data))
        }
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
  }, [form])

  async function onSubmit(values) {
    setSaveSuccess(false)
    setSaveError(null)

    const payload = {}
    if (values.birth_date) payload.birth_date = values.birth_date
    if (values.height_cm) payload.height_cm = Number(values.height_cm)
    if (values.weight_kg) payload.weight_kg = Number(values.weight_kg)
    if (values.max_hr) payload.max_hr = Number(values.max_hr)
    if (values.resting_hr_baseline) payload.resting_hr_baseline = Number(values.resting_hr_baseline)
    if (values.sex && values.sex !== 'unspecified') payload.sex = values.sex
    else if (values.sex === 'unspecified') payload.sex = null

    try {
      await updateProfile(payload)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile')
    }
  }

  return (
    <section aria-label="Profile" id="profileSection_settings">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Profile</h2>

      {loading && (
        <Card className="border border-slate-200/70 shadow-sm">
          <CardContent id="profileLoading_settings" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </CardContent>
        </Card>
      )}

      {!loading && loadError && (
        <Card className="border border-red-200 shadow-sm bg-red-50">
          <CardContent className="px-5 py-4">
            <p id="profileLoadError_settings" className="text-sm text-red-700" role="alert">
              {loadError}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !loadError && (
        <Card className="border border-slate-200/70 shadow-sm">
          <CardContent className="px-5 py-5">
            <Form {...form}>
              <form
                id="profileForm_settings"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
              >
                {/* Birth date */}
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => {
                    const selectedDate = field.value
                      ? new Date(field.value + 'T00:00:00')
                      : undefined
                    return (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <CalendarIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                          Birth date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                id="birthDateInput_settings"
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon
                                  className="size-4 mr-2 text-slate-400"
                                  aria-hidden="true"
                                />
                                {field.value
                                  ? format(selectedDate, 'd MMM yyyy')
                                  : 'Select your birth date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              selected={selectedDate}
                              onSelect={(date) =>
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                              }
                              disabled={(date) => date > new Date()}
                              defaultMonth={selectedDate ?? new Date(1990, 0)}
                              fromYear={1930}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                {/* Sex */}
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <UserIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                        Sex
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? 'unspecified'}>
                        <FormControl>
                          <SelectTrigger
                            id="sexSelect_settings"
                            className="w-full text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            aria-label="Select sex"
                          >
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unspecified">Prefer not to say</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Height + Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height_cm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <RulerIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                          Height (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="heightInput_settings"
                            type="number"
                            inputMode="decimal"
                            placeholder="170"
                            min={100}
                            max={250}
                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <RulerIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                          Weight (kg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="weightInput_settings"
                            type="number"
                            inputMode="decimal"
                            placeholder="65"
                            min={30}
                            max={300}
                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* HR fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="resting_hr_baseline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <HeartPulseIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                          Resting HR (bpm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="restingHrInput_settings"
                            type="number"
                            inputMode="numeric"
                            placeholder="55"
                            min={30}
                            max={120}
                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_hr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <HeartPulseIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                          Max HR (bpm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="maxHrInput_settings"
                            type="number"
                            inputMode="numeric"
                            placeholder="185"
                            min={100}
                            max={250}
                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Save feedback */}
                {saveSuccess && (
                  <div
                    id="profileSaveSuccess_settings"
                    className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Profile updated successfully.
                  </div>
                )}

                {saveError && (
                  <div
                    id="profileSaveError_settings"
                    className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {saveError}
                  </div>
                )}

                <Button
                  id="saveProfileBtn_settings"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white min-h-11"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoaderIcon className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
