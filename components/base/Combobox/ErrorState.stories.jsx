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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">variant="error"</code> for
        explicit error styling, or wrap in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop to inject the error
        variant automatically. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldError</code> to display the
        message below the trigger.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">variant="error" (explicit)</span>
          <Combobox variant="error" options={FRUITS} placeholder="Select..." />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent error prop</span>
          <FieldDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'How to trigger error state',
            cards: [
              {
                title: 'Pass error to FieldContent — the trigger border inherits it automatically',
                body: 'FieldContent broadcasts the error via context. The trigger renders with a red border and FieldError shows the message below — no manual variant prop needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always include FieldError — the red border alone is not enough',
                body: 'The red trigger signals something is wrong, but users need to know what to fix. Always pair with FieldError and a message that says what is required.',
              },
              {
                title: 'Use Controller from react-hook-form to wire validation',
                body: 'Controller feeds field.value and field.onChange into Combobox. Validation rules (e.g. required) fire on form submit and auto-populate FieldContent error via errors.field?.message.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Explicit variant */}
<Combobox variant="error" value={val} onChange={setVal} options={options} />

{/* Via FieldContent — error variant + message injected automatically */}
<FieldContent size="base" error={errors.fruit?.message}>
  <FieldLabel required>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
