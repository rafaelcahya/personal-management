import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. The trigger becomes non-clickable and visually dimmed. Also propagates from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> context.
      </p>

      <div className="flex flex-col gap-4 w-64">
        <ColorPicker defaultValue="#7c3aed" disabled />
        <FieldContent disabled>
          <FieldLabel>Brand color</FieldLabel>
          <ColorPicker defaultValue="#3b82f6" />
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Direct prop */}
<ColorPicker defaultValue="#7c3aed" disabled />

{/* Via FieldContent context */}
<FieldContent disabled>
  <FieldLabel>Brand color</FieldLabel>
  <ColorPicker defaultValue="#3b82f6" />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
