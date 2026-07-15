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
  const [month, setMonth] = useState(null)
  return <MonthPicker value={month} onChange={setMonth} {...props} />
}

function FieldDemo() {
  const [month, setMonth] = useState(null)
  return (
    <FieldContent error={undefined}>
      <FieldLabel required>Birth month</FieldLabel>
      <MonthPicker value={month} onChange={setMonth} />
      <FieldDescription className="text-xs text-slate-400">
        The month you were born in.
      </FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded">value</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code>. Default{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">valueFormat</code> is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">"number"</code> — onChange returns
        1–12. Pair with <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> for
        accessible labels and descriptions.
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
                title: 'Use MonthPicker when the user needs to select only a month',
                body: 'Birth month, report month, subscription month — any field where only the month matters, not a specific date.',
              },
              {
                title: 'Choose valueFormat based on how you store the month',
                body: 'Use "number" (default) when storing 1–12 in your database. Use "name" when your API expects "January"–"December" strings.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'MonthPicker calls onChange(number | string), not a native input event. register will not capture the value. Always wrap with Controller.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [month, setMonth] = useState(null)  // month = 1–12 or null

{/* Standalone */}
<MonthPicker value={month} onChange={setMonth} />

{/* With FieldContent */}
<FieldContent>
  <FieldLabel required>Birth month</FieldLabel>
  <MonthPicker value={month} onChange={setMonth} />
  <FieldDescription className="text-xs text-slate-400">The month you were born in.</FieldDescription>
</FieldContent>`}</code>
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">valueFormat</code> controls what{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code> returns and what{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">value</code> expects. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">"number"</code> for numeric month
        storage (1–12), or <code className="font-mono bg-gray-100 px-1 rounded">"name"</code> for
        full month name strings.
      </span>

      <div className="flex flex-col gap-6">
        <ValueFormatDemo valueFormat="number" label='valueFormat="number" (default)' />
        <ValueFormatDemo valueFormat="name" label='valueFormat="name"' />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Replace the default calendar icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code> to remove the icon
        entirely.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <IconDemo label="default (CalendarIcon)" icon={undefined} />
        <IconDemo
          label="icon=<ChevronDownIcon />"
          icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo label="icon={null} — no icon" icon={null} />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
