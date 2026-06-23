import { z } from 'zod'

export const createCurrencyInvestmentSchema = z.object({
  currency: z.string().length(3, 'Currency must be exactly 3 characters').toUpperCase(),
  type: z.enum(['buy', 'sell'], { required_error: 'Type must be buy or sell' }),
  idr_amount: z
    .number({ required_error: 'IDR amount is required' })
    .positive('IDR amount must be positive'),
  rate: z.number({ required_error: 'Rate is required' }).positive('Rate must be positive'),
  transacted_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
})

export const listCurrencyInvestmentsQuerySchema = z.object({
  currency: z.string().length(3).toUpperCase().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

export const forexRatesQuerySchema = z.object({
  symbols: z.string().optional().default('USD,CHF,JPY,SGD,AUD'),
})

export const forexHistoryQuerySchema = z.object({
  currency: z.string().length(3, 'Currency must be exactly 3 characters').toUpperCase(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from must be in YYYY-MM-DD format'),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'to must be in YYYY-MM-DD format')
    .optional(),
})
