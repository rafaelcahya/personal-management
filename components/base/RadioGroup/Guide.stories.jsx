import { RadioGroup, RadioGroupItem } from './RadioGroup'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group',
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
          <h1 className="text-3xl font-bold text-gray-900">Radio Group</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A set of mutually exclusive options — selecting one deselects the others. Built from
          scratch with full keyboard navigation (arrow keys) and screen-reader accessibility. Pairs
          with <code className="font-mono text-sm">FieldContent</code> for accessible labels and
          validation error display.
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
          <FieldContent error="Please select a payment method.">
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
        <Code>{`import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup/RadioGroup'

<RadioGroup defaultValue="standard" onValueChange={setValue}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="standard" id="standard" />
    <label htmlFor="standard" className="text-sm font-medium cursor-pointer select-none">
      Standard — free, 5–7 days
    </label>
  </div>
</RadioGroup>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="RadioGroup wraps multiple RadioGroupItem elements. Pair with FieldContent for accessible labeling and error state."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-64">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent <span className="text-slate-400 font-normal">(optional)</span>
            </span>
            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pick one</span>
            </div>
            <div className="flex flex-col gap-1.5 p-3 border-2 border-dashed border-blue-300 rounded mb-2">
              <span className="text-[10px] font-mono text-blue-500 mb-1">RadioGroup</span>
              {['Option A', 'Option B'].map((label) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 px-3 py-2 border border-dashed border-slate-300 rounded"
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
                  'Optional wrapper. Provides accessible ID, error state, and disabled state via context.',
                ],
                [
                  'FieldLabel',
                  '<label>',
                  'Optional label for the entire group. Add required for the asterisk marker.',
                ],
                [
                  'RadioGroup',
                  '<div role="radiogroup">',
                  'Root container. Manages value state and arrow-key navigation between items.',
                ],
                [
                  'RadioGroupItem',
                  '<button role="radio">',
                  'Individual radio option. Reads disabled from context. Contains a hidden <input type="radio"> for form submission.',
                ],
                [
                  'FieldError',
                  '<p role="alert">',
                  'Optional error message. Only renders when FieldContent has an error prop set.',
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
        <SubSection title="Basic">
          <p className="text-xs text-gray-500 mb-3">
            Pass <code className="font-mono bg-gray-100 px-1 rounded">defaultValue</code> for
            uncontrolled, or <code className="font-mono bg-gray-100 px-1 rounded">value</code> +{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">onValueChange</code> for
            controlled. Arrow keys move focus and select the next item automatically.
          </p>
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
          <Code>{`<RadioGroup defaultValue="standard" onValueChange={setValue}>
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
        </SubSection>

        <SubSection title="Horizontal Layout">
          <p className="text-xs text-gray-500 mb-3">
            Override the default vertical layout with{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">
              className="flex flex-row gap-6"
            </code>
            . Also pass{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">orientation="horizontal"</code> so
            arrow-left / arrow-right navigate between items correctly.
          </p>
          <Preview>
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
          </Preview>
          <Code>{`<RadioGroup defaultValue="m" orientation="horizontal" className="flex flex-row gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="s" id="s" />
    <label htmlFor="s" className="text-sm font-medium cursor-pointer select-none">S</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="m" id="m" />
    <label htmlFor="m" className="text-sm font-medium cursor-pointer select-none">M</label>
  </div>
</RadioGroup>`}</Code>
        </SubSection>

        <SubSection title="With FieldContent">
          <p className="text-xs text-gray-500 mb-3">
            Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> to add
            a group label, description, and error message with proper accessibility wiring.
          </p>
          <Preview>
            <FieldContent>
              <FieldLabel required>Plan</FieldLabel>
              <FieldDescription>Choose the plan that fits your team size.</FieldDescription>
              <RadioGroup defaultValue="pro">
                {[
                  { value: 'free', label: 'Free — up to 3 users' },
                  { value: 'pro', label: 'Pro — up to 20 users' },
                  { value: 'enterprise', label: 'Enterprise — unlimited' },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={`plan-${value}`} />
                    <label
                      htmlFor={`plan-${value}`}
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent>
  <FieldLabel required>Plan</FieldLabel>
  <FieldDescription>Choose the plan that fits your team size.</FieldDescription>
  <RadioGroup value={field.value} onValueChange={field.onChange}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="free" id="free" />
      <label htmlFor="free" className="text-sm font-medium cursor-pointer select-none">Free</label>
    </div>
  </RadioGroup>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <p className="text-xs text-gray-500 mb-3">
            Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">RadioGroup</code> to disable all
            items, or to individual{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">RadioGroupItem</code> for specific
            options. Apply <code className="font-mono bg-gray-100 px-1 rounded">opacity-50</code> to
            each row wrapper so both the item and label visually dim.
          </p>
          <Preview>
            <div>
              <p className="text-[10px] font-mono text-violet-700 mb-2">entire group disabled</p>
              <RadioGroup defaultValue="a" disabled>
                {['Option A', 'Option B', 'Option C'].map((label, i) => {
                  const val = String.fromCharCode(97 + i)
                  return (
                    <div key={val} className="flex items-center gap-2 opacity-50">
                      <RadioGroupItem value={val} id={`guide-dis-all-${val}`} />
                      <label
                        htmlFor={`guide-dis-all-${val}`}
                        className="text-sm font-medium cursor-not-allowed select-none"
                      >
                        {label}
                      </label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
            <div>
              <p className="text-[10px] font-mono text-violet-700 mb-2">
                individual items disabled
              </p>
              <RadioGroup defaultValue="a">
                {[
                  { val: 'a', label: 'Option A', disabled: false },
                  { val: 'b', label: 'Option B (unavailable)', disabled: true },
                  { val: 'c', label: 'Option C', disabled: false },
                ].map(({ val, label, disabled }) => (
                  <div
                    key={val}
                    className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''}`}
                  >
                    <RadioGroupItem value={val} id={`guide-dis-item-${val}`} disabled={disabled} />
                    <label
                      htmlFor={`guide-dis-item-${val}`}
                      className={`text-sm font-medium select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Preview>
          <Code>{`{/* Entire group disabled */}
<RadioGroup disabled>
  <div className="flex items-center gap-2 opacity-50">
    <RadioGroupItem value="a" id="a" />
    <label htmlFor="a" className="text-sm font-medium cursor-not-allowed select-none">Option A</label>
  </div>
</RadioGroup>

{/* Individual item disabled */}
<RadioGroup>
  <div className="flex items-center gap-2 opacity-50">
    <RadioGroupItem value="b" id="b" disabled />
    <label htmlFor="b" className="text-sm font-medium cursor-not-allowed select-none">
      Option B (unavailable)
    </label>
  </div>
</RadioGroup>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <p className="text-xs text-gray-500 mb-3">
            Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop and add{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">aria-invalid</code> on each{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">RadioGroupItem</code> to apply the
            red error border.
          </p>
          <Preview>
            <FieldContent error="Please select a payment method.">
              <FieldLabel required>Payment method</FieldLabel>
              <RadioGroup>
                {[
                  { value: 'card', label: 'Credit / debit card' },
                  { value: 'transfer', label: 'Bank transfer' },
                  { value: 'wallet', label: 'E-wallet' },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={`err2-${value}`} aria-invalid />
                    <label
                      htmlFor={`err2-${value}`}
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
          <Code>{`<FieldContent error={errors.payment?.message}>
  <FieldLabel required>Payment method</FieldLabel>
  <RadioGroup value={field.value} onValueChange={field.onChange}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="card" id="card" aria-invalid={!!errors.payment} />
      <label htmlFor="card" className="text-sm font-medium cursor-pointer select-none">
        Credit / debit card
      </label>
    </div>
  </RadioGroup>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="With react-hook-form">
          <p className="text-xs text-gray-500 mb-3">
            Use <code className="font-mono bg-gray-100 px-1 rounded">Controller</code> —{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">onValueChange</code> returns a
            string, not a native event, so{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">register()</code> cannot capture it
            directly.
          </p>
          <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="plan"
  control={control}
  rules={{ required: 'Please select a plan.' }}
  render={({ field, fieldState }) => (
    <FieldContent error={fieldState.error?.message}>
      <FieldLabel required>Plan</FieldLabel>
      <RadioGroup value={field.value} onValueChange={field.onChange}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="free" id="free" aria-invalid={!!fieldState.error} />
          <label htmlFor="free" className="text-sm font-medium cursor-pointer select-none">Free</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pro" id="pro" aria-invalid={!!fieldState.error} />
          <label htmlFor="pro" className="text-sm font-medium cursor-pointer select-none">Pro</label>
        </div>
      </RadioGroup>
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
              items: [
                {
                  title: "Don't use RadioGroup for 5 or more options — use Select instead",
                  body: 'A long list of radio buttons clutters the form. When there are more than 4–5 options, a Select dropdown keeps the layout compact.',
                },
                {
                  title: "Don't use RadioGroup for multiple-selection — use Checkbox Group instead",
                  body: 'RadioGroup enforces exactly one selection. If the user should be able to pick multiple options simultaneously, use a Checkbox group.',
                },
                {
                  title: "Don't use RadioGroup for an instant on/off toggle — use Switch",
                  body: 'RadioGroup implies a buffered choice submitted with the form. Settings that take effect immediately (dark mode, notifications) belong to Switch.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always pair each RadioGroupItem with a visible label via id and htmlFor',
                  body: 'A RadioGroupItem with no label is not operable by screen reader users. The label also makes the click target larger — users can click the label text to select the item.',
                },
                {
                  title:
                    'Add aria-invalid on every RadioGroupItem when there is a validation error',
                  body: 'FieldError provides the visible message, but each RadioGroupItem needs aria-invalid so screen readers announce the invalid state when the item receives focus.',
                },
                {
                  title: 'Pass orientation="horizontal" when using a flex-row layout',
                  body: 'Without it, RadioGroup uses ArrowUp/ArrowDown for keyboard navigation. In a horizontal layout users expect ArrowLeft/ArrowRight — orientation fixes this.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't use register() from react-hook-form directly on RadioGroup",
                  body: 'onValueChange returns a string, not a native event — register() cannot capture it. Always use Controller to bridge the value correctly to react-hook-form.',
                },
                {
                  title:
                    'Apply opacity-50 to the wrapper row when disabled, not just the RadioGroupItem',
                  body: 'Both the radio button and label must visually dim. Applying opacity only to RadioGroupItem leaves the label looking active and confuses sighted users.',
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
        <SubSection title="RadioGroup">
          <ApiTable
            rows={[
              ['value', 'string', '—', 'Controlled selected value.'],
              ['defaultValue', 'string', '""', 'Initial value for uncontrolled usage.'],
              [
                'onValueChange',
                '(value: string) => void',
                '—',
                'Called when selection changes. Receives the value string of the selected item.',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Disables all items in the group. Also auto-applied from FieldContent context.',
              ],
              ['required', 'boolean', 'false', 'Marks the group as required via aria-required.'],
              ['name', 'string', '—', 'Name submitted with the hidden radio inputs.'],
              [
                'orientation',
                "'horizontal' | 'vertical'",
                "'vertical'",
                'Controls arrow-key navigation direction. Use "horizontal" with flex-row layout.',
              ],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes. Use to override the default flex-col gap-2 layout.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="RadioGroupItem">
          <ApiTable
            rows={[
              ['value', 'string', '—', 'Required. Unique value for this item within the group.'],
              [
                'disabled',
                'boolean',
                'false',
                'Disables this item only. Also auto-applied from FieldContent context.',
              ],
              [
                'aria-invalid',
                'boolean',
                '—',
                'Applies red error border when true. Set when FieldContent has an error.',
              ],
              [
                'id',
                'string',
                'auto',
                'ID for the button element. Auto-generated from useId() if omitted.',
              ],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes applied to the button element.',
              ],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
