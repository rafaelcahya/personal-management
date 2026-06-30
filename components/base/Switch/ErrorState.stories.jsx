import { Switch } from '@/components/ui/switch'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop.
        Switch does not apply a visual error on its own — rely on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> for the
        message.
      </p>

      <div className="flex flex-col gap-4 w-80">
        {['pill', 'track'].map((theme) => (
          <div key={theme} className="flex flex-col gap-2">
            <p className="text-xs font-mono text-violet-700">theme="{theme}"</p>
            <FieldContent size="base" error="You must accept the data processing agreement.">
              <div className="flex items-center justify-between gap-4">
                <FieldLabel
                  htmlFor={`err-${theme}`}
                  required
                  className="cursor-pointer select-none"
                >
                  Data processing agreement
                </FieldLabel>
                <Switch id={`err-${theme}`} theme={theme} className="shrink-0" />
              </div>
              <FieldError />
            </FieldContent>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" error={errors.agreement?.message}>
  <div className="flex items-center justify-between gap-4">
    <FieldLabel htmlFor="agreement" required className="cursor-pointer">
      Data processing agreement
    </FieldLabel>
    <Switch id="agreement" theme="track" className="shrink-0" />
  </div>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
