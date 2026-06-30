import { useState } from 'react'
import Combobox from './Combobox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const Preview = ({ children, wide }) => (
  <div
    className={`flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${wide ? 'max-w-lg' : 'w-80'}`}
  >
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

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
      600
    )
  )

// ─── Stateful demo helpers ────────────────────────────────────────────────────

function Demo(props) {
  const [val, setVal] = useState(null)
  return <Combobox value={val} onChange={setVal} options={FRUITS} {...props} />
}

function MultiDemo(props) {
  const [val, setVal] = useState([])
  return <Combobox value={val} onChange={setVal} options={FRUITS} multiple {...props} />
}

function FieldDemo({ error, description, label = 'Favourite fruit', required = false, ...props }) {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Combobox value={val} onChange={setVal} options={FRUITS} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError />}
    </FieldContent>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Combobox</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A searchable select with support for single and multi-select, grouped options, async
          search, and creatable options. Value is always a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">{'{ value, label }'}</code>{' '}
          object (or array of objects for multi). Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Demo placeholder="Search fruits..." />
          <MultiDemo placeholder="Pick multiple fruits..." />
          <FieldDemo label="Favourite fruit" required description="Type to search." />
          <FieldDemo label="Required field" required error="This field is required." />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Combobox has two trigger modes. inputTrigger (default) renders a combined input + popover. Button trigger renders a button that opens a popover with a search input inside."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex gap-14 mb-2">
            {/* Input trigger */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                inputTrigger=true (default)
              </span>
              <div className="relative pt-6 pb-5 px-5 border-2 border-dashed border-violet-400 rounded-xl w-80">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  FieldContent <span className="text-slate-400 font-normal">(optional)</span>
                </span>
                <div className="relative px-3 pt-5 pb-2 border border-dashed border-green-300 rounded mb-5">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldLabel
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Favourite fruit</span>
                </div>
                <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-blue-300 rounded">
                  <span className="text-xs font-mono text-blue-500">Combobox</span>
                  <div className="flex items-center gap-2 h-8 px-3 rounded border border-violet-400 bg-white">
                    <div className="flex gap-1 items-center">
                      <span className="bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        Apple ×
                      </span>
                      <span className="bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        Banana ×
                      </span>
                    </div>
                    <div className="border border-dashed border-slate-300 rounded px-2 py-0.5 flex-1">
                      <span className="text-[10px] text-slate-400 font-mono">Search input</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[10px] text-slate-400 font-mono border border-dashed border-slate-300 rounded px-1">
                        ×
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono border border-dashed border-slate-300 rounded px-1">
                        ⌄
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-2 py-2 border border-dashed border-slate-300 rounded">
                    <span className="text-[10px] font-mono text-slate-400 mb-0.5">Popover</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] bg-violet-50 text-violet-700">
                      <span className="opacity-100">✓</span> Apple
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-slate-600 hover:bg-gray-100">
                      <span className="opacity-0">✓</span> Banana
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-violet-600 border border-dashed border-violet-200">
                      <span className="opacity-0">✓</span> Create "mango" ← creatable
                    </div>
                  </div>
                </div>
                <div className="relative px-3 pt-5 pb-2 border border-dashed border-green-300 rounded mt-5">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    FieldError
                  </span>
                  <span className="text-xs text-slate-400 font-mono">This field is required.</span>
                </div>
              </div>
            </div>

            {/* Button trigger */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                inputTrigger=false
              </span>
              <div className="flex flex-col gap-3 p-5 border-2 border-dashed border-blue-300 rounded-xl w-64">
                <span className="text-xs font-mono text-blue-500">Combobox</span>
                <div className="flex items-center justify-between gap-2 h-8 px-3 rounded border border-slate-200 bg-white">
                  <span className="text-xs text-slate-700 font-mono">Apple</span>
                  <div className="flex gap-1">
                    <span className="text-[10px] text-slate-400 border border-dashed border-slate-300 rounded px-1">
                      ×
                    </span>
                    <span className="text-[10px] text-slate-400 border border-dashed border-slate-300 rounded px-1">
                      ⌄
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 px-2 py-2 border border-dashed border-slate-300 rounded">
                  <div className="px-1 pb-1.5 mb-1 border-b border-slate-100">
                    <div className="border border-dashed border-slate-300 rounded px-2 py-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Search input (inside popover)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] bg-violet-50 text-violet-700">
                    <span>✓</span> Apple
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-slate-600">
                    <span className="opacity-0">✓</span> Banana
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Element', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Trigger',
                  'div / button',
                  'The clickable area. Input div (inputTrigger) or button (button trigger).',
                ],
                [
                  'ComboTag',
                  'span',
                  'Selected item badge shown inside the trigger (multi-select only).',
                ],
                [
                  'SearchInput',
                  'input',
                  'Filters options as user types. Inside trigger (inputTrigger) or inside Popover (button trigger).',
                ],
                [
                  'ClearButton',
                  'button',
                  'Removes all selections. Shown when clearable=true and a value is selected.',
                ],
                [
                  'Popover',
                  'div',
                  'Floating container. Contains the option list (and search input for button trigger).',
                ],
                [
                  'ComboOption',
                  'button',
                  'A single selectable item. Shows a checkmark when selected.',
                ],
                [
                  'ComboGroup',
                  'div',
                  'A labeled group of ComboOptions. Rendered when options use the group+items shape.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`import Combobox from '@/components/base/Combobox/Combobox'

const options = [
  { value: 'apple',  label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

<Combobox
  value={val}
  onChange={setVal}
  options={options}
  placeholder="Select..."
/>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Single select. value is { value, label } | null. onChange receives the selected option object."
      >
        <Preview>
          <Demo />
          <FieldDemo label="Favourite fruit" required description="Type to filter the list." />
        </Preview>
        <Code>{`const [val, setVal] = useState(null)
// val = { value: 'apple', label: 'Apple' } | null

<Combobox
  value={val}
  onChange={setVal}
  options={[
    { value: 'apple',  label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ]}
/>`}</Code>
      </Section>

      {/* Multiple */}
      <Section
        title="Multiple"
        description="Pass multiple to enable multi-select. value becomes an array of option objects. Use max to cap the number of selections."
      >
        <Preview wide>
          <MultiDemo placeholder="Pick fruits..." />
          <MultiDemo placeholder="Max 2 selections" max={2} />
        </Preview>
        <Code>{`const [val, setVal] = useState([])
// val = [{ value: 'apple', label: 'Apple' }, ...]

{/* Unlimited */}
<Combobox multiple value={val} onChange={setVal} options={options} />

{/* Capped at 2 */}
<Combobox multiple max={2} value={val} onChange={setVal} options={options} />`}</Code>
      </Section>

      {/* Groups */}
      <Section
        title="Groups"
        description="Pass options in the { group, items[] } shape to render labeled groups. Flat and grouped options cannot be mixed in the same array."
      >
        <Preview>
          {(() => {
            const [val, setVal] = useState(null)
            return (
              <Combobox
                value={val}
                onChange={setVal}
                options={GROUPED}
                placeholder="Select food..."
              />
            )
          })()}
        </Preview>
        <Code>{`const options = [
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
      { value: 'carrot',   label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
]

<Combobox value={val} onChange={setVal} options={options} />`}</Code>
      </Section>

      {/* Trigger type */}
      <Section
        title="Trigger Type"
        description="inputTrigger=true (default) renders an inline input. inputTrigger=false renders a button with search inside the popover — useful when the trigger must look like a Select."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">
              inputTrigger=true (default)
            </span>
            <Demo />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">inputTrigger=false</span>
            <Demo inputTrigger={false} />
          </div>
        </Preview>
        <Code>{`{/* Inline search input — feels like a search field */}
<Combobox inputTrigger value={val} onChange={setVal} options={options} />

{/* Button trigger — feels like a Select with search */}
<Combobox inputTrigger={false} value={val} onChange={setVal} options={options} />`}</Code>
      </Section>

      {/* Async */}
      <Section
        title="Async Search"
        description="Pass onSearch to delegate filtering to the server. The component debounces 300ms, shows a spinner while loading, and replaces the option list with the returned results."
      >
        <Preview>
          {(() => {
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
          })()}
        </Preview>
        <Code>{`const searchFruits = async (query) => {
  const res = await fetch(\`/api/fruits?q=\${query}\`)
  return res.json()  // [{ value, label }]
}

<Combobox
  value={val}
  onChange={setVal}
  onSearch={searchFruits}
  placeholder="Type to search..."
  emptyText="No results."
/>`}</Code>
      </Section>

      {/* Creatable */}
      <Section
        title="Creatable"
        description="Pass creatable to let users add new options not in the list. When the typed query has no exact match, a Create option appears at the bottom. Use createLabel to customize the label."
      >
        <Preview>
          <Demo creatable placeholder="Search or create..." />
          <Demo
            creatable
            createLabel={(v) => `+ Add "${v}"`}
            placeholder="Custom create label..."
          />
        </Preview>
        <Code>{`{/* Default create label: Create "xxx" */}
<Combobox creatable value={val} onChange={setVal} options={options} />

{/* Custom create label */}
<Combobox
  creatable
  createLabel={(v) => \`+ Add "\${v}"\`}
  value={val}
  onChange={setVal}
  options={options}
/>`}</Code>
      </Section>

      {/* Clearable */}
      <Section
        title="Clearable"
        description="clearable=true (default) shows an × button when a value is selected. Pass clearable={false} to remove it."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">clearable=true (default)</span>
            <Demo />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">clearable=false</span>
            <Demo clearable={false} />
          </div>
        </Preview>
        <Code>{`{/* With clear button (default) */}
<Combobox clearable value={val} onChange={setVal} options={options} />

{/* No clear button */}
<Combobox clearable={false} value={val} onChange={setVal} options={options} />`}</Code>
      </Section>

      {/* Disabled option */}
      <Section
        title="Disabled Option"
        description="Add disabled: true to any option object to make it non-selectable. Shown visually muted."
      >
        <Preview>
          <Demo
            options={[
              { value: 'apple', label: 'Apple' },
              { value: 'durian', label: 'Durian', disabled: true },
              { value: 'grape', label: 'Grape' },
            ]}
          />
        </Preview>
        <Code>{`const options = [
  { value: 'apple',  label: 'Apple' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'grape',  label: 'Grape' },
]`}</Code>
      </Section>

      {/* Sizes */}
      <Section title="Sizes" description="Five sizes following the same scale as Input and Select.">
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-xs">
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <Demo size={size} />
            </div>
          ))}
        </div>
        <Code>{`<Combobox size="xs"   value={val} onChange={setVal} options={options} />
<Combobox size="sm"   value={val} onChange={setVal} options={options} />
<Combobox size="base" value={val} onChange={setVal} options={options} />  {/* default */}
<Combobox size="md"   value={val} onChange={setVal} options={options} />
<Combobox size="lg"   value={val} onChange={setVal} options={options} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled to prevent interaction. Also inherits from FieldContent context."
      >
        <Preview>
          <Combobox disabled options={FRUITS} placeholder="Select..." />
          <Combobox disabled options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
          <FieldContent size="base" disabled>
            <FieldLabel>Favourite fruit</FieldLabel>
            <Combobox options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
          </FieldContent>
        </Preview>
        <Code>{`<Combobox disabled value={val} onChange={setVal} options={options} />

<FieldContent size="base" disabled>
  <FieldLabel>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
</FieldContent>`}</Code>
      </Section>

      {/* Error */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop. Combobox reads hasError from context automatically."
      >
        <Preview>
          <Combobox variant="error" options={FRUITS} placeholder="Select..." />
          <FieldDemo label="Favourite fruit" required error="This field is required." />
        </Preview>
        <Code>{`{/* Explicit variant */}
<Combobox variant="error" value={val} onChange={setVal} options={options} />

{/* Via FieldContent */}
<FieldContent size="base" error="This field is required.">
  <FieldLabel required>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for fully accessible form fields."
      >
        <Preview>
          <FieldDemo label="Favourite fruit" required description="Type to filter." />
          <FieldDemo label="Optional pick" description="Leave blank to skip." />
        </Preview>
        <Code>{`<FieldContent size="base">
  <FieldLabel required>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
  <FieldDescription>Type to filter.</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller. Combobox's onChange passes a { value, label } object (or array for multiple), not a native event. Extract .value before sending to the server."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="fruit"
  control={control}
  rules={{ required: 'This field is required.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.fruit?.message}>
      <FieldLabel required>Favourite fruit</FieldLabel>
      <Combobox
        value={field.value ?? null}
        onChange={field.onChange}
        options={options}
      />
      <FieldError />
    </FieldContent>
  )}
/>

{/* Extract value before API call */}
const payload = { fruit: formData.fruit?.value }`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'value',
                  '{ value, label } | { value, label }[] | null',
                  'null',
                  'Controlled value. Object for single, array for multiple.',
                ],
                [
                  'onChange',
                  '(val) => void',
                  '—',
                  'Fires with the selected option object or array.',
                ],
                [
                  'options',
                  '{ value, label, disabled? }[] | { group, items[] }[]',
                  '[]',
                  'Flat or grouped option list.',
                ],
                [
                  'onSearch',
                  '(query: string) => Promise<options[]>',
                  '—',
                  'Async search. Overrides client-side filtering. Debounced 300ms.',
                ],
                ['multiple', 'boolean', 'false', 'Enable multi-select. value becomes an array.'],
                [
                  'inputTrigger',
                  'boolean',
                  'true',
                  'Render inline search input (true) or button + popover search (false).',
                ],
                ['clearable', 'boolean', 'true', 'Show × button to clear selection.'],
                [
                  'creatable',
                  'boolean',
                  'false',
                  'Allow user to create new options not in the list.',
                ],
                ['max', 'number', '—', 'Maximum number of selections (multiple only).'],
                [
                  'placeholder',
                  'string',
                  '"Select..."',
                  'Placeholder text when nothing is selected.',
                ],
                [
                  'searchPlaceholder',
                  'string',
                  '"Search..."',
                  'Placeholder inside the search input.',
                ],
                [
                  'emptyText',
                  'string',
                  '"No results."',
                  'Text shown when no options match the query.',
                ],
                [
                  'createLabel',
                  '(value: string) => string',
                  'Create "xxx"',
                  'Label for the creatable option row.',
                ],
                [
                  'disabled',
                  'boolean',
                  'false',
                  'Prevents interaction. Also inherits from FieldContent.',
                ],
                [
                  'variant',
                  '"default" | "error" | "disabled"',
                  '—',
                  'Override the auto-detected visual variant.',
                ],
                [
                  'size',
                  '"xs" | "sm" | "base" | "md" | "lg"',
                  '"base"',
                  'Trigger height. Inherits from FieldContent if not set.',
                ],
                [
                  'align',
                  '"start" | "center" | "end"',
                  '"start"',
                  'Popover alignment relative to the trigger.',
                ],
                ['className', 'string', '—', 'Additional classes on the trigger element.'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                    {type}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {def}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  ),
}
