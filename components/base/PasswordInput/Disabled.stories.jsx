import PasswordInput from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Disabled' }
export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Disabled state is inherited from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> or set
        directly via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop.
      </p>

      <div className="flex flex-col gap-3 w-72">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <FieldContent key={size} size={size} disabled>
            <PasswordInput placeholder={`Disabled — size="${size}"`} defaultValue="secret" />
          </FieldContent>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* via FieldContent */}
<FieldContent size="base" disabled>
  <PasswordInput placeholder="Password" />
</FieldContent>

{/* or directly */}
<PasswordInput disabled placeholder="Password" />`}</code>
      </pre>
    </div>
  ),
}
