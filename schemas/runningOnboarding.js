import { z } from 'zod'

export const biometricSchema = z.object({
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'birth_date must be in YYYY-MM-DD format')
    .optional(),
  height_cm: z.number().min(50).max(300).optional(),
  weight_kg: z.number().min(20).max(500).optional(),
  max_hr: z.number().int().min(60).max(250).optional(),
  resting_hr_baseline: z.number().int().min(20).max(150).optional(),
})
