import { z } from 'zod'

const today = () => new Date().toISOString().slice(0, 10)

export const createRaceLogSchema = z
  .object({
    title: z.string().min(1, 'Race name is required').max(200, 'Race name is too long'),
    race_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Race date must be in YYYY-MM-DD format')
      .refine((d) => d <= today(), { message: 'Race date cannot be in the future' }),
    distance_m: z
      .number({ invalid_type_error: 'Distance must be a number' })
      .positive('Distance must be greater than 0')
      .max(1000000, 'Distance is too large'),
    finish_time_sec: z
      .number()
      .int()
      .positive('Finish time must be positive')
      .optional()
      .nullable(),
    avg_hr: z
      .number()
      .int()
      .min(1, 'Heart rate must be between 1 and 250')
      .max(250, 'Heart rate must be between 1 and 250')
      .optional()
      .nullable(),
    elevation_gain_m: z.number().min(0).optional().nullable(),
    position_overall: z
      .number()
      .int()
      .min(1, 'Position must be 1 or greater')
      .optional()
      .nullable(),
    position_category: z
      .number()
      .int()
      .min(1, 'Position must be 1 or greater')
      .optional()
      .nullable(),
    did_not_finish: z.boolean().optional().default(false),
    activity_id: z.string().uuid('Invalid activity ID').optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.did_not_finish && !data.finish_time_sec) return false
      return true
    },
    { message: 'Finish time is required for completed races', path: ['finish_time_sec'] }
  )

export const updateRaceLogSchema = z
  .object({
    title: z.string().min(1, 'Race name is required').max(200, 'Race name is too long').optional(),
    race_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Race date must be in YYYY-MM-DD format')
      .refine((d) => d <= today(), { message: 'Race date cannot be in the future' })
      .optional(),
    distance_m: z
      .number({ invalid_type_error: 'Distance must be a number' })
      .positive('Distance must be greater than 0')
      .max(1000000, 'Distance is too large')
      .optional(),
    finish_time_sec: z
      .number()
      .int()
      .positive('Finish time must be positive')
      .optional()
      .nullable(),
    avg_hr: z
      .number()
      .int()
      .min(1, 'Heart rate must be between 1 and 250')
      .max(250, 'Heart rate must be between 1 and 250')
      .optional()
      .nullable(),
    elevation_gain_m: z.number().min(0).optional().nullable(),
    position_overall: z
      .number()
      .int()
      .min(1, 'Position must be 1 or greater')
      .optional()
      .nullable(),
    position_category: z
      .number()
      .int()
      .min(1, 'Position must be 1 or greater')
      .optional()
      .nullable(),
    did_not_finish: z.boolean().optional(),
    activity_id: z.string().uuid('Invalid activity ID').optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  })

export const updateGoalSchema = z
  .object({
    title: z.string().min(1).max(200).optional().nullable(),
    description: z.string().max(5000).optional().nullable(),
    target_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be in YYYY-MM-DD format')
      .optional()
      .nullable(),
    target_distance_m: z.number().positive('Distance must be greater than 0').optional().nullable(),
    target_time_sec: z
      .number()
      .int()
      .positive('Target time must be positive')
      .optional()
      .nullable(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  })
