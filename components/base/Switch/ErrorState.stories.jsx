import { Switch } from './Switch'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Error State',
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
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop.
        Switch does not apply a visual error style on its own — rely on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> for the
        message.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">error via FieldContent — pill</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent error="You must accept the data processing agreement.">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="err-pill" required className="cursor-pointer select-none">
                Data processing agreement
              </FieldLabel>
              <Switch id="err-pill" className="shrink-0" />
            </div>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">error via FieldContent — track</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent error="You must accept the data processing agreement.">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="err-track" required className="cursor-pointer select-none">
                Data processing agreement
              </FieldLabel>
              <Switch id="err-track" theme="track" className="shrink-0" />
            </div>
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
                title:
                  'Use the error state only when a Switch is part of a form with a submit button',
                body: 'The most common case is a mandatory agreement toggle (e.g. "Accept data processing") that must be turned on before the form can be submitted.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show error styling on a Switch that controls an instant setting",
                body: 'If the Switch applies its change immediately (dark mode, notifications), there is no submit event to fail validation on. Error state only makes sense when the Switch is inside a form.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Switch has no built-in error indicator — rely entirely on FieldError for the message',
                body: 'Unlike Select or Input which change their border color on error, Switch does not visually indicate error state. Always pair with FieldContent + FieldError so the user knows what went wrong.',
              },
              {
                title: 'Show the error only after the user has attempted to submit',
                body: 'Validate on form submit — not on mount. Showing an error before the user has had a chance to interact is confusing and counterproductive.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent error={errors.agreement?.message}>
  <div className="flex items-center justify-between gap-4">
    <FieldLabel htmlFor="agreement" required className="cursor-pointer select-none">
      Data processing agreement
    </FieldLabel>
    <Switch id="agreement" className="shrink-0" />
  </div>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
