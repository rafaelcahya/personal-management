import { z } from 'zod'

export const vo2maxTargetSchema = z.object({
  vo2max_target: z
    .number({ invalid_type_error: 'VO2max target must be a number' })
    .min(10, 'VO2max target must be at least 10 ml/kg/min')
    .max(90, 'VO2max target must be at most 90 ml/kg/min')
    .nullable(),
})

export const vo2maxTargetInputSchema = z.object({
  vo2max_target: z
    .number({ invalid_type_error: 'Enter a value between 10 and 90' })
    .min(10, 'Must be at least 10 ml/kg/min')
    .max(90, 'Must be at most 90 ml/kg/min'),
})
