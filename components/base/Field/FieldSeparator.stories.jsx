import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldSeparator from './FieldSeparator'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldSeparator',
}

export default meta

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSeparator</code> renders a
        thin horizontal rule — use it to visually divide form sections.
      </p>

      <div className="w-80">
        <FieldSeparator />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldSeparator />`}</code>
      </pre>
    </div>
  ),
}

export const InForm = {
  name: 'In Form',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSeparator</code>{' '}
        inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> to
        divide groups of fields while maintaining consistent gap spacing.
      </p>

      <div className="max-w-sm w-full">
        <FieldContainer gap="md">
          <FieldContent size="base" required>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input placeholder="you@example.com" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base" required>
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <Input type="password" placeholder="••••••••" />
            </FieldControl>
          </FieldContent>
          <FieldSeparator />
          <FieldContent size="base">
            <FieldLabel>Display Name</FieldLabel>
            <FieldControl>
              <Input placeholder="Cahya" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base">
            <FieldLabel>Bio</FieldLabel>
            <FieldControl>
              <Input placeholder="Tell us about yourself" />
            </FieldControl>
          </FieldContent>
        </FieldContainer>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer gap="md">
  <FieldContent size="base" required>
    <FieldLabel>Email</FieldLabel>
    <FieldControl><Input placeholder="you@example.com" /></FieldControl>
  </FieldContent>
  <FieldSeparator />
  <FieldContent size="base">
    <FieldLabel>Display Name</FieldLabel>
    <FieldControl><Input placeholder="Cahya" /></FieldControl>
  </FieldContent>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}
