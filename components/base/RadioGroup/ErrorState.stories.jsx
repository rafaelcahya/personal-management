import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-invalid</code> to each{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroupItem</code> to apply
        the error border.
      </p>

      <div className="w-80">
        <FieldContent size="base" error="Please select a payment method.">
          <FieldLabel required>Payment method</FieldLabel>
          <RadioGroup>
            {[
              { value: 'card', label: 'Credit / debit card' },
              { value: 'transfer', label: 'Bank transfer' },
              { value: 'wallet', label: 'E-wallet' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`err-${value}`} aria-invalid />
                <label
                  htmlFor={`err-${value}`}
                  className="text-sm font-medium cursor-pointer select-none"
                >
                  {label}
                </label>
              </div>
            ))}
          </RadioGroup>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" error={errors.payment?.message}>
  <FieldLabel required>Payment method</FieldLabel>
  <RadioGroup onValueChange={(v) => setValue('payment', v)}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="card" id="card" aria-invalid={!!errors.payment} />
      <label htmlFor="card" className="text-sm font-medium cursor-pointer select-none">
        Credit / debit card
      </label>
    </div>
  </RadioGroup>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
