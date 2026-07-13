import Combobox from './Combobox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox/Disabled',
}

export default meta

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

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
        Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to prevent
        interaction. The trigger becomes non-clickable and visually dimmed. Also inherits from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> context
        automatically.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <Combobox disabled options={FRUITS} placeholder="Select..." />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <Combobox disabled options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            disabled — multiple with tags
          </span>
          <Combobox
            disabled
            multiple
            options={FRUITS}
            value={[
              { value: 'apple', label: 'Apple' },
              { value: 'banana', label: 'Banana' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent disabled</span>
          <FieldContent size="base" disabled>
            <FieldLabel>Favourite fruit</FieldLabel>
            <Combobox options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable when the selection is locked for the current context',
                body: 'A value set by system config, inherited from a parent form, or frozen after submission should be disabled — the value stays visible but cannot be changed.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically dims the label and locks the combobox — no need to pass disabled separately to Combobox.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the field is locked',
                body: 'A dimmed field with no explanation confuses users. Use FieldDescription to say "Set by admin — contact support to change" so users know why they cannot interact.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Standalone — disabled prop */}
<Combobox disabled value={val} onChange={setVal} options={options} />

{/* Via FieldContent — all children inherit disabled */}
<FieldContent size="base" disabled>
  <FieldLabel>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
