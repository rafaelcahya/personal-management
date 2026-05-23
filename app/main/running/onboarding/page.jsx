'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  UserIcon,
  LinkIcon,
  FlagIcon,
  CheckCircle2Icon,
  HeartPulseIcon,
  RulerIcon,
  WeightIcon,
  CalendarIcon,
  ZapIcon,
  SkipForwardIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LoaderIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  saveOnboardingBiometric,
  completeOnboarding,
  redirectToStravaConnect,
} from '@/lib/api/running'

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const biometricSchema = z
  .object({
    birth_date: z
      .string()
      .min(1, 'Birth date is required')
      .refine((val) => {
        const d = new Date(val)
        return !isNaN(d.getTime()) && d < new Date()
      }, 'Enter a valid birth date in the past'),
    height_cm: z
      .string()
      .min(1, 'Height is required')
      .refine((val) => {
        const n = Number(val)
        return !isNaN(n) && n >= 100 && n <= 250
      }, 'Height must be between 100 and 250 cm'),
    weight_kg: z
      .string()
      .min(1, 'Weight is required')
      .refine((val) => {
        const n = Number(val)
        return !isNaN(n) && n >= 30 && n <= 300
      }, 'Weight must be between 30 and 300 kg'),
    resting_hr_baseline: z
      .string()
      .min(1, 'Resting HR is required')
      .refine((val) => {
        const n = Number(val)
        return !isNaN(n) && n >= 30 && n <= 120
      }, 'Resting HR must be between 30 and 120 bpm'),
    max_hr_mode: z.enum(['formula', 'manual']),
    max_hr: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.max_hr_mode === 'manual') {
      if (!data.max_hr || data.max_hr.trim() === '') {
        ctx.addIssue({
          path: ['max_hr'],
          code: z.ZodIssueCode.custom,
          message: 'Max HR is required',
        })
        return
      }
      const n = Number(data.max_hr)
      if (isNaN(n) || n < 100 || n > 250) {
        ctx.addIssue({
          path: ['max_hr'],
          code: z.ZodIssueCode.custom,
          message: 'Max HR must be between 100 and 250 bpm',
        })
      }
    }
  })

const goalSchema = z.object({
  has_goal: z.boolean(),
  target_distance_km: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const n = Number(val)
      return !isNaN(n) && n > 0
    }, 'Distance must be a positive number'),
  target_date: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const d = new Date(val)
      return !isNaN(d.getTime()) && d > new Date()
    }, 'Target date must be in the future'),
})

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: 'Biometrics', icon: UserIcon },
  { id: 2, label: 'Connect Strava', icon: LinkIcon },
  { id: 3, label: 'First Goal', icon: FlagIcon },
]

function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Onboarding progress" className="flex items-center justify-center gap-0">
      {STEPS.map((step, idx) => {
        const Icon = step.icon
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isUpcoming = currentStep < step.id

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                  isCompleted
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : isCurrent
                      ? 'bg-white border-violet-600 text-violet-600'
                      : 'bg-white border-slate-200 text-slate-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <CheckCircle2Icon className="size-5" aria-hidden="true" />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </div>
              <span
                className={[
                  'text-xs font-medium',
                  isCurrent
                    ? 'text-violet-700'
                    : isCompleted
                      ? 'text-violet-600'
                      : 'text-slate-400',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={[
                  'w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all duration-200',
                  currentStep > step.id ? 'bg-violet-500' : 'bg-slate-200',
                ].join(' ')}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Step 1 — Biometrics
// ---------------------------------------------------------------------------

function calculateMaxHr(birthDate) {
  if (!birthDate) return null
  const d = new Date(birthDate)
  if (isNaN(d.getTime())) return null
  const age = new Date().getFullYear() - d.getFullYear()
  return Math.max(0, 220 - age)
}

function StepBiometrics({ onNext }) {
  const form = useForm({
    resolver: zodResolver(biometricSchema),
    defaultValues: {
      birth_date: '',
      height_cm: '',
      weight_kg: '',
      resting_hr_baseline: '',
      max_hr_mode: 'formula',
      max_hr: '',
    },
  })

  const maxHrMode = form.watch('max_hr_mode')
  const birthDate = form.watch('birth_date')
  const formulaMaxHr = calculateMaxHr(birthDate)

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const resolvedMaxHr =
        values.max_hr_mode === 'formula' && formulaMaxHr !== null
          ? formulaMaxHr
          : Number(values.max_hr)

      await saveOnboardingBiometric({
        birth_date: values.birth_date,
        height_cm: Number(values.height_cm),
        weight_kg: Number(values.weight_kg),
        resting_hr_baseline: Number(values.resting_hr_baseline),
        max_hr: resolvedMaxHr,
      })
      onNext()
    } catch (err) {
      form.setError('root', { message: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Let's set up your biometrics</h2>
        <p className="text-sm text-slate-500 mt-1">
          This data helps the AI Coach give you accurate HR zone analysis and personalised advice.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Birth date */}
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-slate-700">
                  <CalendarIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                  Birth date
                </FormLabel>
                <FormControl>
                  <Input
                    id="birthDateInput_onboarding"
                    type="date"
                    {...field}
                    className="w-full focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Height + Weight side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height_cm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-slate-700">
                    <RulerIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                    Height (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="heightInput_onboarding"
                      type="number"
                      inputMode="decimal"
                      placeholder="170"
                      min={100}
                      max={250}
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
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
                  <FormLabel className="flex items-center gap-1.5 text-slate-700">
                    <WeightIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                    Weight (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="weightInput_onboarding"
                      type="number"
                      inputMode="decimal"
                      placeholder="65"
                      min={30}
                      max={300}
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Resting HR */}
          <FormField
            control={form.control}
            name="resting_hr_baseline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-slate-700">
                  <HeartPulseIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                  Resting heart rate (bpm)
                </FormLabel>
                <FormControl>
                  <Input
                    id="restingHrInput_onboarding"
                    type="number"
                    inputMode="numeric"
                    placeholder="55"
                    min={30}
                    max={120}
                    className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max HR — formula vs manual */}
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ZapIcon className="size-3.5 text-slate-400" aria-hidden="true" />
              Max heart rate (bpm)
            </span>

            {/* Mode toggle */}
            <div role="radiogroup" aria-label="Max heart rate method" className="flex gap-3">
              {[
                { value: 'formula', label: 'Use formula (220 − age)' },
                { value: 'manual', label: 'Enter manually' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={[
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all',
                    maxHrMode === option.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300',
                  ].join(' ')}
                >
                  <input
                    id={
                      option.value === 'formula'
                        ? 'maxHrFormulaRadio_onboarding'
                        : 'maxHrManualRadio_onboarding'
                    }
                    type="radio"
                    className="accent-violet-600"
                    value={option.value}
                    checked={maxHrMode === option.value}
                    onChange={() => form.setValue('max_hr_mode', option.value)}
                    aria-label={option.label}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {/* Formula preview */}
            {maxHrMode === 'formula' && (
              <div
                id="maxHrFormulaPreview_onboarding"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 border border-violet-200 text-sm text-violet-700"
                aria-live="polite"
              >
                <HeartPulseIcon className="size-4 shrink-0" aria-hidden="true" />
                {formulaMaxHr !== null ? (
                  <span>
                    Estimated max HR: <strong>{formulaMaxHr} bpm</strong>
                  </span>
                ) : (
                  <span className="text-slate-500">Enter your birth date to see the estimate</span>
                )}
              </div>
            )}

            {/* Manual input */}
            {maxHrMode === 'manual' && (
              <FormField
                control={form.control}
                name="max_hr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Max heart rate</FormLabel>
                    <FormControl>
                      <Input
                        id="maxHrManualInput_onboarding"
                        type="number"
                        inputMode="numeric"
                        placeholder="185"
                        min={100}
                        max={250}
                        aria-label="Max heart rate in bpm"
                        className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Root error */}
          {form.formState.errors.root && (
            <p
              id="rootError_onboarding"
              role="alert"
              aria-live="assertive"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="pt-2">
            <Button
              id="continueBtn_onboarding"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white min-h-11"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Connect Strava
// ---------------------------------------------------------------------------

function StepStrava({ onNext, onSkip }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  async function handleConnect() {
    setIsConnecting(true)
    setError(null)
    try {
      redirectToStravaConnect()
      if (false) {
        window.location.href = data.redirectUrl
      }
    } catch (err) {
      setError(err.message)
      setIsConnecting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Connect Strava</h2>
        <p className="text-sm text-slate-500 mt-1">
          Link your Strava account and we'll automatically sync all your runs — past and future.
        </p>
      </div>

      {/* Strava benefits card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-6 space-y-2.5">
        {[
          'Auto-sync all past and future activities',
          'Real-time HR, GPS, and pace streams',
          'AI Coach insights right after each run',
        ].map((benefit) => (
          <div key={benefit} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2Icon
              className="size-4 text-violet-500 mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {benefit}
          </div>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button
          id="connectStravaBtn_onboarding"
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-[#FC4C02] hover:bg-[#e04402] text-white min-h-11"
          aria-label="Connect with Strava"
        >
          {isConnecting ? (
            <>
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
              Redirecting to Strava…
            </>
          ) : (
            <>
              <LinkIcon className="size-4" aria-hidden="true" />
              Connect with Strava
            </>
          )}
        </Button>

        <Button
          id="skipStravaBtn_onboarding"
          variant="ghost"
          onClick={onSkip}
          className="w-full text-slate-500 hover:text-slate-700 min-h-11"
          aria-label="Skip Strava connection for now"
        >
          <SkipForwardIcon className="size-4" aria-hidden="true" />
          Skip for now — I'll add activities manually
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 3 — First Goal
// ---------------------------------------------------------------------------

function StepGoal({ onFinish }) {
  const form = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      has_goal: false,
      target_distance_km: '',
      target_date: '',
    },
  })

  const hasGoal = form.watch('has_goal')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const payload = {}
      if (values.has_goal && values.target_distance_km && values.target_date) {
        payload.goal_type = 'race'
        payload.target_date = values.target_date
        payload.target_distance_m = Number(values.target_distance_km) * 1000
      }
      await completeOnboarding(payload)
    } catch {
      // Goal save failure non-blocking — tetap lanjut ke dashboard
    } finally {
      setIsSubmitting(false)
      onFinish()
    }
  }

  const RACE_DISTANCES = [
    { label: '5K', value: '5' },
    { label: '10K', value: '10' },
    { label: 'Half Marathon', value: '21.1' },
    { label: 'Marathon', value: '42.195' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Set your first goal</h2>
        <p className="text-sm text-slate-500 mt-1">
          Got an upcoming race? Let the AI Coach tailor your weekly plan and taper advice.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Toggle: has goal */}
          <div
            role="radiogroup"
            aria-label="Do you have an upcoming race?"
            className="grid grid-cols-2 gap-3"
          >
            {[
              { value: true, label: 'Yes, I have a race' },
              { value: false, label: 'No race planned yet' },
            ].map((option) => (
              <label
                key={String(option.value)}
                className={[
                  'flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all',
                  hasGoal === option.value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300',
                ].join(' ')}
              >
                <input
                  id={option.value === true ? 'goalYesRadio_onboarding' : 'goalNoRadio_onboarding'}
                  type="radio"
                  className="sr-only"
                  checked={hasGoal === option.value}
                  onChange={() => form.setValue('has_goal', option.value)}
                  aria-label={option.label}
                />
                {option.label}
              </label>
            ))}
          </div>

          {/* Goal fields — shown when user has a race */}
          {hasGoal && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Quick distance buttons */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Target distance</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {RACE_DISTANCES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => form.setValue('target_distance_km', d.value)}
                      className={[
                        'py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                        form.watch('target_distance_km') === d.value
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300',
                      ].join(' ')}
                      aria-pressed={form.watch('target_distance_km') === d.value}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="target_distance_km"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-slate-600">
                        Or enter custom distance (km)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="targetDistanceInput_onboarding"
                          type="number"
                          inputMode="decimal"
                          placeholder="e.g. 30"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="target_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-slate-700">
                      <CalendarIcon className="size-3.5 text-slate-400" aria-hidden="true" />
                      Race date
                    </FormLabel>
                    <FormControl>
                      <Input id="targetDateInput_onboarding" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="pt-2">
            <Button
              id="finishBtn_onboarding"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white min-h-11"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
                  Setting up your dashboard…
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="size-4" aria-hidden="true" />
                  {hasGoal ? 'Save goal & go to dashboard' : 'Go to dashboard'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page — orchestrates the 3 steps
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  function goNext() {
    setStep((s) => Math.min(s + 1, 3))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleFinish() {
    router.push('/main/running/dashboard')
  }

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-start py-6 px-4">
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium mb-4">
          <ZapIcon className="size-3.5" aria-hidden="true" />
          Quick setup — takes about 2 minutes
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome to Running Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">
          Let's get your profile set up so the AI Coach can give you accurate insights from day one.
        </p>
      </div>

      {/* Step indicator */}
      <div className="w-full max-w-lg mb-8">
        <StepIndicator currentStep={step} />
      </div>

      {/* Step card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {step === 1 && <StepBiometrics onNext={goNext} />}
        {step === 2 && <StepStrava onNext={goNext} onSkip={goNext} />}
        {step === 3 && <StepGoal onFinish={handleFinish} />}

        {/* Back navigation for steps 2+ */}
        {step > 1 && (
          <button
            id="backBtn_onboarding"
            type="button"
            onClick={goBack}
            className="mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            aria-label="Go back to previous step"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            Back
          </button>
        )}
      </div>

      {/* Step count label */}
      <p id="stepCountLabel_onboarding" className="mt-4 text-xs text-slate-400" aria-live="polite">
        Step {step} of {STEPS.length}
      </p>
    </main>
  )
}
