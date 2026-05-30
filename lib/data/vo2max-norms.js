const NORMS = {
  male: [
    { minAge: 20, maxAge: 29, superior: 55, excellent: 51, good: 45, fair: 38 },
    { minAge: 30, maxAge: 39, superior: 54, excellent: 48, good: 43, fair: 36 },
    { minAge: 40, maxAge: 49, superior: 52, excellent: 46, good: 40, fair: 33 },
    { minAge: 50, maxAge: 59, superior: 48, excellent: 43, good: 36, fair: 29 },
    { minAge: 60, maxAge: Infinity, superior: 45, excellent: 39, good: 32, fair: 26 },
  ],
  female: [
    { minAge: 20, maxAge: 29, superior: 49, excellent: 44, good: 38, fair: 31 },
    { minAge: 30, maxAge: 39, superior: 45, excellent: 41, good: 35, fair: 28 },
    { minAge: 40, maxAge: 49, superior: 42, excellent: 37, good: 32, fair: 26 },
    { minAge: 50, maxAge: 59, superior: 38, excellent: 33, good: 28, fair: 22 },
    { minAge: 60, maxAge: Infinity, superior: 35, excellent: 31, good: 24, fair: 20 },
  ],
}

export function getVo2maxCategory(vo2max, sex, age) {
  if (sex == null || age == null) return null

  const sexKey = sex === 'male' ? 'male' : sex === 'female' ? 'female' : null
  if (!sexKey) return null

  const band = NORMS[sexKey].find((b) => age >= b.minAge && age <= b.maxAge)
  if (!band) return null

  if (vo2max >= band.superior) return 'Superior'
  if (vo2max >= band.excellent) return 'Excellent'
  if (vo2max >= band.good) return 'Good'
  if (vo2max >= band.fair) return 'Fair'
  return 'Poor'
}
