/**
 * Computes age in whole years from a birth date string (YYYY-MM-DD or ISO).
 * Returns null if birthDate is falsy.
 */
export function computeAge(birthDate) {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}
