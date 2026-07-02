import { Checkbox } from './Checkbox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox',
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

// ─── Story ────────────────────────────────────────────────────────────────────

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
          A binary toggle for boolean values — checked, unchecked, or indeterminate. Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <div className="flex items-center gap-2">
            <Checkbox id="overview-terms" defaultChecked />
            <label
              htmlFor="overview-terms"
              className="text-sm font-medium cursor-pointer select-none"
            >
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="overview-marketing" />
            <label
              htmlFor="overview-marketing"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Receive marketing emails
            </label>
          </div>
          <FieldContent size="base" error="You must accept the terms to continue.">
            <div className="flex items-center gap-2">
              <Checkbox id="overview-error" aria-invalid />
              <FieldLabel htmlFor="overview-error" className="cursor-pointer select-none">
                Accept privacy policy
              </FieldLabel>
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Checkbox is a single self-contained element. Pair it with FieldContent for accessible labeling and error state."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent <span className="text-slate-400 font-normal">(optional)</span>
            </span>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
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
                  'Optional wrapper. Provides accessible ID, error state, disabled, and size via context.',
                ],
                ['FieldLabel', '<label>', 'Optional label linked to the Checkbox via context ID.'],
                [
                  'Checkbox',
                  '<button>',
                  'Core toggle element. Reads disabled from FieldContent context.',
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

        <Code>{`import { Checkbox } from '@/components/base/Checkbox/Checkbox'

<Checkbox
  id="my-checkbox"
  checked={checked}
  onCheckedChange={setChecked}
/>`}</Code>
      </Section>

      {/* States */}
      <Section
        title="States"
        description="Checkbox supports three visual states: unchecked, checked, and indeterminate."
      >
        <div className="flex items-center gap-8 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          {[
            { id: 'state-unchecked', label: 'unchecked', props: {} },
            { id: 'state-checked', label: 'checked', props: { defaultChecked: true } },
            {
              id: 'state-indeterminate',
              label: 'indeterminate',
              props: { checked: 'indeterminate' },
            },
            { id: 'state-disabled', label: 'disabled', props: { disabled: true } },
            {
              id: 'state-disabled-checked',
              label: 'disabled checked',
              props: { disabled: true, defaultChecked: true },
            },
          ].map(({ id, label, props }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <Checkbox id={id} {...props} />
              <span className="text-xs text-gray-400 font-mono">{label}</span>
            </div>
          ))}
        </div>
        <Code>{`{/* Unchecked (default) */}
<Checkbox />

{/* Checked */}
<Checkbox defaultChecked />

{/* Indeterminate */}
<Checkbox checked="indeterminate" />

{/* Disabled */}
<Checkbox disabled />

{/* Disabled + checked */}
<Checkbox disabled defaultChecked />`}</Code>
      </Section>

      {/* With Label */}
      <Section
        title="With Label"
        description="Always pair a Checkbox with a label. Use id on the Checkbox and htmlFor on the label to make it clickable."
      >
        <Preview>
          <div className="flex items-center gap-2">
            <Checkbox id="label-terms" />
            <label htmlFor="label-terms" className="text-sm font-medium cursor-pointer select-none">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="label-marketing" defaultChecked />
            <label
              htmlFor="label-marketing"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Receive marketing emails
            </label>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <Checkbox id="label-disabled" disabled />
            <label
              htmlFor="label-disabled"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              This option is unavailable
            </label>
          </div>
        </Preview>
        <Code>{`<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm font-medium cursor-pointer select-none">
    I agree to the terms and conditions
  </label>
</div>`}</Code>
      </Section>

      {/* Group */}
      <Section
        title="Group"
        description="Render multiple checkboxes as a list. Each checkbox manages its own state independently."
      >
        <Preview>
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-medium mb-2">Notification preferences</legend>
            {['Email', 'Push notification', 'SMS', 'In-app'].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <Checkbox
                  id={`group-${label}`}
                  defaultChecked={label === 'Email' || label === 'Push notification'}
                />
                <label
                  htmlFor={`group-${label}`}
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
  <div className="flex items-center gap-2">
    <Checkbox id="email" defaultChecked />
    <label htmlFor="email" className="text-sm font-medium cursor-pointer select-none">Email</label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="sms" />
    <label htmlFor="sms" className="text-sm font-medium cursor-pointer select-none">SMS</label>
  </div>
</fieldset>`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent with an error prop to show validation feedback via FieldError."
      >
        <Preview>
          <FieldContent size="base" error="You must accept the terms to continue.">
            <div className="flex items-center gap-2">
              <Checkbox id="error-terms" aria-invalid />
              <FieldLabel htmlFor="error-terms" className="cursor-pointer select-none font-medium">
                I agree to the terms and conditions
              </FieldLabel>
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.terms?.message}>
  <div className="flex items-center gap-2">
    <Checkbox
      id="terms"
      aria-invalid={!!errors.terms}
      onCheckedChange={(v) => setValue('terms', v)}
    />
    <FieldLabel htmlFor="terms" className="cursor-pointer">
      I agree to the terms and conditions
    </FieldLabel>
  </div>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller to integrate Checkbox — onCheckedChange returns a boolean, not a native event, so register() alone does not work."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="terms"
  control={control}
  rules={{ required: 'You must accept the terms.' }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.terms?.message}>
      <div className="flex items-center gap-2">
        <Checkbox
          id="terms"
          checked={field.value}
          onCheckedChange={field.onChange}
          aria-invalid={!!errors.terms}
        />
        <FieldLabel htmlFor="terms" className="cursor-pointer">
          I agree to the terms and conditions
        </FieldLabel>
      </div>
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
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
                  'checked',
                  `boolean | 'indeterminate'`,
                  '—',
                  'Controlled checked state. Use indeterminate for partial selection.',
                ],
                ['defaultChecked', 'boolean', 'false', 'Initial checked state when uncontrolled.'],
                [
                  'onCheckedChange',
                  '(checked: boolean | "indeterminate") => void',
                  '—',
                  'Callback fired when state changes.',
                ],
                ['disabled', 'boolean', 'false', 'Prevents interaction and applies opacity.'],
                [
                  'required',
                  'boolean',
                  'false',
                  'Marks the checkbox as required for form submission.',
                ],
                ['name', 'string', '—', 'Name submitted with the form.'],
                ['value', 'string', 'on', 'Value submitted with the form when checked.'],
                ['aria-invalid', 'boolean', '—', 'Applies error styling when true.'],
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
