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
          <h1 className="text-3xl font-bold text-gray-900">Switch</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A toggle control for binary on/off settings. Prefer Switch over Checkbox when the action
          takes immediate effect without a form submit button. Built from scratch with full keyboard
          support. Pairs with <code className="font-mono text-sm">FieldContent</code> for accessible
          labels and validation error display.
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
          <FieldContent error="You must accept the data processing agreement.">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="ov-err" required className="cursor-pointer select-none">
                Data processing agreement
              </FieldLabel>
              <Switch id="ov-err" className="shrink-0" />
            </div>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`import { Switch } from '@/components/base/Switch/Switch'

<div className="flex items-center justify-between gap-4">
  <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
    Push notifications
  </label>
  <Switch id="notif" defaultChecked onCheckedChange={setNotif} />
</div>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Switch is a single self-contained element. Pair it with FieldContent for accessible labeling and error state."
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
              <span className="text-[10px] text-slate-400 font-mono">Enable notifications</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 border-2 border-dashed border-blue-300 rounded inline-block">
              <span className="text-[10px] font-mono text-blue-500">Switch</span>
              <div className="w-9 h-5 bg-violet-600 rounded-full flex items-center px-0.5 mt-0.5">
                <div className="size-4 bg-white rounded-full shadow-sm translate-x-4" />
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
                  'Optional wrapper. Provides accessible ID, error state, and disabled state via context.',
                ],
                [
                  'FieldLabel',
                  '<label>',
                  'Optional label linked to the Switch via context ID or explicit htmlFor.',
                ],
                [
                  'Switch',
                  '<button role="switch">',
                  'Core toggle element. Reads disabled from FieldContent context. Contains a hidden <input type="checkbox"> for form submission.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Optional helper text. Linked to the Switch via aria-describedby.',
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
        <SubSection title="Themes">
          <p className="text-xs text-gray-500 mb-3">
            Two visual styles controlled by the{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">theme</code> prop. Default is{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">pill</code>.
          </p>
          <div className="flex flex-col gap-4 mb-4">
            {[
              {
                theme: 'pill',
                desc: 'Classic filled container — thumb is wrapped inside. Familiar and high-contrast.',
              },
              {
                theme: 'track',
                desc: 'Thin track with a floating thumb. Lighter, more modern feel.',
              },
            ].map(({ theme, desc }) => (
              <div
                key={theme}
                className="flex items-center gap-5 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-6 w-36 shrink-0">
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
        </SubSection>

        <SubSection title="States">
          <p className="text-xs text-gray-500 mb-3">
            Switch has two states: off and on. Pass{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">defaultChecked</code> for
            uncontrolled or <code className="font-mono bg-gray-100 px-1 rounded">checked</code> +{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">onCheckedChange</code> for
            controlled.
          </p>
          <div className="flex items-center gap-10 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80">
            {[
              { id: 'st-off', label: 'off', props: {} },
              { id: 'st-on', label: 'on', props: { defaultChecked: true } },
              { id: 'st-dis-off', label: 'disabled off', props: { disabled: true } },
              {
                id: 'st-dis-on',
                label: 'disabled on',
                props: { disabled: true, defaultChecked: true },
              },
            ].map(({ id, label, props }) => (
              <div key={id} className="flex flex-col items-center gap-2">
                <Switch id={id} {...props} />
                <span className="text-xs text-gray-400 font-mono text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Code>{`<Switch />                           {/* off */}
<Switch defaultChecked />            {/* on */}
<Switch disabled />                  {/* disabled off */}
<Switch disabled defaultChecked />   {/* disabled on */}`}</Code>
        </SubSection>

        <SubSection title="With Label">
          <p className="text-xs text-gray-500 mb-3">
            Link a label via <code className="font-mono bg-gray-100 px-1 rounded">htmlFor</code> so
            clicking the label text toggles the switch. Place the switch on the trailing edge so the
            label is read first.
          </p>
          <Preview>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="wl-notif" className="text-sm font-medium cursor-pointer select-none">
                Push notifications
              </label>
              <Switch id="wl-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="wl-email" className="text-sm font-medium cursor-pointer select-none">
                Email digest
              </label>
              <Switch id="wl-email" />
            </div>
            <div className="flex items-center justify-between gap-4 opacity-50">
              <label
                htmlFor="wl-sms"
                className="text-sm font-medium cursor-not-allowed select-none"
              >
                SMS alerts
              </label>
              <Switch id="wl-sms" disabled />
            </div>
          </Preview>
          <Code>{`<div className="flex items-center justify-between gap-4">
  <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
    Push notifications
  </label>
  <Switch id="notif" defaultChecked />
</div>

{/* Disabled row — opacity on wrapper, cursor-not-allowed on label */}
<div className="flex items-center justify-between gap-4 opacity-50">
  <label htmlFor="sms" className="text-sm font-medium cursor-not-allowed select-none">
    SMS alerts
  </label>
  <Switch id="sms" disabled />
</div>`}</Code>
        </SubSection>

        <SubSection title="With Description">
          <p className="text-xs text-gray-500 mb-3">
            Use <code className="font-mono bg-gray-100 px-1 rounded">FieldDescription</code> below
            the label for supporting copy. Common in settings pages where the label alone is not
            self-explanatory.
          </p>
          <Preview>
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
                  <FieldDescription className="text-xs text-slate-400">{desc}</FieldDescription>
                </div>
                <Switch id={id} defaultChecked={checked} className="mt-0.5 shrink-0" />
              </div>
            ))}
          </Preview>
          <Code>{`<div className="flex items-start justify-between gap-4">
  <div className="flex flex-col gap-0.5">
    <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
      Push notifications
    </label>
    <FieldDescription className="text-xs text-slate-400">
      Receive alerts for new messages and activity.
    </FieldDescription>
  </div>
  <Switch id="notif" defaultChecked className="mt-0.5 shrink-0" />
</div>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <p className="text-xs text-gray-500 mb-3">
            Wrap in <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> with an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">error</code> prop. Switch has no
            built-in error indicator — rely on{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">FieldError</code> for the message.
          </p>
          <Preview>
            <FieldContent error="You must accept the data processing agreement.">
              <div className="flex items-center justify-between gap-4">
                <FieldLabel htmlFor="err-sw" required className="cursor-pointer select-none">
                  Data processing agreement
                </FieldLabel>
                <Switch id="err-sw" className="shrink-0" />
              </div>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent error={errors.agreement?.message}>
  <div className="flex items-center justify-between gap-4">
    <FieldLabel htmlFor="agreement" required className="cursor-pointer select-none">
      Data processing agreement
    </FieldLabel>
    <Switch id="agreement" className="shrink-0" />
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
                  title:
                    'Use Switch for settings that take immediate effect without a submit button',
                  body: 'Dark mode, push notifications, and similar persistent app settings are correct Switch use cases. The user expects the change to apply the moment they toggle.',
                },
                {
                  title: 'Place the switch on the trailing edge of the label row',
                  body: 'The label should be read before the control. Left-align the label and right-align the switch so the eye flows naturally from description to toggle.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title:
                    "Don't use Switch when the value must be submitted with a form — use Checkbox",
                  body: 'If the user must click a Save button for the change to apply, Switch sends the wrong signal. Users expect a Switch change to be instant.',
                },
                {
                  title:
                    "Don't use Switch for mutually exclusive choices — use RadioGroup or Select",
                  body: 'Switch is binary — on or off. If the user chooses between three or more options (Off / Low / High), use RadioGroup or Select instead.',
                },
                {
                  title: "Don't use Switch for multiple-selection opt-ins — use Checkbox",
                  body: 'If the user selects multiple independent features from a list to be submitted with a form (newsletter, weekly digest, account alerts), use a Checkbox group.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title:
                    'Always link a visible label via htmlFor so the label click toggles the switch',
                  body: 'A Switch with no label is inaccessible. The htmlFor association also enlarges the click target — users can click the label text instead of the small switch element.',
                },
                {
                  title: 'Use descriptive labels — never just "Enable" without context',
                  body: 'Screen readers announce the label when the switch receives focus. "Enable" alone gives no context. Write "Enable push notifications" or use a visible label that names the setting clearly.',
                },
                {
                  title: 'Apply opacity-50 to the wrapper row when the entire setting is disabled',
                  body: 'Switch internally applies opacity to itself when disabled. But the label also needs to visually dim. Apply opacity-50 to the wrapping div so the full row reads as disabled.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't use register() from react-hook-form directly on Switch",
                  body: 'onCheckedChange returns a boolean, not a native event — register() cannot capture it. Always use Controller to bridge Switch with react-hook-form.',
                },
                {
                  title:
                    'Apply the change immediately on toggle — if it needs a network call, show a loading state',
                  body: 'Switch implies instant effect. If persisting the value requires an API call, show a spinner or loading indicator on the switch itself while the request is in-flight.',
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
        <SubSection title="Switch">
          <ApiTable
            rows={[
              [
                'theme',
                '"pill" | "track"',
                '"pill"',
                'Visual style — pill wraps the thumb inside a filled container; track is a thin bar with a floating thumb.',
              ],
              ['checked', 'boolean', '—', 'Controlled checked state.'],
              ['defaultChecked', 'boolean', 'false', 'Initial state for uncontrolled usage.'],
              [
                'onCheckedChange',
                '(checked: boolean) => void',
                '—',
                'Called when state changes. Receives the new boolean value.',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Prevents interaction and applies opacity. Also auto-applied from FieldContent context.',
              ],
              [
                'required',
                'boolean',
                'false',
                'Marks the switch as required via aria-required and the hidden input.',
              ],
              ['name', 'string', '—', 'Name submitted with the hidden checkbox input.'],
              ['value', 'string', '"on"', 'Value submitted with the form when checked.'],
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
