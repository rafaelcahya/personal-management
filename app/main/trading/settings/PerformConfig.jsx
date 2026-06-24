'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { Info, Loader2, Settings, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { tradeSettingsSchema } from '@/schemas/tradeSettings'
import { getTradeSettings, updateTradeSettings } from '@/lib/api/tradeSettings'

function SettingsSkeleton() {
  return (
    <div
      id="settingsLoadingSkeleton_settingsPage"
      className="px-5 py-6 space-y-6 animate-pulse"
      aria-label="Loading settings"
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-3 w-52" />
        </div>
      ))}
    </div>
  )
}

function SettingsErrorState({ onRetry }) {
  return (
    <div
      id="settingsError_settingsPage"
      className="flex flex-col items-center justify-center py-14 gap-4 text-center px-5"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Failed to load settings</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        id="settingsRetryBtn_settingsPage"
        className="min-w-11"
      >
        Try again
      </Button>
    </div>
  )
}

export default function PerformConfig() {
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  const form = useForm({
    resolver: zodResolver(tradeSettingsSchema),
    defaultValues: {
      initial_margin: '',
      bi_risk_free_rate: '',
      personal_risk_free_rate: '',
      margin_of_error: '',
    },
  })

  const { control, handleSubmit, reset, formState } = form

  const loadSettings = useCallback(async () => {
    try {
      setFetchLoading(true)
      setFetchError(false)
      const data = await getTradeSettings()
      reset({
        initial_margin: data.initial_margin?.toString() || '',
        bi_risk_free_rate: data.bi_risk_free_rate?.toString() || '',
        personal_risk_free_rate: data.personal_risk_free_rate?.toString() || '',
        margin_of_error: data.margin_of_error?.toString() || '',
      })
    } catch {
      setFetchError(true)
    } finally {
      setFetchLoading(false)
    }
  }, [reset])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  async function onSubmit(values) {
    try {
      await updateTradeSettings(values)
      toast.success('Settings updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to update settings')
    }
  }

  return (
    <section
      id="performConfigSection_settingsPage"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <Settings className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Performance Configuration</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure trading metrics parameters for accurate performance analysis
          </p>
        </div>
      </div>

      {/* Body */}
      {fetchLoading ? (
        <SettingsSkeleton />
      ) : fetchError ? (
        <SettingsErrorState onRetry={loadSettings} />
      ) : (
        <Form {...form}>
          <form id="settingsForm_settingsPage" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-5 py-5 space-y-5">
              {/* Initial Margin */}
              <FormField
                control={control}
                name="initial_margin"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Initial Margin</FormLabel>
                    <FormControl>
                      <Input
                        id="initialMarginInput_settingsPage"
                        type="text"
                        placeholder="Rp 10.000.000"
                        value={
                          field.value ? `Rp ${Number(field.value).toLocaleString('id-ID')}` : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '')
                          field.onChange(raw)
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        aria-describedby="initialMarginDesc_settingsPage"
                        aria-invalid={!!fieldState.error}
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                      />
                    </FormControl>
                    <FormDescription
                      id="initialMarginDesc_settingsPage"
                      className="text-xs text-slate-400"
                    >
                      Starting capital for your trading account
                    </FormDescription>
                    <FormMessage id="initialMarginError_settingsPage" className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* BI Risk Free Rate */}
                <FormField
                  control={control}
                  name="bi_risk_free_rate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">BI Risk Free Rate</FormLabel>
                      <FormControl>
                        <Input
                          id="biRiskFreeRateInput_settingsPage"
                          type="text"
                          placeholder="6.5"
                          value={field.value}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                            field.onChange(cleaned)
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          aria-describedby="biRiskFreeRateDesc_settingsPage"
                          aria-invalid={!!fieldState.error}
                          className={cn(
                            'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                            fieldState.error && 'border-rose-500'
                          )}
                        />
                      </FormControl>
                      <FormDescription
                        id="biRiskFreeRateDesc_settingsPage"
                        className="text-xs text-slate-400"
                      >
                        Bank Indonesia reference rate (in %)
                      </FormDescription>
                      <FormMessage id="biRiskFreeRateError_settingsPage" className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Personal Risk Free Rate */}
                <FormField
                  control={control}
                  name="personal_risk_free_rate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Personal Risk Free Rate</FormLabel>
                      <FormControl>
                        <Input
                          id="personalRiskFreeRateInput_settingsPage"
                          type="text"
                          placeholder="8.0"
                          value={field.value}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                            field.onChange(cleaned)
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          aria-describedby="personalRiskFreeRateDesc_settingsPage"
                          aria-invalid={!!fieldState.error}
                          className={cn(
                            'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                            fieldState.error && 'border-rose-500'
                          )}
                        />
                      </FormControl>
                      <FormDescription
                        id="personalRiskFreeRateDesc_settingsPage"
                        className="text-xs text-slate-400"
                      >
                        Your personal target return rate (in %)
                      </FormDescription>
                      <FormMessage
                        id="personalRiskFreeRateError_settingsPage"
                        className="text-xs"
                      />
                    </FormItem>
                  )}
                />
              </div>

              {/* Margin of Error */}
              <FormField
                control={control}
                name="margin_of_error"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Margin of Error</FormLabel>
                    <FormControl>
                      <Input
                        id="marginOfErrorInput_settingsPage"
                        type="text"
                        placeholder="10"
                        value={field.value}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                          field.onChange(cleaned)
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        aria-describedby="marginOfErrorDesc_settingsPage"
                        aria-invalid={!!fieldState.error}
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                      />
                    </FormControl>
                    <FormDescription
                      id="marginOfErrorDesc_settingsPage"
                      className="text-xs text-slate-400"
                    >
                      Safety buffer for risk calculations (in %)
                    </FormDescription>
                    <FormMessage id="marginOfErrorError_settingsPage" className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 px-5 py-3 bg-slate-50">
              <Button
                type="submit"
                id="saveSettingsBtn_settingsPage"
                disabled={formState.isSubmitting}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {formState.isSubmitting && (
                  <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                )}
                {formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </section>
  )
}
