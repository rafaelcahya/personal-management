import { z } from 'zod'

const ALLOWED_RANGES = ['4w', '3m', '6m', '1y', 'all']
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

export const analyticsQuerySchema = z.object({
  range: z.enum(ALLOWED_RANGES).default('3m'),
  activity_type: z.enum(ALLOWED_ACTIVITY_TYPES).default('All'),
})
