import { z } from 'zod'

export const generateSingleAnalysisSchema = z.object({
  event_id: z.number().int().positive('event_id must be a positive integer'),
  additional_context: z
    .string()
    .max(500, 'Additional context must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

export const generateMultiAnalysisSchema = z.object({
  event_ids: z
    .array(z.number().int().positive('Each event_id must be a positive integer'))
    .min(2, 'At least 2 events required for multi-event analysis')
    .max(10, 'Maximum 10 events allowed per multi-event analysis'),
  additional_context: z
    .string()
    .max(500, 'Additional context must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

export const getAnalysisQuerySchema = z.object({
  event_id: z.coerce.number().int().positive('event_id must be a positive integer'),
})
