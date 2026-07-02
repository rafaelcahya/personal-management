import { useState } from 'react'
import { ClockIcon, ChevronDownIcon } from 'lucide-react'
import DatePicker from './DatePicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'
import FieldDescription from '../../Field/FieldDescription'
import FieldError from '../../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/DatePicker',
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
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} {...props} />
}

function IconDemo({ icon, label }) {
  const [date, setDate] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-mono text-violet-700">{label}</span>
      <DatePicker value={date} onChange={setDate} icon={icon} />
    </div>
  )
}

function FieldDemo({ error, description, label = 'Trade date', required = false, ...props }) {
  const [date, setDate] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <DatePicker value={date} onChange={setDate} {...props} />
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
          <h1 className="text-3xl font-bold text-gray-900">DatePicker</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A popover calendar for selecting a single date. Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Demo />
          <FieldDemo label="Trade date" required description="When did you execute this trade?" />
          <FieldDemo label="Race date" error="Race date is required." />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="DatePicker renders a trigger button and a custom popover calendar with three views: Day, Month, and Year. Pair with FieldContent for accessible labeling and error state."
      >
        {/* ── Box diagram ── */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex gap-14 mb-5">
            {/* Closed state */}
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
                  <span className="text-xs text-slate-400 font-mono">Trade date</span>
                </div>

                <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-blue-300 rounded">
                  <span className="text-xs font-mono text-blue-500">DatePicker</span>
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

            {/* Open — Day view */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Open — Day View
              </span>
              <div className="flex flex-col gap-3 p-5 border-2 border-dashed border-blue-300 rounded-xl w-80">
                <span className="text-xs font-mono text-blue-500">DatePicker</span>

                <div className="flex flex-col gap-2 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">Trigger</span>
                  <div className="flex items-center justify-between gap-4 h-8 px-3 rounded border border-violet-400 bg-white">
                    <span className="text-xs text-slate-700 font-mono">15 Jun 2025</span>
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

                <div className="flex flex-col gap-3 px-3 py-3 border border-dashed border-slate-300 rounded">
                  <span className="text-xs font-mono text-slate-400">CalendarPopup</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    {/* Header */}
                    <div className="border border-dashed border-slate-300 rounded px-2 py-2 mb-3">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                        Header
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 border border-dashed border-slate-300 rounded px-1.5 py-0.5">
                          NavButton ‹
                        </span>
                        <div className="flex gap-1.5">
                          <span className="text-[10px] text-violet-600 border border-dashed border-violet-300 rounded px-1.5 py-0.5">
                            MonthLabel
                          </span>
                          <span className="text-[10px] text-violet-600 border border-dashed border-violet-300 rounded px-1.5 py-0.5">
                            YearLabel
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 border border-dashed border-slate-300 rounded px-1.5 py-0.5">
                          NavButton ›
                        </span>
                      </div>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 mb-1.5">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-center text-slate-400 font-medium"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Day grid */}
                    <div className="border border-dashed border-slate-300 rounded p-1.5">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">
                        DayGrid
                      </span>
                      <div className="grid grid-cols-7 gap-0.5">
                        {[
                          null,
                          null,
                          null,
                          1,
                          2,
                          3,
                          4,
                          5,
                          6,
                          7,
                          8,
                          9,
                          10,
                          11,
                          12,
                          13,
                          14,
                          15,
                          16,
                          17,
                          18,
                          19,
                          20,
                          21,
                          22,
                          23,
                          24,
                          25,
                          26,
                          27,
                          28,
                          29,
                          30,
                          31,
                          null,
                        ].map((d, i) => (
                          <span
                            key={i}
                            className={`text-[9px] text-center rounded py-0.5 ${
                              d === 15
                                ? 'bg-violet-600 text-white font-medium'
                                : d
                                  ? 'text-slate-600'
                                  : 'text-slate-200'
                            }`}
                          >
                            {d ?? '·'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Month view + Year view */}
            <div className="flex flex-col gap-7 shrink-0">
              {/* Month view */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                  Click MonthLabel → Month View
                </span>
                <div className="bg-white border border-slate-200 rounded-lg p-4 w-52">
                  <div className="border border-dashed border-slate-300 rounded px-2 py-2 mb-4">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                      Header
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">‹</span>
                      <span className="text-[10px] text-violet-600 border border-dashed border-violet-300 rounded px-1.5 py-0.5">
                        YearLabel
                      </span>
                      <span className="text-[10px] text-slate-500">›</span>
                    </div>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded p-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                      MonthGrid
                    </span>
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
                          className={`text-[10px] text-center rounded py-1 ${m === 'Jun' ? 'bg-violet-600 text-white' : 'text-slate-600'}`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Year view */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                  Click YearLabel → Year View
                </span>
                <div className="bg-white border border-slate-200 rounded-lg p-4 w-52">
                  <div className="border border-dashed border-slate-300 rounded px-2 py-2 mb-4">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                      Header
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">‹</span>
                      <span className="text-[10px] text-slate-600 font-medium">2020 – 2031</span>
                      <span className="text-[10px] text-slate-500">›</span>
                    </div>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded p-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                      YearGrid
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031].map(
                        (y) => (
                          <span
                            key={y}
                            className={`text-[10px] text-center rounded py-1 ${y === 2025 ? 'bg-violet-600 text-white' : 'text-slate-600'}`}
                          >
                            {y}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Parts table ── */}
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
                  'Opens and closes the calendar popover. Displays the selected date or placeholder text.',
                ],
                [
                  'Placeholder',
                  '<span>',
                  'Text shown inside the trigger when no date is selected.',
                ],
                [
                  'Icon',
                  'ReactNode',
                  'Right-side icon of the trigger. Defaults to CalendarIcon. Customizable via the icon prop.',
                ],
                [
                  'CalendarPopup',
                  '<div>',
                  'Popover content. Renders one of three views: Day, Month, or Year.',
                ],
                [
                  'Header',
                  '<div>',
                  'Top bar of CalendarPopup. Contains NavButton × 2 and the clickable MonthLabel / YearLabel.',
                ],
                [
                  'NavButton',
                  '<button>',
                  '‹ / › arrows. Navigate by month in Day view, by year in Month view, by decade in Year view.',
                ],
                [
                  'MonthLabel',
                  '<button>',
                  'Clickable month name in Header. Clicking switches CalendarPopup to Month view.',
                ],
                [
                  'YearLabel',
                  '<button>',
                  'Clickable year number in Header. Clicking switches CalendarPopup to Year view.',
                ],
                [
                  'DayGrid',
                  '<div>',
                  '5×7 grid of day cells. Outside-month days shown muted. Today highlighted in violet-50.',
                ],
                [
                  'MonthGrid',
                  '<div>',
                  '3×4 grid of month buttons. Shown when MonthLabel is clicked. Selecting returns to Day view.',
                ],
                [
                  'YearGrid',
                  '<div>',
                  '3×4 grid of year buttons (1 decade per page). Selecting returns to Month view.',
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

        <Code>{`import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Controlled via value (Date | null) and onChange. Pass null to clear the selection."
      >
        <Preview>
          <Demo />
          <Demo placeholder="Select a date..." />
        </Preview>
        <Code>{`const [date, setDate] = useState(null)

<DatePicker
  value={date}
  onChange={setDate}
/>`}</Code>
      </Section>

      {/* Sizes */}
      <Section title="Sizes" description="Six sizes following the same scale as Input and Select.">
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <Demo size={size} />
            </div>
          ))}
        </div>
        <Code>{`<DatePicker size="xs" value={date} onChange={setDate} />
<DatePicker size="sm" value={date} onChange={setDate} />
<DatePicker size="base" value={date} onChange={setDate} />  {/* default */}
<DatePicker size="md" value={date} onChange={setDate} />
<DatePicker size="lg" value={date} onChange={setDate} />`}</Code>
      </Section>

      {/* Display format */}
      <Section
        title="Display Format"
        description="Control how the selected date is shown using any date-fns format string."
      >
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {[
            { fmt: 'd MMM yyyy', label: 'd MMM yyyy', eg: '15 Jun 2025' },
            { fmt: 'PPP', label: 'PPP', eg: 'June 15th, 2025' },
            { fmt: 'yyyy-MM-dd', label: 'yyyy-MM-dd', eg: '2025-06-15' },
            { fmt: 'dd/MM/yyyy', label: 'dd/MM/yyyy', eg: '15/06/2025' },
          ].map(({ fmt, label, eg }) => (
            <div key={fmt} className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-violet-700">
                {label} — e.g. "{eg}"
              </span>
              <Demo displayFormat={fmt} />
            </div>
          ))}
        </div>
        <Code>{`{/* Default — "15 Jun 2025" */}
<DatePicker displayFormat="d MMM yyyy" value={date} onChange={setDate} />

{/* Long form — "June 15th, 2025" */}
<DatePicker displayFormat="PPP" value={date} onChange={setDate} />

{/* ISO — "2025-06-15" */}
<DatePicker displayFormat="yyyy-MM-dd" value={date} onChange={setDate} />`}</Code>
      </Section>

      {/* Icon */}
      <Section
        title="Icon"
        description="Override the default CalendarIcon with any React node via the icon prop. Pass null to remove the icon entirely."
      >
        <Preview>
          <IconDemo label="default (CalendarIcon)" icon={undefined} />
          <IconDemo
            label="icon=<ClockIcon />"
            icon={<ClockIcon className="size-4 shrink-0 opacity-50" />}
          />
          <IconDemo
            label="icon=<ChevronDownIcon />"
            icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
          />
          <IconDemo label="icon={null} — no icon" icon={null} />
        </Preview>
        <Code>{`import { ClockIcon } from 'lucide-react'

{/* Custom icon */}
<DatePicker
  icon={<ClockIcon className="size-4 shrink-0 opacity-50" />}
  value={date}
  onChange={setDate}
/>

{/* No icon */}
<DatePicker icon={null} value={date} onChange={setDate} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled to prevent interaction. The trigger becomes non-clickable and visually muted."
      >
        <Preview>
          <DatePicker disabled placeholder="Pick a date" />
          <DatePicker disabled value={new Date(2025, 5, 15)} />
        </Preview>
        <Code>{`<DatePicker disabled placeholder="Pick a date" />
<DatePicker disabled value={new Date(2025, 5, 15)} />`}</Code>
      </Section>

      {/* Date constraints */}
      <Section
        title="Date Constraints"
        description="Use fromDate and toDate to restrict the selectable range. Use disabledDates for custom rules."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">fromDate / toDate</span>
            <Demo
              fromDate={new Date(2025, 0, 1)}
              toDate={new Date(2025, 11, 31)}
              placeholder="Only 2025"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-violet-700">disabledDates (weekends)</span>
            <Demo
              disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6}
              placeholder="Weekdays only"
            />
          </div>
        </Preview>
        <Code>{`{/* Restrict to a year range */}
<DatePicker
  fromDate={new Date(2025, 0, 1)}
  toDate={new Date(2025, 11, 31)}
  value={date}
  onChange={setDate}
/>

{/* Disable weekends */}
<DatePicker
  disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6}
  value={date}
  onChange={setDate}
/>`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop. DatePicker auto-reads hasError from context and applies error styling."
      >
        <Preview>
          <FieldDemo label="Trade date" required error="Trade date is required." />
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.trade_date?.message}>
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for fully accessible form fields."
      >
        <Preview>
          <FieldDemo label="Trade date" required description="When did you execute this trade?" />
          <FieldDemo label="Event date" description="Leave blank if date is not confirmed yet." />
        </Preview>
        <Code>{`<FieldContent size="base">
  <FieldLabel required>Trade date</FieldLabel>
  <DatePicker value={date} onChange={setDate} />
  <FieldDescription>When did you execute this trade?</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — DatePicker's onChange passes a Date | null, not a native event."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="trade_date"
  control={control}
  rules={{ required: 'Trade date is required.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.trade_date?.message}>
      <FieldLabel required>Trade date</FieldLabel>
      <DatePicker
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
                ['value', 'Date | null', 'null', 'Controlled selected date.'],
                [
                  'onChange',
                  '(date: Date | null) => void',
                  '—',
                  'Callback fired when a date is selected or cleared.',
                ],
                ['placeholder', 'string', '"Pick a date"', 'Text shown when no date is selected.'],
                [
                  'displayFormat',
                  'string',
                  '"d MMM yyyy"',
                  'date-fns format string for rendering the selected date.',
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
                ['fromDate', 'Date', '—', 'Earliest selectable date.'],
                ['toDate', 'Date', '—', 'Latest selectable date.'],
                [
                  'disabledDates',
                  '(date: Date) => boolean',
                  '—',
                  'Function returning true to disable a specific date.',
                ],
                [
                  'icon',
                  'ReactNode',
                  '<CalendarIcon />',
                  'Icon rendered on the right of the trigger. Pass null to remove.',
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
