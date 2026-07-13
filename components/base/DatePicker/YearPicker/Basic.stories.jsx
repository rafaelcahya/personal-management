import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import YearPicker from './YearPicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/YearPicker/Basic',
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
  const [year, setYear] = useState(null)
  return <YearPicker value={year} onChange={setYear} {...props} />
}

function FieldDemo() {
  const [year, setYear] = useState(null)
  return (
    <FieldContent error={undefined}>
      <FieldLabel required>Birth year</FieldLabel>
      <YearPicker value={year} onChange={setYear} />
      <FieldDescription className="text-xs text-slate-400">
        The year you were born.
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
        <code className="font-mono bg-gray-100 px-1 rounded">number | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code>. The popover opens a
        scrollable year list and auto-scrolls to the selected year (or current year) on open.
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
                title: 'Use YearPicker when the user needs to select only a year',
                body: 'Birth year, fiscal year, graduation year — fields where only the year matters, not a specific month or date.',
              },
              {
                title: 'Constrain the range with fromYear / toYear',
                body: 'Set fromYear and toYear to limit the list to a meaningful range. For birth years, fromYear=1940 toYear=currentYear. For future planning, fromYear=currentYear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'YearPicker calls onChange(number), not a native input event. register will not capture the value. Always wrap with Controller.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [year, setYear] = useState(null)  // e.g. 2025

{/* Standalone */}
<YearPicker value={year} onChange={setYear} />

{/* With FieldContent */}
<FieldContent>
  <FieldLabel required>Birth year</FieldLabel>
  <YearPicker value={year} onChange={setYear} />
  <FieldDescription className="text-xs text-slate-400">The year you were born.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const YearRange = {
  name: 'Year Range',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">fromYear</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">toYear</code> to limit the selectable
        range. Defaults to <code className="font-mono bg-gray-100 px-1 rounded">1970</code> –{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">current year + 20</code>.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            default (1970 – current + 20)
          </span>
          <Demo />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">fromYear=2000 toYear=2030</span>
          <Demo fromYear={2000} toYear={2030} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">birth year (1940 – current)</span>
          <Demo fromYear={1940} toYear={new Date().getFullYear()} placeholder="Select birth year" />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Default range */}
<YearPicker value={year} onChange={setYear} />

{/* Custom range */}
<YearPicker fromYear={2000} toYear={2030} value={year} onChange={setYear} />

{/* Birth year range */}
<YearPicker
  fromYear={1940}
  toYear={new Date().getFullYear()}
  value={year}
  onChange={setYear}
/>`}</code>
      </pre>
    </div>
  ),
}

function IconDemo({ icon, label }) {
  const [year, setYear] = useState(null)
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-mono text-violet-700">{label}</span>
      <YearPicker value={year} onChange={setYear} icon={icon} />
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
<YearPicker
  icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
  value={year}
  onChange={setYear}
/>

{/* No icon */}
<YearPicker icon={null} value={year} onChange={setYear} />`}</code>
      </pre>
    </div>
  ),
}
