import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Basic',
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
        A compound dropdown built from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectTrigger</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectContent</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectItem</code>. Place{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectValue</code> inside the
        trigger to show the selected label or a placeholder. Wrap in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> to wire up
        label, description, and error automatically.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone — flat item list</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">with FieldContent — label wired automatically</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Category</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Select when you have 5 or more mutually exclusive options',
                body: 'A collapsed dropdown fits better than a row of radio buttons when the list is long. Select is ideal for categories, statuses, and other enumerated values.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use Select for 2–4 options where comparison helps — use RadioGroup instead",
                body: '"Weekly / Monthly / Yearly" is clearer as a RadioGroup — users see all choices without opening a dropdown. Reserve Select for lists where collapsed presentation saves meaningful space.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always wrap in FieldContent with a FieldLabel',
                body: 'FieldContent generates the id and wires it to FieldLabel via htmlFor. SelectTrigger reads the id, error, and disabled state from context automatically — no manual wiring needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always provide a placeholder on SelectValue',
                body: 'A placeholder like "Select a category" signals that no value has been chosen yet. Without it, the trigger shows an empty string and users may not realize the field needs input.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone */}
<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="draft">Draft</SelectItem>
    <SelectItem value="archived">Archived</SelectItem>
  </SelectContent>
</Select>

{/* With FieldContent */}
<FieldContent required>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={setValue}>
    <SelectTrigger>
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectContent>
  </Select>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
