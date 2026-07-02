import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Pin Input/Error State' }
export default meta

function ValidationDemo() {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const error = submitted && value.length < 6 ? 'Please enter all 6 digits.' : undefined
  const wrongCode = submitted && value === '000000' ? 'Invalid code. Please try again.' : undefined

  return (
    <div className="flex flex-col gap-3">
      <FieldContent size="base" error={error ?? wrongCode}>
        <FieldLabel>Verification code</FieldLabel>
        <PinInput length={6} value={value} onChange={setValue} />
        <FieldError />
      </FieldContent>
      <button
        onClick={() => setSubmitted(true)}
        className="px-4 py-2 text-sm font-medium bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors w-fit"
      >
        Verify
      </button>
    </div>
  )
}

function RHFErrorDemo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { pin: '' } })

  return (
    <form onSubmit={handleSubmit(() => alert('Valid!'))}>
      <div className="flex flex-col gap-3">
        <FieldContent size="base" error={errors.pin?.message}>
          <FieldLabel>PIN</FieldLabel>
          <Controller
            name="pin"
            control={control}
            rules={{
              required: 'PIN is required.',
              minLength: { value: 6, message: 'PIN must be 6 digits.' },
            }}
            render={({ field }) => (
              <PinInput
                length={6}
                value={field.value ?? ''}
                onChange={field.onChange}
                ref={field.ref}
              />
            )}
          />
          <FieldError />
        </FieldContent>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors w-fit"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — cells
        switch to the error variant automatically and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> shows the
        message below.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">static error</span>
          <FieldContent size="base" error="Invalid verification code.">
            <FieldLabel>Verification code</FieldLabel>
            <PinInput length={6} value="123456" onChange={() => {}} />
            <FieldError />
          </FieldContent>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            validation on submit — try clicking Verify with empty or "000000"
          </span>
          <ValidationDemo />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            react-hook-form — click Submit with empty or partial PIN
          </span>
          <RHFErrorDemo />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Static error */}
<FieldContent size="base" error="Invalid code.">
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
  <FieldError />
</FieldContent>

{/* react-hook-form */}
<FieldContent size="base" error={errors.pin?.message}>
  <FieldLabel>PIN</FieldLabel>
  <Controller
    name="pin"
    control={control}
    rules={{ required: 'Required.', minLength: { value: 6, message: 'Must be 6 digits.' } }}
    render={({ field }) => (
      <PinInput length={6} value={field.value ?? ''} onChange={field.onChange} ref={field.ref} />
    )}
  />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
