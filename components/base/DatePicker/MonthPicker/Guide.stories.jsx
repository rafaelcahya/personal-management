import { useState } from 'react'
import MonthPicker from './MonthPicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'
import FieldError from '../../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/MonthPicker',
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

function MonthDemo(props) {
  const [month, setMonth] = useState(null)
  return <MonthPicker value={month} onChange={setMonth} {...props} />
}

function MonthFieldDemo({ error, description, label = 'Birth month', required = false, ...props }) {
  const [month, setMonth] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <MonthPicker value={month} onChange={setMonth} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError />}
    </FieldContent>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const MonthPickerDocs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">MonthPicker</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A popover month picker — outputs a month number (1–12) or a month name string depending on{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">valueFormat</code>. Pairs
          with <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <MonthDemo />
          <MonthFieldDemo label="Birth month" required description="The month you were born in." />
          <MonthFieldDemo label="Report month" error="Month is required." />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="MonthPicker renders a trigger button and a popover with a 3×4 month grid. Pair with FieldContent for accessible labeling and error state."
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
                  <span className="text-xs text-slate-400 font-mono">Birth month</span>
                </div>

                <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-blue-300 rounded">
                  <span className="text-xs font-mono text-blue-500">MonthPicker</span>
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
                Open
              </span>
              <div className="flex flex-col gap-3 p-5 border-2 border-dashed border-blue-300 rounded-xl w-64">
                <span className="text-xs font-mono text-blue-500">MonthPicker</span>

                <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">Trigger</span>
                  <div className="flex items-center justify-between gap-4 h-8 px-3 rounded border border-violet-400 bg-white">
                    <span className="text-xs text-slate-700 font-mono">June</span>
                    <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 16 16">
                      <rect
                        x="2"
                        y="3"
                        width="12"
                        height="11"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 1v4M11 1v4M2 7h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">MonthGrid</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                      ].map((m) => (
                        <span
                          key={m}
                          className={`text-[10px] text-center rounded py-1.5 ${m === 'Jun' ? 'bg-violet-600 text-white' : 'text-slate-600'}`}
                        >
                          {m}
                        </span>
                      ))}
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
                  'Opens and closes the popover. Displays the selected month name or placeholder.',
                ],
                [
                  'Placeholder',
                  '<span>',
                  'Text shown inside the trigger when no month is selected.',
                ],
                [
                  'Icon',
                  'ReactNode',
                  'Right-side icon of the trigger. Defaults to CalendarIcon. Customizable via the icon prop.',
                ],
                [
                  'MonthGrid',
                  '<div>',
                  '3×4 grid of 12 month buttons. Selecting a month closes the popover and fires onChange.',
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

        <Code>{`import MonthPicker from '@/components/base/DatePicker/MonthPicker/MonthPicker'

<MonthPicker
  value={month}
  onChange={setMonth}
  placeholder="Pick a month"
/>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Controlled via value and onChange. Default valueFormat is 'number' — onChange returns 1–12."
      >
        <Preview>
          <MonthDemo />
          <MonthDemo placeholder="Select month..." />
        </Preview>
        <Code>{`const [month, setMonth] = useState(null)  // month = 1–12 or null

<MonthPicker
  value={month}
  onChange={setMonth}
/>`}</Code>
      </Section>

      {/* Sizes */}
      <Section
        title="Sizes"
        description="Six sizes following the same scale as DatePicker and Input."
      >
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <MonthDemo size={size} />
            </div>
          ))}
        </div>
        <Code>{`<MonthPicker size="xs"   value={month} onChange={setMonth} />
<MonthPicker size="sm"   value={month} onChange={setMonth} />
<MonthPicker size="base" value={month} onChange={setMonth} />  {/* default */}
<MonthPicker size="md"   value={month} onChange={setMonth} />
<MonthPicker size="lg"   value={month} onChange={setMonth} />`}</Code>
      </Section>

      {/* valueFormat */}
      <Section
        title="valueFormat"
        description="Controls what onChange returns and what value expects. 'number' returns 1–12; 'name' returns the full month name."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">
              valueFormat="number" (default) — returns 1–12
            </span>
            <MonthDemo valueFormat="number" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">
              valueFormat="name" — returns "January"–"December"
            </span>
            <MonthDemo valueFormat="name" />
          </div>
        </Preview>
        <Code>{`{/* Returns 1–12 */}
const [month, setMonth] = useState(null)  // e.g. 6
<MonthPicker valueFormat="number" value={month} onChange={setMonth} />

{/* Returns "January"–"December" */}
const [month, setMonth] = useState(null)  // e.g. "June"
<MonthPicker valueFormat="name" value={month} onChange={setMonth} />`}</Code>
      </Section>

      {/* Icon */}
      <Section
        title="Icon"
        description="Override the default CalendarIcon or remove it entirely via the icon prop."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">default (CalendarIcon)</span>
            <MonthDemo icon={undefined} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">icon={`{null}`} — no icon</span>
            <MonthDemo icon={null} />
          </div>
        </Preview>
        <Code>{`{/* No icon */}
<MonthPicker icon={null} value={month} onChange={setMonth} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section title="Disabled" description="Pass disabled to prevent interaction.">
        <Preview>
          <MonthPicker disabled placeholder="Pick a month" />
          <MonthPicker disabled value={6} />
        </Preview>
        <Code>{`<MonthPicker disabled placeholder="Pick a month" />
<MonthPicker disabled value={6} />`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop. MonthPicker auto-reads hasError from context and applies error styling."
      >
        <Preview>
          <MonthFieldDemo label="Birth month" required error="Month is required." />
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.birth_month?.message}>
  <FieldLabel required>Birth month</FieldLabel>
  <MonthPicker value={month} onChange={setMonth} />
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for fully accessible form fields."
      >
        <Preview>
          <MonthFieldDemo label="Birth month" required description="The month you were born in." />
          <MonthFieldDemo
            label="Report month"
            description="Leave blank to use the current month."
          />
        </Preview>
        <Code>{`<FieldContent size="base">
  <FieldLabel required>Birth month</FieldLabel>
  <MonthPicker value={month} onChange={setMonth} />
  <FieldDescription>The month you were born in.</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — MonthPicker's onChange passes a number or string, not a native event."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="birth_month"
  control={control}
  rules={{ required: 'Month is required.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.birth_month?.message}>
      <FieldLabel required>Birth month</FieldLabel>
      <MonthPicker
        valueFormat="number"
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
                  'number | string | null',
                  'null',
                  'Controlled value. Format must match valueFormat.',
                ],
                [
                  'onChange',
                  '(value: number | string) => void',
                  '—',
                  'Fires with a number (1–12) or name string depending on valueFormat.',
                ],
                [
                  'valueFormat',
                  '"number" | "name"',
                  '"number"',
                  'Output format. "number" = 1–12, "name" = "January"–"December".',
                ],
                [
                  'placeholder',
                  'string',
                  '"Pick a month"',
                  'Text shown when no month is selected.',
                ],
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
                  'Trigger button height. Inherits from FieldContent if not set.',
                ],
                [
                  'icon',
                  'ReactNode',
                  '<CalendarIcon />',
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
