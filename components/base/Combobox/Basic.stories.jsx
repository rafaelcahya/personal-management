import { useState } from 'react'
import Combobox from './Combobox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox/Basic',
}

export default meta

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

// ─── Basic ────────────────────────────────────────────────────────────────────

export const Basic = {
  name: 'Basic',
  render: () => {
    const [val, setVal] = useState(null)
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Single select with client-side search. Type to filter the list.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'{ value, label }'}</code>{' '}
          or <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code>.
        </p>

        <div className="flex flex-col gap-1.5 w-80">
          <Combobox value={val} onChange={setVal} options={FRUITS} placeholder="Search fruits..." />
          <span className="text-[10px] font-mono text-gray-400">
            value:{' '}
            <span className="text-gray-700">{val === null ? 'null' : JSON.stringify(val)}</span>
          </span>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
    )
  },
}

// ─── Multiple ─────────────────────────────────────────────────────────────────

export const Multiple = {
  name: 'Multiple',
  render: () => {
    const [val, setVal] = useState([])
    const [valMax, setValMax] = useState([])
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">multiple</code> to
          enable multi-select. Selections appear as removable tags inside the trigger. Use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">max</code> to cap the number
          of items.
        </p>

        <div className="flex flex-col gap-5 w-80">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">multiple</span>
            <Combobox
              multiple
              value={val}
              onChange={setVal}
              options={FRUITS}
              placeholder="Pick fruits..."
            />
            <span className="text-[10px] font-mono text-gray-400">
              value:{' '}
              <span className="text-gray-700">{val.length === 0 ? '[]' : JSON.stringify(val)}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">multiple max=2</span>
            <Combobox
              multiple
              max={2}
              value={valMax}
              onChange={setValMax}
              options={FRUITS}
              placeholder="Max 2 items..."
            />
            <span className="text-[10px] font-mono text-gray-400">
              value:{' '}
              <span className="text-gray-700">
                {valMax.length === 0 ? '[]' : JSON.stringify(valMax)}
              </span>
            </span>
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [val, setVal] = useState([])

<Combobox multiple value={val} onChange={setVal} options={options} />

{/* Capped at 2 */}
<Combobox multiple max={2} value={val} onChange={setVal} options={options} />`}</code>
        </pre>
      </div>
    )
  },
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export const Groups = {
  name: 'Groups',
  render: () => {
    const [val, setVal] = useState(null)
    const [valMulti, setValMulti] = useState([])
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass options in the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'{ group, items[] }'}</code>{' '}
          shape to render labeled groups. Works with both single and multi-select.
        </p>

        <div className="flex flex-col gap-5 w-80">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">single + groups</span>
            <Combobox
              value={val}
              onChange={setVal}
              options={GROUPED}
              placeholder="Select food..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">multiple + groups</span>
            <Combobox
              multiple
              value={valMulti}
              onChange={setValMulti}
              options={GROUPED}
              placeholder="Pick foods..."
            />
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
    )
  },
}

// ─── TriggerType ──────────────────────────────────────────────────────────────

export const TriggerType = {
  name: 'Trigger Type',
  render: () => {
    const [valInput, setValInput] = useState(null)
    const [valButton, setValButton] = useState(null)
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">inputTrigger=true</code>{' '}
          (default) renders an inline search input inside the trigger — feels like a search field.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">inputTrigger=false</code>{' '}
          renders a button with the search input inside the popover — feels like a Select with
          search.
        </p>

        <div className="flex flex-col gap-5 w-80">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">
              inputTrigger=true (default)
            </span>
            <Combobox
              value={valInput}
              onChange={setValInput}
              options={FRUITS}
              placeholder="Type to search..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">inputTrigger=false</span>
            <Combobox
              inputTrigger={false}
              value={valButton}
              onChange={setValButton}
              options={FRUITS}
              placeholder="Click to open..."
            />
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* Inline search — default */}
<Combobox inputTrigger value={val} onChange={setVal} options={options} />

{/* Button with search inside popover */}
<Combobox inputTrigger={false} value={val} onChange={setVal} options={options} />`}</code>
        </pre>
      </div>
    )
  },
}

// ─── AsyncSearch ──────────────────────────────────────────────────────────────

export const AsyncSearch = {
  name: 'Async Search',
  render: () => {
    const [val, setVal] = useState(null)
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">onSearch</code> to
          delegate filtering to the server. Input is debounced 300ms. A spinner shows while loading.
          The option list is replaced with whatever the promise resolves to.
        </p>

        <div className="flex flex-col gap-1.5 w-80">
          <Combobox
            value={val}
            onChange={setVal}
            onSearch={mockSearch}
            placeholder="Type to search..."
            emptyText="No fruits found."
          />
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const searchFruits = async (query) => {
  const res = await fetch(\`/api/fruits?q=\${query}\`)
  return res.json()  // returns [{ value, label }]
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
    )
  },
}

// ─── Creatable ────────────────────────────────────────────────────────────────

export const Creatable = {
  name: 'Creatable',
  render: () => {
    const [val, setVal] = useState(null)
    const [valCustom, setValCustom] = useState(null)
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">creatable</code> to let
          users add options not in the list. A "Create" row appears at the bottom when the typed
          query has no exact match. Press{' '}
          <kbd className="font-mono bg-gray-100 px-1 rounded text-xs">Enter</kbd> or click it to
          create.
        </p>

        <div className="flex flex-col gap-5 w-80">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">creatable (default label)</span>
            <Combobox
              creatable
              value={val}
              onChange={setVal}
              options={FRUITS}
              placeholder='Try typing "mango"...'
            />
            <span className="text-[10px] font-mono text-gray-400">
              value:{' '}
              <span className="text-gray-700">{val === null ? 'null' : JSON.stringify(val)}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-violet-700">
              creatable + custom createLabel
            </span>
            <Combobox
              creatable
              createLabel={(v) => `+ Add "${v}"`}
              value={valCustom}
              onChange={setValCustom}
              options={FRUITS}
              placeholder='Try typing "mango"...'
            />
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
    )
  },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Five sizes following the same scale as Input and Select. Inherits from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> when not
        set explicitly.
      </p>

      <div className="flex flex-col gap-3 w-72">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => {
          const [val, setVal] = useState(null)
          return (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <Combobox size={size} value={val} onChange={setVal} options={FRUITS} />
            </div>
          )
        })}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Combobox size="xs"   value={val} onChange={setVal} options={options} />
<Combobox size="sm"   value={val} onChange={setVal} options={options} />
<Combobox size="base" value={val} onChange={setVal} options={options} />  {/* default */}
<Combobox size="md"   value={val} onChange={setVal} options={options} />
<Combobox size="lg"   value={val} onChange={setVal} options={options} />`}</code>
      </pre>
    </div>
  ),
}
