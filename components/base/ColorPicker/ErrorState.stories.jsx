import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop to
        show validation feedback. The trigger border turns red automatically.
      </p>

      <div className="w-64">
        <FieldContent size="base" error="Please select a brand color.">
          <FieldLabel>Brand color</FieldLabel>
          <ColorPicker defaultValue="#7c3aed" />
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" error={errors.color?.message}>
  <FieldLabel>Brand color</FieldLabel>
  <ColorPicker
    value={field.value}
    onChange={field.onChange}
  />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
