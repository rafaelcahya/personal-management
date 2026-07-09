'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import FieldLabel from '@/components/base/Field/FieldLabel'
import Textarea from '@/components/base/Textarea/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
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
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent
        variant="bordered"
        borderColor="border-slate-200"
        id="editGoalModal_activityDetailPage"
        className="max-w-md flex flex-col max-h-[90vh]"
      >
        <ModalHeader>
          <ModalTitle>Edit race goal</ModalTitle>
        </ModalHeader>

        <ModalBody className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-1">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="goalTitle">Race title</FieldLabel>
              <Input id="goalTitle" placeholder="e.g. Bali Marathon 2026" {...register('title')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Target distance</FieldLabel>
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
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
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
              <FieldLabel htmlFor="goalDate">Target date</FieldLabel>
              <Input id="goalDate" type="date" {...register('target_date')} />
              {errors.target_date && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.target_date.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="goalDescription">Notes / description</FieldLabel>
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
            id="editGoalSaveBtn_activityDetailPage"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
