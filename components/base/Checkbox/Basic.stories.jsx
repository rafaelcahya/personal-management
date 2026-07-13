import { Checkbox } from './Checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Basic',
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
        Checkbox supports three visual states:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">unchecked</code> (default),{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">checked</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">indeterminate</code>. Always
        pair with a visible label linked via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">id</code> /{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">three states</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 w-80">
          <div className="flex items-center gap-3">
            <Checkbox id="basic-unchecked" />
            <label
              htmlFor="basic-unchecked"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Unchecked
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="basic-checked" defaultChecked />
            <label
              htmlFor="basic-checked"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Checked
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="basic-indeterminate" checked="indeterminate" />
            <label
              htmlFor="basic-indeterminate"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Indeterminate
            </label>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Checkbox for boolean opt-in fields submitted with a form',
                body: 'Terms acceptance, newsletter subscription, and feature toggles that take effect on submit are all correct Checkbox use cases. The value is stored and sent only when the form is submitted.',
              },
              {
                title: 'Use the indeterminate state for "select all" parent controls',
                body: 'When a parent checkbox controls a list where only some children are checked, use checked="indeterminate" to communicate partial selection clearly.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use Checkbox for mutually exclusive choices — use RadioGroup",
                body: 'If only one option from a set can be active at a time, use RadioGroup. Checkboxes imply independent, additive selection — seeing multiple checked boxes is expected behavior.',
              },
              {
                title: "Don't use Checkbox for settings that take effect immediately — use Switch",
                body: 'Dark mode, notifications on/off, and similar instant-effect toggles should use Switch. Checkbox implies the value is buffered until form submission.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always link a visible label via id and htmlFor',
                body: 'A Checkbox with no label is not operable by screen reader users. Every checkbox must have a visible, clickable label associated via htmlFor that matches the checkbox id.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't use register() from react-hook-form directly on Checkbox",
                body: 'onCheckedChange returns a boolean, not a native event — register() cannot capture it. Always use Controller to bridge the value correctly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex items-center gap-3">
  <Checkbox id="terms" defaultChecked />
  <label htmlFor="terms" className="text-sm font-medium cursor-pointer select-none">
    I agree to the terms
  </label>
</div>

{/* Indeterminate — useful for "select all" controls */}
<Checkbox id="select-all" checked="indeterminate" />`}</code>
      </pre>
    </div>
  ),
}
