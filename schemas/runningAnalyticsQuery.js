import { z } from 'zod'

const ALLOWED_RANGES = ['today', '4w', '3m', '6m', '1y', 'all', 'custom']
const ALLOWED_ACTIVITY_TYPES = [
  'All',
  'Run',
  'TrailRun',
  'VirtualRun',
  'Walk',
  'Hike',
  'Ride',
  'Swim',
]

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
  .optional()

export const analyticsQuerySchema = z
  .object({
    range: z.enum(ALLOWED_RANGES).default('3m'),
    activity_type: z.enum(ALLOWED_ACTIVITY_TYPES).default('All'),
    start_date: isoDate,
    end_date: isoDate,
  })
  .refine((d) => d.range !== 'custom' || (!!d.start_date && !!d.end_date), {
    message: 'start_date and end_date are required when range is custom',
  })
  .refine((d) => !d.start_date || !d.end_date || d.start_date <= d.end_date, {
    message: 'start_date must be on or before end_date',
  })
