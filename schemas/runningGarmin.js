import { z } from 'zod'
import { DAY_MS, GARMIN_DEFAULT_SYNC_DAYS, GARMIN_MAX_SYNC_DAYS } from '@/lib/constants/garmin'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const isRealDate = (s) => {
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

const dateOnly = (message) =>
  z.string({ error: message }).trim().regex(DATE_ONLY, message).refine(isRealDate, { message })

const todayUtc = () => new Date().toISOString().slice(0, 10)

const oneYearFromToday = () => {
  const d = new Date(`${todayUtc()}T00:00:00Z`)
  d.setUTCFullYear(d.getUTCFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export const saveGarminConnectionSchema = z.object({
  api_key: z
    .string({ error: 'Garmin API key is required' })
    .trim()
    .min(1, 'Garmin API key is required')
    .max(500, 'Garmin API key is too long'),
  expires_at: dateOnly('Pick the expiry date you chose in Garmin').refine(
    (d) => d >= todayUtc() && d <= oneYearFromToday(),
    { message: 'Pick the expiry date you chose in Garmin' }
  ),
})

/** Fills the optional from/to with defaults. `to` never goes past today. */
export function resolveGarminSyncRange({ from, to } = {}) {
  const today = todayUtc()
  const resolvedTo = to && to < today ? to : today
  const toMs = new Date(`${resolvedTo}T00:00:00Z`).getTime()
  const resolvedFrom =
    from ?? new Date(toMs - GARMIN_DEFAULT_SYNC_DAYS * DAY_MS).toISOString().slice(0, 10)
  return { from: resolvedFrom, to: resolvedTo }
}

export const garminSyncSchema = z
  .object({
    from: dateOnly('from must be a date in YYYY-MM-DD format').optional(),
    to: dateOnly('to must be a date in YYYY-MM-DD format').optional(),
  })
  .superRefine((d, ctx) => {
    const { from, to } = resolveGarminSyncRange(d)
    if (from > to) {
      ctx.addIssue({
        code: 'custom',
        path: ['from'],
        message: 'from must be before or equal to to',
      })
      return
    }
    const days = (new Date(`${to}T00:00:00Z`) - new Date(`${from}T00:00:00Z`)) / DAY_MS
    if (days > GARMIN_MAX_SYNC_DAYS) {
      ctx.addIssue({
        code: 'custom',
        path: ['from'],
        message: 'Date range must be 90 days or less',
      })
    }
  })
