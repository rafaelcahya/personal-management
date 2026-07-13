import { useState } from 'react'
import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Basic',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

function BasicDemo() {
  const [color, setColor] = useState('#7c3aed')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-violet-700">hex (default)</span>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-violet-700">withAlpha</span>
        <ColorPicker value={color} onChange={setColor} withAlpha />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-violet-700">format="rgb"</span>
        <ColorPicker value={color} onChange={setColor} format="rgb" />
      </div>
      <p className="text-[10px] font-mono text-gray-400 mt-1">
        value: <span className="text-gray-700">{color}</span>
      </p>
    </div>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Click the trigger to open the color picker. Drag the canvas to pick saturation and
        brightness, use the hue slider, or type a value directly. Output format is controlled by the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">format</code> prop.
      </span>

      <div className="w-64 flex flex-col gap-4">
        <BasicDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use ColorPicker for arbitrary color selection',
                body: 'Brand colors, chart series colors, annotation colors — any context where the user needs to choose from the full color space, not just a fixed palette.',
              },
              {
                title: 'Wrap in FieldContent + FieldLabel in forms',
                body: 'A standalone swatch with no label is ambiguous. FieldContent provides the accessible ID, error state, and size context. Always pair with FieldLabel in forms.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match format to your API expectation before calling onChange',
                body: 'If the API expects a hex string, use format="hex". If it expects an object, use "rgb" or "hsl". Never convert the value after the fact — choose format upfront.',
              },
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'onChange fires a color string or object, not a native event. register will not capture the value correctly. Always wrap with Controller.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [color, setColor] = useState('#7c3aed')

{/* Hex output (default) */}
<ColorPicker value={color} onChange={setColor} />

{/* With alpha channel */}
<ColorPicker value={color} onChange={setColor} withAlpha />

{/* RGB output */}
<ColorPicker value={color} onChange={setColor} format="rgb" />`}</code>
      </pre>
    </div>
  ),
}

function PresetsDemo() {
  const [color, setColor] = useState('#7c3aed')
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
    '#ffffff',
  ]
  return (
    <div className="flex flex-col gap-2">
      <ColorPicker value={color} onChange={setColor} presets={presets} />
      <p className="text-[10px] font-mono text-gray-400">
        value: <span className="text-gray-700">{color}</span>
      </p>
    </div>
  )
}

export const WithPresets = {
  name: 'With Presets',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded">presets</code> array of hex
        colors to show quick-pick swatches at the bottom of the picker. Users can still choose any
        color from the canvas.
      </span>

      <div className="w-64 flex flex-col gap-4">
        <PresetsDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Provide presets when there is a recommended palette',
                body: 'Chart series colors, status badge colors, or brand palettes benefit from presets. They speed up the common case without restricting free choice from the canvas.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep presets concise — 8 to 12 colors maximum',
                body: 'Too many swatches defeat the purpose of quick-pick. Curate the most likely choices. Users can still pick any color from the canvas if they need something else.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const presets = ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6']

<ColorPicker
  value={color}
  onChange={setColor}
  presets={presets}
/>`}</code>
      </pre>
    </div>
  ),
}

export const Uncontrolled = {
  name: 'Uncontrolled',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">defaultValue</code> instead of{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">value</code> for uncontrolled usage.
        The component manages its own internal state.
      </span>

      <div className="w-64 flex flex-col gap-4">
        <ColorPicker defaultValue="#7c3aed" />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use defaultValue for simple one-off color pickers outside a form',
                body: 'If the parent does not need to react to color changes (no onChange, no form submit), defaultValue is the simplest option — no useState needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer controlled (value + onChange) when in a form',
                body: 'Uncontrolled usage cannot be validated, reset, or pre-filled from a server response. Use controlled mode whenever the color feeds into a form or API payload.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* No useState needed — internal state only */}
<ColorPicker defaultValue="#7c3aed" />`}</code>
      </pre>
    </div>
  ),
}
