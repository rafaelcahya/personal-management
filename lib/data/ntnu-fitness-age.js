// Nes et al. 2011 — mean VO2max (mL/kg/min) by age group, Scandinavian Journal of
// Medicine and Science in Sports. Representative age = bracket start.
const NTNU_NORMS = {
  male: [
    { age: 20, meanVo2max: 54.0 },
    { age: 25, meanVo2max: 52.5 },
    { age: 30, meanVo2max: 50.4 },
    { age: 35, meanVo2max: 48.5 },
    { age: 40, meanVo2max: 46.5 },
    { age: 45, meanVo2max: 43.9 },
    { age: 50, meanVo2max: 41.6 },
    { age: 55, meanVo2max: 38.9 },
    { age: 60, meanVo2max: 37.1 },
    { age: 65, meanVo2max: 35.0 },
    { age: 70, meanVo2max: 33.0 },
  ],
  female: [
    { age: 20, meanVo2max: 44.0 },
    { age: 25, meanVo2max: 43.0 },
    { age: 30, meanVo2max: 41.5 },
    { age: 35, meanVo2max: 39.5 },
    { age: 40, meanVo2max: 37.5 },
    { age: 45, meanVo2max: 35.0 },
    { age: 50, meanVo2max: 32.3 },
    { age: 55, meanVo2max: 29.4 },
    { age: 60, meanVo2max: 27.4 },
    { age: 65, meanVo2max: 24.9 },
    { age: 70, meanVo2max: 22.8 },
  ],
}

/**
 * Returns the fitness age (years) for a given VO2max and sex.
 * Finds the NTNU age bracket whose mean VO2max is closest to the user's.
 * Result is capped at the youngest (20) and oldest (70) bracket.
 *
 * @param {number} vo2max
 * @param {'male'|'female'} sex
 * @returns {number|null}
 */
export function computeFitnessAge(vo2max, sex) {
  const norms = NTNU_NORMS[sex]
  if (!norms) return null

  // Norms are ordered ascending by age (descending by meanVo2max).
  // Cap at youngest bracket if VO2max exceeds the top, oldest if below the bottom.
  if (vo2max >= norms[0].meanVo2max) return norms[0].age
  if (vo2max <= norms[norms.length - 1].meanVo2max) return norms[norms.length - 1].age

  // Find the two surrounding brackets and interpolate.
  for (let i = 0; i < norms.length - 1; i++) {
    const upper = norms[i] // higher meanVo2max → younger age
    const lower = norms[i + 1] // lower meanVo2max  → older age
    if (vo2max <= upper.meanVo2max && vo2max >= lower.meanVo2max) {
      const t = (upper.meanVo2max - vo2max) / (upper.meanVo2max - lower.meanVo2max)
      return Math.round(upper.age + t * (lower.age - upper.age))
    }
  }

  return norms[norms.length - 1].age
}
