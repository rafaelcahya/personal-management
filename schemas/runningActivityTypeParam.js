import { z } from 'zod'

// Blank values become undefined so '' / '  ' can never produce a cache key different from "all types".
export const activityTypeParam = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z
    .string()
    .trim()
    .max(30, 'type is too long')
    .regex(/^[A-Za-z]+$/, 'type must contain letters only')
    .optional()
)
