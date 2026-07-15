import { RadioGroup, RadioGroupItem } from './RadioGroup'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Horizontal',
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

export const Horizontal = {
  name: 'Horizontal',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Override the default vertical layout with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          className="flex flex-row gap-6"
        </code>{' '}
        on <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroup</code>. Also pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="horizontal"</code>{' '}
        so arrow-left / arrow-right navigate between items.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">horizontal — size picker</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <RadioGroup defaultValue="m" orientation="horizontal" className="flex flex-row gap-6">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <div key={size} className="flex items-center gap-2">
                <RadioGroupItem value={size.toLowerCase()} id={`size-${size}`} />
                <label
                  htmlFor={`size-${size}`}
                  className="text-sm font-medium cursor-pointer select-none"
                >
                  {size}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">horizontal — yes / no</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <RadioGroup defaultValue="yes" orientation="horizontal" className="flex flex-row gap-6">
            {['Yes', 'No'].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <RadioGroupItem value={label.toLowerCase()} id={`yn-${label}`} />
                <label
                  htmlFor={`yn-${label}`}
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
                title: 'Use horizontal layout for short labels that fit comfortably in one row',
                body: 'Sizes (XS S M L XL), ratings (1–5), and binary choices (Yes / No) work well horizontally because the labels are short and the group is small.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use horizontal layout for long labels — they wrap and become hard to scan",
                body: 'Shipping options like "Standard — free, 5–7 business days" are too long for a row. Use the default vertical layout so each label is easy to read.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always pass orientation="horizontal" alongside the flex-row className',
                body: 'The orientation prop tells RadioGroup to use ArrowLeft/ArrowRight for keyboard navigation instead of ArrowUp/ArrowDown. Without it, keyboard navigation feels broken in horizontal layouts.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Pass orientation="horizontal" so arrow keys work correctly */}
<RadioGroup defaultValue="m" orientation="horizontal" className="flex flex-row gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="s" id="s" />
    <label htmlFor="s" className="text-sm font-medium cursor-pointer select-none">S</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="m" id="m" />
    <label htmlFor="m" className="text-sm font-medium cursor-pointer select-none">M</label>
  </div>
</RadioGroup>`}</code>
      </pre>
    </div>
  ),
}
