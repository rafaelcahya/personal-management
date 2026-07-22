'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Color/Palette' }
export default meta

// ─── Data ─────────────────────────────────────────────────────────────────────

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const GROUPS = [
  {
    label: 'Neutral — Pure',
    desc: 'Zero chroma. Black scale for dark mode surfaces; white scale for dark mode text.',
    families: [
      { name: 'black', label: 'Black' },
      { name: 'white', label: 'White' },
    ],
  },
  {
    label: 'Neutral — Tinted',
    desc: 'Very low chroma. Used for light mode UI chrome, borders, and muted surfaces.',
    families: [
      { name: 'slate', label: 'Slate' },
      { name: 'gray', label: 'Gray' },
      { name: 'zinc', label: 'Zinc' },
      { name: 'neutral', label: 'Neutral' },
      { name: 'stone', label: 'Stone' },
    ],
  },
  {
    label: 'Warm',
    desc: 'Reds through yellows. Red and amber are used for destructive and warning feedback.',
    families: [
      { name: 'red', label: 'Red' },
      { name: 'orange', label: 'Orange' },
      { name: 'amber', label: 'Amber' },
      { name: 'yellow', label: 'Yellow' },
    ],
  },
  {
    label: 'Green',
    desc: 'Green family. Green is used for success feedback.',
    families: [
      { name: 'lime', label: 'Lime' },
      { name: 'green', label: 'Green' },
      { name: 'emerald', label: 'Emerald' },
    ],
  },
  {
    label: 'Blue & Teal',
    desc: 'Cyans through blues. Blue is used for info feedback.',
    families: [
      { name: 'teal', label: 'Teal' },
      { name: 'cyan', label: 'Cyan' },
      { name: 'sky', label: 'Sky' },
      { name: 'blue', label: 'Blue' },
    ],
  },
  {
    label: 'Purple & Pink',
    desc: 'Indigos through roses. Violet is reserved for the violet color scheme.',
    families: [
      { name: 'indigo', label: 'Indigo' },
      { name: 'violet', label: 'Violet' },
      { name: 'purple', label: 'Purple' },
      { name: 'fuchsia', label: 'Fuchsia' },
      { name: 'pink', label: 'Pink' },
      { name: 'rose', label: 'Rose' },
    ],
  },
  {
    label: 'Custom',
    desc: 'Handcrafted scales not in standard Tailwind. Useful for brand or UI accent variants.',
    families: [
      { name: 'mauve', label: 'Mauve', desc: 'Purple-grey' },
      { name: 'olive', label: 'Olive', desc: 'Yellow-green' },
      { name: 'mist', label: 'Mist', desc: 'Blue-grey' },
      { name: 'taupe', label: 'Taupe', desc: 'Brown-grey' },
    ],
  },
]

// ─── Color Utils ──────────────────────────────────────────────────────────────

function parseOklch(str) {
  // Handles: oklch(0.628 0.2577 29.23) and oklch(62.8% 0.2577 29.23)
  const m = str.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return null
  let L = parseFloat(m[1])
  if (m[1].endsWith('%')) L /= 100
  return { L, C: parseFloat(m[2]), H: parseFloat(m[3]) }
}

function oklchToRgb(L, C, H) {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  // OKLab → Linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3

  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const toSrgb = (c) => {
    const v = Math.max(0, Math.min(1, c))
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
  }

  return {
    r: Math.round(toSrgb(rLin) * 255),
    g: Math.round(toSrgb(gLin) * 255),
    b: Math.round(toSrgb(bLin) * 255),
  }
}

function resolveColor(tokenName) {
  const oklch = getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim()
  if (!oklch) return null

  const parsed = parseOklch(oklch)
  if (!parsed) return { oklch, rgb: null, hex: null }

  const { r, g, b } = oklchToRgb(parsed.L, parsed.C, parsed.H)
  const clamp = (v) => Math.max(0, Math.min(255, v))
  const hex =
    '#' +
    [r, g, b]
      .map((v) => clamp(v).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()

  return { oklch, rgb: `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`, hex }
}

// ─── Popover ──────────────────────────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-auto shrink-0 text-gray-300 hover:text-gray-600 transition-colors"
    >
      {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
    </button>
  )
}

function ColorPopover({ popover, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!popover) return
    function handleDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [popover, onClose])

  if (!popover) return null

  const { token, colors, x, y } = popover

  const rows = [
    { label: 'Token', value: token },
    { label: 'OKLCH', value: colors?.oklch ?? '—' },
    { label: 'HEX', value: colors?.hex ?? '—' },
    { label: 'RGB', value: colors?.rgb ?? '—' },
  ]

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: y + 10,
        left: x,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
      className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-60 text-xs"
    >
      {/* Arrow */}
      <div
        style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
        className="absolute -top-[5px] w-2.5 h-2.5 bg-white border-l border-t border-gray-200 rounded-sm"
      />

      {/* Color preview */}
      <div
        className="w-full h-10 rounded-lg mb-3 border border-black/[0.06]"
        style={{ background: `var(${token})` }}
      />

      {/* Values */}
      <div className="flex flex-col gap-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-gray-400 w-10 shrink-0 font-medium">{label}</span>
            <code className="font-mono text-gray-800 truncate flex-1 text-[10px]">{value}</code>
            {value !== '—' && <CopyButton value={value} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Components ───────────────────────────────────────────────────────────────

function ColorRow({ family, onSwatchClick }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600 w-20 shrink-0 capitalize">
        {family.label}
        {family.desc && (
          <span className="block text-[10px] font-normal text-gray-400">{family.desc}</span>
        )}
      </span>
      <div className="flex flex-1 gap-0.5">
        {SHADES.map((shade) => {
          const token = `--color-${family.name}-${shade}`
          return (
            <div key={shade} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-20 h-20 rounded-md border border-black/[0.06] cursor-pointer hover:scale-110 hover:shadow-md transition-all"
                style={{ background: `var(${token})` }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  onSwatchClick(token, rect)
                }}
              />
              <span className="text-[9px] text-gray-400 font-mono">{shade}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Group({ label, desc, families, onSwatchClick }) {
  return (
    <div className="mb-10">
      <div className="mb-1">
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <hr className="mb-4 border-gray-200" />
      <div className="flex flex-col gap-3">
        {families.map((f) => (
          <ColorRow key={f.name} family={f} onSwatchClick={onSwatchClick} />
        ))}
      </div>
    </div>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

function PaletteCanvas() {
  const [popover, setPopover] = useState(null)

  const handleSwatchClick = useCallback((token, rect) => {
    const colors = resolveColor(token)
    setPopover({ token, colors, x: rect.left + rect.width / 2, y: rect.bottom })
  }, [])

  const handleClose = useCallback(() => setPopover(null), [])

  return (
    <div className="p-8 max-w-4xl font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Palette</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Full OKLCH palette from{' '}
          <code className="font-mono text-sm bg-gray-100 px-1 rounded">app/tokens.css</code>. 30
          color families × 11 shades (50–950). Click any swatch to inspect its token, OKLCH, HEX,
          and RGB values.
        </p>
      </div>

      {/* Shade legend */}
      <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
        <span className="text-xs text-gray-500 w-20 shrink-0">Shade →</span>
        <div className="flex flex-1 gap-0.5">
          {SHADES.map((s) => (
            <div key={s} className="flex-1 text-center">
              <span className="text-[10px] font-mono font-semibold text-gray-500">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((g) => (
        <Group key={g.label} {...g} onSwatchClick={handleSwatchClick} />
      ))}

      {/* Usage note */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
        <strong>Palette tokens are raw values.</strong> Components should never reference{' '}
        <code className="font-mono">--color-red-500</code> directly. Use semantic tokens like{' '}
        <code className="font-mono">--color-destructive</code> so the color adapts across themes
        without touching component code.
      </div>

      <ColorPopover popover={popover} onClose={handleClose} />
    </div>
  )
}

export const Palette = {
  name: 'Palette',
  render: () => <PaletteCanvas />,
}
