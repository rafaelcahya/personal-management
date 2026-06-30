import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldLabel',
}

export default meta

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldLabel</code> renders a
        label element. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">required</code> to show a red
        asterisk.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldLabel htmlFor="demo-1">Email address</FieldLabel>
        <FieldLabel htmlFor="demo-2" required>
          Password
        </FieldLabel>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldLabel htmlFor="email">Email address</FieldLabel>
<FieldLabel htmlFor="password" required>Password</FieldLabel>`}</code>
      </pre>
    </div>
  ),
}

export const AutoWired = {
  name: 'Auto-wired',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldLabel</code> is
        auto-linked to the input via context — no{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code> needed. Click
        the label to focus the input.
      </p>

      <div className="w-80">
        <FieldContent size="base" required>
          <FieldLabel>Auto-linked label</FieldLabel>
          <FieldControl>
            <Input placeholder="Click label to focus" />
          </FieldControl>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required>
  <FieldLabel>Auto-linked label</FieldLabel>
  <FieldControl><Input placeholder="Click label to focus" /></FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
