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

function FieldDemo() {
  const [date, setDate] = useState(null)
  return (
    <FieldContent size="base" error="Trade date is required.">
      <FieldLabel required>Trade date</FieldLabel>
      <DatePicker value={date} onChange={setDate} />
      <FieldError />
    </FieldContent>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="error"</code> for
        explicit styling, or let{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> inject the
        error variant automatically when its{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop is set. Pair
        with <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to
        display the message below the trigger.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">variant="error" (explicit)</span>
          <DatePicker variant="error" placeholder="Pick a date" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent error prop</span>
          <FieldDemo />
        </div>
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Explicit variant */}
<DatePicker variant="error" value={date} onChange={setDate} />

{/* Via FieldContent — error variant + message injected automatically */}
<FieldContent size="base" error="Trade date is required.">
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
