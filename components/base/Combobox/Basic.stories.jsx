import { useState } from 'react'
import Combobox from './Combobox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox/Basic',
}

export default meta

// ─── Mock data ────────────────────────────────────────────────────────────────

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

const GROUPED = [
  {
    group: 'Fruits',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
  {
    group: 'Vegetables',
    items: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'spinach', label: 'Spinach' },
    ],
  },
  {
    group: 'Grains',
    items: [
      { value: 'rice', label: 'Rice' },
      { value: 'wheat', label: 'Wheat' },
      { value: 'oats', label: 'Oats', disabled: true },
    ],
  },
]

const mockSearch = (query) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(FRUITS.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))),
      700
    )
  )

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function Demo(props) {
  const [val, setVal] = useState(null)
  return <Combobox value={val} onChange={setVal} options={FRUITS} {...props} />
}

function MultiDemo(props) {
  const [val, setVal] = useState([])
  return <Combobox multiple value={val} onChange={setVal} options={FRUITS} {...props} />
}

function GroupSingleDemo() {
  const [val, setVal] = useState(null)
  return <Combobox value={val} onChange={setVal} options={GROUPED} placeholder="Select food..." />
}

function GroupMultiDemo() {
  const [val, setVal] = useState([])
  return (
    <Combobox
      multiple
      value={val}
      onChange={setVal}
      options={GROUPED}
      placeholder="Pick foods..."
    />
  )
}

function AsyncDemo() {
  const [val, setVal] = useState(null)
  return (
    <Combobox
      value={val}
      onChange={setVal}
      onSearch={mockSearch}
      placeholder="Type to search..."
      emptyText="No fruits found."
    />
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
        Single-select combobox. Value is a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">{'{ value, label }'}</code> object or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code>. Type in the trigger to
        filter options.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <Demo placeholder="Search fruits..." />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Combobox when the list is too long for a plain Select',
                body: 'If there are more than ~10 options, a searchable Combobox keeps the list manageable. For short, static lists prefer Select.',
              },
              {
                title: 'Wrap in FieldContent + FieldLabel in forms',
                body: 'FieldContent provides the accessible ID, error context, and size. Always pair with FieldLabel so the field has an accessible name.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Value is an object — extract .value before sending to the API',
                body: 'onChange fires { value, label }, not a raw ID string. Always do payload.fruitId = val?.value before submitting to the server.',
              },
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'onChange receives an object, not a native event. register cannot capture it. Wrap with Controller and pass value={field.value ?? null}.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [val, setVal] = useState(null)

<Combobox
  value={val}
  onChange={setVal}
  options={[
    { value: 'apple',  label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ]}
  placeholder="Search fruits..."
/>`}</code>
      </pre>
    </div>
  ),
}

export const Multiple = {
  name: 'Multiple',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">multiple</code> to enable
        multi-select. Value becomes an array of option objects. Selections appear as removable tags
        inside the trigger. Use <code className="font-mono bg-gray-100 px-1 rounded">max</code> to
        cap the number of selections.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">multiple</span>
          <MultiDemo placeholder="Pick fruits..." />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">multiple + max=2</span>
          <MultiDemo placeholder="Max 2 items..." max={2} />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use multiple for tags, categories, or assignee fields',
                body: 'Each selected item renders as a removable tag inside the trigger. Pressing Backspace when the search input is empty removes the last tag.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Initialize value as an empty array — not null',
                body: 'multiple mode expects value to be an array. Pass useState([]) as the initial state, not useState(null), to avoid runtime errors.',
              },
              {
                title: 'Use max to prevent excessive selections',
                body: 'Capping selections guides users to a reasonable number of choices. Once the cap is reached, unselected options are not clickable.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [val, setVal] = useState([])

{/* Unlimited */}
<Combobox multiple value={val} onChange={setVal} options={options} />

{/* Capped at 2 */}
<Combobox multiple max={2} value={val} onChange={setVal} options={options} />`}</code>
      </pre>
    </div>
  ),
}

export const Groups = {
  name: 'Groups',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass options in the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">{'{ group, items[] }'}</code> shape to
        render labeled groups. Works with both single and multi-select. Flat and grouped options
        cannot be mixed in the same array.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">single + groups</span>
          <GroupSingleDemo />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">multiple + groups</span>
          <GroupMultiDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use groups when options belong to distinct categories',
                body: 'Product types, countries by region, or team members by department are good candidates for grouped options. Groups make long lists scannable.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Do not mix flat and grouped options in the same array',
                body: 'All items must use the same shape. Either pass a flat array of { value, label } objects, or a grouped array of { group, items[] } objects — never both.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const options = [
  {
    group: 'Fruits',
    items: [
      { value: 'apple',  label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    group: 'Vegetables',
    items: [
      { value: 'carrot', label: 'Carrot' },
    ],
  },
]

<Combobox value={val} onChange={setVal} options={options} />`}</code>
      </pre>
    </div>
  ),
}

export const TriggerType = {
  name: 'Trigger Type',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">inputTrigger=true</code> (default)
        renders a combined input + popover — the trigger IS the search field.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">inputTrigger=false</code> renders a
        button that opens a popover with a search input inside — feels like a Select with search.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">inputTrigger=true (default)</span>
          <Demo placeholder="Type to search..." />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">inputTrigger=false</span>
          <Demo inputTrigger={false} placeholder="Click to open..." />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use each',
            cards: [
              {
                title: 'Use inputTrigger (default) when search is the primary interaction',
                body: 'The trigger doubles as a search field. Good for fields where users are expected to type rather than scroll — products, users, large category lists.',
              },
              {
                title: 'Use inputTrigger=false when the field should look like a Select',
                body: 'The button trigger shows the selected label and opens a separate search input inside the popover. Use when visual consistency with non-searchable Select fields matters.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Inline search — trigger IS the search field */}
<Combobox value={val} onChange={setVal} options={options} />

{/* Button trigger — search inside popover */}
<Combobox inputTrigger={false} value={val} onChange={setVal} options={options} />`}</code>
      </pre>
    </div>
  ),
}

export const AsyncSearch = {
  name: 'Async Search',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">onSearch</code> to delegate
        filtering to the server. Input is debounced 300ms. A spinner shows while loading. The option
        list is replaced with whatever the Promise resolves to. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">options</code> prop is ignored when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onSearch</code> is provided.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <AsyncDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use onSearch when options are too large to load upfront',
                body: 'Thousands of products, users, or locations should be loaded on demand. onSearch receives the current query and returns a Promise of option objects.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Return [] from the Promise on error — never reject',
                body: 'The component does not handle rejected Promises. Catch errors inside onSearch and return an empty array to gracefully show emptyText instead of crashing.',
              },
              {
                title: 'onSearch is not called when query is empty',
                body: 'The option list clears on empty query. If you want to show recent items on open, initialize the options prop with a default list.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const searchFruits = async (query) => {
  const res = await fetch(\`/api/fruits?q=\${query}\`)
  return res.json()  // [{ value, label }]
}

<Combobox
  value={val}
  onChange={setVal}
  onSearch={searchFruits}
  placeholder="Type to search..."
  emptyText="No results."
/>`}</code>
      </pre>
    </div>
  ),
}

export const Creatable = {
  name: 'Creatable',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">creatable</code> to let users add
        new options not in the list. A Create row appears at the bottom when the typed query has no
        exact match. Press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> or click
        it to create. Use <code className="font-mono bg-gray-100 px-1 rounded">createLabel</code> to
        customize the row label.
      </span>

      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">creatable (default label)</span>
          <Demo creatable placeholder='Try typing "mango"...' />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">createLabel custom</span>
          <Demo
            creatable
            createLabel={(v) => `+ Add "${v}"`}
            placeholder="Custom create label..."
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use creatable for open-ended tag or category fields',
                body: 'When users need to define their own values — custom tags, ad-hoc labels, free-form categories — creatable lets them add new options without a separate flow.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Persist created options back to your data source',
                body: 'onChange fires { value: "typed text", label: "typed text" } for created options. Save the new option to your backend and add it to the options list so it appears on reload.',
              },
              {
                title: 'Combine with multiple for free-form tag inputs',
                body: 'creatable + multiple is the standard pattern for tag inputs. Users can search existing tags or type to create new ones — all in one field.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Default create label: Create "xxx" */}
<Combobox creatable value={val} onChange={setVal} options={options} />

{/* Custom label */}
<Combobox
  creatable
  createLabel={(v) => \`+ Add "\${v}"\`}
  value={val}
  onChange={setVal}
  options={options}
/>`}</code>
      </pre>
    </div>
  ),
}
