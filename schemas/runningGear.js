import { z } from 'zod'

export const updateGearSchema = z
  .object({
    category: z.string().max(100).nullable().optional(),
    retirement_km: z.number().int().min(0).max(100000).nullable().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  })
