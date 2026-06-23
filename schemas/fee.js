import { z } from 'zod'

export const feeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(15),
})

export const feeSchema = z.object({
  fee_name: z
    .string()
    .min(3, 'Fee name must be at least 3 characters')
    .max(100, 'Fee name must not exceed 100 characters'),
  fee: z
    .string()
    .min(1, 'Fee amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Fee must be a positive number',
    }),
  fee_date: z.date({
    required_error: 'Please select a fee date',
  }),
})
