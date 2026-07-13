import { Checkbox } from './Checkbox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox',
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
          <h1 className="text-3xl font-bold text-gray-900">Checkbox</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A binary toggle for boolean values — checked, unchecked, or indeterminate. Built from
          scratch with full keyboard support and screen-reader accessibility. Pairs with{' '}
          <code className="font-mono text-sm">FieldContent</code> for validation error display.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <div className="flex items-center gap-3">
            <Checkbox id="ov-terms" defaultChecked />
            <label htmlFor="ov-terms" className="text-sm font-medium cursor-pointer select-none">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="ov-marketing" />
            <label
              htmlFor="ov-marketing"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Receive marketing emails
            </label>
          </div>
          <FieldContent error="You must accept the terms to continue.">
            <div className="flex items-center gap-3">
              <Checkbox id="ov-error" aria-invalid />
              <FieldLabel htmlFor="ov-error" className="cursor-pointer select-none">
                Accept privacy policy
              </FieldLabel>
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`import { Checkbox } from '@/components/base/Checkbox/Checkbox'

<div className="flex items-center gap-3">
  <Checkbox id="terms" onCheckedChange={setTerms} />
  <label htmlFor="terms" className="text-sm font-medium cursor-pointer select-none">
    I agree to the terms and conditions
  </label>
</div>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Checkbox is a single self-contained element. Pair it with FieldContent for accessible labeling and error state."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent <span className="text-slate-400 font-normal">(optional)</span>
            </span>
            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Accept terms</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 border-2 border-dashed border-blue-300 rounded inline-block">
              <span className="text-[10px] font-mono text-blue-500">Checkbox</span>
              <div className="size-4 rounded-sm border-2 border-violet-600 bg-violet-600 flex items-center justify-center mt-0.5">
                <svg className="size-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mt-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldError
              </span>
              <span className="text-[10px] text-slate-400 font-mono">This field is required.</span>
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
                  'Optional accessible label linked to the Checkbox via htmlFor.',
                ],
                [
                  'Checkbox',
                  '<button role="checkbox">',
                  'Core toggle element. Reads disabled from FieldContent context. Contains a hidden <input type="checkbox"> for form submission.',
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
        <SubSection title="States">
          <p className="text-xs text-gray-500 mb-3">
            Three visual states:{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">unchecked</code>,{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">checked</code>, and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">indeterminate</code>. All support
            disabled variants.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 flex items-center gap-8 flex-wrap">
            {[
              { id: 'st-uncheck', label: 'unchecked', props: {} },
              { id: 'st-check', label: 'checked', props: { defaultChecked: true } },
              { id: 'st-indet', label: 'indeterminate', props: { checked: 'indeterminate' } },
              { id: 'st-dis', label: 'disabled', props: { disabled: true } },
              {
                id: 'st-dis-ch',
                label: 'disabled checked',
                props: { disabled: true, defaultChecked: true },
              },
            ].map(({ id, label, props }) => (
              <div key={id} className="flex flex-col items-center gap-2">
                <Checkbox id={id} {...props} />
                <span className="text-[10px] text-gray-400 font-mono">{label}</span>
              </div>
            ))}
          </div>
          <Code>{`<Checkbox />                              {/* unchecked */}
<Checkbox defaultChecked />              {/* checked */}
<Checkbox checked="indeterminate" />     {/* indeterminate */}
<Checkbox disabled />                    {/* disabled */}
<Checkbox disabled defaultChecked />`}</Code>
        </SubSection>

        <SubSection title="With Label">
          <p className="text-xs text-gray-500 mb-3">
            Always pair with a visible label. Link via{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">id</code> on Checkbox and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">htmlFor</code> on the label so
            clicking the label toggles the checkbox.
          </p>
          <Preview>
            <div className="flex items-center gap-3">
              <Checkbox id="lbl-terms" />
              <label htmlFor="lbl-terms" className="text-sm font-medium cursor-pointer select-none">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="lbl-marketing" defaultChecked />
              <label
                htmlFor="lbl-marketing"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Receive marketing emails
              </label>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <Checkbox id="lbl-disabled" disabled />
              <label
                htmlFor="lbl-disabled"
                className="text-sm font-medium cursor-not-allowed select-none"
              >
                This option is unavailable
              </label>
            </div>
          </Preview>
          <Code>{`<div className="flex items-center gap-3">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm font-medium cursor-pointer select-none">
    I agree to the terms and conditions
  </label>
</div>

{/* Disabled row — opacity on wrapper, cursor-not-allowed on label */}
<div className="flex items-center gap-3 opacity-50">
  <Checkbox id="option" disabled />
  <label htmlFor="option" className="text-sm font-medium cursor-not-allowed select-none">
    This option is unavailable
  </label>
</div>`}</Code>
        </SubSection>

        <SubSection title="Group">
          <p className="text-xs text-gray-500 mb-3">
            Wrap multiple checkboxes in a{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">fieldset</code> with a{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">legend</code> for semantic
            grouping. Each checkbox manages its own state independently.
          </p>
          <Preview>
            <fieldset className="flex flex-col gap-2.5">
              <legend className="text-sm font-medium mb-2">Notification preferences</legend>
              {['Email', 'Push notification', 'SMS', 'In-app'].map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <Checkbox id={`grp-${label}`} defaultChecked={i < 2} />
                  <label
                    htmlFor={`grp-${label}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </fieldset>
          </Preview>
          <Code>{`<fieldset className="flex flex-col gap-2.5">
  <legend className="text-sm font-medium mb-3">Notification preferences</legend>
  <div className="flex items-center gap-3">
    <Checkbox id="email" defaultChecked />
    <label htmlFor="email" className="text-sm font-medium cursor-pointer select-none">
      Email
    </label>
  </div>
  <div className="flex items-center gap-3">
    <Checkbox id="sms" />
    <label htmlFor="sms" className="text-sm font-medium cursor-pointer select-none">
      SMS
    </label>
  </div>
</fieldset>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <p className="text-xs text-gray-500 mb-3">
            Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop. Add{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">aria-invalid</code> on the Checkbox
            so screen readers announce the invalid state.
          </p>
          <Preview>
            <FieldContent error="You must accept the terms to continue.">
              <div className="flex items-center gap-3">
                <Checkbox id="err-ov-terms" aria-invalid />
                <FieldLabel
                  htmlFor="err-ov-terms"
                  className="cursor-pointer select-none font-medium"
                >
                  I agree to the terms and conditions
                </FieldLabel>
              </div>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent error={errors.terms?.message}>
  <div className="flex items-center gap-3">
    <Checkbox
      id="terms"
      aria-invalid={!!errors.terms}
      checked={field.value}
      onCheckedChange={field.onChange}
    />
    <FieldLabel htmlFor="terms" className="cursor-pointer select-none font-medium">
      I agree to the terms and conditions
    </FieldLabel>
  </div>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="With react-hook-form">
          <p className="text-xs text-gray-500 mb-3">
            Use <code className="font-mono bg-gray-100 px-1 rounded">Controller</code> —{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">onCheckedChange</code> returns a
            boolean, not a native event, so{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">register()</code> cannot capture it
            directly.
          </p>
          <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="terms"
  control={control}
  rules={{ required: 'You must accept the terms.' }}
  render={({ field, fieldState }) => (
    <FieldContent error={fieldState.error?.message}>
      <div className="flex items-center gap-3">
        <Checkbox
          id="terms"
          checked={field.value}
          onCheckedChange={field.onChange}
          aria-invalid={!!fieldState.error}
        />
        <FieldLabel htmlFor="terms" className="cursor-pointer select-none font-medium">
          I agree to the terms and conditions
        </FieldLabel>
      </div>
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
                  title: 'Use Checkbox for boolean opt-in fields submitted with a form',
                  body: 'Terms acceptance, newsletter subscription, and feature flags that take effect on submit are correct Checkbox use cases.',
                },
                {
                  title: 'Use the indeterminate state for "select all" parent controls',
                  body: 'When a parent checkbox controls a list where only some children are checked, use checked="indeterminate" to communicate partial selection clearly.',
                },
                {
                  title: 'Use fieldset + legend for any group of related checkboxes',
                  body: "Screen readers announce the legend before each checkbox — users know which group they're in without needing it repeated in every label.",
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use Checkbox for mutually exclusive choices — use RadioGroup",
                  body: 'If selecting one option should deselect others, RadioGroup is the correct component. Checkboxes imply independent, additive selection.',
                },
                {
                  title:
                    "Don't use Checkbox for settings that take effect immediately — use Switch",
                  body: 'Dark mode, notifications on/off, and similar instant-effect toggles should use Switch. Checkbox implies the value is buffered until form submission.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always link a visible label via id and htmlFor',
                  body: 'A Checkbox with no label is inaccessible to screen reader users. Every checkbox must have a visible, clickable label associated via htmlFor.',
                },
                {
                  title: 'Add aria-invalid on the Checkbox when there is a validation error',
                  body: 'FieldContent provides the error message via FieldError, but Checkbox needs aria-invalid explicitly so screen readers announce the field as invalid.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't use register() from react-hook-form directly on Checkbox",
                  body: 'onCheckedChange returns a boolean, not a native event. Always use Controller to bridge the value correctly to react-hook-form.',
                },
                {
                  title:
                    'Apply opacity-50 to the wrapper row, not just the Checkbox, when disabled',
                  body: 'Both the checkbox and label must visually dim. Applying opacity only to the Checkbox leaves the label looking active and confuses users.',
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
        <SubSection title="Checkbox">
          <ApiTable
            rows={[
              [
                'checked',
                `boolean | 'indeterminate'`,
                '—',
                'Controlled checked state. Use "indeterminate" for partial group selection.',
              ],
              [
                'defaultChecked',
                'boolean',
                'false',
                'Initial checked state for uncontrolled usage.',
              ],
              [
                'onCheckedChange',
                '(checked: boolean) => void',
                '—',
                'Called when the state changes. Receives boolean (or true from indeterminate toggle).',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Prevents interaction. Also auto-applied from FieldContent context.',
              ],
              [
                'required',
                'boolean',
                'false',
                'Marks the hidden input as required for native form validation.',
              ],
              ['name', 'string', '—', 'Name of the hidden input submitted with the form.'],
              ['value', 'string', '"on"', 'Value of the hidden input submitted when checked.'],
              [
                'aria-invalid',
                'boolean',
                '—',
                'Applies red error border. Set to true when there is a validation error.',
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
