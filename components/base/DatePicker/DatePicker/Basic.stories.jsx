import { useState } from 'react'
import { ClockIcon, ChevronDownIcon } from 'lucide-react'
import DatePicker from './DatePicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/DatePicker/Basic',
}

export default meta

function Demo(props) {
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} {...props} />
}

function FieldDemo() {
  const [date, setDate] = useState(null)
  return (
    <FieldContent size="base">
      <FieldLabel required>Trade date</FieldLabel>
      <DatePicker value={date} onChange={setDate} />
      <FieldDescription>When did you execute this trade?</FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Date | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code>. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> for
        accessible labels and descriptions.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-4 w-80">
        <Demo />
        <FieldDemo />
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [date, setDate] = useState(null)

{/* Standalone */}
<DatePicker value={date} onChange={setDate} />

{/* With FieldContent */}
<FieldContent size="base">
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldDescription>When did you execute this trade?</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const DisplayFormat = {
  name: 'Display Format',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Control how the selected date appears using any{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">date-fns</code> format string
        via the <code className="font-mono bg-gray-100 px-1 rounded text-xs">displayFormat</code>{' '}
        prop. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"d MMM yyyy"</code>.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-4 w-80">
        {[
          { fmt: 'd MMM yyyy', label: 'd MMM yyyy  →  "15 Jun 2025"' },
          { fmt: 'PPP', label: 'PPP  →  "June 15th, 2025"' },
          { fmt: 'yyyy-MM-dd', label: 'yyyy-MM-dd  →  "2025-06-15"' },
          { fmt: 'dd/MM/yyyy', label: 'dd/MM/yyyy  →  "15/06/2025"' },
        ].map(({ fmt, label }) => (
          <div key={fmt} className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">{label}</span>
            <Demo displayFormat={fmt} />
          </div>
        ))}
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Default — "15 Jun 2025" */}
<DatePicker displayFormat="d MMM yyyy" value={date} onChange={setDate} />

{/* Long form — "June 15th, 2025" */}
<DatePicker displayFormat="PPP" value={date} onChange={setDate} />

{/* ISO — "2025-06-15" */}
<DatePicker displayFormat="yyyy-MM-dd" value={date} onChange={setDate} />`}</code>
      </pre>
    </div>
  ),
}

function IconDemo({ icon, label }) {
  const [date, setDate] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono text-violet-700">{label}</span>
      <DatePicker value={date} onChange={setDate} icon={icon} />
    </div>
  )
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Replace the default calendar icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code> to remove the icon
        entirely.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-4 w-80">
        <IconDemo label="default" icon={undefined} />
        <IconDemo
          label="icon=<ClockIcon />"
          icon={<ClockIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo
          label="icon=<ChevronDownIcon />"
          icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo label="icon={null} — no icon" icon={null} />
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ClockIcon } from 'lucide-react'

{/* Custom icon */}
<DatePicker
  icon={<ClockIcon className="size-4 shrink-0 opacity-50" />}
  value={date}
  onChange={setDate}
/>

{/* No icon */}
<DatePicker icon={null} value={date} onChange={setDate} />`}</code>
      </pre>
    </div>
  ),
}

export const DateConstraints = {
  name: 'Date Constraints',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">fromDate</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">toDate</code> to restrict the
        selectable range. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabledDates</code> for custom
        rules such as disabling weekends or specific dates.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            fromDate / toDate — 2025 only
          </span>
          <Demo
            fromDate={new Date(2025, 0, 1)}
            toDate={new Date(2025, 11, 31)}
            placeholder="2025 only"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            disabledDates — weekdays only
          </span>
          <Demo
            disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
            placeholder="Weekdays only"
          />
        </div>
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Restrict to a year */}
<DatePicker
  fromDate={new Date(2025, 0, 1)}
  toDate={new Date(2025, 11, 31)}
  value={date}
  onChange={setDate}
/>

{/* Disable weekends */}
<DatePicker
  disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
  value={date}
  onChange={setDate}
/>`}</code>
      </pre>
    </div>
  ),
}
