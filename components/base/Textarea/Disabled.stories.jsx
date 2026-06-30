import Textarea from './Textarea'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="disabled"</code>{' '}
        or <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> to render
        the textarea in a dimmed, non-interactive state.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Textarea rows={3} variant="disabled" placeholder="Disabled via variant prop" />
        <FieldContent size="base" disabled>
          <FieldLabel>Notes</FieldLabel>
          <FieldControl>
            <Textarea rows={3} defaultValue="Disabled via FieldContent context." />
          </FieldControl>
          <FieldDescription>This field cannot be edited.</FieldDescription>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Via variant prop */}
<Textarea rows={3} variant="disabled" placeholder="..." />

{/* Via FieldContent context */}
<FieldContent size="base" disabled>
  <FieldLabel>Notes</FieldLabel>
  <FieldControl>
    <Textarea rows={3} defaultValue="Cannot be edited." />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
