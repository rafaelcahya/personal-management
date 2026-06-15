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

  let closestAge = norms[0].age
  let minDiff = Math.abs(vo2max - norms[0].meanVo2max)

  for (const entry of norms) {
    const diff = Math.abs(vo2max - entry.meanVo2max)
    if (diff < minDiff) {
      minDiff = diff
      closestAge = entry.age
    }
  }

  return closestAge
}
