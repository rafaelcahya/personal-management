import { z } from 'zod'

export const tradeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(15),
  ticker: z.string().min(1).max(10).optional(),
})

export const tradeSchema = z.object({
  // z.date() for browser form use (DatePicker returns Date objects)
  buy_date: z.date({ required_error: 'Please select a buy date' }).nullable().optional(),
  sell_date: z.date({ required_error: 'Please select a sell date' }).nullable().optional(),
  ticker: z
    .string()
    .min(1, 'Ticker is required')
    .max(10, 'Ticker must not exceed 10 characters')
    .transform((val) => val.toUpperCase()),
  margin: z
    .string()
    .min(1, 'Margin is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Margin must be a positive number',
    }),
  proceeds: z
    .string()
    .min(1, 'Proceeds is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Proceeds must be a positive number',
    }),
  return_percent: z.string().optional(),
  realized_gain: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === '' || !isNaN(Number(val)), {
      message: 'Realized gain must be a number',
    }),
  stock_type_option: z.string().min(1, 'Stock type is required'),
  entry_session_option: z.string().min(1, 'Entry session is required'),
  entry_occasion_option: z.string().min(1, 'Entry occasion is required'),
  buy_reason_option: z.string().min(1, 'Buy reason is required'),
  sell_reason_option: z.string().min(1, 'Sell reason is required'),
  notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
})

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)')
  .nullable()
  .optional()

// Server-side schema for API routes — dates arrive as 'YYYY-MM-DD' strings from JSON
export const createTradeServerSchema = tradeSchema.extend({
  buy_date: dateString,
  sell_date: dateString,
})

export const dailyPnlQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year out of range'),
  month: z.coerce.number().int().min(1, 'Month must be 1–12').max(12, 'Month must be 1–12'),
})
