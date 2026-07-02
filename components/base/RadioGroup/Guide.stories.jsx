import { RadioGroup, RadioGroupItem } from './RadioGroup'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group',
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

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Radio Group</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A set of mutually exclusive options — selecting one deselects the others. Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <RadioGroup defaultValue="standard">
            {[
              { value: 'standard', label: 'Standard — free, 5–7 days' },
              { value: 'express', label: 'Express — Rp 25.000, 2–3 days' },
              { value: 'overnight', label: 'Overnight — Rp 75.000, next day' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`ov-${value}`} />
                <label
                  htmlFor={`ov-${value}`}
                  className="text-sm font-medium cursor-pointer select-none"
                >
                  {label}
                </label>
              </div>
            ))}
          </RadioGroup>
          <FieldContent size="base" error="Please select a payment method.">
            <FieldLabel required>Payment method</FieldLabel>
            <RadioGroup>
              {[
                { value: 'card', label: 'Credit / debit card' },
                { value: 'transfer', label: 'Bank transfer' },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center gap-2">
                  <RadioGroupItem value={value} id={`ov-err-${value}`} aria-invalid />
                  <label
                    htmlFor={`ov-err-${value}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <FieldError />
          </FieldContent>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="RadioGroup wraps multiple RadioGroupItem elements. Pair with FieldContent for accessible labeling and error state."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-64">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent <span className="text-slate-400 font-normal">(optional)</span>
            </span>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pick one</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3 border-2 border-dashed border-blue-300 rounded mb-2">
              <span className="text-[10px] font-mono text-blue-500 mb-1">RadioGroup</span>
              {['Option A', 'Option B'].map((label) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded"
                >
                  <span className="text-[10px] font-mono text-slate-400">RadioGroupItem</span>
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full border-2 border-violet-500 flex items-center justify-center shrink-0">
                      {label === 'Option A' && (
                        <div className="size-2 rounded-full bg-violet-500" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldError
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Select an option.</span>
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
                  'FieldContent',
                  '<div>',
                  'Optional wrapper. Provides accessible ID, error state, disabled, and size via context.',
                ],
                ['FieldLabel', '<label>', 'Optional label for the entire group.'],
                [
                  'RadioGroup',
                  '<div>',
                  'Root container. Manages value and keyboard navigation (arrow keys).',
                ],
                [
                  'RadioGroupItem',
                  '<button>',
                  'Individual radio option. Requires a unique value prop. Always pair with a <label>.',
                ],
                [
                  'FieldError',
                  '<p>',
                  'Optional error message. Only renders when FieldContent has an error prop.',
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

        <Code>{`import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup/RadioGroup'

<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-a" id="option-a" />
    <label htmlFor="option-a">Option A</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-b" id="option-b" />
    <label htmlFor="option-b">Option B</label>
  </div>
</RadioGroup>`}</Code>
      </Section>

      {/* Basic */}
      <Section
        title="Basic"
        description="Pass defaultValue for an uncontrolled group, or value + onValueChange for a controlled one. Keyboard navigation via arrow keys — pressing an arrow key moves focus and selects the next option."
      >
        <Preview>
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
        </Preview>
        <Code>{`<RadioGroup defaultValue="standard">
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
</RadioGroup>`}</Code>
      </Section>

      {/* Horizontal */}
      <Section
        title="Horizontal Layout"
        description='Override the default vertical layout by passing className="flex flex-row gap-6" to RadioGroup. Use this for short option labels like sizes or ratings.'
      >
        <Preview>
          <RadioGroup defaultValue="m" className="flex flex-row gap-6">
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
        </Preview>
        <Code>{`<RadioGroup defaultValue="m" className="flex flex-row gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="s" id="s" />
    <label htmlFor="s" className="text-sm font-medium cursor-pointer select-none">S</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="m" id="m" />
    <label htmlFor="m" className="text-sm font-medium cursor-pointer select-none">M</label>
  </div>
</RadioGroup>`}</Code>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled to RadioGroup to disable all items, or to individual RadioGroupItem to disable specific options."
      >
        <div className="flex gap-12 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono text-violet-700 mb-1">entire group disabled</p>
            <RadioGroup defaultValue="a" disabled>
              {['Option A', 'Option B', 'Option C'].map((label, i) => {
                const val = String.fromCharCode(97 + i)
                return (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`dis-all-${val}`} />
                    <label
                      htmlFor={`dis-all-${val}`}
                      className="text-sm font-medium cursor-not-allowed select-none opacity-50"
                    >
                      {label}
                    </label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono text-violet-700 mb-1">individual items disabled</p>
            <RadioGroup defaultValue="a">
              {[
                { val: 'a', label: 'Option A', disabled: false },
                { val: 'b', label: 'Option B (unavailable)', disabled: true },
                { val: 'c', label: 'Option C', disabled: false },
              ].map(({ val, label, disabled }) => (
                <div key={val} className="flex items-center gap-2">
                  <RadioGroupItem value={val} id={`dis-item-${val}`} disabled={disabled} />
                  <label
                    htmlFor={`dis-item-${val}`}
                    className={`text-sm font-medium select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <Code>{`{/* Disable entire group */}
<RadioGroup disabled>...</RadioGroup>

{/* Disable individual item */}
<RadioGroupItem value="b" id="b" disabled />`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop to show a validation message via FieldError. Pass aria-invalid to each RadioGroupItem to apply the error border."
      >
        <Preview>
          <FieldContent size="base" error="Please select a payment method.">
            <FieldLabel required>Payment method</FieldLabel>
            <RadioGroup>
              {[
                { value: 'card', label: 'Credit / debit card' },
                { value: 'transfer', label: 'Bank transfer' },
                { value: 'wallet', label: 'E-wallet' },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center gap-2">
                  <RadioGroupItem value={value} id={`err-${value}`} aria-invalid />
                  <label
                    htmlFor={`err-${value}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.payment?.message}>
  <FieldLabel required>Payment method</FieldLabel>
  <RadioGroup onValueChange={(v) => setValue('payment', v)}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="card" id="card" aria-invalid={!!errors.payment} />
      <label htmlFor="card" className="text-sm font-medium cursor-pointer select-none">
        Credit / debit card
      </label>
    </div>
  </RadioGroup>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — RadioGroup's onValueChange returns a string, not a native event, so register() alone does not work."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="plan"
  control={control}
  rules={{ required: 'Please select a plan.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.plan?.message}>
      <FieldLabel required>Plan</FieldLabel>
      <RadioGroup value={field.value} onValueChange={field.onChange}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="free" id="free" aria-invalid={!!errors.plan} />
          <label htmlFor="free" className="text-sm font-medium cursor-pointer select-none">Free</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pro" id="pro" aria-invalid={!!errors.plan} />
          <label htmlFor="pro" className="text-sm font-medium cursor-pointer select-none">Pro</label>
        </div>
      </RadioGroup>
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        <p className="text-xs font-mono text-violet-700 mb-3">RadioGroup</p>
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
                ['value', 'string', '—', 'Controlled selected value.'],
                ['defaultValue', 'string', '—', 'Initial value when uncontrolled.'],
                [
                  'onValueChange',
                  '(value: string) => void',
                  '—',
                  'Callback fired when selection changes.',
                ],
                ['disabled', 'boolean', 'false', 'Disables all items in the group.'],
                [
                  'required',
                  'boolean',
                  'false',
                  'Marks the group as required for form submission.',
                ],
                ['name', 'string', '—', 'Name submitted with the form.'],
                [
                  'orientation',
                  `'horizontal' | 'vertical'`,
                  `'vertical'`,
                  'Direction for arrow-key navigation.',
                ],
                ['className', 'string', '—', 'Additional Tailwind classes.'],
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

        <p className="text-xs font-mono text-violet-700 mb-3">RadioGroupItem</p>
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
                ['value', 'string', '—', 'Required. Unique value for this item within the group.'],
                ['disabled', 'boolean', 'false', 'Disables this item only.'],
                ['aria-invalid', 'boolean', '—', 'Applies error border when true.'],
                ['className', 'string', '—', 'Additional Tailwind classes.'],
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
