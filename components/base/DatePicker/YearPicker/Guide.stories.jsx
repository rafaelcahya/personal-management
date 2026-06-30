import { useState } from 'react'
import YearPicker from './YearPicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'
import FieldError from '../../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/YearPicker',
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

function YearDemo(props) {
  const [year, setYear] = useState(null)
  return <YearPicker value={year} onChange={setYear} {...props} />
}

function YearFieldDemo({ error, description, label = 'Year', required = false, ...props }) {
  const [year, setYear] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <YearPicker value={year} onChange={setYear} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError />}
    </FieldContent>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const YearPickerDocs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">YearPicker</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A popover year picker with a scrollable year list. Outputs a year number. Auto-scrolls to
          the selected year (or current year if nothing is selected) when the popover opens. Pairs
          with <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <YearDemo />
          <YearFieldDemo label="Birth year" required description="The year you were born." />
          <YearFieldDemo label="Fiscal year" error="Year is required." />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="YearPicker renders a trigger button and a popover with a scrollable year list. The list auto-scrolls to the selected year on open."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-10 mb-2">
            {/* Closed */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Closed
              </span>
              <div className="relative p-5 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  FieldContent <span className="text-slate-400 font-normal">(optional)</span>
                </span>

                <div className="relative px-3 py-2 border border-dashed border-green-300 rounded mb-3">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldLabel
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Birth year</span>
                </div>

                <div className="flex flex-col gap-1.5 p-3 border-2 border-dashed border-blue-300 rounded">
                  <span className="text-xs font-mono text-blue-500">YearPicker</span>
                  <div className="flex flex-col gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded">
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

                <div className="relative px-3 py-2 border border-dashed border-green-300 rounded mt-3">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldError
                  </span>
                  <span className="text-xs text-slate-400 font-mono">This field is required.</span>
                </div>
              </div>
            </div>

            {/* Open */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Open
              </span>
              <div className="flex flex-col gap-1.5 p-4 border-2 border-dashed border-blue-300 rounded-xl">
                <span className="text-xs font-mono text-blue-500 mb-1">YearPicker</span>

                <div className="flex flex-col gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">Trigger</span>
                  <div className="flex items-center justify-between gap-4 h-8 px-3 rounded border border-violet-400 bg-white">
                    <span className="text-xs text-slate-700 font-mono">2025</span>
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

                <div className="flex flex-col gap-1.5 px-3 py-3 border border-dashed border-slate-300 rounded mt-1">
                  <span className="text-xs font-mono text-slate-400">YearList</span>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden w-32">
                    <div className="overflow-y-auto h-36 py-1">
                      {[2022, 2023, 2024, 2025, 2026, 2027, 2028].map((y) => (
                        <div
                          key={y}
                          className={`px-3 py-1 text-xs text-center rounded mx-1 ${y === 2025 ? 'bg-violet-600 text-white font-medium' : 'text-slate-600'}`}
                        >
                          {y}
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-[10px] text-slate-300 pb-1 font-mono">
                      ↕ scroll
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
                  'Opens and closes the popover. Displays the selected year or placeholder.',
                ],
                [
                  'Placeholder',
                  '<span>',
                  'Text shown inside the trigger when no year is selected.',
                ],
                [
                  'Icon',
                  'ReactNode',
                  'Right-side icon of the trigger. Defaults to CalendarIcon. Customizable via the icon prop.',
                ],
                [
                  'YearList',
                  '<div>',
                  'Scrollable list of year buttons from fromYear to toYear. Auto-scrolls to selected year (or current year) on open.',
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

        <Code>{`import YearPicker from '@/components/base/DatePicker/YearPicker/YearPicker'

<YearPicker
  value={year}
  onChange={setYear}
  placeholder="Pick a year"
/>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Controlled via value (number | null) and onChange. onChange returns a year number."
      >
        <Preview>
          <YearDemo />
          <YearDemo placeholder="Select year..." />
        </Preview>
        <Code>{`const [year, setYear] = useState(null)  // e.g. 2025

<YearPicker
  value={year}
  onChange={setYear}
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
              <YearDemo size={size} />
            </div>
          ))}
        </div>
        <Code>{`<YearPicker size="xs"   value={year} onChange={setYear} />
<YearPicker size="sm"   value={year} onChange={setYear} />
<YearPicker size="base" value={year} onChange={setYear} />  {/* default */}
<YearPicker size="md"   value={year} onChange={setYear} />
<YearPicker size="lg"   value={year} onChange={setYear} />`}</Code>
      </Section>

      {/* Year Range */}
      <Section
        title="Year Range"
        description="Use fromYear and toYear to limit the list. Defaults to 1970 – current year + 20."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">
              default range (1970 – {new Date().getFullYear() + 20})
            </span>
            <YearDemo />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">fromYear=2000 toYear=2030</span>
            <YearDemo fromYear={2000} toYear={2030} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">birth year range</span>
            <YearDemo
              fromYear={1940}
              toYear={new Date().getFullYear()}
              placeholder="Select birth year"
            />
          </div>
        </Preview>
        <Code>{`{/* Default */}
<YearPicker value={year} onChange={setYear} />

{/* Custom range */}
<YearPicker fromYear={2000} toYear={2030} value={year} onChange={setYear} />

{/* Birth year */}
<YearPicker fromYear={1940} toYear={new Date().getFullYear()} value={year} onChange={setYear} />`}</Code>
      </Section>

      {/* Icon */}
      <Section
        title="Icon"
        description="Override the default CalendarIcon or remove it entirely via the icon prop."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">default (CalendarIcon)</span>
            <YearDemo icon={undefined} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">icon={`{null}`} — no icon</span>
            <YearDemo icon={null} />
          </div>
        </Preview>
        <Code>{`{/* No icon */}
<YearPicker icon={null} value={year} onChange={setYear} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section title="Disabled" description="Pass disabled to prevent interaction.">
        <Preview>
          <YearPicker disabled placeholder="Pick a year" />
          <YearPicker disabled value={2025} />
        </Preview>
        <Code>{`<YearPicker disabled placeholder="Pick a year" />
<YearPicker disabled value={2025} />`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop. YearPicker auto-reads hasError from context and applies error styling."
      >
        <Preview>
          <YearFieldDemo label="Birth year" required error="Year is required." />
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.birth_year?.message}>
  <FieldLabel required>Birth year</FieldLabel>
  <YearPicker value={year} onChange={setYear} />
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for fully accessible form fields."
      >
        <Preview>
          <YearFieldDemo label="Birth year" required description="The year you were born." />
          <YearFieldDemo
            label="Fiscal year"
            description="Defaults to current year if left blank."
          />
        </Preview>
        <Code>{`<FieldContent size="base">
  <FieldLabel required>Birth year</FieldLabel>
  <YearPicker value={year} onChange={setYear} />
  <FieldDescription>The year you were born.</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — YearPicker's onChange passes a number, not a native event."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="birth_year"
  control={control}
  rules={{ required: 'Year is required.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.birth_year?.message}>
      <FieldLabel required>Birth year</FieldLabel>
      <YearPicker
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
                ['value', 'number | null', 'null', 'Controlled selected year.'],
                ['onChange', '(year: number) => void', '—', 'Fires with the selected year number.'],
                ['fromYear', 'number', '1970', 'First year in the list.'],
                ['toYear', 'number', 'current + 20', 'Last year in the list.'],
                ['placeholder', 'string', '"Pick a year"', 'Text shown when no year is selected.'],
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
