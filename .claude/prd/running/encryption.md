## 17. Encryption Strategy

### 16.1 What is encrypted

| Data                                             | Location | Reason                                                                                      |
| ------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| `strava_credentials.access_token`                | DB       | Active token — if leaked, an attacker can read all activities                               |
| `strava_credentials.refresh_token`               | DB       | More critical — long-lived, can generate new access tokens                                  |
| `rt_garmin_credentials` (API key + cached token) | DB       | Garmin Personal API key and access token (#922). See `garmin-integration.md`, section 26.10 |

### 16.2 Algorithm

**AES-256-GCM** — chosen because:

- 256-bit key — strong
- GCM mode — authenticated encryption, also detects tampering
- Built into Node.js `crypto` module — no extra library needed

### 16.3 Implementasi

```javascript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex') // 32 bytes = 64 hex chars

export function encrypt(plaintext) {
  const iv = randomBytes(12) // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag() // 16-byte auth tag

  // Stored as: iv(12) + authTag(16) + ciphertext — all in hex
  return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex')
}

export function decrypt(ciphertext) {
  const iv = Buffer.from(ciphertext.slice(0, 24), 'hex') // 12 bytes
  const authTag = Buffer.from(ciphertext.slice(24, 56), 'hex') // 16 bytes
  const content = Buffer.from(ciphertext.slice(56), 'hex')

  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  return decipher.update(content) + decipher.final('utf8')
}
```

The IV (Initialization Vector) is freshly generated on every encryption call — never reused. The IV does not need to be secret; it is stored alongside the ciphertext.

### 16.4 Key management

```
ENCRYPTION_KEY=   ← 64 hex characters (= 32 bytes)
                  ← generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
                  ← store in .env.local and Vercel environment variables
                  ← NEVER commit to git
```

Key rotation: if `ENCRYPTION_KEY` needs to change, a migration is required — decrypt all tokens with the old key and re-encrypt with the new key. This process must be atomic and run during a maintenance window.

### 16.5 Where encrypt/decrypt is called

| Operation                | When                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `encrypt(access_token)`  | On save to DB — after OAuth callback and after token refresh |
| `decrypt(access_token)`  | Immediately before making a call to the Strava API           |
| `encrypt(refresh_token)` | Same as access_token                                         |
| `decrypt(refresh_token)` | During the token refresh process                             |

Tokens are never logged in plaintext — not even in error logs.

---
