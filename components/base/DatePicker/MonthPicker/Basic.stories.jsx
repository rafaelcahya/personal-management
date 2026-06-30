import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import MonthPicker from './MonthPicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/MonthPicker/Basic',
}

export default meta

function Demo(props) {
  const [month, setMonth] = useState(null)
  return <MonthPicker value={month} onChange={setMonth} {...props} />
}

function FieldDemo() {
  const [month, setMonth] = useState(null)
  return (
    <FieldContent size="base">
      <FieldLabel required>Birth month</FieldLabel>
      <MonthPicker value={month} onChange={setMonth} />
      <FieldDescription>The month you were born in.</FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code>. Default{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">valueFormat</code> is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"number"</code> — onChange
        returns 1–12. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> for
        accessible labels and descriptions.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Demo />
        <FieldDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [month, setMonth] = useState(null)  // month = 1–12 or null

{/* Standalone */}
<MonthPicker value={month} onChange={setMonth} />

{/* With FieldContent */}
<FieldContent size="base">
  <FieldLabel required>Birth month</FieldLabel>
  <MonthPicker value={month} onChange={setMonth} />
  <FieldDescription>The month you were born in.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Five sizes following the same scale as{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DatePicker</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Input</code>. Inherits size
        from <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> when
        not set explicitly.
      </p>

      <div className="flex flex-col gap-3 w-80">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <div key={size} className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
            <Demo size={size} />
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<MonthPicker size="xs"   value={month} onChange={setMonth} />
<MonthPicker size="sm"   value={month} onChange={setMonth} />
<MonthPicker size="base" value={month} onChange={setMonth} />  {/* default */}
<MonthPicker size="md"   value={month} onChange={setMonth} />
<MonthPicker size="lg"   value={month} onChange={setMonth} />`}</code>
      </pre>
    </div>
  ),
}

function ValueFormatDemo({ valueFormat, label }) {
  const [month, setMonth] = useState(null)
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-mono text-violet-700">{label}</span>
      <MonthPicker value={month} onChange={setMonth} valueFormat={valueFormat} />
      <span className="text-[10px] font-mono text-gray-400">
        value:{' '}
        <span className="text-gray-700">{month === null ? 'null' : JSON.stringify(month)}</span>
      </span>
    </div>
  )
}

export const ValueFormat = {
  name: 'Value Format',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">valueFormat</code> controls
        what <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code> returns
        and what <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> expects.
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">"number"</code> for numeric
        month storage (1–12), or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"name"</code> for full month
        name strings.
      </p>

      <div className="flex flex-col gap-6 w-80">
        <ValueFormatDemo valueFormat="number" label='valueFormat="number" (default)' />
        <ValueFormatDemo valueFormat="name" label='valueFormat="name"' />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Numeric — value is 1–12 */}
const [month, setMonth] = useState(null)  // e.g. 6
<MonthPicker valueFormat="number" value={month} onChange={setMonth} />

{/* Name string — value is "January"–"December" */}
const [month, setMonth] = useState(null)  // e.g. "June"
<MonthPicker valueFormat="name" value={month} onChange={setMonth} />`}</code>
      </pre>
    </div>
  ),
}

function IconDemo({ icon, label }) {
  const [month, setMonth] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono text-violet-700">{label}</span>
      <MonthPicker value={month} onChange={setMonth} icon={icon} />
    </div>
  )
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Replace the default calendar icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code> to remove the icon
        entirely.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <IconDemo label="default (CalendarIcon)" icon={undefined} />
        <IconDemo
          label="icon=<ChevronDownIcon />"
          icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo label="icon={null} — no icon" icon={null} />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ChevronDownIcon } from 'lucide-react'

{/* Custom icon */}
<MonthPicker
  icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
  value={month}
  onChange={setMonth}
/>

{/* No icon */}
<MonthPicker icon={null} value={month} onChange={setMonth} />`}</code>
      </pre>
    </div>
  ),
}
