// ─── Conversions ───────────────────────────────────────────────────────────────

export function hsvToRgb(h, s, v) {
  s /= 100
  v /= 100
  const i = Math.floor(h / 60) % 6
  const f = h / 60 - Math.floor(h / 60)
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const [r, g, b] = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ][i]
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round((h / 6) * 360)
    if (h < 0) h += 360
  }
  return { h, s: max ? Math.round((d / max) * 100) : 0, v: Math.round(max * 100) }
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export function hexToRgb(hex) {
  const c = hex.replace(/^#/, '')
  if (c.length === 3)
    return {
      r: parseInt(c[0] + c[0], 16),
      g: parseInt(c[1] + c[1], 16),
      b: parseInt(c[2] + c[2], 16),
    }
  if (c.length >= 6)
    return {
      r: parseInt(c.slice(0, 2), 16),
      g: parseInt(c.slice(2, 4), 16),
      b: parseInt(c.slice(4, 6), 16),
    }
  return null
}

export function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2
  let h = 0,
    s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// ─── Format helpers ────────────────────────────────────────────────────────────

export function toOutput(h, s, v, a, format, withAlpha) {
  const rgb = hsvToRgb(h, s, v)
  if (format === 'hex') {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    return withAlpha
      ? hex +
          Math.round(a * 255)
            .toString(16)
            .padStart(2, '0')
      : hex
  }
  if (format === 'rgb') return withAlpha ? { ...rgb, a: +a.toFixed(2) } : rgb
  if (format === 'hsl') {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return withAlpha ? { ...hsl, a: +a.toFixed(2) } : hsl
  }
}

export function fromInput(value, format) {
  if (!value) return { h: 0, s: 0, v: 100, a: 1 }
  let rgb,
    a = 1
  try {
    if (format === 'hex') {
      const c = String(value).replace(/^#/, '')
      if (c.length === 8) {
        a = parseInt(c.slice(6, 8), 16) / 255
        rgb = hexToRgb('#' + c.slice(0, 6))
      } else rgb = hexToRgb(value)
    } else if (format === 'rgb') {
      rgb = { r: value.r ?? 0, g: value.g ?? 0, b: value.b ?? 0 }
      a = value.a ?? 1
    } else if (format === 'hsl') {
      rgb = hslToRgb(value.h ?? 0, value.s ?? 0, value.l ?? 0)
      a = value.a ?? 1
    }
  } catch {
    return { h: 0, s: 0, v: 100, a: 1 }
  }
  if (!rgb) return { h: 0, s: 0, v: 100, a: 1 }
  return { ...rgbToHsv(rgb.r, rgb.g, rgb.b), a }
}

export function displayText(h, s, v, a, format, withAlpha) {
  const rgb = hsvToRgb(h, s, v)
  if (format === 'hex') {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase()
    return withAlpha
      ? hex +
          Math.round(a * 255)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase()
      : hex
  }
  if (format === 'rgb') {
    return withAlpha
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${+a.toFixed(2)})`
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }
  if (format === 'hsl') {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return withAlpha
      ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${+a.toFixed(2)})`
      : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }
}
