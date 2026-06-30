import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import FieldError from './FieldError'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldError',
}

export default meta

export const ViaContext = {
  name: 'Via Context',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> reads the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> context —
        no props needed on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> itself.
      </p>

      <div className="w-80">
        <FieldContent size="base" required error="Enter a valid email address.">
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input defaultValue="wrong@" />
          </FieldControl>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input defaultValue="wrong@" /></FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const CustomMessage = {
  name: 'Custom Message',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">children</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to override
        the context error message with a custom one.
      </p>

      <div className="w-80">
        <FieldContent size="base" required error="Context error (overridden)">
          <FieldLabel>Amount</FieldLabel>
          <FieldControl>
            <FieldPrefix>Rp</FieldPrefix>
            <Input defaultValue="-1" />
          </FieldControl>
          <FieldError>Amount must be greater than zero.</FieldError>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Context error (overridden)">
  <FieldLabel>Amount</FieldLabel>
  <FieldControl>
    <FieldPrefix>Rp</FieldPrefix>
    <Input defaultValue="-1" />
  </FieldControl>
  <FieldError>Amount must be greater than zero.</FieldError>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const NullRender = {
  name: 'Null Render',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        When no <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> is set on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders
        nothing — it takes up no space in the layout.
      </p>

      <div className="w-80">
        <FieldContent size="base">
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input placeholder="No error here" />
          </FieldControl>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* No error prop → FieldError renders nothing */}
<FieldContent size="base">
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input placeholder="No error here" /></FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
