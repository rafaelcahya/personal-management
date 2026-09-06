// Subsequence scorer for the command palette. Returns a number where higher is a better
// match and -Infinity means the query is not a subsequence of the text at all. Rewards
// contiguous runs and matches at word boundaries so "prb" ranks "Product Brand" above a
// scattered coincidental match.
export function fuzzyScore(query, text) {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  const t = text.toLowerCase()

  let score = 0
  let ti = 0
  let prevMatchIdx = -2
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi]
    const found = t.indexOf(ch, ti)
    if (found === -1) return -Infinity

    score += 1
    if (found === prevMatchIdx + 1) score += 5
    const prevChar = found > 0 ? t[found - 1] : ' '
    if (prevChar === ' ' || prevChar === '·' || prevChar === '/') score += 3

    prevMatchIdx = found
    ti = found + 1
  }

  // Prefer shorter targets when scores are otherwise close.
  return score - t.length * 0.01
}
