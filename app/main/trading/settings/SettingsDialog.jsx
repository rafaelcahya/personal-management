'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from 'sonner'
import { Loader2, Info, Settings } from 'lucide-react'
import { tradeSettingsSchema } from '@/schemas/tradeSettings'
import { getTradeSettings, updateTradeSettings } from '@/lib/api/tradeSettings'

export default function SettingsDialog({ open, onOpenChange, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(tradeSettingsSchema),
    defaultValues: {
      initial_margin: '',
      bi_risk_free_rate: '',
      personal_risk_free_rate: '',
      margin_of_error: '',
    },
  })

  const { control, handleSubmit, reset } = form

  useEffect(() => {
    if (open) {
      fetchSettings()
    }
  }, [open])

  const fetchSettings = async () => {
    try {
      setFetchLoading(true)
      const data = await getTradeSettings()

      reset({
        initial_margin: data.initial_margin?.toString() || '',
        bi_risk_free_rate: data.bi_risk_free_rate?.toString() || '',
        personal_risk_free_rate: data.personal_risk_free_rate?.toString() || '',
        margin_of_error: data.margin_of_error?.toString() || '',
      })
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to load settings')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleUpdateSettings = async (values) => {
    setLoading(true)
    try {
      await updateTradeSettings(values)
      toast.success('Settings updated successfully!')
      onOpenChange(false)
      onUpdated?.()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
        id="settingsDialogForm"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Settings className="size-4 text-violet-500" />
            Performance Configuration
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Configure trading metrics parameters for accurate performance analysis and risk
            management.
          </DialogDescription>
        </DialogHeader>

        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="size-8 animate-spin text-violet-600" />
            <p className="text-sm text-slate-600">Loading settings...</p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={handleSubmit(handleUpdateSettings)}
              className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
              noValidate
            >
              {/* Initial Margin */}
              <FormField
                control={control}
                name="initial_margin"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Initial Margin</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Rp 10.000.000"
                        id="initialMarginField"
                        value={
                          field.value ? `Rp ${Number(field.value).toLocaleString('id-ID')}` : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '')
                          field.onChange(raw)
                        }}
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Starting capital for your trading account
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* BI Risk Free Rate */}
              <FormField
                control={control}
                name="bi_risk_free_rate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-medium flex items-center gap-1.5">
                      BI Risk Free Rate
                      <Info className="size-3.5 text-slate-400" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="6.5"
                        id="biRiskFreeRateField"
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                          field.onChange(cleaned)
                        }}
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Bank Indonesia reference rate (in %)
                    </FormDescription>
                    <FormMessage className="text-xs" />
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
                        {...field}
                        type="text"
                        placeholder="8.0"
                        id="personalRiskFreeRateField"
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                          field.onChange(cleaned)
                        }}
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Your personal target return rate (in %)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Margin of Error */}
              <FormField
                control={control}
                name="margin_of_error"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Margin of Error</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="10"
                        id="marginOfErrorField"
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.,]/g, '')
                          field.onChange(cleaned)
                        }}
                        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Safety buffer for risk calculations (in %)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                    id="cancelSettingsBtn"
                    disabled={form.formState.isSubmitting || loading}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || loading}
                  id="submitSettingsBtn"
                  className="min-w-[80px]"
                >
                  {(form.formState.isSubmitting || loading) && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
