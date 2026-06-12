import { z } from 'zod'

export const profileSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  height_cm: z.coerce.number().positive().optional().or(z.literal('')),
  weight_kg: z.coerce.number().positive().optional().or(z.literal('')),
  max_hr: z.coerce.number().int().min(60).max(250).optional().or(z.literal('')),
  resting_hr_baseline: z.coerce.number().int().min(30).max(120).optional().or(z.literal('')),
  sex: z.enum(['male', 'female', 'none']).optional(),
})
