import PasswordInput from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Error State' }
export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Error state is driven by the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to surface
        the validation message.
      </p>

      <div className="flex flex-col gap-5 w-72">
        <FieldContent size="base" required error="Password must be at least 8 characters.">
          <FieldLabel>Password</FieldLabel>
          <PasswordInput defaultValue="123" />
          <FieldError />
        </FieldContent>

        <FieldContent size="base" required error="Passwords do not match.">
          <FieldLabel>Confirm password</FieldLabel>
          <PasswordInput defaultValue="different" />
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Password must be at least 8 characters.">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="123" />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
