import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Error State',
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

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop to show validation
        feedback. The trigger border turns red automatically and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldError</code> renders the message
        below.
      </span>

      <div className="w-64 flex flex-col gap-4">
        <FieldContent size="base" error="Please select a brand color.">
          <FieldLabel>Brand color</FieldLabel>
          <ColorPicker defaultValue="#7c3aed" />
          <FieldError />
        </FieldContent>
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
                body: 'Controller feeds field.value and field.onChange into ColorPicker. Validation rules (e.g. required) fire on form submit and auto-populate FieldContent error via errors.brandColor?.message.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<FieldContent size="base" error={errors.color?.message}>
  <FieldLabel>Brand color</FieldLabel>
  <ColorPicker
    value={field.value}
    onChange={field.onChange}
  />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
