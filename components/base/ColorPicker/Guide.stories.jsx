import { useState } from 'react'
import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const Preview = ({ children, className = 'w-80' }) => (
  <div
    className={`flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${className}`}
  >
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => {
    const [color, setColor] = useState('#7c3aed')
    const [colorAlpha, setColorAlpha] = useState('#7c3aed')
    const presets = [
      '#ef4444',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#6b7280',
      '#000000',
    ]

    return (
      <div className="p-8 max-w-4xl font-sans text-gray-900">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">ColorPicker</h1>
            <Tag color="violet">Base Component</Tag>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            A popover-based color picker with HSV canvas, hue and alpha sliders, format switching,
            and optional preset swatches. Pairs with{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
            accessible labels and error messages.
          </p>
        </div>

        {/* Overview */}
        <Section title="Overview">
          <Preview>
            <ColorPicker value={color} onChange={setColor} />
            <ColorPicker value={color} onChange={setColor} withAlpha />
            <ColorPicker value={color} onChange={setColor} presets={presets} />
          </Preview>
          <div className="text-xs font-mono text-gray-400 mb-4">
            current value: <span className="text-gray-700">{color}</span>
          </div>
        </Section>

        {/* Anatomy */}
        <Section
          title="Anatomy"
          description="ColorPicker is a self-contained trigger + popover. Pair it with FieldContent for accessible labeling and error state."
        >
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
            <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                FieldContent <span className="text-slate-400 font-normal">(optional)</span>
              </span>

              <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                  FieldLabel
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Brand color</span>
              </div>

              <div className="flex flex-col gap-1 p-2 border-2 border-dashed border-blue-300 rounded">
                <span className="text-[10px] font-mono text-blue-500">ColorPicker</span>
                <div className="flex items-center gap-1.5 h-6 px-2 border border-gray-300 rounded bg-white mt-0.5">
                  <div
                    className="size-3 rounded-sm border border-black/10"
                    style={{ background: '#7c3aed' }}
                  />
                  <span className="text-[10px] font-mono text-gray-600">#7C3AED</span>
                </div>
              </div>

              <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mt-2">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                  FieldError
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  This field is required.
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Element', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'FieldContent',
                    '<div>',
                    'Optional wrapper. Provides accessible ID, error state, disabled, and size via context.',
                  ],
                  ['FieldLabel', '<label>', 'Optional label linked to ColorPicker via context ID.'],
                  [
                    'ColorPicker',
                    '<button>',
                    'Trigger button showing color swatch and hex value. Opens the picker popover.',
                  ],
                  [
                    'FieldError',
                    '<p>',
                    'Optional error message. Only renders when FieldContent has an error prop.',
                  ],
                ].map(([part, el, desc]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {el}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Code>{`import { ColorPicker } from '@/components/base/ColorPicker/ColorPicker'

<ColorPicker
  value={color}
  onChange={setColor}
/>`}</Code>
        </Section>

        {/* Sizes */}
        <Section title="Sizes" description="Five sizes match the rest of the form system.">
          <Preview className="w-64">
            {['xs', 'sm', 'base', 'md', 'lg'].map((sz) => (
              <div key={sz} className="flex items-center gap-3">
                <ColorPicker defaultValue="#7c3aed" size={sz} />
                <span className="text-xs font-mono text-gray-400">{sz}</span>
              </div>
            ))}
          </Preview>
          <Code>{`<ColorPicker size="xs"   defaultValue="#7c3aed" />
<ColorPicker size="sm"   defaultValue="#7c3aed" />
<ColorPicker size="base" defaultValue="#7c3aed" />   {/* default */}
<ColorPicker size="md"   defaultValue="#7c3aed" />
<ColorPicker size="lg"   defaultValue="#7c3aed" />`}</Code>
        </Section>

        {/* Output formats */}
        <Section
          title="Output Formats"
          description="The format prop controls what onChange fires. The picker's text input always displays the current format and lets the user switch within the popover."
        >
          <Preview className="w-64">
            <ColorPicker defaultValue="#7c3aed" format="hex" />
            <ColorPicker defaultValue="#7c3aed" format="rgb" />
            <ColorPicker defaultValue="#7c3aed" format="hsl" />
          </Preview>
          <Code>{`{/* onChange fires '#7c3aed' */}
<ColorPicker value={color} onChange={setColor} format="hex" />

{/* onChange fires { r: 124, g: 58, b: 237 } */}
<ColorPicker value={color} onChange={setColor} format="rgb" />

{/* onChange fires { h: 263, s: 83, l: 58 } */}
<ColorPicker value={color} onChange={setColor} format="hsl" />`}</Code>
        </Section>

        {/* Alpha */}
        <Section
          title="Alpha Channel"
          description="Enable withAlpha to show the alpha slider and include opacity in the output value."
        >
          <Preview className="w-64">
            <ColorPicker value={colorAlpha} onChange={setColorAlpha} withAlpha />
          </Preview>
          <div className="text-xs font-mono text-gray-400 mb-4">
            value: <span className="text-gray-700">{colorAlpha}</span>
          </div>
          <Code>{`{/* hex output includes alpha byte: '#7c3aedff' */}
<ColorPicker value={color} onChange={setColor} withAlpha />

{/* rgb output includes alpha: { r, g, b, a: 0.85 } */}
<ColorPicker value={color} onChange={setColor} format="rgb" withAlpha />`}</Code>
        </Section>

        {/* Presets */}
        <Section
          title="Preset Swatches"
          description="Pass a presets array of hex strings to show quick-pick swatches at the bottom of the popover."
        >
          <Preview className="w-64">
            <ColorPicker defaultValue="#7c3aed" presets={presets} />
          </Preview>
          <Code>{`const presets = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

<ColorPicker
  value={color}
  onChange={setColor}
  presets={presets}
/>`}</Code>
        </Section>

        {/* Disabled */}
        <Section
          title="Disabled"
          description="Pass disabled to prevent interaction. Also inherits from FieldContent."
        >
          <Preview className="w-64">
            <ColorPicker defaultValue="#7c3aed" disabled />
          </Preview>
          <Code>{`<ColorPicker defaultValue="#7c3aed" disabled />

{/* Via FieldContent context */}
<FieldContent disabled>
  <ColorPicker defaultValue="#7c3aed" />
</FieldContent>`}</Code>
        </Section>

        {/* Error State */}
        <Section
          title="Error State"
          description="Wrap in FieldContent with an error prop to show validation feedback via FieldError."
        >
          <Preview className="w-64">
            <FieldContent size="base" error="Please select a brand color.">
              <FieldLabel>Brand color</FieldLabel>
              <ColorPicker defaultValue="#7c3aed" />
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" error={errors.color?.message}>
  <FieldLabel>Brand color</FieldLabel>
  <ColorPicker
    value={field.value}
    onChange={field.onChange}
  />
  <FieldError />
</FieldContent>`}</Code>
        </Section>

        {/* react-hook-form */}
        <Section
          title="With react-hook-form"
          description="Use Controller to integrate ColorPicker — onChange receives the formatted value directly, not a native event."
        >
          <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="brandColor"
  control={control}
  rules={{ required: 'Please select a brand color.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.brandColor?.message}>
      <FieldLabel>Brand color</FieldLabel>
      <ColorPicker
        value={field.value}
        onChange={field.onChange}
        format="hex"
      />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </Section>

        {/* When to Use */}
        <Section title="When to Use">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Use ColorPicker when…', 'Consider an alternative when…'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        The user needs to choose any arbitrary color, not just from a fixed set —
                        e.g. brand color, chart series color, annotation color.
                      </li>
                      <li>
                        You need the output in a specific format (hex, RGB, HSL) for direct use in
                        CSS or an API.
                      </li>
                      <li>
                        Opacity/alpha is part of the value — e.g. overlay colors, watermark tints.
                      </li>
                    </ul>
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        Use <strong>a preset swatch group or radio group</strong> when the palette
                        is fixed and controlled — e.g. theme selection with 5 brand colors. Fewer
                        options reduces decision fatigue.
                      </li>
                      <li>
                        Use <strong>a plain text input</strong> when the user already knows the
                        exact hex code and precision entry is faster than visual picking.
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Dos & Don'ts */}
        <Section title="Dos & Don'ts">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
                <span className="text-sm font-semibold text-green-700">Do</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Always wrap ColorPicker in <strong>FieldContent + FieldLabel</strong> inside a
                    form so users know what the color represents. A lone swatch with no label is
                    ambiguous.
                  </p>
                </div>
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Provide <strong>preset swatches</strong> when the feature has a recommended
                    palette (e.g. chart series colors, status badge colors). Presets speed up the
                    common case without restricting free choice.
                  </p>
                </div>
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Enable <strong>withAlpha</strong> only when opacity is meaningful in context
                    (e.g. overlay backgrounds, watermark tints). Leave it off for opaque colors like
                    brand primaries to avoid accidental transparency.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  ✕
                </span>
                <span className="text-sm font-semibold text-red-700">Don't</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-800">
                    Don't store the raw onChange value without accounting for the format. If format
                    is <strong>"rgb"</strong>, the value is an object — serializing it as a string
                    will break color restoration on next load.
                  </p>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-800">
                    Don't mix <strong>format="hex" withAlpha</strong> and expect a 6-digit hex — the
                    output becomes an 8-digit hex string (e.g. <code>#7c3aedcc</code>). Make sure
                    the consumer (CSS, API) supports the 8-digit form.
                  </p>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-800">
                    Don't place ColorPicker inside a scrollable popover or Sheet without testing —
                    the picker's own popover may clip or misalign. Prefer rendering it in a full
                    page or dialog where there is enough vertical space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Props */}
        <Section title="Props">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'value',
                    'string | object',
                    '—',
                    'Controlled color value. Type matches the format prop.',
                  ],
                  [
                    'defaultValue',
                    'string | object',
                    '—',
                    'Uncontrolled initial color. Type matches the format prop.',
                  ],
                  [
                    'onChange',
                    '(value) => void',
                    '—',
                    'Fires when the color changes. Receives the value in the output format.',
                  ],
                  [
                    'format',
                    `'hex' | 'rgb' | 'hsl'`,
                    `'hex'`,
                    'Output format for value and onChange. Does not affect internal HSV state.',
                  ],
                  [
                    'withAlpha',
                    'boolean',
                    'false',
                    'Show alpha slider and include alpha in the output value.',
                  ],
                  [
                    'presets',
                    'string[]',
                    '—',
                    'Array of hex color strings shown as quick-pick swatches.',
                  ],
                  [
                    'size',
                    `'xs' | 'sm' | 'base' | 'md' | 'lg'`,
                    `'base'`,
                    'Trigger height and font size. Also set via FieldContent context.',
                  ],
                  [
                    'disabled',
                    'boolean',
                    'false',
                    'Prevents opening the picker. Also inherited from FieldContent context.',
                  ],
                  [
                    'className',
                    'string',
                    '—',
                    'Additional Tailwind classes for the trigger button.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    )
  },
}
