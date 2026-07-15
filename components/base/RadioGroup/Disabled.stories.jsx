import { RadioGroup, RadioGroupItem } from './RadioGroup'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Disabled',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroup</code> to disable
        all items at once, or to individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroupItem</code> to
        disable specific options only.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">entire group disabled</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <RadioGroup defaultValue="a" disabled>
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const val = String.fromCharCode(97 + i)
              return (
                <div key={val} className="flex items-center gap-2 opacity-50">
                  <RadioGroupItem value={val} id={`dis-all-${val}`} />
                  <label
                    htmlFor={`dis-all-${val}`}
                    className="text-sm font-medium cursor-not-allowed select-none"
                  >
                    {label}
                  </label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">individual items disabled</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <RadioGroup defaultValue="a">
            {[
              { val: 'a', label: 'Option A', disabled: false },
              { val: 'b', label: 'Option B (unavailable)', disabled: true },
              { val: 'c', label: 'Option C', disabled: false },
            ].map(({ val, label, disabled }) => (
              <div key={val} className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''}`}>
                <RadioGroupItem value={val} id={`dis-item-${val}`} disabled={disabled} />
                <label
                  htmlFor={`dis-item-${val}`}
                  className={`text-sm font-medium select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable the entire group when the selection cannot be changed in the current context',
                body: 'Read-only review forms, locked permissions, or values auto-set by the system should be visible but non-interactive. Disabling communicates the read-only state without hiding the field.',
              },
              {
                title:
                  'Disable individual items when specific options are conditionally unavailable',
                body: 'If only some options are locked (e.g. "Overnight" unavailable in your region), disable those items individually rather than the whole group.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Apply opacity-50 to the wrapper row so both the item and label visually dim together',
                body: 'Applying opacity only to RadioGroupItem leaves the label looking active and confuses sighted users. Wrap both the item and label in a div and apply opacity to the wrapper.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Consider explaining why an option is disabled if it may surprise the user',
                body: 'A tooltip or nearby helper text ("Not available in your region") prevents confusion when users see a grayed-out option they cannot select.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Disable entire group — apply opacity to each row wrapper */}
<RadioGroup disabled>
  <div className="flex items-center gap-2 opacity-50">
    <RadioGroupItem value="a" id="a" />
    <label htmlFor="a" className="text-sm font-medium cursor-not-allowed select-none">Option A</label>
  </div>
</RadioGroup>

{/* Disable individual item only */}
<RadioGroup>
  <div className="flex items-center gap-2 opacity-50">
    <RadioGroupItem value="b" id="b" disabled />
    <label htmlFor="b" className="text-sm font-medium cursor-not-allowed select-none">
      Option B (unavailable)
    </label>
  </div>
</RadioGroup>`}</code>
      </pre>
    </div>
  ),
}
