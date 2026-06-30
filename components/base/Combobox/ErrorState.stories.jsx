import { useState } from 'react'
import Combobox from './Combobox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox/Error State',
}

export default meta

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function FieldDemo() {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error="This field is required.">
      <FieldLabel required>Favourite fruit</FieldLabel>
      <Combobox value={val} onChange={setVal} options={FRUITS} placeholder="Select..." />
      <FieldError />
    </FieldContent>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="error"</code> for
        explicit error styling, or wrap in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> with an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop to inject the
        error variant automatically. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to display
        the message below the trigger.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">variant="error" (explicit)</span>
          <Combobox variant="error" options={FRUITS} placeholder="Select..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent error prop</span>
          <FieldDemo />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Explicit variant */}
<Combobox variant="error" value={val} onChange={setVal} options={options} />

{/* Via FieldContent — error variant + message injected automatically */}
<FieldContent size="base" error="This field is required.">
  <FieldLabel required>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
