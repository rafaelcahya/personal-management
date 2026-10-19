import { z } from 'zod'
import { activityTypeParam } from '@/schemas/runningActivityTypeParam'

const tzOffset = z.coerce
  .number('tz_offset must be a number')
  .int('tz_offset must be a whole number of minutes')
  .gte(-840, 'tz_offset must be between -840 and 840')
  .lte(840, 'tz_offset must be between -840 and 840')
  .default(0)

const activityType = activityTypeParam

export const dashboardQuerySchema = z.object({
  type: activityType,
  tz_offset: tzOffset,
})

export const weeklyStatsQuerySchema = z.object({
  type: activityType,
  tz_offset: tzOffset,
  weeks_ago: z.coerce
    .number('weeks_ago must be a number')
    .int('weeks_ago must be a whole number')
    .gte(0, 'weeks_ago must be between 0 and 4')
    .lte(4, 'weeks_ago must be between 0 and 4')
    .default(0),
})
