import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
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
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ headers = ['Prop', 'Type', 'Default', 'Description'], rows }) => (
  <div className="mb-6 overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => (
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
        {rows.map((row, ri) => (
          <tr key={ri} className="even:bg-gray-50">
            {row.map((cell, ci) => (
              <td
                key={ci}
                className={`px-3 py-2 border border-gray-200 text-xs ${
                  ci === 0
                    ? 'font-mono text-violet-700 whitespace-nowrap'
                    : ci === 1
                      ? 'font-mono text-gray-500 max-w-xs'
                      : ci === 2
                        ? 'font-mono text-gray-400 whitespace-nowrap'
                        : 'text-gray-700'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Select</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A custom dropdown built from compound sub-components —{' '}
          <code className="font-mono text-sm">SelectTrigger</code>,{' '}
          <code className="font-mono text-sm">SelectContent</code>, and{' '}
          <code className="font-mono text-sm">SelectItem</code>. Fully keyboard-navigable and
          screen-reader friendly. Integrates with{' '}
          <code className="font-mono text-sm">FieldContent</code> for accessible form fields with
          automatic error and disabled state propagation.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
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
        </Preview>
        <Code>{`<FieldContent required>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={setValue}>
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
</FieldContent>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed mb-4 w-full overflow-x-auto">{`Select                           ← root — context provider (value, open, labelMap)
├── SelectTrigger                ← <button> — opens/closes the dropdown
│   └── SelectValue              ← shows selected label or placeholder
└── SelectContent                ← portaled dropdown panel
    ├── SelectGroup              ← <div role="group"> — groups related items
    │   ├── SelectLabel          ← group heading label
    │   ├── SelectItem           ← <div role="option"> — selectable item
    │   └── SelectItem
    ├── SelectSeparator          ← visual divider between groups
    └── SelectItem               ← flat item outside a group`}</pre>

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
                  'Select',
                  'Context Provider',
                  'Root. Manages open state, selected value, and label map. Provides context to all sub-components.',
                ],
                [
                  'SelectTrigger',
                  '<button>',
                  'Opens and closes the dropdown. Reads error, disabled, and id from FieldContent context automatically.',
                ],
                [
                  'SelectValue',
                  '<span>',
                  'Displays the selected item label or placeholder when no value is selected.',
                ],
                [
                  'SelectContent',
                  'Portal <div role="listbox">',
                  'Portaled dropdown panel. Positions itself below the trigger and closes on click outside or scroll.',
                ],
                [
                  'SelectGroup',
                  '<div role="group">',
                  'Wraps a set of related SelectItem components. Used with SelectLabel for accessible grouping.',
                ],
                [
                  'SelectLabel',
                  '<div>',
                  'Muted label heading rendered above a SelectGroup to name the group.',
                ],
                [
                  'SelectItem',
                  '<div role="option">',
                  'Selectable item. Shows a checkmark when selected. Supports disabled prop to block interaction.',
                ],
                [
                  'SelectSeparator',
                  '<div>',
                  'Horizontal visual divider used between groups or sections inside SelectContent.',
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
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Basic — flat list">
          <Preview>
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
          </Preview>
          <Code>{`<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="draft">Draft</SelectItem>
    <SelectItem value="archived">Archived</SelectItem>
  </SelectContent>
</Select>`}</Code>
        </SubSection>

        <SubSection title="With FieldContent">
          <p className="text-xs text-gray-500 mb-3">
            Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> to wire
            up the label, description, error message, and disabled state. SelectTrigger reads all of
            these from context — no manual prop passing needed.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80 flex flex-col gap-4">
            <FieldContent required>
              <FieldLabel>Status</FieldLabel>
              <FieldDescription>Choose the current lifecycle status.</FieldDescription>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            <FieldContent required error="Please select a category.">
              <FieldLabel>Category</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                </SelectContent>
              </Select>
              <FieldError />
            </FieldContent>
            <FieldContent disabled>
              <FieldLabel>Region</FieldLabel>
              <FieldDescription>Auto-assigned — cannot be changed.</FieldDescription>
              <Select defaultValue="asia">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </div>
          <Code>{`{/* Normal */}
<FieldContent required>
  <FieldLabel>Status</FieldLabel>
  <FieldDescription>Choose the current lifecycle status.</FieldDescription>
  <Select onValueChange={setValue}>
    <SelectTrigger>
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
    </SelectContent>
  </Select>
</FieldContent>

{/* Error — trigger turns red automatically */}
<FieldContent required error={errors.category?.message}>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={setValue}>
    <SelectTrigger>
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
    </SelectContent>
  </Select>
  <FieldError />
</FieldContent>

{/* Disabled — trigger and label both dim */}
<FieldContent disabled>
  <FieldLabel>Region</FieldLabel>
  <Select defaultValue="asia">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="asia">Asia</SelectItem>
    </SelectContent>
  </Select>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Grouped + Labels">
          <Preview>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="wib">WIB — Jakarta</SelectItem>
                  <SelectItem value="wita">WITA — Makassar</SelectItem>
                  <SelectItem value="wit">WIT — Jayapura</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="gmt">GMT — London</SelectItem>
                  <SelectItem value="cet">CET — Paris</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Preview>
          <Code>{`<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="wib">WIB — Jakarta</SelectItem>
      <SelectItem value="wita">WITA — Makassar</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT — London</SelectItem>
      <SelectItem value="cet">CET — Paris</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</Code>
        </SubSection>

        <SubSection title="With Separator">
          <Preview>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Essentials</SelectLabel>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Lifestyle</SelectLabel>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Preview>
          <Code>{`<SelectContent>
  <SelectGroup>
    <SelectLabel>Essentials</SelectLabel>
    <SelectItem value="food">Food</SelectItem>
    <SelectItem value="transport">Transport</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Lifestyle</SelectLabel>
    <SelectItem value="entertainment">Entertainment</SelectItem>
  </SelectGroup>
</SelectContent>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <p className="text-xs text-gray-500 mb-3">
            Pass <code className="font-mono bg-gray-100 px-1 rounded">value</code> and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">onValueChange</code> to control the
            selected value externally. Without these, the component manages its own state via{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">defaultValue</code>.
          </p>
          <Code>{`const [value, setValue] = useState('')

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>

{/* With react-hook-form */}
<Controller
  control={control}
  name="status"
  render={({ field, fieldState }) => (
    <FieldContent required error={fieldState.error?.message}>
      <FieldLabel>Status</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use Select when you have 5 or more mutually exclusive options',
                  body: 'A collapsed dropdown fits better than a row of radio buttons when the list is long. Use it for categories, statuses, timezones, and other enumerated values where compact presentation saves space.',
                },
                {
                  title: 'Use SelectGroup + SelectLabel when options span distinct categories',
                  body: 'Grouping keeps the list scannable. Asia / Europe / Americas as group labels beat a flat alphabetical list of 20 timezones.',
                },
                {
                  title: 'Wrap in FieldContent with FieldLabel for all form usage',
                  body: 'FieldContent auto-wires the accessible id, error state, and disabled state to SelectTrigger. Without this, you lose label association and screen reader support.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use Select for 2–4 options when side-by-side comparison helps",
                  body: '"Weekly / Monthly / Yearly" is better as a RadioGroup — users can see all choices at once without opening a dropdown. Reserve Select for longer lists.',
                },
                {
                  title: "Don't use Select when the user must pick more than one value",
                  body: 'This Select does not support multi-select. Use Checkbox, a tag input, or a dedicated multi-select component instead.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always include FieldError when validation is possible',
                  body: 'FieldError renders with role="alert" and is linked via aria-errormessage. This triggers an immediate screen reader announcement when the error message appears.',
                },
                {
                  title: 'Always provide a placeholder on SelectValue',
                  body: 'A placeholder like "Select a category" tells the user the field has not been filled. Without it, the trigger is blank and users may miss that interaction is needed.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't manually set variant on SelectTrigger when inside FieldContent",
                  body: 'FieldContent derives the error and disabled variant from context automatically. Manually overriding can cause the visual and semantic states to diverge.',
                },
                {
                  title: 'Prefer onValueChange over onChange for value handling',
                  body: 'onValueChange receives the selected value string directly — no need to extract e.target.value. This is the idiomatic pattern for compound selects and works cleanly with react-hook-form.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="Select">
          <ApiTable
            rows={[
              ['value', 'string', '—', 'Controlled selected value.'],
              ['defaultValue', 'string', '""', 'Initial value for uncontrolled usage.'],
              [
                'onValueChange',
                '(value: string) => void',
                '—',
                'Called when the user selects an item.',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Disables the entire select. Also auto-applied from FieldContent context.',
              ],
              ['open', 'boolean', '—', 'Controlled open state.'],
              [
                'onOpenChange',
                '(open: boolean) => void',
                '—',
                'Called when the dropdown opens or closes.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="SelectTrigger">
          <ApiTable
            rows={[
              [
                'variant',
                '"default" | "error" | "disabled"',
                'auto',
                'Auto-derived from FieldContent context. Override explicitly only for standalone usage.',
              ],
              ['className', 'string', '—', 'Extra CSS classes on the trigger button.'],
            ]}
          />
        </SubSection>

        <SubSection title="SelectValue">
          <ApiTable
            rows={[
              [
                'placeholder',
                'string',
                '—',
                'Text shown when no value is selected. Rendered in muted color.',
              ],
              [
                'children',
                'ReactNode',
                '—',
                'Override the displayed label entirely. If omitted, the label is derived from the matching SelectItem children.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="SelectContent">
          <ApiTable
            rows={[
              ['className', 'string', '—', 'Extra CSS classes on the dropdown panel.'],
              [
                'position',
                '"popper"',
                '"popper"',
                'Positioning strategy. Currently fixed below the trigger via getBoundingClientRect.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="SelectItem">
          <ApiTable
            rows={[
              ['value', 'string', '—', 'Required. The value stored when this item is selected.'],
              ['disabled', 'boolean', 'false', 'Blocks selection and dims the item visually.'],
              ['className', 'string', '—', 'Extra CSS classes on the item div.'],
            ]}
          />
        </SubSection>

        <SubSection title="SelectGroup · SelectLabel · SelectSeparator">
          <ApiTable
            headers={['Component', 'Props', 'Description']}
            rows={[
              [
                'SelectGroup',
                'className, children',
                'Wraps a set of SelectItem components. Renders with role="group".',
              ],
              [
                'SelectLabel',
                'className',
                'Muted heading above a SelectGroup. No interactive role — purely presentational.',
              ],
              [
                'SelectSeparator',
                'className',
                'Horizontal 1px divider. Use between groups or sections inside SelectContent.',
              ],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
