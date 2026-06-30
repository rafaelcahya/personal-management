import { useState } from 'react'
import { ClockIcon, ChevronDownIcon } from 'lucide-react'
import TimePicker from './TimePicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/TimePicker',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

// ─── Stateful demo helpers ────────────────────────────────────────────────────

function Demo(props) {
  const [time, setTime] = useState(null)
  return <TimePicker value={time} onChange={setTime} {...props} />
}

function FieldDemo({ error, description, label = 'Start time', required = false, ...props }) {
  const [time, setTime] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <TimePicker value={time} onChange={setTime} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError />}
    </FieldContent>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">TimePicker</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A popover time picker with scrollable columns for hour, minute, and second. Uses 24-hour
          format. Output is a string whose format follows the active{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">fields</code> — e.g.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">"14:30:45"</code> or{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">"30"</code> for minute-only.
          Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Demo />
          <FieldDemo label="Start time" required description="When does the session start?" />
          <FieldDemo label="End time" error="End time is required." />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="TimePicker renders a trigger button and a popover with one scroll column per active field. Selecting a value in any column immediately fires onChange."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex gap-14 mb-2">
            {/* Closed */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Closed
              </span>
              <div className="relative pt-6 pb-5 px-5 border-2 border-dashed border-violet-400 rounded-xl w-72">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  FieldContent <span className="text-slate-400 font-normal">(optional)</span>
                </span>

                <div className="relative px-3 pt-5 pb-2 border border-dashed border-green-300 rounded mb-5">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldLabel
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Start time</span>
                </div>

                <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-blue-300 rounded">
                  <span className="text-xs font-mono text-blue-500">TimePicker</span>
                  <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                    <span className="text-xs font-mono text-slate-400">Trigger</span>
                    <div className="flex items-center justify-between gap-4 h-8 px-3 rounded border border-slate-200 bg-white">
                      <div className="border border-dashed border-slate-300 rounded px-2 py-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">Placeholder</span>
                      </div>
                      <div className="border border-dashed border-slate-300 rounded px-2 py-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">Icon</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative px-3 pt-5 pb-2 border border-dashed border-green-300 rounded mt-5">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldError
                  </span>
                  <span className="text-xs text-slate-400 font-mono">This field is required.</span>
                </div>
              </div>
            </div>

            {/* Open */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Open — default (H:MM:SS)
              </span>
              <div className="flex flex-col gap-3 p-5 border-2 border-dashed border-blue-300 rounded-xl w-72">
                <span className="text-xs font-mono text-blue-500">TimePicker</span>

                <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">Trigger</span>
                  <div className="flex items-center justify-between gap-4 h-8 px-3 rounded border border-violet-400 bg-white">
                    <span className="text-xs text-slate-700 font-mono">14:30:45</span>
                    <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                      <path
                        d="M12 7v5l3 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">Popover</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-2">
                    <div className="flex divide-x divide-slate-100">
                      {[
                        { label: 'HOUR', items: [12, 13, '14', 15, 16], sel: '14' },
                        { label: 'MIN', items: [28, 29, '30', 31, 32], sel: '30' },
                        { label: 'SEC', items: [43, 44, '45', 46, 47], sel: '45' },
                      ].map(({ label, items, sel }) => (
                        <div key={label} className="flex flex-col items-center px-2">
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide pb-1">
                            {label}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            {items.map((item) => (
                              <div
                                key={item}
                                className={`text-[10px] text-center rounded px-2 py-0.5 font-mono ${
                                  String(item) === sel
                                    ? 'bg-violet-600 text-white font-medium'
                                    : 'text-slate-500'
                                }`}
                              >
                                {String(item).padStart(2, '0')}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border border-dashed border-slate-300 rounded px-2 py-1 mt-2">
                      <span className="text-[9px] font-mono text-slate-400">
                        TimeScrollColumn × active fields
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Element', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Trigger',
                  '<button>',
                  'Opens and closes the popover. Shows the current time string or placeholder.',
                ],
                ['Placeholder', '<span>', 'Text shown when no time is selected.'],
                [
                  'Icon',
                  'ReactNode',
                  'Right-side icon. Defaults to ClockIcon. Customizable via the icon prop.',
                ],
                [
                  'Popover',
                  '<div>',
                  'Container for the scroll columns. Rendered via Radix UI Popover.',
                ],
                [
                  'TimeScrollColumn',
                  '<div>',
                  'One column per active field. Scrollable list of options. Auto-scrolls to the selected value on open.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`import TimePicker from '@/components/base/TimePicker/TimePicker'

<TimePicker
  value={time}
  onChange={setTime}
  placeholder="Pick a time"
/>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Controlled via value (string | null) and onChange. Default fields is ['hour', 'minute', 'second'] — output is HH:mm:ss."
      >
        <Preview>
          <Demo />
          <Demo placeholder="Select time..." />
        </Preview>
        <Code>{`const [time, setTime] = useState(null)  // e.g. "14:30:45"

<TimePicker value={time} onChange={setTime} />`}</Code>
      </Section>

      {/* Fields */}
      <Section
        title="Fields"
        description="Use the fields prop to control which columns appear and what the output format is. Fields render in the order provided."
      >
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {[
            {
              fields: ['hour', 'minute', 'second'],
              label: "default — ['hour', 'minute', 'second']",
            },
            { fields: ['hour', 'minute'], label: "['hour', 'minute']  →  HH:mm" },
            { fields: ['hour'], label: "['hour']  →  HH" },
            { fields: ['minute'], label: "['minute']  →  mm" },
            { fields: ['second'], label: "['second']  →  ss" },
          ].map(({ fields, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-violet-700">{label}</span>
              <Demo fields={fields} />
            </div>
          ))}
        </div>
        <Code>{`{/* Default — HH:mm:ss */}
<TimePicker value={time} onChange={setTime} />

{/* Hour + Minute only — HH:mm */}
<TimePicker fields={['hour', 'minute']} value={time} onChange={setTime} />

{/* Hour only — HH */}
<TimePicker fields={['hour']} value={time} onChange={setTime} />

{/* Minute only — mm */}
<TimePicker fields={['minute']} value={time} onChange={setTime} />

{/* Second only — ss */}
<TimePicker fields={['second']} value={time} onChange={setTime} />`}</Code>
      </Section>

      {/* Sizes */}
      <Section
        title="Sizes"
        description="Five sizes following the same scale as Input and DatePicker."
      >
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <Demo size={size} />
            </div>
          ))}
        </div>
        <Code>{`<TimePicker size="xs"   value={time} onChange={setTime} />
<TimePicker size="sm"   value={time} onChange={setTime} />
<TimePicker size="base" value={time} onChange={setTime} />  {/* default */}
<TimePicker size="md"   value={time} onChange={setTime} />
<TimePicker size="lg"   value={time} onChange={setTime} />`}</Code>
      </Section>

      {/* Step */}
      <Section
        title="Step"
        description="Control the interval between options per field using hourStep, minuteStep, and secondStep."
      >
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {[
            { props: { minuteStep: 15 }, label: 'minuteStep=15  →  00 15 30 45' },
            { props: { minuteStep: 30 }, label: 'minuteStep=30  →  00 30' },
            { props: { hourStep: 2 }, label: 'hourStep=2  →  00 02 04 …' },
            { props: { minuteStep: 15, secondStep: 30 }, label: 'minuteStep=15 secondStep=30' },
          ].map(({ props, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-violet-700">{label}</span>
              <Demo {...props} />
            </div>
          ))}
        </div>
        <Code>{`{/* Every 15 minutes */}
<TimePicker minuteStep={15} value={time} onChange={setTime} />

{/* Every 2 hours, every 30 minutes */}
<TimePicker hourStep={2} minuteStep={30} value={time} onChange={setTime} />

{/* Combine with fields */}
<TimePicker
  fields={['hour', 'minute']}
  minuteStep={15}
  value={time}
  onChange={setTime}
/>`}</Code>
      </Section>

      {/* Icon */}
      <Section
        title="Icon"
        description="Override the default ClockIcon or remove it via the icon prop."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">default (ClockIcon)</span>
            <Demo icon={undefined} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">
              icon=&lt;ChevronDownIcon /&gt;
            </span>
            <Demo icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">icon={'{null}'} — no icon</span>
            <Demo icon={null} />
          </div>
        </Preview>
        <Code>{`import { ChevronDownIcon } from 'lucide-react'

<TimePicker
  icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
  value={time}
  onChange={setTime}
/>

<TimePicker icon={null} value={time} onChange={setTime} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled to prevent interaction. Works standalone and via FieldContent."
      >
        <Preview>
          <TimePicker disabled placeholder="Pick a time" />
          <TimePicker disabled value="14:30:45" />
          <FieldContent size="base" disabled>
            <FieldLabel>Start time</FieldLabel>
            <TimePicker value="14:30:45" />
          </FieldContent>
        </Preview>
        <Code>{`<TimePicker disabled placeholder="Pick a time" />
<TimePicker disabled value="14:30:45" />

{/* Via FieldContent */}
<FieldContent size="base" disabled>
  <FieldLabel>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
</FieldContent>`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop. TimePicker reads hasError from context and applies error styling automatically."
      >
        <Preview>
          <TimePicker variant="error" placeholder="Pick a time" />
          <FieldDemo label="Start time" required error="Start time is required." />
        </Preview>
        <Code>{`{/* Explicit variant */}
<TimePicker variant="error" value={time} onChange={setTime} />

{/* Via FieldContent */}
<FieldContent size="base" error="Start time is required.">
  <FieldLabel required>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for fully accessible form fields."
      >
        <Preview>
          <FieldDemo label="Start time" required description="When does the session start?" />
          <FieldDemo
            label="Break duration"
            fields={['hour', 'minute']}
            description="Leave blank if no break."
          />
        </Preview>
        <Code>{`<FieldContent size="base">
  <FieldLabel required>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
  <FieldDescription>When does the session start?</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — TimePicker's onChange passes a string, not a native event."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="start_time"
  control={control}
  rules={{ required: 'Start time is required.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.start_time?.message}>
      <FieldLabel required>Start time</FieldLabel>
      <TimePicker
        value={field.value ?? null}
        onChange={field.onChange}
      />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'value',
                  'string | null',
                  'null',
                  'Controlled time string. Format depends on fields.',
                ],
                [
                  'onChange',
                  '(value: string) => void',
                  '—',
                  'Fires with the formatted time string on any column change.',
                ],
                [
                  'fields',
                  "('hour' | 'minute' | 'second')[]",
                  "['hour','minute','second']",
                  'Which columns to show. Determines the output string format.',
                ],
                ['hourStep', 'number', '1', 'Interval between hour options.'],
                ['minuteStep', 'number', '1', 'Interval between minute options.'],
                ['secondStep', 'number', '1', 'Interval between second options.'],
                ['placeholder', 'string', '"Pick a time"', 'Text shown when no time is selected.'],
                ['disabled', 'boolean', 'false', 'Prevents interaction and applies opacity.'],
                [
                  'variant',
                  '"default" | "error" | "disabled"',
                  '—',
                  'Override the auto-detected visual variant.',
                ],
                [
                  'size',
                  '"xs" | "sm" | "base" | "md" | "lg"',
                  '"base"',
                  'Trigger height. Inherits from FieldContent if not set.',
                ],
                [
                  'icon',
                  'ReactNode',
                  '<ClockIcon />',
                  'Icon on the right of the trigger. Pass null to remove.',
                ],
                [
                  'align',
                  '"start" | "center" | "end"',
                  '"start"',
                  'Popover alignment relative to the trigger.',
                ],
                ['className', 'string', '—', 'Additional Tailwind classes on the trigger button.'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                    {type}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {def}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  ),
}
