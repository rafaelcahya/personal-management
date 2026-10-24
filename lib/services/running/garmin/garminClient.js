import { decrypt, encrypt } from '@/lib/utils/running/encrypt'
import { deriveGarminStatus } from './connectionStatus'

const GARMIN_BASE_URL = 'https://personal.connectapi.garmin.com'
const TOKEN_PATH = '/personalapitoken-service/personal-api/personal-api-key/token'
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000
const FALLBACK_TOKEN_TTL_MS = 23 * 60 * 60 * 1000
const REQUEST_GAP_MS = 250
const REQUEST_TIMEOUT_MS = 15000
const DEFAULT_RETRY_AFTER_SEC = 60

/**
 * kind: rejected | unavailable | rate_limited | not_connected | expired | invalid
 * Messages are safe to log. They never hold the key or a token.
 */
export class GarminError extends Error {
  constructor(kind, message, { status, retryAfterSec } = {}) {
    super(message ?? kind)
    this.name = 'GarminError'
    this.kind = kind
    this.status = status
    this.retryAfterSec = retryAfterSec
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function garminFetch(path, { params, headers, method = 'GET' }) {
  const url = new URL(path, GARMIN_BASE_URL)
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, String(v))
  try {
    return await fetch(url, {
      method,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch {
    throw new GarminError('unavailable', 'Garmin API is unreachable')
  }
}

function failFromStatus(res) {
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after'))
    return new GarminError('rate_limited', 'Garmin rate limit hit', {
      status: 429,
      retryAfterSec:
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : DEFAULT_RETRY_AFTER_SEC,
    })
  }
  if (res.status >= 500) {
    return new GarminError('unavailable', `Garmin API error ${res.status}`, { status: res.status })
  }
  return new GarminError('rejected', `Garmin rejected the request (${res.status})`, {
    status: res.status,
  })
}

function decodeJwtExpiry(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
    if (typeof payload.exp === 'number') return new Date(payload.exp * 1000)
  } catch {
    // fall through to the fallback below
  }
  return new Date(Date.now() + FALLBACK_TOKEN_TTL_MS)
}

/** Swaps an API key for a short-lived access token. Garmin answers with a raw JWT, not JSON. */
export async function exchangeApiKey(apiKey) {
  const res = await garminFetch(TOKEN_PATH, {
    method: 'POST',
    headers: { Authorization: `ApiKey ${apiKey}` },
  })
  if (!res.ok) throw failFromStatus(res)

  const token = (await res.text()).trim().replace(/^"|"$/g, '')
  if (token.split('.').length !== 3) {
    throw new GarminError('unavailable', 'Garmin returned an unexpected token response')
  }
  return { token, expiresAt: decodeJwtExpiry(token) }
}

async function storeToken(admin, userId, { token, expiresAt }) {
  const { error } = await admin
    .from('rt_garmin_credentials')
    .update({
      access_token_encrypted: encrypt(token),
      token_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (error) throw new Error(`Failed to cache Garmin token: ${error.message}`)
}

async function markKeyInvalid(admin, userId) {
  const { error } = await admin
    .from('rt_garmin_credentials')
    .update({
      status: 'invalid',
      last_error: 'Garmin rejected the API key',
      access_token_encrypted: null,
      token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (error) console.error('[garminClient] could not mark key invalid', error.message)
}

/**
 * One session per job step. Calls run one at a time with a small gap, the cached token is
 * reused until it is about to expire, and a 401 swaps the key for a new token exactly once.
 * Throws GarminError(not_connected | expired | invalid) when Garmin work should be skipped.
 */
export async function createGarminSession(admin, userId) {
  const { data: creds, error } = await admin
    .from('rt_garmin_credentials')
    .select('api_key_encrypted, access_token_encrypted, token_expires_at, status, key_expires_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load Garmin credentials: ${error.message}`)

  const status = deriveGarminStatus(creds)
  if (status !== 'connected') throw new GarminError(status)

  let token = null
  if (
    creds.access_token_encrypted &&
    creds.token_expires_at &&
    new Date(creds.token_expires_at).getTime() - Date.now() > TOKEN_EXPIRY_BUFFER_MS
  ) {
    token = decrypt(creds.access_token_encrypted)
  }
  let lastCallAt = 0

  async function refreshToken() {
    try {
      const fresh = await exchangeApiKey(decrypt(creds.api_key_encrypted))
      await storeToken(admin, userId, fresh)
      token = fresh.token
    } catch (err) {
      if (err instanceof GarminError && err.kind === 'rejected') {
        await markKeyInvalid(admin, userId)
        throw new GarminError('invalid', 'Garmin rejected the API key')
      }
      throw err
    }
  }

  async function request(path, params) {
    const wait = REQUEST_GAP_MS - (Date.now() - lastCallAt)
    if (wait > 0) await sleep(wait)
    lastCallAt = Date.now()
    return garminFetch(path, { params, headers: { Authorization: `Bearer ${token}` } })
  }

  return {
    async get(path, params) {
      if (!token) await refreshToken()
      let res = await request(path, params)
      if (res.status === 401) {
        await refreshToken()
        res = await request(path, params)
      }
      if (!res.ok) throw failFromStatus(res)
      try {
        return await res.json()
      } catch {
        throw new GarminError('unavailable', 'Garmin returned an unreadable response')
      }
    },
  }
}
