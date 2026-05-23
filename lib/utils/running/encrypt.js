import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex')
if (KEY.length !== 32) {
  throw new Error(
    'ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  )
}

export function encrypt(plaintext) {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex')
}

export function decrypt(ciphertext) {
  const iv = Buffer.from(ciphertext.slice(0, 24), 'hex')
  const authTag = Buffer.from(ciphertext.slice(24, 56), 'hex')
  const content = Buffer.from(ciphertext.slice(56), 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8')
}
