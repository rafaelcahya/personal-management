import { Checkbox } from '@/components/ui/checkbox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop to
        show validation feedback via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code>.
      </p>

      <div className="w-80">
        <FieldContent size="base" error="You must accept the terms to continue.">
          <div className="flex items-center gap-3">
            <Checkbox id="err-terms" aria-invalid />
            <FieldLabel htmlFor="err-terms" className="cursor-pointer select-none font-medium">
              I agree to the terms and conditions
            </FieldLabel>
          </div>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" error={errors.terms?.message}>
  <div className="flex items-center gap-3">
    <Checkbox id="terms" aria-invalid={!!errors.terms} />
    <FieldLabel htmlFor="terms" className="cursor-pointer">
      I agree to the terms and conditions
    </FieldLabel>
  </div>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
