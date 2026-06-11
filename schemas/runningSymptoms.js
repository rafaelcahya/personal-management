import { z } from 'zod'

export const createSymptomLogSchema = z.object({
  body_region: z.string().min(1, 'Body region is required').max(100),
  pain_level: z.number().int().min(0).max(10),
  pain_type: z.enum(['sharp', 'dull', 'stiff', 'swelling']).optional(),
  occurs_when: z.enum(['during', 'after', 'morning', 'rest']).optional(),
  notes: z.string().max(1000).optional(),
})

export const archiveSymptomSchema = z.object({
  archived: z.literal(true),
})

export const injuryCoachRequestSchema = z.object({
  role: z.enum(['physio', 'sports_medicine']),
  body_part: z.string().max(100).optional(),
  injuryPhase: z.enum(['acute', 'subacute', 'recovery']).optional(),
  question: z.string().min(10, 'Question must be at least 10 characters').max(1000),
  pain_level: z.number().int().min(0).max(10).optional(),
  activity_id: z.string().uuid().optional(),
})
