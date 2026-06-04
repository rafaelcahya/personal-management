// VDOT table derived from Jack Daniels' Aerobic Capacity formula:
//   vVO2      = -4.6 + 0.182258*v + 0.000104*v²   (v in m/min)
//   %VO2max   = 0.8 + 0.1894393*exp(-0.012778*t) + 0.2989558*exp(-0.1932605*t)  (t in min)
//   VDOT      = vVO2 / %VO2max
//
// Race times are computed by inverting the formula via binary search for each (VDOT, distance) pair.

const STANDARD_DISTANCES_M = {
  '1500m': 1500,
  '3K': 3000,
  '5K': 5000,
  '10K': 10000,
  '15K': 15000,
  half_marathon: 21097,
  marathon: 42195,
}

function estimateVdot(distanceM, timeSec) {
  const v = (distanceM / timeSec) * 60
  const tMin = timeSec / 60
  const vVO2 = -4.6 + 0.182258 * v + 0.000104 * v * v
  const pctVO2max =
    0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) + 0.2989558 * Math.exp(-0.1932605 * tMin)
  return vVO2 / pctVO2max
}

function findTimeForVdot(targetVdot, distanceM) {
  // Binary search: faster (lower) time → higher VDOT
  let lo = distanceM / (500 / 60) // upper speed bound (~500 m/min)
  let hi = distanceM / (40 / 60) // lower speed bound (~40 m/min, walking pace)
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (estimateVdot(distanceM, mid) > targetVdot) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return Math.round((lo + hi) / 2)
}

// Generate table for VDOT 30–75 (covers recreational to sub-elite)
const VDOT_TABLE = []
for (let vdot = 30; vdot <= 75; vdot++) {
  const times = {}
  for (const [key, distM] of Object.entries(STANDARD_DISTANCES_M)) {
    times[key] = findTimeForVdot(vdot, distM)
  }
  VDOT_TABLE.push({ vdot, times })
}

/**
 * Converts a user's race goal (any distance + target time) to the nearest
 * standard VDOT-table distance, applying Riegel's formula when necessary.
 *
 * @param {number} targetDistM   - goal race distance in metres
 * @param {number} targetTimeSec - goal finish time in seconds
 * @returns {{ distKey: string, timeSec: number }}
 */
export function normalizeToStandardDistance(targetDistM, targetTimeSec) {
  const standardEntries = Object.entries(STANDARD_DISTANCES_M)

  let closestKey = null
  let closestDiff = Infinity
  for (const [key, distM] of standardEntries) {
    const diff = Math.abs(distM - targetDistM)
    if (diff < closestDiff) {
      closestDiff = diff
      closestKey = key
    }
  }

  const closestDistM = STANDARD_DISTANCES_M[closestKey]

  // Within 2% of a standard distance → use directly (accounts for course measurement variance)
  if (Math.abs(closestDistM - targetDistM) / closestDistM < 0.02) {
    return { distKey: closestKey, timeSec: targetTimeSec }
  }

  // Riegel's formula: T2 = T1 × (D2/D1)^1.06 — convert to 10K equivalent
  const refDistM = STANDARD_DISTANCES_M['10K']
  const normalizedTimeSec = targetTimeSec * Math.pow(refDistM / targetDistM, 1.06)
  return { distKey: '10K', timeSec: Math.round(normalizedTimeSec) }
}

/**
 * Returns the VDOT value for a given race distance and finish time,
 * interpolating linearly between adjacent table rows.
 *
 * Higher VDOT = faster pace = lower finish time.
 *
 * @param {string} distKey   - key from STANDARD_DISTANCES_M
 * @param {number} timeSec   - finish time in seconds
 * @returns {number}         - VDOT (≈ VO2max in mL/kg/min)
 */
export function lookupVdotFromTime(distKey, timeSec) {
  // Scan from lowest VDOT (slowest times) upward.
  // Find the first row whose time is ≤ timeSec — that row's VDOT is the upper bracket.
  let upperRow = null // row with VDOT just above the interpolated value
  let lowerRow = null // row with VDOT just below

  for (let i = 0; i < VDOT_TABLE.length; i++) {
    const rowTime = VDOT_TABLE[i].times[distKey]
    if (rowTime === undefined) continue

    if (rowTime <= timeSec) {
      // timeSec is faster than or equal to this row's time → VDOT is ≥ this row's VDOT.
      // The actual VDOT lies between rows[i-1] (slower, lower VDOT) and rows[i] (faster, higher VDOT).
      upperRow = VDOT_TABLE[i]
      lowerRow = i > 0 ? VDOT_TABLE[i - 1] : null
      break
    }
  }

  // Time is slower than the slowest table entry (VDOT 30) → cap at VDOT 30
  if (!upperRow) return VDOT_TABLE[0].vdot

  // Time is faster than the fastest table entry (VDOT 75) → cap at VDOT 75
  if (!lowerRow) return upperRow.vdot

  // Linear interpolation between the two bracketing rows
  const lowerTime = lowerRow.times[distKey]
  const upperTime = upperRow.times[distKey]
  const fraction = (timeSec - upperTime) / (lowerTime - upperTime)
  const interpolated = upperRow.vdot + fraction * (lowerRow.vdot - upperRow.vdot)
  return Math.round(interpolated * 10) / 10
}
