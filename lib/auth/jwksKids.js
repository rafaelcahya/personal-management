const REFETCH_MS = 10 * 60 * 1000
const RETRY_AFTER_FAILURE_MS = 30 * 1000
const FETCH_TIMEOUT_MS = 3000

let knownKids = new Set()
let lastFetchAt = 0
let pending = null

async function refresh() {
  lastFetchAt = Date.now()
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      }
    )
    if (!res.ok) throw new Error('JWKS fetch failed')
    const { keys } = await res.json()
    knownKids = new Set((keys ?? []).map((key) => key.kid).filter(Boolean))
  } catch {
    // Keep the old set (fail closed for unknown kids) but retry soon, so one blip is not a 10 minute outage.
    lastFetchAt = Date.now() - REFETCH_MS + RETRY_AFTER_FAILURE_MS
  }
}

/**
 * Whether the kid belongs to the project's signing keys. Forged tokens with a random kid would
 * otherwise cost the Auth server two requests each; an unknown kid refetches the key list at most
 * once per REFETCH_MS, so a rotated key is picked up within that window.
 * @param {string} kid
 */
export async function isKnownKid(kid) {
  if (knownKids.has(kid)) return true
  if (!pending && Date.now() - lastFetchAt >= REFETCH_MS) {
    pending = refresh().finally(() => {
      pending = null
    })
  }
  if (pending) await pending
  return knownKids.has(kid)
}
