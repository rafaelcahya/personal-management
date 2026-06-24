'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Target } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { toast } from 'sonner'
import { updateGoal } from '@/lib/api/running'
import { updateGoalSchema } from '@/schemas/raceLog'

export const DISTANCE_PRESETS = [
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: 'Half Marathon (21.1K)', value: 21097.5 },
  { label: 'Marathon (42.2K)', value: 42195 },
  { label: 'Custom', value: 'custom' },
]

export function getDistanceLabel(m) {
  if (!m) return null
  const km = Number(m) / 1000
  if (km === 42.195) return 'Marathon'
  if (km === 21.0975) return 'Half Marathon'
  if (km === 10) return '10K'
  if (km === 5) return '5K'
  return `${km % 1 === 0 ? km : km.toFixed(1)} km`
}

export default function EditGoalModal({ open, goal, onClose, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    resolver: zodResolver(updateGoalSchema),
    defaultValues: {
      title: '',
      target_distance_m: null,
      target_date: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open && goal) {
      const presetMatch = DISTANCE_PRESETS.find(
        (p) => p.value !== 'custom' && p.value === Number(goal.distance_m)
      )
      setDistanceMode(presetMatch ? 'preset' : 'custom')
      form.reset({
        title: goal.title ?? '',
        target_distance_m: goal.distance_m ? Number(goal.distance_m) : null,
        target_date: goal.target_date ? goal.target_date.slice(0, 10) : '',
        description: goal.description ?? '',
      })
    }
    setServerError(null)
  }, [open, goal, form])

  async function onSubmit(data) {
    if (!goal?.id) return
    setServerError(null)
    try {
      const result = await updateGoal(goal.id, data)
      toast.success('Race goal updated')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        id="editGoalModal_activityDetailPage"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Target className="size-4 text-violet-500" aria-hidden="true" />
            Edit race goal
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update your target race details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Race title</FormLabel>
                  <FormControl>
                    <Input
                      id="goalTitle"
                      placeholder="e.g. Bali Marathon 2026"
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

            <FormField
              control={form.control}
              name="target_distance_m"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Target distance</FormLabel>
                  <FormControl>
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
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                          fieldState.error && 'border-rose-500'
                        )}
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
                  </FormControl>
                  {distanceMode === 'custom' && (
                    <Input
                      type="number"
                      placeholder="Distance in meters"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 mt-2"
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

            <FormField
              control={form.control}
              name="target_date"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Target date</FormLabel>
                  <FormControl>
                    <Input
                      id="goalDate"
                      type="date"
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

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes / description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="goalDescription"
                      placeholder="Training goals, race context…"
                      rows={3}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none',
                        fieldState.error && 'border-rose-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-xs text-red-600" role="alert">
                {serverError}
              </p>
            )}

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="editGoalSaveBtn_activityDetailPage"
                type="submit"
                disabled={form.formState.isSubmitting}
                className="min-w-[80px]"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
