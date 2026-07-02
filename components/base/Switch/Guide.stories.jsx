import { Switch } from './Switch'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch',
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
          <h1 className="text-3xl font-bold text-gray-900">Switch</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A toggle control for binary on/off settings. Prefer Switch over Checkbox when the action
          takes immediate effect — no form submission required. Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels and error messages.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="ov-notif" className="text-sm font-medium cursor-pointer select-none">
              Push notifications
            </label>
            <Switch id="ov-notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="ov-email" className="text-sm font-medium cursor-pointer select-none">
              Email digest
            </label>
            <Switch id="ov-email" />
          </div>
          <FieldContent size="base" error="You must accept the data processing agreement.">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="ov-err" required className="cursor-pointer select-none">
                Data processing agreement
              </FieldLabel>
              <Switch id="ov-err" className="shrink-0" />
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Switch is a single self-contained element. Pair it with FieldContent for accessible labeling and error state."
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
              <span className="text-[10px] text-slate-400 font-mono">Enable notifications</span>
            </div>

            <div className="flex flex-col gap-0.5 p-2 border-2 border-dashed border-blue-300 rounded inline-block">
              <span className="text-[10px] font-mono text-blue-500">Switch</span>
              <div className="w-9 h-5 bg-violet-600 rounded-full flex items-center px-0.5 mt-0.5">
                <div className="size-4 bg-white rounded-full shadow-sm translate-x-4 transition-transform" />
              </div>
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mt-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldDescription
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Get notified about updates.
              </span>
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
                  'Optional wrapper. Provides accessible ID, disabled, and size via context.',
                ],
                ['FieldLabel', '<label>', 'Optional label linked to the Switch via context ID.'],
                [
                  'Switch',
                  '<button>',
                  'Core toggle element. Reads disabled from FieldContent context.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Optional helper text below. Linked via aria-describedby.',
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

        <Code>{`import { Switch } from '@/components/base/Switch/Switch'

<Switch
  id="my-switch"
  checked={checked}
  onCheckedChange={setChecked}
/>`}</Code>
      </Section>

      {/* Themes */}
      <Section
        title="Themes"
        description="Two visual styles controlled by the theme prop. Default is pill."
      >
        <div className="flex flex-col gap-3 mb-3">
          {[
            {
              theme: 'pill',
              label: 'Pill',
              desc: 'Classic filled container — thumb is wrapped inside. Familiar and high-contrast.',
            },
            {
              theme: 'track',
              label: 'Track',
              desc: 'Thin track with a floating thumb that extends beyond the track height. Lighter, modern feel.',
            },
          ].map(({ theme, label, desc }) => (
            <div
              key={theme}
              className="flex items-center gap-5 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-6 w-40 shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <Switch theme={theme} />
                  <span className="text-xs text-gray-400 font-mono">off</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Switch theme={theme} defaultChecked />
                  <span className="text-xs text-gray-400 font-mono">on</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono font-medium text-violet-700 mb-1">
                  theme="{theme}"
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Code>{`{/* Pill (default) */}
<Switch />
<Switch theme="pill" />

{/* Track */}
<Switch theme="track" />`}</Code>
      </Section>

      {/* States */}
      <Section
        title="States"
        description="Switch has two states: off (unchecked) and on (checked). The thumb slides right and the track turns violet when checked."
      >
        <div className="flex items-center gap-10 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          {[
            { id: 'state-off', label: 'off', props: {} },
            { id: 'state-on', label: 'on', props: { defaultChecked: true } },
            { id: 'state-disabled-off', label: 'disabled off', props: { disabled: true } },
            {
              id: 'state-disabled-on',
              label: 'disabled on',
              props: { disabled: true, defaultChecked: true },
            },
          ].map(({ id, label, props }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <Switch id={id} {...props} />
              <span className="text-xs text-gray-400 font-mono">{label}</span>
            </div>
          ))}
        </div>
        <Code>{`{/* Off (default) */}
<Switch />

{/* On */}
<Switch defaultChecked />

{/* Disabled */}
<Switch disabled />

{/* Disabled + on */}
<Switch disabled defaultChecked />`}</Code>
      </Section>

      {/* With Label */}
      <Section
        title="With Label"
        description="Place the label to the right of the switch for settings-style layouts. Link it via htmlFor to make it clickable."
      >
        <Preview>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="label-notif" className="text-sm font-medium cursor-pointer select-none">
              Push notifications
            </label>
            <Switch id="label-notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="label-email" className="text-sm font-medium cursor-pointer select-none">
              Email digest
            </label>
            <Switch id="label-email" />
          </div>
          <div className="flex items-center justify-between gap-4 opacity-50">
            <label
              htmlFor="label-sms"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              SMS alerts
            </label>
            <Switch id="label-sms" disabled />
          </div>
        </Preview>
        <Code>{`<div className="flex items-center justify-between gap-4">
  <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
    Push notifications
  </label>
  <Switch id="notif" defaultChecked />
</div>`}</Code>
      </Section>

      {/* With Description */}
      <Section
        title="With Description"
        description="Use FieldDescription below the label for supporting copy. Common in settings pages."
      >
        <div className="flex flex-col gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 max-w-sm">
          {[
            {
              id: 'desc-notif',
              label: 'Push notifications',
              desc: 'Receive alerts for new messages and activity.',
              checked: true,
            },
            {
              id: 'desc-dark',
              label: 'Dark mode',
              desc: 'Use a dark background across the app.',
              checked: false,
            },
          ].map(({ id, label, desc, checked }) => (
            <div key={id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
                  {label}
                </label>
                <FieldDescription>{desc}</FieldDescription>
              </div>
              <Switch id={id} defaultChecked={checked} className="mt-0.5 shrink-0" />
            </div>
          ))}
        </div>
        <Code>{`<div className="flex items-start justify-between gap-4">
  <div className="flex flex-col gap-0.5">
    <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
      Push notifications
    </label>
    <FieldDescription>Receive alerts for new messages and activity.</FieldDescription>
  </div>
  <Switch id="notif" defaultChecked className="mt-0.5 shrink-0" />
</div>`}</Code>
      </Section>

      {/* Error State */}
      <Section
        title="Error State"
        description="Wrap in FieldContent when you need form validation feedback. Switch doesn't visually indicate an error on its own — rely on FieldError for the message."
      >
        <Preview>
          <FieldContent size="base" error="You must accept the data processing agreement.">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="err-switch" required className="cursor-pointer select-none">
                Data processing agreement
              </FieldLabel>
              <Switch id="err-switch" className="shrink-0" />
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`<FieldContent size="base" error={errors.agreement?.message}>
  <div className="flex items-center justify-between gap-4">
    <FieldLabel htmlFor="agreement" required className="cursor-pointer">
      Data processing agreement
    </FieldLabel>
    <Switch id="agreement" className="shrink-0" />
  </div>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller — Switch's onCheckedChange returns a boolean, not a native event, so register() alone does not work."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="notifications"
  control={control}
  render={({ field }) => (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor="notifications" className="text-sm font-medium cursor-pointer select-none">
        Push notifications
      </label>
      <Switch
        id="notifications"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
    </div>
  )}
/>`}</Code>
      </Section>

      {/* Switch vs Checkbox */}
      <Section title="Switch vs Checkbox">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Switch when…', 'Use Checkbox when…'].map((h) => (
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
              <tr className="even:bg-gray-50">
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>The toggle takes immediate effect (no submit button)</li>
                    <li>It controls a system or app setting</li>
                    <li>The on/off metaphor is clear (e.g. dark mode, notifications)</li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>The value is submitted as part of a form</li>
                    <li>Multiple independent options can be selected</li>
                    <li>The field requires explicit confirmation (e.g. "I agree to…")</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Switch when…', 'Consider an alternative when…'].map((h) => (
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
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>The action takes immediate effect without a form submit button</li>
                    <li>
                      Toggling a persistent app or system setting (e.g. dark mode, notifications)
                    </li>
                    <li>The binary on/off metaphor is immediately clear to the user</li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Checkbox</strong> when the value is collected and submitted as
                      part of a form
                    </li>
                    <li>
                      Use <strong>RadioGroup</strong> when the user must pick one exclusive option
                      from a labeled set of choices
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use descriptive labels that make the setting clear — "Email notifications" is
                  better than just "Notifications". The label should name what is being toggled.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Place the switch on the trailing edge of the label row so the eye reads the label
                  first, then reaches the control. This matches the natural left-to-right reading
                  flow.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Apply the change immediately on toggle — Switch implies instant effect. If
                  persistence requires a network call, show a loading indicator on the switch
                  itself.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use Switch for values that need a form submission before taking effect. If
                  the user must click a Save button for the change to apply, use a Checkbox instead.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use vague labels like "Enable" without context. The label must always
                  describe what is being enabled — a Switch without a meaningful label is unusable
                  for assistive technology.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use Switch when there are more than two mutually exclusive states. If the
                  user chooses between three or more options (e.g. Off / Low / High), use a
                  RadioGroup or Select instead.
                </p>
              </div>
            </div>
          </div>
        </div>
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
                  'theme',
                  '"pill" | "track"',
                  '"pill"',
                  'Visual style — pill wraps the thumb; track is a thin bar with a floating thumb.',
                ],
                ['checked', 'boolean', '—', 'Controlled checked state.'],
                ['defaultChecked', 'boolean', 'false', 'Initial state when uncontrolled.'],
                [
                  'onCheckedChange',
                  '(checked: boolean) => void',
                  '—',
                  'Callback fired when state changes.',
                ],
                ['disabled', 'boolean', 'false', 'Prevents interaction and applies opacity.'],
                [
                  'required',
                  'boolean',
                  'false',
                  'Marks the switch as required for form submission.',
                ],
                ['name', 'string', '—', 'Name submitted with the form.'],
                ['value', 'string', 'on', 'Value submitted with the form when checked.'],
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
