import { format } from 'date-fns'
import { fmtPace } from '../(app)/dashboard/utils/format'

const DAY_MS = 24 * 60 * 60 * 1000

export const GARMIN_EXPIRY_WARNING_DAYS = 14

const MINUS = '\u2212'

// key_expires_at is a timestamp at UTC midnight and the key works through that whole day,
// so the date part is compared against today in UTC to match the server.
export function daysUntilExpiry(keyExpiresAt, now = new Date()) {
  if (!keyExpiresAt) return null
  const [y, m, d] = String(keyExpiresAt).slice(0, 10).split('-').map(Number)
  const expiry = Date.UTC(y, m - 1, d)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((expiry - today) / DAY_MS)
}

export function expiryPhrase(days) {
  if (days <= 0) return 'Expires today'
  return `Expires in ${days} ${days === 1 ? 'day' : 'days'}`
}

export function formatExpiryDate(keyExpiresAt) {
  if (!keyExpiresAt) return null
  return new Date(keyExpiresAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Training Effect ──────────────────────────────────────────────────────────

// Full class strings so Tailwind can see them
const HUES = {
  slate: {
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    text: 'text-slate-700',
    fill: 'bg-slate-500',
  },
  sky: { badge: 'bg-sky-50 text-sky-700 border-sky-200', text: 'text-sky-700', fill: 'bg-sky-500' },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
    fill: 'bg-emerald-500',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    text: 'text-violet-700',
    fill: 'bg-violet-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'text-amber-700',
    fill: 'bg-amber-500',
  },
  red: { badge: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', fill: 'bg-red-500' },
  rose: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    text: 'text-rose-700',
    fill: 'bg-rose-500',
  },
}

const TE_LABELS = {
  RECOVERY: { long: 'Recovery', short: 'Recovery', hue: 'slate' },
  BASE: { long: 'Base', short: 'Base', hue: 'sky' },
  AEROBIC_BASE: { long: 'Base', short: 'Base', hue: 'sky' },
  TEMPO: { long: 'Tempo', short: 'Tempo', hue: 'emerald' },
  LACTATE_THRESHOLD: { long: 'Lactate Threshold', short: 'Threshold', hue: 'amber' },
  VO2MAX: { long: 'VO2 Max', short: 'VO2 Max', hue: 'violet' },
  ANAEROBIC_CAPACITY: { long: 'Anaerobic Capacity', short: 'Anaerobic', hue: 'rose' },
}

function titleCase(raw) {
  return raw
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

/** Null when the label is empty or UNKNOWN, so callers can simply skip rendering. */
export function getTeLabel(raw) {
  if (!raw || raw === 'UNKNOWN') return null
  const known = TE_LABELS[raw]
  const fallback = titleCase(raw)
  const entry = known ?? { long: fallback, short: fallback, hue: 'slate' }
  return { long: entry.long, short: entry.short, ...HUES[entry.hue] }
}

const TE_BANDS = [
  { max: 1, hue: 'slate', meaning: 'No benefit' },
  { max: 2, hue: 'sky', meaning: 'Minor' },
  { max: 3, hue: 'emerald', meaning: 'Maintaining' },
  { max: 4, hue: 'violet', meaning: 'Improving' },
  { max: 5, hue: 'amber', meaning: 'Highly improving' },
  { max: Infinity, hue: 'red', meaning: 'Overreaching' },
]

export function getTeBand(value) {
  const band = TE_BANDS.find((b) => value < b.max)
  return { ...HUES[band.hue], meaning: band.meaning }
}

/** OVERREACHING_14 becomes "Overreaching", NO_ANAEROBIC_BENEFIT_0 becomes "No anaerobic benefit". */
export function cleanTeMessage(message) {
  if (!message) return null
  const words = message.replace(/_\d+$/, '').toLowerCase().split('_').filter(Boolean).join(' ')
  return words ? words[0].toUpperCase() + words.slice(1) : null
}

// ─── Units ────────────────────────────────────────────────────────────────────

export const fmtGroundContact = (ms) => `${Math.round(ms)}`
export const fmtOneDecimal = (n) => Number(n).toFixed(1)
export const fmtStrideM = (cm) => (Number(cm) / 100).toFixed(2)
export const fmtTe = (n) => Number(n).toFixed(1)
export const fmtGapPace = (sec) => fmtPace(Math.round(sec))

export function fmtBodyBattery(delta) {
  const n = Math.round(Number(delta))
  if (n === 0) return '0'
  return n < 0 ? `${MINUS}${Math.abs(n)}` : `+${n}`
}

export function fmtSweat(ml) {
  const n = Number(ml)
  return n >= 1000
    ? { value: (n / 1000).toFixed(2), unit: 'L' }
    : { value: String(Math.round(n)), unit: 'ml' }
}

// ─── Settings helpers ─────────────────────────────────────────────────────────

// No Garmin brand token exists; sky-700 keeps white text at AA contrast
export const GARMIN_BTN_CLASS =
  'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white shrink-0 h-11 md:h-8 focus-visible:ring-2 focus-visible:ring-sky-300'

export const GARMIN_MAX_RANGE_DAYS = 90

export const FIELD_CLASS =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

// The date pickers work in local calendar days, the API wants plain YYYY-MM-DD
export const toIsoDate = (date) => (date ? format(date, 'yyyy-MM-dd') : '')

export function fromIsoDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** The server checks the expiry against today in UTC, so the picker range uses the same day. */
export function utcToday() {
  const now = new Date()
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

export function validateSyncRange(from, to) {
  if (!from && !to) return null
  if (!from || !to) return 'Pick both dates, or leave both empty'
  if (from > to) return 'From must be before To'
  const days = (new Date(`${to}T00:00:00Z`) - new Date(`${from}T00:00:00Z`)) / DAY_MS
  if (days > GARMIN_MAX_RANGE_DAYS) return 'Date range must be 90 days or less'
  return null
}
