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

function FieldDemo() {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error="Please provide a rating.">
      <FieldLabel required>Run effort (RPE)</FieldLabel>
      <RatingInput value={val} onChange={setVal} />
      <FieldError />
    </FieldContent>
  )
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Wrap in <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        with an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> prop to
        show validation errors. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to display
        the message below the rating.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent error prop</span>
          <FieldDemo />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">number style + error</span>
          <FieldContent size="base" error="Please select a confidence level.">
            <FieldLabel required>Trade confidence</FieldLabel>
            <RatingInput style="number" max={10} value={null} onChange={() => {}} />
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" error="Please provide a rating.">
  <FieldLabel required>Run effort (RPE)</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
