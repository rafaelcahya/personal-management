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

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function Demo(props) {
  const [time, setTime] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <TimePicker value={time} onChange={setTime} {...props} />
      <span className="text-[10px] font-mono text-gray-400">
        value: <span className="text-gray-700">{time === null ? 'null' : time}</span>
      </span>
    </div>
  )
}

function FieldDemo() {
  const [time, setTime] = useState(null)
  return (
    <FieldContent size="base">
      <FieldLabel required>Start time</FieldLabel>
      <TimePicker value={time} onChange={setTime} />
      <FieldDescription className="text-xs text-slate-400">
        When does the session start?
      </FieldDescription>
    </FieldContent>
  )
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

// ─── BestPractices ────────────────────────────────────────────────────────────

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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Controlled via <code className="font-mono bg-gray-100 px-1 rounded">value</code> (
        <code className="font-mono bg-gray-100 px-1 rounded">string | null</code>) and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code>. Default output is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">"HH:mm:ss"</code>. The popover opens
        scrollable columns and auto-scrolls to the selected value.
      </span>

      <div className="flex flex-col gap-4">
        <Demo />
        <FieldDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use TimePicker for structured time input with fixed intervals',
                body: 'Good for scheduling — workout start time, trade alarm, session duration. Users scroll to pick rather than type, which avoids format errors.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair with FieldContent + FieldLabel inside forms',
                body: 'A bare TimePicker without a label is not accessible. Wrap it in FieldContent so users get a label, description, and error message.',
              },
              {
                title: 'Initialize value as null — not undefined',
                body: 'Passing undefined makes TimePicker uncontrolled. Always initialize state with null and pass it as value={null} until the user selects a time.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [time, setTime] = useState(null)  // e.g. "14:30:45"

<TimePicker value={time} onChange={setTime} />

<FieldContent size="base">
  <FieldLabel required>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
  <FieldDescription className="text-xs text-slate-400">When does the session start?</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Fields = {
  name: 'Fields',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        The <code className="font-mono bg-gray-100 px-1 rounded">fields</code> prop controls which
        columns are shown and what format{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onChange</code> returns. Columns render
        in the order the array is provided.
      </span>

      <div className="flex flex-col gap-4">
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

      <BestPractices
        items={[
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Narrow fields to only what the user needs',
                body: "If you only need hours and minutes (e.g. session start time), use fields={['hour', 'minute']} — fewer columns means less cognitive load.",
              },
              {
                title: "Omit 'second' for scheduling use cases",
                body: "Most scheduling scenarios don't need second precision. Drop 'second' from fields to simplify the picker.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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

export const Step = {
  name: 'Step',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">hourStep</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">minuteStep</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">secondStep</code> to control the
        interval between options in each column. Useful for scheduling and calendar inputs.
      </span>

      <div className="flex flex-col gap-4">
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

      <BestPractices
        items={[
          {
            heading: 'When to use step',
            cards: [
              {
                title: 'Use minuteStep when the domain restricts valid times to fixed intervals',
                body: 'Scheduling classes, trade alerts, or calendar slots at 15-minute boundaries. Fixed steps remove invalid options rather than relying on validation after the fact.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Replace the default clock icon with any React node via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">icon</code> prop. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code> to remove the icon
        entirely.
      </span>

      <div className="flex flex-col gap-4">
        <IconDemo label="default (ClockIcon)" icon={undefined} />
        <IconDemo
          label="icon=<ChevronDownIcon />"
          icon={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
        />
        <IconDemo label="icon={null} — no icon" icon={null} />
      </div>

      <BestPractices
        items={[
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pass null to remove the icon — do not pass an empty fragment',
                body: 'icon={null} cleanly removes the icon slot. Passing an empty fragment leaves invisible padding. Only override the icon if the default ClockIcon conflicts with your field context.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
