import { useState } from 'react'
import RatingInput from './RatingInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput/Error State',
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

function StarFieldDemo() {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error="Please provide a rating.">
      <FieldLabel required>Run effort (RPE)</FieldLabel>
      <RatingInput value={val} onChange={setVal} />
      <FieldError />
    </FieldContent>
  )
}

function NumberFieldDemo() {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error="Please select a confidence level.">
      <FieldLabel required>Trade confidence</FieldLabel>
      <RatingInput style="number" max={10} value={val} onChange={setVal} />
      <FieldError />
    </FieldContent>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop to show validation
        feedback. Pair with <code className="font-mono bg-gray-100 px-1 rounded">FieldError</code>{' '}
        to display the message below the rating.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">star style + error</span>
          <StarFieldDemo />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">number style + error</span>
          <NumberFieldDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'How to trigger error state',
            cards: [
              {
                title: 'Pass error to FieldContent — FieldError renders the message below',
                body: 'RatingInput does not have a built-in error variant. Error feedback is handled entirely by FieldContent + FieldError. Pass the error string to FieldContent and include FieldError as a sibling.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Validate that value !== null — not value > 0',
                body: 'An empty rating returns null. In react-hook-form, use validate: v => v !== null to catch the unrated state. Checking v > 0 also works but null > 0 is false anyway — be explicit for clarity.',
              },
              {
                title: 'Use Controller from react-hook-form to wire validation',
                body: 'Controller feeds field.value and field.onChange into RatingInput. Validation fires on form submit and auto-populates FieldContent error via errors.fieldName?.message.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<FieldContent size="base" error={errors.effort?.message}>
  <FieldLabel required>Run effort (RPE)</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
