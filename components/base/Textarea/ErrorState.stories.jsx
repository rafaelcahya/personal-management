import Textarea from './Textarea'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — Textarea
        automatically gets a red border and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders the
        message.
      </p>

      <div className="w-80">
        <FieldContent size="base" required error="Description must be at least 20 characters.">
          <FieldLabel>Description</FieldLabel>
          <FieldControl>
            <Textarea rows={4} defaultValue="Too short." />
          </FieldControl>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Description must be at least 20 characters.">
  <FieldLabel>Description</FieldLabel>
  <FieldControl>
    <Textarea rows={4} defaultValue="Too short." />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
