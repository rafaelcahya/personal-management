import { z } from 'zod'

const MIN_PACE = 150 // 2:30 /km
const MAX_PACE = 900 // 15:00 /km
const MAX_GPX_LENGTH = 8_000_000 // ~8 MB of GPX text

const baseSimulationInput = z
  .object({
    source: z.enum(['gpx_upload', 'activity']),
    gpx: z.string().max(MAX_GPX_LENGTH).optional(),
    activity_id: z.string().uuid().optional(),
    target_mode: z.enum(['pace', 'time']),
    target_pace_sec_per_km: z.number().int().min(MIN_PACE).max(MAX_PACE).optional(),
    target_time_sec: z
      .number()
      .int()
      .positive()
      .max(24 * 3600)
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.source === 'gpx_upload' && !val.gpx?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['gpx'], message: 'GPX content is required' })
    }
    if (val.source === 'activity' && !val.activity_id) {
      ctx.addIssue({
        code: 'custom',
        path: ['activity_id'],
        message: 'An activity must be selected',
      })
    }
    if (val.target_mode === 'pace' && val.target_pace_sec_per_km == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['target_pace_sec_per_km'],
        message: 'Target pace is required',
      })
    }
    if (val.target_mode === 'time' && val.target_time_sec == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['target_time_sec'],
        message: 'Target time is required',
      })
    }
  })

export const previewSimulationSchema = baseSimulationInput

export const createSimulationSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  })
  .and(baseSimulationInput)

export const updateSimulationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
})
