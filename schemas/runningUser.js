import { z } from 'zod'

export const hrZonesPatchSchema = z
  .object({
    max_hr: z.number().int().min(60).max(250).nullable().optional(),
    resting_hr_baseline: z.number().int().min(30).max(120).nullable().optional(),
    threshold_hr: z.number().int().min(100).max(220).nullable().optional(),
    hr_zones_method: z.enum(['max_hr', 'karvonen', 'threshold']).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field must be provided' })
  .refine((o) => !o.max_hr || !o.resting_hr_baseline || o.resting_hr_baseline < o.max_hr, {
    message: 'Resting HR must be lower than max HR',
    path: ['resting_hr_baseline'],
  })
  .refine((o) => !o.max_hr || !o.threshold_hr || o.threshold_hr <= o.max_hr, {
    message: 'Threshold HR must not exceed max HR',
    path: ['threshold_hr'],
  })

export const profilePatchSchema = z
  .object({
    display_name: z.string().min(1).max(100).optional(),
    birth_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    height_cm: z.number().positive().optional(),
    weight_kg: z.number().positive().optional(),
    max_hr: z.number().int().min(60).max(250).optional(),
    resting_hr_baseline: z.number().int().min(30).max(120).optional(),
    sex: z.enum(['male', 'female']).nullable().optional(),
    threshold_pace_sec: z.number().int().min(120).max(900).nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field must be provided' })
  .refine((o) => !o.max_hr || !o.resting_hr_baseline || o.resting_hr_baseline < o.max_hr, {
    message: 'Resting HR must be lower than max HR',
    path: ['resting_hr_baseline'],
  })

export const deleteActivitiesSchema = z.object({
  confirmation: z.literal('DELETE', { error: 'Type DELETE to confirm' }),
})
