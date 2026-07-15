import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Pin Input/Basic',
}

export default meta

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

function Demo({ length = 6 }) {
  const [value, setValue] = useState('')
  return <PinInput length={length} value={value} onChange={setValue} />
}

function FieldDemo() {
  const [value, setValue] = useState('')
  return (
    <FieldContent>
      <FieldLabel required>Verification code</FieldLabel>
      <PinInput length={6} value={value} onChange={setValue} />
      <FieldDescription className="text-xs text-slate-400">
        Enter the 6-digit code sent to your phone.
      </FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded">value</code> (string of
        digits) and <code className="font-mono bg-gray-100 px-1 rounded">onChange</code>. Focus
        auto-advances on entry, Backspace moves back, and pasting a full code fills all cells at
        once.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <Demo />
        <FieldDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use PinInput for fixed-length numeric codes',
                body: 'OTP, SMS verification codes, numeric PINs — any flow where the user enters a known number of digits one cell at a time.',
              },
              {
                title: 'Wrap in FieldContent for form fields',
                body: 'FieldContent provides accessible labels, error state, and size context. Always pair with FieldLabel and FieldError in forms.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'PinInput calls onChange(string), not a native input event. Using register will not capture the value. Always wrap with Controller.',
              },
              {
                title: 'Clear and refocus after a failed attempt',
                body: 'When a verification attempt fails, clear the value and refocus the first cell so users can re-enter without deleting each digit manually.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [pin, setPin] = useState('')

{/* Standalone */}
<PinInput length={6} value={pin} onChange={setPin} />

{/* With FieldContent */}
<FieldContent>
  <FieldLabel required>Verification code</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
  <FieldDescription>Enter the 6-digit code sent to your phone.</FieldDescription>
</FieldContent>

{/* react-hook-form Controller */}
<Controller
  name="pin"
  control={control}
  rules={{ required: true, minLength: 6, maxLength: 6 }}
  render={({ field }) => (
    <PinInput length={6} value={field.value ?? ''} onChange={field.onChange} ref={field.ref} />
  )}
/>`}</code>
      </pre>
    </div>
  ),
}

export const Length = {
  name: 'Length',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">length</code> to match the exact
        digit count users expect — <code className="font-mono bg-gray-100 px-1 rounded">4</code> for
        a PIN, <code className="font-mono bg-gray-100 px-1 rounded">6</code> for a typical OTP. The
        cell count sets the right expectation before they start typing.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">length=4 — PIN</span>
          <Demo length={4} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">length=6 — OTP (default)</span>
          <Demo length={6} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* 4-digit PIN */}
<PinInput length={4} value={pin} onChange={setPin} />

{/* 6-digit OTP (default) */}
<PinInput length={6} value={pin} onChange={setPin} />`}</code>
      </pre>
    </div>
  ),
}
