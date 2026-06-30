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

function Demo(props) {
  const [year, setYear] = useState(null)
  return <YearPicker value={year} onChange={setYear} {...props} />
}

function FieldDemo() {
  const [year, setYear] = useState(null)
  return (
    <FieldContent size="base">
      <FieldLabel required>Birth year</FieldLabel>
      <YearPicker value={year} onChange={setYear} />
      <FieldDescription>The year you were born.</FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">number | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code>. The popover
        opens a scrollable year list and auto-scrolls to the selected year (or current year) on
        open.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Demo />
        <FieldDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [year, setYear] = useState(null)  // e.g. 2025

{/* Standalone */}
<YearPicker value={year} onChange={setYear} />

{/* With FieldContent */}
<FieldContent size="base">
  <FieldLabel required>Birth year</FieldLabel>
  <YearPicker value={year} onChange={setYear} />
  <FieldDescription>The year you were born.</FieldDescription>
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
        <code>{`<YearPicker size="xs"   value={year} onChange={setYear} />
<YearPicker size="sm"   value={year} onChange={setYear} />
<YearPicker size="base" value={year} onChange={setYear} />  {/* default */}
<YearPicker size="md"   value={year} onChange={setYear} />
<YearPicker size="lg"   value={year} onChange={setYear} />`}</code>
      </pre>
    </div>
  ),
}

export const YearRange = {
  name: 'Year Range',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">fromYear</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">toYear</code> to limit the
        selectable range. Defaults to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">1970</code> –{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">current year + 20</code>.
      </p>

      <div className="flex flex-col gap-4 w-80">
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
