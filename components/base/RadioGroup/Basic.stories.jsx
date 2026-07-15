import { RadioGroup, RadioGroupItem } from './RadioGroup'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A set of mutually exclusive options — selecting one deselects the others. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> for
        uncontrolled, or <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> for
        controlled. Arrow keys move focus and select the next item.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">vertical group — defaultValue pre-selects</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <RadioGroup defaultValue="standard">
            {[
              { value: 'standard', label: 'Standard — free, 5–7 business days' },
              { value: 'express', label: 'Express — Rp 25.000, 2–3 business days' },
              { value: 'overnight', label: 'Overnight — Rp 75.000, next day' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`basic-${value}`} />
                <label
                  htmlFor={`basic-${value}`}
                  className="text-sm font-medium cursor-pointer select-none"
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
                title: 'Use RadioGroup for mutually exclusive choices with 2–4 visible options',
                body: 'Payment method, shipping speed, and plan tier are correct use cases — each option is visible at once, and only one can be selected at a time.',
              },
              {
                title:
                  'Pre-select a sensible default with defaultValue when one option is clearly recommended',
                body: 'A pre-selected default prevents accidental form submission with no value chosen. Use it when one option is the most common or safest choice.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use RadioGroup for 5 or more options — use Select instead",
                body: 'A long list of radio buttons clutters the form. When there are more than 4–5 options, a Select dropdown keeps the layout compact.',
              },
              {
                title:
                  "Don't use RadioGroup for a binary on/off toggle that takes effect immediately — use Switch",
                body: 'RadioGroup implies a buffered choice submitted with the form. Instant settings changes (dark mode, notifications) belong to Switch.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always pair each RadioGroupItem with a visible label via id and htmlFor',
                body: 'A RadioGroupItem with no label is not operable by screen reader users. The label also makes the click target larger — users can click the label text to select the item.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use Controller from react-hook-form — onValueChange returns a string, not a native event',
                body: 'register() cannot capture the value from onValueChange. Always use Controller to bridge RadioGroup with react-hook-form.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RadioGroup defaultValue="standard">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="standard" id="standard" />
    <label htmlFor="standard" className="text-sm font-medium cursor-pointer select-none">
      Standard — free, 5–7 business days
    </label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="express" id="express" />
    <label htmlFor="express" className="text-sm font-medium cursor-pointer select-none">
      Express — Rp 25.000, 2–3 business days
    </label>
  </div>
</RadioGroup>`}</code>
      </pre>
    </div>
  ),
}
