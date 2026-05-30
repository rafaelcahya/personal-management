'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
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
      reset({
        title: goal.title ?? '',
        target_distance_m: goal.distance_m ? Number(goal.distance_m) : null,
        target_date: goal.target_date ? goal.target_date.slice(0, 10) : '',
        description: goal.description ?? '',
      })
    }
    setServerError(null)
  }, [open, goal, reset])

  async function onSubmit(data) {
    if (!goal?.id) return
    setSaving(true)
    setServerError(null)
    try {
      const result = await updateGoal(goal.id, data)
      toast.success('Race goal updated')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent id="editGoalModal_activityDetailPage" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit race goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalTitle">Race title</Label>
            <Input id="goalTitle" placeholder="e.g. Bali Marathon 2026" {...register('title')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Target distance</Label>
            <Controller
              name="target_distance_m"
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
                  <SelectTrigger>
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
                name="target_distance_m"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Distance in meters"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            )}
            {errors.target_distance_m && (
              <p className="text-xs text-red-600" role="alert">
                {errors.target_distance_m.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalDate">Target date</Label>
            <Input id="goalDate" type="date" {...register('target_date')} />
            {errors.target_date && (
              <p className="text-xs text-red-600" role="alert">
                {errors.target_date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalDescription">Notes / description</Label>
            <Textarea
              id="goalDescription"
              placeholder="Training goals, race context…"
              rows={3}
              {...register('description')}
            />
          </div>

          {serverError && (
            <p className="text-xs text-red-600" role="alert">
              {serverError}
            </p>
          )}
        </form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
              type="button"
              disabled={saving}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            id="editGoalSaveBtn_activityDetailPage"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
