import { useState } from 'react'
import TimePicker from './TimePicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/TimePicker/Error State',
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

function FieldDemo() {
  const [time, setTime] = useState(null)
  return (
    <FieldContent size="base" error="Start time is required.">
      <FieldLabel required>Start time</FieldLabel>
      <TimePicker value={time} onChange={setTime} />
      <FieldError />
    </FieldContent>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">variant="error"</code> for
        explicit styling, or let{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> inject the error
        variant automatically when its{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop is set. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldError</code> to display the
        message below the trigger.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">variant="error" (explicit)</span>
          <TimePicker variant="error" placeholder="Pick a time" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent error prop</span>
          <FieldDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'How to trigger error state',
            cards: [
              {
                title: 'Pass error to FieldContent — FieldError renders the message below',
                body: "TimePicker reads hasError from FieldContent context and applies error styling automatically. Pair with FieldError as a sibling to display the message — don't rely on variant='error' alone in forms.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Controller from react-hook-form to wire validation',
                body: 'Controller feeds field.value and field.onChange into TimePicker. Validation fires on form submit and auto-populates FieldContent error via errors.fieldName?.message.',
              },
              {
                title: 'Validate that value !== null for required fields',
                body: 'An empty time returns null. In react-hook-form, use rules={{ required: "Start time is required." }} — the built-in required rule catches null correctly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Explicit variant */}
<TimePicker variant="error" value={time} onChange={setTime} />

{/* Via FieldContent — error variant + message injected automatically */}
<FieldContent size="base" error="Start time is required.">
  <FieldLabel required>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
