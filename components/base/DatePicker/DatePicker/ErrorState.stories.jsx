import { useState } from 'react'
import DatePicker from './DatePicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldError from '../../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/DatePicker/Error State',
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
  const [date, setDate] = useState(null)
  return (
    <FieldContent error="Trade date is required.">
      <FieldLabel required>Trade date</FieldLabel>
      <DatePicker value={date} onChange={setDate} />
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

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">variant="error" (explicit)</span>
          <DatePicker variant="error" placeholder="Pick a date" />
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
                title: 'Pass error to FieldContent — the picker inherits it automatically',
                body: 'FieldContent broadcasts the error to all child field components via context. The trigger turns red and FieldError renders the message below.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair error state with a FieldError message',
                body: 'The red trigger signals something is wrong, but without a message the user cannot know what to fix. Always include a FieldError explaining the constraint.',
              },
              {
                title: 'Clear the error as soon as the user picks a valid date',
                body: 'With react-hook-form Controller, validation re-runs on change. Displaying an error after the user has selected a valid date creates a frustrating UX.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Explicit variant */}
<DatePicker variant="error" value={date} onChange={setDate} />

{/* Via FieldContent — error variant + message injected automatically */}
<FieldContent error="Trade date is required.">
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
