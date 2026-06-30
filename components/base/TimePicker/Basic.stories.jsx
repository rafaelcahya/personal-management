import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import TimePicker from './TimePicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/TimePicker/Basic',
}

export default meta

function Demo(props) {
  const [time, setTime] = useState(null)
  return <TimePicker value={time} onChange={setTime} {...props} />
}

function FieldDemo() {
  const [time, setTime] = useState(null)
  return (
    <FieldContent size="base">
      <FieldLabel required>Start time</FieldLabel>
      <TimePicker value={time} onChange={setTime} />
      <FieldDescription>When does the session start?</FieldDescription>
    </FieldContent>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">string | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code>. Default output
        is <code className="font-mono bg-gray-100 px-1 rounded text-xs">"HH:mm:ss"</code>. The
        popover opens scrollable columns and auto-scrolls to the selected value.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Demo />
        <FieldDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [time, setTime] = useState(null)  // e.g. "14:30:45"

{/* Standalone */}
<TimePicker value={time} onChange={setTime} />

{/* With FieldContent */}
<FieldContent size="base">
  <FieldLabel required>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
  <FieldDescription>When does the session start?</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Fields = {
  name: 'Fields',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">fields</code> prop controls
        which columns are shown and what format{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code> returns.
        Columns render in the order the array is provided.
      </p>

      <div className="flex flex-col gap-4 w-80">
        {[
          {
            fields: ['hour', 'minute', 'second'],
            label: "['hour', 'minute', 'second']  →  HH:mm:ss  (default)",
          },
          { fields: ['hour', 'minute'], label: "['hour', 'minute']  →  HH:mm" },
          { fields: ['hour'], label: "['hour']  →  HH" },
          { fields: ['minute'], label: "['minute']  →  mm" },
          { fields: ['second'], label: "['second']  →  ss" },
          { fields: ['minute', 'second'], label: "['minute', 'second']  →  mm:ss" },
        ].map(({ fields, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">{label}</span>
            <Demo fields={fields} />
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Default — HH:mm:ss */}
<TimePicker value={time} onChange={setTime} />

{/* Hour + Minute — HH:mm */}
<TimePicker fields={['hour', 'minute']} value={time} onChange={setTime} />

{/* Minute only — mm */}
<TimePicker fields={['minute']} value={time} onChange={setTime} />`}</code>
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Input</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DatePicker</code>. Inherits
        size from <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>{' '}
        when not set explicitly.
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
        <code>{`<TimePicker size="xs"   value={time} onChange={setTime} />
<TimePicker size="sm"   value={time} onChange={setTime} />
<TimePicker size="base" value={time} onChange={setTime} />  {/* default */}
<TimePicker size="md"   value={time} onChange={setTime} />
<TimePicker size="lg"   value={time} onChange={setTime} />`}</code>
      </pre>
    </div>
  ),
}

export const Step = {
  name: 'Step',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">hourStep</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">minuteStep</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">secondStep</code> to control
        the interval between options in each column. Useful for scheduling and calendar inputs.
      </p>

      <div className="flex flex-col gap-4 w-80">
        {[
          { props: { minuteStep: 15 }, label: 'minuteStep=15  →  00, 15, 30, 45' },
          { props: { minuteStep: 30 }, label: 'minuteStep=30  →  00, 30' },
          { props: { hourStep: 2 }, label: 'hourStep=2  →  00, 02, 04 …' },
          {
            props: { fields: ['hour', 'minute'], minuteStep: 15 },
            label: "fields=['hour','minute'] minuteStep=15",
          },
          { props: { minuteStep: 15, secondStep: 30 }, label: 'minuteStep=15 secondStep=30' },
        ].map(({ props, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">{label}</span>
            <Demo {...props} />
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Every 15 minutes */}
<TimePicker minuteStep={15} value={time} onChange={setTime} />

{/* Every 2 hours */}
<TimePicker hourStep={2} value={time} onChange={setTime} />

{/* Combine with fields */}
<TimePicker
  fields={['hour', 'minute']}
  minuteStep={15}
  value={time}
  onChange={setTime}
/>`}</code>
      </pre>
    </div>
  ),
}

function IconDemo({ icon, label }) {
  const [time, setTime] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono text-violet-700">{label}</span>
      <TimePicker value={time} onChange={setTime} icon={icon} />
    </div>
  )
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Replace the default clock icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code> to remove the icon
        entirely.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <IconDemo label="default (ClockIcon)" icon={undefined} />
        <IconDemo
          label="icon=<ChevronDownIcon />"
          icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo label="icon={null} — no icon" icon={null} />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ChevronDownIcon } from 'lucide-react'

<TimePicker
  icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
  value={time}
  onChange={setTime}
/>

<TimePicker icon={null} value={time} onChange={setTime} />`}</code>
      </pre>
    </div>
  ),
}
