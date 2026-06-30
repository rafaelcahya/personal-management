import { useState } from 'react'
import { ColorPicker } from './ColorPicker'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => {
    const [color, setColor] = useState('#7c3aed')
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Click the trigger to open the color picker. Drag the canvas to pick saturation and
          brightness, use the hue slider, or type a value directly. Output format is controlled by
          the <code className="font-mono bg-gray-100 px-1 rounded text-xs">format</code> prop.
        </p>

        <div className="flex flex-col gap-4 w-64">
          <ColorPicker value={color} onChange={setColor} />
          <ColorPicker value={color} onChange={setColor} withAlpha />
          <ColorPicker value={color} onChange={setColor} format="rgb" />
        </div>

        <div className="text-xs font-mono text-gray-400">
          value: <span className="text-gray-700">{color}</span>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [color, setColor] = useState('#7c3aed')

{/* Hex output (default) */}
<ColorPicker value={color} onChange={setColor} />

{/* With alpha channel */}
<ColorPicker value={color} onChange={setColor} withAlpha />

{/* RGB output */}
<ColorPicker value={color} onChange={setColor} format="rgb" />`}</code>
        </pre>
      </div>
    )
  },
}

export const WithPresets = {
  name: 'With Presets',
  render: () => {
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
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">presets</code> array
          of hex colors to show quick-pick swatches at the bottom of the picker.
        </p>

        <div className="w-64">
          <ColorPicker value={color} onChange={setColor} presets={presets} />
        </div>

        <div className="text-xs font-mono text-gray-400">
          value: <span className="text-gray-700">{color}</span>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const presets = ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6']

<ColorPicker
  value={color}
  onChange={setColor}
  presets={presets}
/>`}</code>
        </pre>
      </div>
    )
  },
}

export const Uncontrolled = {
  name: 'Uncontrolled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> instead
        of <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> for
        uncontrolled usage. The component manages its own state internally.
      </p>

      <div className="w-64">
        <ColorPicker defaultValue="#7c3aed" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ColorPicker defaultValue="#7c3aed" />`}</code>
      </pre>
    </div>
  ),
}
