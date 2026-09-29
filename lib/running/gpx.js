// Minimal GPX reader — extracts track/route points as { lat, lon, ele }.
// GPX is XML, but a full parser is overkill for pulling waypoints; the repo has
// no XML dependency, so we match the well-defined trkpt/rtept shape directly.

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([-\\d.]+)["']`))
  return m ? parseFloat(m[1]) : NaN
}

export function parseGpx(xml) {
  if (typeof xml !== 'string' || !xml.includes('<')) return []
  const points = []
  const tagRe = /<(trkpt|rtept)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1\s*>)/g
  let m
  while ((m = tagRe.exec(xml)) !== null) {
    const attrs = m[2] ?? ''
    const inner = m[3] ?? ''
    const lat = attr(attrs, 'lat')
    const lon = attr(attrs, 'lon')
    if (Number.isNaN(lat) || Number.isNaN(lon)) continue
    const eleMatch = inner.match(/<ele>\s*([-\d.]+)\s*<\/ele>/)
    const ele = eleMatch ? parseFloat(eleMatch[1]) : null
    points.push({ lat, lon, ele })
  }
  return points
}

export function hasElevation(points) {
  return (points ?? []).some((p) => p && Number.isFinite(p.ele))
}
