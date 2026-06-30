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
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'
import FieldContainer from '../Field/FieldContainer'

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

const Preview = ({ children, className = 'w-80' }) => (
  <div
    className={`flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${className}`}
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
          An accessible dropdown menu for selecting a single value from a list of options. Built on
          Radix UI — keyboard navigable, screen-reader friendly, and fully composable. Combine with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldLabel</code> for
          accessible form fields.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="broccoli">Broccoli</SelectItem>
                <SelectItem value="carrot">Carrot</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="All exported sub-components and how they compose.">
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex gap-6 flex-wrap">
            {/* Closed state */}
            <div>
              <p className="text-[10px] font-mono text-gray-400 mb-2">Closed</p>
              <div className="relative p-3 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-52">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  Select
                </span>
                {/* SelectTrigger */}
                <div className="flex flex-col gap-0.5 p-2 border border-dashed border-blue-300 rounded">
                  <span className="text-[10px] font-mono text-blue-500">SelectTrigger</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    {/* SelectValue */}
                    <div className="flex flex-col gap-0.5 px-2 py-1 border border-dashed border-slate-300 rounded flex-1">
                      <span className="text-[10px] font-mono text-slate-400">SelectValue</span>
                      <span className="text-[10px] text-slate-400 font-mono">Pick one</span>
                    </div>
                    <svg className="size-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M3 4.5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Open state */}
            <div>
              <p className="text-[10px] font-mono text-gray-400 mb-2">Open (dropdown)</p>
              <div className="relative p-3 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-52">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  SelectContent
                </span>

                {/* SelectGroup 1 */}
                <div className="flex flex-col gap-1 p-2 border border-dashed border-blue-300 rounded mb-2">
                  <span className="text-[10px] font-mono text-blue-500">SelectGroup</span>
                  {/* SelectLabel */}
                  <div className="flex flex-col gap-0.5 px-2 py-1 border border-dashed border-slate-300 rounded">
                    <span className="text-[10px] font-mono text-slate-400">SelectLabel</span>
                    <span className="text-[10px] text-slate-400 font-mono">Group A</span>
                  </div>
                  {['Option A', 'Option B'].map((o) => (
                    <div
                      key={o}
                      className="flex flex-col gap-0.5 px-2 py-1 border border-dashed border-slate-300 rounded"
                    >
                      <span className="text-[10px] font-mono text-slate-400">SelectItem</span>
                      <span className="text-[10px] text-slate-500 font-mono">{o}</span>
                    </div>
                  ))}
                </div>

                {/* SelectSeparator */}
                <div className="flex flex-col gap-1 px-2 py-1.5 border border-dashed border-green-300 rounded mb-2">
                  <span className="text-[10px] font-mono text-green-500">SelectSeparator</span>
                  <div className="h-px bg-slate-200" />
                </div>

                {/* SelectGroup 2 */}
                <div className="flex flex-col gap-1 p-2 border border-dashed border-blue-300 rounded">
                  <span className="text-[10px] font-mono text-blue-500">SelectGroup</span>
                  <div className="flex flex-col gap-0.5 px-2 py-1 border border-dashed border-slate-300 rounded">
                    <span className="text-[10px] font-mono text-slate-400">SelectItem</span>
                    <span className="text-[10px] text-slate-500 font-mono">Option C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  '<div>',
                  'Root — controls open/close state and selected value. Accepts value, defaultValue, onValueChange, disabled.',
                ],
                [
                  'SelectTrigger',
                  '<button>',
                  'The clickable button that opens the dropdown. Renders the chevron icon. Accepts size.',
                ],
                [
                  'SelectValue',
                  '<span>',
                  'Renders the selected item label inside the trigger. Shows placeholder when nothing is selected.',
                ],
                [
                  'SelectContent',
                  '<div>',
                  'The dropdown panel — rendered in a portal above the rest of the page.',
                ],
                [
                  'SelectGroup',
                  '<div>',
                  'Optional wrapper to group related items. Always pair with SelectLabel.',
                ],
                ['SelectLabel', '<div>', 'Non-selectable heading above a group of options.'],
                [
                  'SelectItem',
                  '<div>',
                  'Individual option. Requires a unique value prop. Accepts disabled.',
                ],
                ['SelectSeparator', '<div>', 'A thin horizontal rule to visually separate groups.'],
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

        <Code>{`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Pick one" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Group A</SelectLabel>
      <SelectItem value="a">Option A</SelectItem>
      <SelectItem value="b">Option B</SelectItem>
    </SelectGroup>

    <SelectSeparator />

    <SelectGroup>
      <SelectLabel>Group B</SelectLabel>
      <SelectItem value="c">Option C</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</Code>
      </Section>

      {/* Sizes */}
      <Section title="Sizes" description="SelectTrigger supports two sizes via the size prop.">
        <div className="flex flex-col gap-4 max-w-xs mb-4">
          {[
            { size: 'sm', label: 'sm — h-8', desc: 'Compact — tight layouts, table rows' },
            { size: 'default', label: 'default — h-9', desc: 'Standard — form fields, modals' },
          ].map(({ size, label, desc }) => (
            <div key={size} className="flex items-center gap-4">
              <div className="w-52 shrink-0">
                <Select>
                  <SelectTrigger size={size} className="w-full">
                    <SelectValue placeholder={label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-mono font-medium text-violet-700">{`size="${size}"`}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Code>{`<SelectTrigger size="sm">...</SelectTrigger>
<SelectTrigger size="default">...</SelectTrigger>`}</Code>
      </Section>

      {/* Grouped options */}
      <Section
        title="Grouped Options"
        description="Use SelectGroup + SelectLabel to organize related items under a named heading."
      >
        <Preview>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="wib">WIB — Jakarta</SelectItem>
                <SelectItem value="wita">WITA — Makassar</SelectItem>
                <SelectItem value="wit">WIT — Jayapura</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="gmt">GMT — London</SelectItem>
                <SelectItem value="cet">CET — Paris</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Preview>

        <Code>{`<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="wib">WIB — Jakarta</SelectItem>
      <SelectItem value="wita">WITA — Makassar</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT — London</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</Code>
      </Section>

      {/* Disabled */}
      <Section title="Disabled" description="Disable the whole trigger or individual items.">
        <SubSection
          title="Disabled trigger — entire select"
          description="Pass disabled to Select (root) or SelectTrigger."
        >
          <Preview>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Entire select is disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Option A</SelectItem>
              </SelectContent>
            </Select>
          </Preview>
          <Code>{`<Select disabled>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>`}</Code>
        </SubSection>

        <SubSection
          title="Disabled items — individual options"
          description="Pass disabled to SelectItem to make specific options unselectable."
        >
          <Preview>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Some options are disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending" disabled>
                  Pending (unavailable)
                </SelectItem>
                <SelectItem value="archived" disabled>
                  Archived (unavailable)
                </SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </Preview>
          <Code>{`<SelectItem value="pending" disabled>Pending (unavailable)</SelectItem>`}</Code>
        </SubSection>
      </Section>

      {/* Error state */}
      <Section
        title="Error State"
        description="Pass error to FieldContent — SelectTrigger reads error state from context automatically and applies the red border, just like Input."
      >
        <Preview>
          <FieldContent size="base" required error="Please select a category.">
            <FieldLabel>Category</FieldLabel>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
            <FieldError />
          </FieldContent>
        </Preview>

        <Code>{`<FieldContent size="base" required error={errors.category?.message}>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={(v) => setValue('category', v)}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectContent>
  </Select>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        <SubSection title="Select (Root)">
          <div className="overflow-x-auto mb-6">
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
                  ['value', 'string', '—', 'Controlled selected value'],
                  ['defaultValue', 'string', '—', 'Uncontrolled initial value'],
                  [
                    'onValueChange',
                    '(value: string) => void',
                    '—',
                    'Fires whenever the user picks a new option',
                  ],
                  [
                    'disabled',
                    'boolean',
                    'false',
                    'Disables the entire select — trigger becomes non-interactive',
                  ],
                  [
                    'required',
                    'boolean',
                    'false',
                    'Marks the select as required for form validation',
                  ],
                  ['open', 'boolean', '—', 'Controlled open state'],
                  [
                    'onOpenChange',
                    '(open: boolean) => void',
                    '—',
                    'Fires when the dropdown opens or closes',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="SelectTrigger">
          <div className="overflow-x-auto mb-6">
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
                    'variant',
                    '"default" | "error" | "disabled"',
                    'auto',
                    'Auto-derived from FieldContent context. Override explicitly when used standalone.',
                  ],
                  [
                    'size',
                    '"xs" | "sm" | "base" | "md" | "lg"',
                    'ctx or "base"',
                    'Auto-derived from FieldContent context size. Override when used standalone.',
                  ],
                  [
                    'className',
                    'string',
                    '—',
                    'Additional CSS classes — use w-full to stretch to parent width',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="SelectItem">
          <div className="overflow-x-auto mb-6">
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
                    'string',
                    '—',
                    'Required — the value committed to form state when this item is selected',
                  ],
                  [
                    'disabled',
                    'boolean',
                    'false',
                    'Makes this item non-selectable — renders dimmed',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the item'],
                  ['children', 'ReactNode', '—', 'Label displayed to the user'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="With FieldContent (recommended for forms)">
          <Preview>
            <FieldContainer gap="base">
              <FieldContent size="base" required>
                <FieldLabel>Category</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>Choose the category that best fits.</FieldDescription>
              </FieldContent>
            </FieldContainer>
          </Preview>
          <Code>{`<FieldContent size="base" required>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={field.onChange} value={field.value}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectContent>
  </Select>
  <FieldDescription>Choose the category that best fits.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Controlled — with react-hook-form">
          <Code>{`const { control } = useForm()

<Controller
  control={control}
  name="category"
  render={({ field, fieldState }) => (
    <FieldContent size="base" required error={fieldState.error?.message}>
      <FieldLabel>Category</FieldLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="transport">Transport</SelectItem>
        </SelectContent>
      </Select>
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </SubSection>

        <SubSection title="Flat list (no groups)">
          <Code>{`<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="archived">Archived</SelectItem>
  </SelectContent>
</Select>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
