import MonthPicker from './MonthPicker'
import FieldContent from '../../Field/FieldContent'
import FieldLabel from '../../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/DatePicker/MonthPicker/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use the <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> prop to prevent
        interaction. Works both standalone and inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> — the field
        inherits disabled state from context automatically.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <MonthPicker disabled placeholder="Pick a month" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <MonthPicker disabled value={6} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            Via FieldContent disabled prop
          </span>
          <FieldContent disabled>
            <FieldLabel>Birth month</FieldLabel>
            <MonthPicker value={6} />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable when the month value is locked for the current context',
                body: 'A month set by system logic, locked after form submission, or read-only in a review screen should be disabled — the value stays visible but cannot be changed.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically disables the picker and dims the label — no need to pass disabled separately to MonthPicker.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a description explaining why the field is locked',
                body: 'A muted trigger with no explanation confuses users. Use FieldDescription to say "Locked after submission" so users understand why they cannot interact.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Standalone — disabled prop */}
<MonthPicker disabled value={month} onChange={setMonth} />

{/* Via FieldContent — all children inherit disabled */}
<FieldContent disabled>
  <FieldLabel>Birth month</FieldLabel>
  <MonthPicker value={month} onChange={setMonth} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
