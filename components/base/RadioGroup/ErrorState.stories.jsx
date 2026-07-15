import { RadioGroup, RadioGroupItem } from './RadioGroup'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Error State',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
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

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop and
        add <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-invalid</code> on each{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroupItem</code> to apply
        the red error border.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">error via FieldContent — red border + message</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent error="Please select a payment method.">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Show the error state only after the user has attempted to submit',
                body: 'Validate on form submit — not on mount. Showing red radio items before the user has had a chance to interact is confusing and counterproductive.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show error styling without a FieldError message",
                body: 'A red border alone does not explain what went wrong. aria-invalid + FieldError together provide both the visual cue and the accessible error announcement.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Add aria-invalid on every RadioGroupItem in the group when there is a validation error',
                body: 'FieldContent provides the error message via FieldError, but each RadioGroupItem needs aria-invalid explicitly so screen readers announce the field as invalid when focused.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Write specific, actionable error messages',
                body: '"Please select a payment method" tells the user exactly what to do. "Required" alone does not. Write from the user\'s perspective.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent error={errors.payment?.message}>
  <FieldLabel required>Payment method</FieldLabel>
  <RadioGroup value={field.value} onValueChange={field.onChange}>
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
