'use client'
import { useState } from 'react'
import PasswordInput from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Basic' }
export default meta

function StrengthDemo({ meterVariant = 'bars' }) {
  const [value, setValue] = useState('')
  return (
    <FieldContent size="base">
      <PasswordInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to see strength"
        strengthMeter
        meterVariant={meterVariant}
      />
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        All five sizes with show/hide toggle. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">strengthMeter</code> for a live
        strength indicator, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">meterVariant</code> to choose
        the display style.
      </p>

      {/* Sizes */}
      <div className="flex flex-col gap-4 w-72">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <FieldContent key={size} size={size}>
            <FieldLabel>
              Password <span className="text-xs font-mono text-gray-400 ml-1">size="{size}"</span>
            </FieldLabel>
            <PasswordInput placeholder={`size="${size}"`} />
          </FieldContent>
        ))}
      </div>

      {/* Meter variants */}
      <div className="flex gap-8 flex-wrap justify-center">
        <div className="flex flex-col gap-2 w-72">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            meterVariant="bars" (default)
          </p>
          <StrengthDemo meterVariant="bars" />
        </div>
        <div className="flex flex-col gap-2 w-72">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            meterVariant="full"
          </p>
          <StrengthDemo meterVariant="full" />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* bars variant (default) */}
<FieldContent size="base">
  <PasswordInput value={value} onChange={e => setValue(e.target.value)} strengthMeter />
</FieldContent>

{/* full animated bar */}
<FieldContent size="base">
  <PasswordInput value={value} onChange={e => setValue(e.target.value)} strengthMeter meterVariant="full" />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
