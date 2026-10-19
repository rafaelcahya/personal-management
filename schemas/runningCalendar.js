import { z } from 'zod'
import { activityTypeParam } from '@/schemas/runningActivityTypeParam'

export const calendarQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be YYYY-MM')
    .optional(),
  tz_offset: z.coerce
    .number('tz_offset must be a number')
    .int('tz_offset must be a whole number of minutes')
    .gte(-840, 'tz_offset must be between -840 and 840')
    .lte(840, 'tz_offset must be between -840 and 840')
    .default(0),
  type: activityTypeParam,
})
