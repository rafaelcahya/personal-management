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

function Demo(props) {
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} {...props} />
}

function FieldDemo() {
  const [date, setDate] = useState(null)
  return (
    <FieldContent error={undefined}>
      <FieldLabel required>Trade date</FieldLabel>
      <DatePicker value={date} onChange={setDate} />
      <FieldDescription className="text-xs text-slate-400">
        When did you execute this trade?
      </FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded">value</code> (
        <code className="font-mono bg-gray-100 px-1 rounded">Date | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code>. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> for accessible
        labels and descriptions.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <Demo />
        <FieldDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use DatePicker when the user needs to pick a single calendar date',
                body: 'Trade dates, race dates, event dates — any case where the user needs a visual calendar, not a raw text input.',
              },
              {
                title: 'Wrap in FieldContent for form fields',
                body: 'FieldContent provides the accessible label, description, and error state. Standalone DatePicker is fine for filters; form fields should always use the full FieldContent composition.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'DatePicker calls onChange(Date | null), not a native input event. Using register will not capture the value. Always use Controller.',
              },
              {
                title: 'Pass a Date object — not a string',
                body: 'value must be a Date or null. API date strings must be converted first with new Date(str) before being passed as value.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [date, setDate] = useState(null)

{/* Standalone */}
<DatePicker value={date} onChange={setDate} />

{/* With FieldContent */}
<FieldContent>
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldDescription className="text-xs text-slate-400">When did you execute this trade?</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const DisplayFormat = {
  name: 'Display Format',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Control how the selected date appears using any{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">date-fns</code> format string via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">displayFormat</code> prop. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">"d MMM yyyy"</code>.
      </span>

      <div className="w-80 flex flex-col gap-4">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Replace the default calendar icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code> to remove the icon
        entirely.
      </span>

      <div className="w-80 flex flex-col gap-4">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">fromDate</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">toDate</code> to restrict the
        selectable range. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">disabledDates</code> for custom rules
        such as disabling weekends or specific dates.
      </span>

      <div className="w-80 flex flex-col gap-4">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
