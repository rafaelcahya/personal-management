// Minimal GPX reader — extracts track/route points as { lat, lon, ele }.
// GPX is XML, but a full parser is overkill for pulling waypoints; the repo has
// no XML dependency, so we scan for the well-defined trkpt/rtept shape directly.
// The scan uses indexOf only (no lazy regex over the whole document), so cost
// stays linear in the input size.

export const MAX_GPX_POINTS = 100_000
const MAX_ATTR_LENGTH = 512
const POINT_TAGS = ['<trkpt', '<rtept']

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([-\\d.]+)["']`))
  return m ? parseFloat(m[1]) : NaN
}

function parseEle(inner) {
  const open = inner.indexOf('<ele>')
  if (open === -1) return null
  const close = inner.indexOf('</ele>', open)
  if (close === -1) return null
  const value = parseFloat(inner.slice(open + 5, close))
  return Number.isFinite(value) ? value : null
}

// Earliest point-tag opening at or after `from`, as { index, tag } or null.
// `cache` keeps each tag's last hit so a tag that never appears is searched for
// once, not again on every point (that would be quadratic).
function nextPointTag(xml, from, cache) {
  let best = null
  for (const tag of POINT_TAGS) {
    let index = cache[tag]
    if (index === undefined || (index !== -1 && index < from)) {
      index = xml.indexOf(tag, from)
      cache[tag] = index
    }
    if (index !== -1 && (best === null || index < best.index)) best = { index, tag }
  }
  return best
}

/**
 * Returns at most MAX_GPX_POINTS + 1 points, so a caller can tell "too many"
 * from "exactly at the limit" without the parser walking an unbounded file.
 */
export function parseGpx(xml) {
  if (typeof xml !== 'string' || !xml.includes('<')) return []
  const points = []
  const tagCache = {}
  const noCloseTag = new Set() // a close tag missing once is missing for the rest of the file
  let pos = 0

  while (points.length <= MAX_GPX_POINTS) {
    const found = nextPointTag(xml, pos, tagCache)
    if (!found) break

    const nameEnd = found.index + found.tag.length
    const next = xml[nameEnd]
    if (next !== undefined && !/[\s/>]/.test(next)) {
      pos = nameEnd
      continue
    }

    const tagEnd = xml.indexOf('>', nameEnd)
    if (tagEnd === -1) break
    pos = tagEnd + 1
    if (tagEnd - nameEnd > MAX_ATTR_LENGTH) continue

    const attrs = xml.slice(nameEnd, tagEnd)
    const lat = attr(attrs, 'lat')
    const lon = attr(attrs, 'lon')
    const selfClosing = xml[tagEnd - 1] === '/'

    let ele = null
    if (!selfClosing && !noCloseTag.has(found.tag)) {
      const closeIdx = xml.indexOf(`</${found.tag.slice(1)}`, pos)
      if (closeIdx === -1) {
        noCloseTag.add(found.tag)
      } else {
        ele = parseEle(xml.slice(pos, closeIdx))
        pos = closeIdx
      }
    }

    if (Number.isNaN(lat) || Number.isNaN(lon)) continue
    points.push({ lat, lon, ele })
  }

  return points
}

export function hasElevation(points) {
  return (points ?? []).some((p) => p && Number.isFinite(p.ele))
}
