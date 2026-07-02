import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Pin Input/Disabled' }
export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Disabled state via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent disabled</code> or
        directly on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">PinInput disabled</code>. Cells
        become non-interactive and visually muted.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">disabled — empty</span>
          <FieldContent size="base" disabled>
            <FieldLabel>PIN</FieldLabel>
            <PinInput length={6} value="" onChange={() => {}} />
          </FieldContent>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">disabled — prefilled</span>
          <FieldContent size="base" disabled>
            <FieldLabel>Verification code</FieldLabel>
            <PinInput length={6} value="123456" onChange={() => {}} />
          </FieldContent>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">disabled via prop (no FieldContent)</span>
          <PinInput length={4} value="9876" onChange={() => {}} disabled />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Via FieldContent context */}
<FieldContent size="base" disabled>
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
</FieldContent>

{/* Via prop */}
<PinInput length={6} value={pin} onChange={setPin} disabled />`}</code>
      </pre>
    </div>
  ),
}
