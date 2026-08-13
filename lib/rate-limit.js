const store = new Map()
const MAX_STORE_SIZE = 5000

export const TIERS = {
  ai: { requests: 30, windowMs: 60 * 60 * 1000 }, // 30/hour
  sync: { requests: 15, windowMs: 60 * 60 * 1000 }, // 15/hour
  valuation: { requests: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  standard: { requests: 600, windowMs: 5 * 60 * 1000 }, // 600/5min
}

function cleanup(now) {
  if (store.size < MAX_STORE_SIZE) return
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

export function rateLimit(key, tier = 'standard') {
  const config = TIERS[tier]
  const now = Date.now()
  cleanup(now)

  const existing = store.get(key)
  if (!existing || now > existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, remaining: config.requests - 1, resetAt: now + config.windowMs }
  }

  existing.count++
  const remaining = Math.max(0, config.requests - existing.count)
  return { allowed: existing.count <= config.requests, remaining, resetAt: existing.resetAt }
}

export function rateLimitResponse(result) {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000)
  return Response.json(
    { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
      },
    }
  )
}

const AI_PREFIXES = ['/api/running/v1/ai/', '/api/chat', '/api/trade-chat']

const SYNC_PREFIXES = [
  '/api/running/v1/sync/',
  '/api/running/v1/auth/strava/sync',
  '/api/running/v1/auth/strava/re-enrich',
]

const VALUATION_PREFIXES = ['/api/valuation/', '/api/forex/']

export function getRateLimitTier(path) {
  if (AI_PREFIXES.some((p) => path.startsWith(p))) return 'ai'
  if (SYNC_PREFIXES.some((p) => path.startsWith(p))) return 'sync'
  if (VALUATION_PREFIXES.some((p) => path.startsWith(p))) return 'valuation'
  return 'standard'
}
