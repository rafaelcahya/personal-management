import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Pin Input/Basic' }
export default meta

function ControlledDemo({ length = 6 }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <FieldContent size="base">
        <PinInput length={length} value={value} onChange={setValue} />
      </FieldContent>
      <p className="text-xs text-gray-400">value: "{value}"</p>
    </div>
  )
}

function RHFDemo() {
  const { control, handleSubmit, watch } = useForm({ defaultValues: { pin: '' } })
  const pin = watch('pin')

  return (
    <form onSubmit={handleSubmit((d) => alert(`Submitted: ${d.pin}`))}>
      <div className="flex flex-col gap-3">
        <FieldContent size="base">
          <FieldLabel>Verification code</FieldLabel>
          <Controller
            name="pin"
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 6 }}
            render={({ field }) => (
              <PinInput
                length={6}
                value={field.value ?? ''}
                onChange={field.onChange}
                ref={field.ref}
              />
            )}
          />
          <FieldDescription>Enter the 6-digit code from your authenticator app.</FieldDescription>
        </FieldContent>
        <button
          type="submit"
          disabled={pin.length < 6}
          className="px-4 py-2 text-sm font-medium bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg transition-colors w-fit"
        >
          Verify
        </button>
      </div>
    </form>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Each digit gets its own box. Focus auto-advances on entry, and Backspace moves back. Try
        pasting a full code — all cells fill at once.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">length=6 (default)</span>
        <ControlledDemo length={6} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">length=4</span>
        <ControlledDemo length={4} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">all sizes</span>
        <div className="flex flex-col gap-4">
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <FieldContent size={size}>
                <PinInput length={4} value="" onChange={() => {}} />
              </FieldContent>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">with react-hook-form Controller</span>
        <RHFDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Standalone controlled */}
const [pin, setPin] = useState('')

<FieldContent size="base">
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
</FieldContent>

{/* react-hook-form Controller */}
<Controller
  name="pin"
  control={control}
  rules={{ required: true, minLength: 6 }}
  render={({ field }) => (
    <PinInput length={6} value={field.value ?? ''} onChange={field.onChange} ref={field.ref} />
  )}
/>`}</code>
      </pre>
    </div>
  ),
}
