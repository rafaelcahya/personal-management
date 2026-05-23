import { z } from 'zod'

export const createActivitySchema = z.object({
  started_at: z.string().datetime(),
  duration_sec: z.number().int().positive(),
  distance_m: z.number().positive(),
  activity_type: z.enum(['easy', 'tempo', 'interval', 'long', 'race', 'recovery']).optional(),
  perceived_exertion: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(2000).optional(),
  avg_hr: z.number().int().min(30).max(250).optional(),
  max_hr: z.number().int().min(30).max(250).optional(),
  avg_cadence: z.number().int().min(0).max(300).optional(),
  avg_pace_sec_per_km: z.number().positive().optional(),
  max_pace_sec_per_km: z.number().positive().optional(),
  elevation_gain_m: z.number().optional(),
  elevation_loss_m: z.number().optional(),
  calories: z.number().int().min(0).optional(),
  moving_time_sec: z.number().int().positive().optional(),
})

export const patchActivitySchema = z
  .object({
    notes: z.string().max(2000).optional(),
    activity_type: z.enum(['easy', 'tempo', 'interval', 'long', 'race', 'recovery']).optional(),
    perceived_exertion: z.number().int().min(1).max(10).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: 'At least one field must be provided' })

export const createSubjectiveHealthSchema = z.object({
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sleep_hours: z.number().min(0).max(24).optional(),
  sleep_quality: z.enum(['good', 'ok', 'bad']).optional(),
  morning_energy: z.number().int().min(1).max(5).optional(),
  mood: z.string().max(100).optional(),
  soreness_level: z.number().int().min(1).max(5).optional(),
  manual_rhr: z.number().int().min(20).max(150).optional(),
  notes: z.string().max(2000).optional(),
})

export const patchSubjectiveHealthSchema = z
  .object({
    sleep_hours: z.number().min(0).max(24).optional(),
    sleep_quality: z.enum(['good', 'ok', 'bad']).optional(),
    morning_energy: z.number().int().min(1).max(5).optional(),
    mood: z.string().max(100).optional(),
    soreness_level: z.number().int().min(1).max(5).optional(),
    manual_rhr: z.number().int().min(20).max(150).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: 'At least one field must be provided' })

export const createWeightSchema = z.object({
  measured_at: z.string().datetime(),
  weight_kg: z.number().min(20).max(500),
  body_fat_pct: z.number().min(1).max(70).optional(),
  notes: z.string().max(500).optional(),
})

export const patchWeightSchema = z
  .object({
    measured_at: z.string().datetime().optional(),
    weight_kg: z.number().min(20).max(500).optional(),
    body_fat_pct: z.number().min(1).max(70).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: 'At least one field must be provided' })
