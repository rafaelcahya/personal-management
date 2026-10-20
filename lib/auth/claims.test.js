import { afterEach, beforeEach, describe, mock, test } from 'node:test'
import assert from 'node:assert/strict'
import { acceptUserClaims, claimsSource, getClaimsMode, getFailedClaims } from './claims.js'

const BASE_URL = 'https://abc.supabase.co'
const valid = () => ({
  sub: 'user-1',
  role: 'authenticated',
  aud: 'authenticated',
  iss: `${BASE_URL}/auth/v1`,
  is_anonymous: false,
})

let savedUrl
let savedMode
beforeEach(() => {
  savedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  savedMode = process.env.AUTH_CLAIMS_MODE
  process.env.NEXT_PUBLIC_SUPABASE_URL = BASE_URL
  delete process.env.AUTH_CLAIMS_MODE
})
afterEach(() => {
  mock.restoreAll()
  if (savedUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
  else process.env.NEXT_PUBLIC_SUPABASE_URL = savedUrl
  if (savedMode === undefined) delete process.env.AUTH_CLAIMS_MODE
  else process.env.AUTH_CLAIMS_MODE = savedMode
})

// Bearer always enforces, so it is the plain "are these claims acceptable" answer.
const hasValidUserClaims = (claims) => acceptUserClaims(claims, 'bearer')

describe('claim rules', () => {
  test('accepts a normal user token', () => {
    assert.equal(hasValidUserClaims(valid()), true)
  })

  test('accepts a token without the is_anonymous claim', () => {
    const { is_anonymous: _omit, ...claims } = valid()
    assert.equal(hasValidUserClaims(claims), true)
  })

  test('rejects missing sub', () => {
    const { sub: _omit, ...claims } = valid()
    assert.equal(hasValidUserClaims(claims), false)
  })

  test('rejects anon and service_role roles', () => {
    assert.equal(hasValidUserClaims({ ...valid(), role: 'anon' }), false)
    assert.equal(hasValidUserClaims({ ...valid(), role: 'service_role' }), false)
  })

  test('rejects a wrong audience', () => {
    assert.equal(hasValidUserClaims({ ...valid(), aud: 'other' }), false)
    assert.equal(hasValidUserClaims({ ...valid(), aud: undefined }), false)
  })

  test('accepts an audience array that contains authenticated', () => {
    assert.equal(hasValidUserClaims({ ...valid(), aud: ['x', 'authenticated'] }), true)
    assert.equal(hasValidUserClaims({ ...valid(), aud: ['x', 'y'] }), false)
  })

  test('rejects a wrong issuer', () => {
    assert.equal(hasValidUserClaims({ ...valid(), iss: 'https://evil.example/auth/v1' }), false)
    assert.equal(hasValidUserClaims({ ...valid(), iss: BASE_URL }), false)
  })

  test('ignores trailing slashes in the URL env', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = `${BASE_URL}//`
    assert.equal(hasValidUserClaims(valid()), true)
  })

  test('rejects an anonymous token', () => {
    assert.equal(hasValidUserClaims({ ...valid(), is_anonymous: true }), false)
  })

  test('rejects missing claims', () => {
    assert.equal(hasValidUserClaims(null), false)
    assert.equal(hasValidUserClaims(undefined), false)
    assert.equal(hasValidUserClaims({}), false)
  })
})

describe('getFailedClaims', () => {
  test('lists only rule names', () => {
    const failed = getFailedClaims({ ...valid(), role: 'anon', is_anonymous: true })
    assert.deepEqual(failed, ['role', 'is_anonymous'])
  })

  test('returns just sub when sub is missing', () => {
    assert.deepEqual(getFailedClaims(undefined), ['sub'])
  })
})

describe('getClaimsMode', () => {
  test('only the exact value log relaxes', () => {
    assert.equal(getClaimsMode(), 'enforce')
    process.env.AUTH_CLAIMS_MODE = 'log'
    assert.equal(getClaimsMode(), 'log')
    for (const value of ['LOG', ' log', 'logs', 'off', 'true', '', 'enforce']) {
      process.env.AUTH_CLAIMS_MODE = value
      assert.equal(getClaimsMode(), 'enforce', `value: "${value}"`)
    }
  })
})

describe('claimsSource', () => {
  test('no Authorization header is cookie, anything else is bearer', () => {
    assert.equal(claimsSource({ status: 'none' }), 'cookie')
    assert.equal(claimsSource({ status: 'ok' }), 'bearer')
    assert.equal(claimsSource({ status: 'invalid' }), 'bearer')
  })
})

describe('acceptUserClaims', () => {
  const anonymous = () => ({ ...valid(), is_anonymous: true })
  const loggedText = (spy) => spy.mock.calls.map((call) => call.arguments.join(' ')).join(' | ')

  test('valid cookie claims in enforce mode are accepted and log nothing', () => {
    const warn = mock.method(console, 'warn', () => {})
    assert.equal(acceptUserClaims(valid(), 'cookie'), true)
    assert.equal(warn.mock.callCount(), 0)
  })

  test('valid claims pass for both sources in log mode without logging', () => {
    const warn = mock.method(console, 'warn', () => {})
    process.env.AUTH_CLAIMS_MODE = 'log'
    assert.equal(acceptUserClaims(valid(), 'cookie'), true)
    assert.equal(acceptUserClaims(valid(), 'bearer'), true)
    assert.equal(warn.mock.callCount(), 0)
  })

  test('cookie in enforce mode is rejected and logs one line with rule names', () => {
    const warn = mock.method(console, 'warn', () => {})
    assert.equal(acceptUserClaims(anonymous(), 'cookie'), false)
    assert.equal(warn.mock.callCount(), 1)
    assert.match(loggedText(warn), /cookie session rejected: is_anonymous/)
  })

  test('cookie in log mode logs a would-be-rejected line and accepts', () => {
    const warn = mock.method(console, 'warn', () => {})
    process.env.AUTH_CLAIMS_MODE = 'log'
    assert.equal(acceptUserClaims(anonymous(), 'cookie'), true)
    assert.equal(warn.mock.callCount(), 1)
    assert.match(loggedText(warn), /cookie session would be rejected: is_anonymous/)
  })

  test('bearer enforces even in log mode and never logs', () => {
    const warn = mock.method(console, 'warn', () => {})
    process.env.AUTH_CLAIMS_MODE = 'log'
    assert.equal(acceptUserClaims(anonymous(), 'bearer'), false)
    delete process.env.AUTH_CLAIMS_MODE
    assert.equal(acceptUserClaims(anonymous(), 'bearer'), false)
    assert.equal(warn.mock.callCount(), 0)
  })

  test('log lines never contain claim values, in either mode', () => {
    const bad = {
      ...valid(),
      role: 'anon',
      iss: 'https://evil.example/auth/v1',
      email: 'owner@example.com',
    }
    const warn = mock.method(console, 'warn', () => {})
    acceptUserClaims(bad, 'cookie')
    process.env.AUTH_CLAIMS_MODE = 'log'
    acceptUserClaims(bad, 'cookie')
    assert.equal(warn.mock.callCount(), 2)
    const text = loggedText(warn)
    assert.match(text, /role, iss/)
    for (const secret of ['anon', 'evil.example', 'user-1', 'owner@example.com']) {
      assert.equal(text.includes(secret), false, `log leaked "${secret}"`)
    }
  })

  test('no sub means not signed in: rejected in both modes, nothing logged', () => {
    const warn = mock.method(console, 'warn', () => {})
    assert.equal(acceptUserClaims(undefined, 'cookie'), false)
    process.env.AUTH_CLAIMS_MODE = 'log'
    assert.equal(acceptUserClaims(undefined, 'cookie'), false)
    assert.equal(acceptUserClaims({ role: 'authenticated' }, 'cookie'), false)
    assert.equal(warn.mock.callCount(), 0)
  })
})
