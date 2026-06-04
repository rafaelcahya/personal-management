import { z } from 'zod'

const today = () => new Date().toISOString().slice(0, 10)

export const createUpcomingRaceSchema = z.object({
  title: z.string().min(1, 'Race name is required').max(200, 'Race name is too long'),
  race_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Race date must be in YYYY-MM-DD format')
    .refine((d) => d >= today(), { message: 'Race date must be today or in the future' }),
  distance_m: z
    .number({ invalid_type_error: 'Distance must be a number' })
    .positive('Distance must be greater than 0')
    .max(1000000, 'Distance is too large'),
  location: z.string().max(300, 'Location is too long').optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  target_time_sec: z
    .number({ invalid_type_error: 'Target time must be a number' })
    .int('Target time must be a whole number of seconds')
    .positive('Target time must be greater than 0')
    .optional()
    .nullable(),
})

export const updateUpcomingRaceSchema = z
  .object({
    title: z.string().min(1, 'Race name is required').max(200, 'Race name is too long').optional(),
    race_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Race date must be in YYYY-MM-DD format')
      .optional(),
    distance_m: z
      .number({ invalid_type_error: 'Distance must be a number' })
      .positive('Distance must be greater than 0')
      .max(1000000, 'Distance is too large')
      .optional(),
    location: z.string().max(300, 'Location is too long').optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
    target_time_sec: z
      .number({ invalid_type_error: 'Target time must be a number' })
      .int('Target time must be a whole number of seconds')
      .positive('Target time must be greater than 0')
      .optional()
      .nullable(),
    linked_activity_id: z.string().uuid('Invalid activity ID').optional().nullable(),
    finish_position: z.number().int().min(1, 'Position must be 1 or greater').optional().nullable(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  })
