import { DAY_MS } from '@/lib/constants/garmin'

/** The key works through the whole expiry day, so it expires once that day is over. */
export function isGarminKeyExpired(keyExpiresAt, now = Date.now()) {
  if (!keyExpiresAt) return false
  return now >= new Date(keyExpiresAt).getTime() + DAY_MS
}

export function deriveGarminStatus(row) {
  if (!row) return 'not_connected'
  if (isGarminKeyExpired(row.key_expires_at)) return 'expired'
  if (row.status === 'invalid') return 'invalid'
  return 'connected'
}

export function toConnectionResponse(row) {
  return {
    status: deriveGarminStatus(row),
    key_last4: row?.key_last4 ?? null,
    key_expires_at: row?.key_expires_at ?? null,
    last_synced_at: row?.last_synced_at ?? null,
    last_error: row?.last_error ?? null,
  }
}
