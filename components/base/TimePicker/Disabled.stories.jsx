import TimePicker from './TimePicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/TimePicker/Disabled',
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
        Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to prevent
        interaction. Works both standalone and inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> — the field
        inherits disabled state from context automatically.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <TimePicker disabled placeholder="Pick a time" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <TimePicker disabled value="14:30:45" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent disabled</span>
          <FieldContent size="base" disabled>
            <FieldLabel>Start time</FieldLabel>
            <TimePicker value="14:30:45" />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable when the time field is locked for the current context',
                body: 'A session time submitted in a past entry, frozen after a form step, or locked by a status condition should be disabled — the value stays visible but cannot be changed.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically dims the label and locks the picker — no need to pass disabled directly to TimePicker.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<TimePicker disabled value={time} onChange={setTime} />

<FieldContent size="base" disabled>
  <FieldLabel>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
