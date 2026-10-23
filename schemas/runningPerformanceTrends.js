import { z } from 'zod'
import { activityTypeParam } from '@/schemas/runningActivityTypeParam'

const MAX_LIMIT = 100

export const performanceTrendsQuerySchema = z.object({
  // Values above the max are capped rather than rejected, as the route always did.
  limit: z.coerce
    .number('limit must be a number')
    .int('limit must be a whole number')
    .gte(1, 'limit must be at least 1')
    .transform((n) => Math.min(n, MAX_LIMIT))
    .default(25),
  type: activityTypeParam,
})
