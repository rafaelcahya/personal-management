import FieldGroup from './FieldGroup'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldTitle from './FieldTitle'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldTitle',
}

export default meta

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldTitle</code> renders a
        section heading inside a form — use it to label groups of related fields.
      </p>

      <div className="max-w-xs w-full">
        <FieldTitle>Personal Info</FieldTitle>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldTitle>Personal Info</FieldTitle>`}</code>
      </pre>
    </div>
  ),
}

export const InGroup = {
  name: 'In Group',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldTitle</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> — it spans
        all columns automatically to act as a section break.
      </p>

      <div className="max-w-lg w-full">
        <FieldGroup cols={2}>
          <FieldTitle>Personal Info</FieldTitle>
          <FieldContent size="base" required>
            <FieldLabel>First Name</FieldLabel>
            <FieldControl>
              <Input placeholder="John" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base" required>
            <FieldLabel>Last Name</FieldLabel>
            <FieldControl>
              <Input placeholder="Doe" />
            </FieldControl>
          </FieldContent>

          <FieldTitle>Address</FieldTitle>
          <FieldContent size="base">
            <FieldLabel>City</FieldLabel>
            <FieldControl>
              <Input placeholder="Jakarta" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base">
            <FieldLabel>Postal Code</FieldLabel>
            <FieldControl>
              <Input placeholder="12345" />
            </FieldControl>
          </FieldContent>
        </FieldGroup>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={2}>
  <FieldTitle>Personal Info</FieldTitle>
  <FieldContent size="base" required>
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldContent size="base" required>
    <FieldLabel>Last Name</FieldLabel>
    <FieldControl><Input placeholder="Doe" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}
