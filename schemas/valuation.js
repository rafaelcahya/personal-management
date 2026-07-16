import { z } from 'zod'

export const watchlistAddTickerSchema = z.object({
  ticker: z
    .string()
    .min(1, 'Ticker is required')
    .max(10, 'Ticker must not exceed 10 characters')
    .regex(/^[A-Za-z]+$/, 'IDX tickers are letters only, e.g. BBCA')
    .transform((val) => val.toUpperCase()),
})
