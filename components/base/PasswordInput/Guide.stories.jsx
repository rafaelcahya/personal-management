'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PasswordInput, { DEFAULT_STRENGTH_RULES } from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input' }
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
  <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80">
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

const ApiTable = ({ component, rows }) => (
  <div className="mb-6">
    {component && <p className="text-xs font-mono font-semibold text-gray-500 mb-2">{component}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
          {rows.map(([prop, type, def, desc]) => (
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
              <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// ─── Demo components ──────────────────────────────────────────────────────────

const SIMPLE_RULES = [(v) => v.length >= 6, (v) => /[A-Z]/.test(v), (v) => /[0-9]/.test(v)]

const PIN_RULES = [
  (v) => /^\d+$/.test(v),
  (v) => v.length >= 4,
  (v) => v.length >= 6,
  (v) => new Set(v).size >= 4,
]

function StrengthDemo({ meterVariant = 'bars' }) {
  const [value, setValue] = useState('')
  return (
    <FieldContent required>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to see strength"
        strengthMeter
        meterVariant={meterVariant}
      />
      <FieldDescription>Use 12+ characters with uppercase, numbers, and symbols.</FieldDescription>
    </FieldContent>
  )
}

function RHFDemo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { password: '' } })

  return (
    <form onSubmit={handleSubmit(() => {})} className="flex flex-col gap-3 w-full">
      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
          minLength: { value: 8, message: 'At least 8 characters' },
        }}
        render={({ field }) => (
          <FieldContent required error={errors.password?.message}>
            <FieldLabel>Password</FieldLabel>
            <PasswordInput {...field} strengthMeter placeholder="Enter password" />
            <FieldError />
          </FieldContent>
        )}
      />
      <Button type="submit" size="sm" className="w-full">
        Submit
      </Button>
    </form>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">PasswordInput</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A password field with a built-in show/hide toggle and an optional strength meter. Composes
          with the <code className="font-mono bg-gray-100 px-1 rounded text-sm">Field</code> system
          for accessible labels, descriptions, and error messages. Works with react-hook-form out of
          the box via <code className="font-mono bg-gray-100 px-1 rounded text-sm">Controller</code>
          .
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <Preview>
          <StrengthDemo />
        </Preview>
        <Code>{`<FieldContent required>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput
    value={value}
    onChange={e => setValue(e.target.value)}
    strengthMeter
    placeholder="Type to see strength"
  />
  <FieldDescription>Use 12+ characters with uppercase, numbers, and symbols.</FieldDescription>
</FieldContent>`}</Code>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section
        title="Anatomy"
        description="PasswordInput wraps FieldControl + Input + FieldSuffix internally. Callers only need to place it inside FieldContent — no extra wrapping needed."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent
            </span>

            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Password</span>
            </div>

            <div className="relative pt-4 pb-2 px-2 border border-dashed border-violet-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                PasswordInput (internal)
              </span>

              <div className="relative pt-4 pb-2 px-2 border border-dashed border-blue-300 rounded mb-2">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                  FieldControl
                </span>
                <div className="flex items-stretch gap-1">
                  <div className="flex flex-col gap-0.5 flex-1 px-2 pt-1 pb-1.5 border border-dashed border-blue-300 rounded">
                    <span className="text-[10px] font-mono text-blue-500">Input</span>
                    <span className="text-[10px] text-slate-300 font-mono">••••••••</span>
                  </div>
                  <div className="flex flex-col gap-0.5 px-2 pt-1 pb-1.5 border border-dashed border-green-300 rounded shrink-0">
                    <span className="text-[10px] font-mono text-green-500">FieldSuffix</span>
                    <span className="text-[10px] text-slate-400 font-mono">👁</span>
                  </div>
                </div>
              </div>

              <div className="relative px-3 py-1.5 border border-dashed border-violet-200 rounded">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-400">
                  StrengthMeter (optional)
                </span>
                <div className="flex gap-0.5 mt-1">
                  {[
                    'bg-emerald-500',
                    'bg-emerald-500',
                    'bg-emerald-500',
                    'bg-gray-200',
                    'bg-gray-200',
                  ].map((c, i) => (
                    <div key={i} className={`h-1 w-8 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldDescription
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Use 12+ characters.</span>
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-red-200 rounded">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-red-400">
                FieldError
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Password too short.</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Who renders it', 'Description'].map((h) => (
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
                  'Caller',
                  'Root wrapper — provides accessible IDs, error state, required, and disabled via context.',
                ],
                [
                  'FieldLabel',
                  'Caller',
                  'Accessible label auto-linked to the input via context ID.',
                ],
                [
                  'FieldControl',
                  'PasswordInput internally',
                  'Relative positioning wrapper for the suffix toggle.',
                ],
                [
                  'Input',
                  'PasswordInput internally',
                  'Core input element. Reads error/disabled from FieldContent context.',
                ],
                [
                  'FieldSuffix (toggle)',
                  'PasswordInput internally',
                  'Eye/EyeOff button that switches between password and text type.',
                ],
                [
                  'StrengthMeter',
                  'PasswordInput internally',
                  'Optional bars or full-bar indicator. Shown only when strengthMeter=true and field has a value.',
                ],
                [
                  'FieldDescription',
                  'Caller',
                  'Hint text linked to the input via aria-describedby.',
                ],
                [
                  'FieldError',
                  'Caller',
                  'Error message with role="alert". Reads from FieldContent context.',
                ],
              ].map(([part, who, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-400 whitespace-nowrap">
                    {who}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Usage ──────────────────────────────────────────────────────────── */}
      <Section title="Usage">
        <SubSection
          title="Basic"
          description="Minimal — just the show/hide toggle, no label or strength meter."
        >
          <Preview>
            <PasswordInput placeholder="Enter password" aria-label="Password" />
          </Preview>
          <Code>{`<PasswordInput placeholder="Enter password" aria-label="Password" />`}</Code>
        </SubSection>

        <SubSection title="Inside FieldContent">
          <Preview>
            <FieldContent required>
              <FieldLabel>Password</FieldLabel>
              <PasswordInput placeholder="Enter password" />
              <FieldDescription>Must be at least 8 characters.</FieldDescription>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput placeholder="Enter password" />
  <FieldDescription>Must be at least 8 characters.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection
          title="Strength Meter — bars (default)"
          description="Add strengthMeter to show a 5-segment indicator. Score is based on the strengthRules array."
        >
          <Preview>
            <StrengthDemo meterVariant="bars" />
          </Preview>
          <Code>{`<PasswordInput
  value={value}
  onChange={e => setValue(e.target.value)}
  strengthMeter
/>`}</Code>
        </SubSection>

        <SubSection
          title="Strength Meter — full"
          description="meterVariant=full renders a single animated bar that expands and changes color as the score increases."
        >
          <Preview>
            <StrengthDemo meterVariant="full" />
          </Preview>
          <Code>{`<PasswordInput
  value={value}
  onChange={e => setValue(e.target.value)}
  strengthMeter
  meterVariant="full"
/>`}</Code>
        </SubSection>

        <SubSection
          title="Custom strengthRules"
          description="Pass an array of test functions. Each passing rule adds to the score, which is scaled to 0–5 automatically."
        >
          <div className="flex gap-5 flex-wrap mb-4">
            <div className="flex flex-col gap-2 w-72">
              <span className="text-xs text-gray-400">Simple — 3 rules</span>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                {(() => {
                  const [v, setV] = useState('')
                  return (
                    <FieldContent>
                      <PasswordInput
                        value={v}
                        onChange={(e) => setV(e.target.value)}
                        placeholder="Min 6, uppercase, number"
                        strengthMeter
                        strengthRules={SIMPLE_RULES}
                      />
                    </FieldContent>
                  )
                })()}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-72">
              <span className="text-xs text-gray-400">PIN — digits only, 4 rules</span>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                {(() => {
                  const [v, setV] = useState('')
                  return (
                    <FieldContent>
                      <PasswordInput
                        value={v}
                        onChange={(e) => setV(e.target.value)}
                        placeholder="Digits only PIN"
                        strengthMeter
                        strengthRules={PIN_RULES}
                      />
                    </FieldContent>
                  )
                })()}
              </div>
            </div>
          </div>
          <Code>{`import PasswordInput, { DEFAULT_STRENGTH_RULES } from '@/components/base/PasswordInput/PasswordInput'

const SIMPLE_RULES = [
  (v) => v.length >= 6,
  (v) => /[A-Z]/.test(v),
  (v) => /[0-9]/.test(v),
]

const EXTENDED_RULES = [
  ...DEFAULT_STRENGTH_RULES,
  (v) => v.length >= 16,
]

<PasswordInput strengthMeter strengthRules={SIMPLE_RULES} />
<PasswordInput strengthMeter strengthRules={EXTENDED_RULES} />`}</Code>
        </SubSection>

        <SubSection
          title="With react-hook-form"
          description="Use Controller and spread the field object — forwardRef ensures the ref lands on the underlying input element."
        >
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80">
            <RHFDemo />
          </div>
          <Code>{`const { control, handleSubmit, formState: { errors } } = useForm()

<Controller
  name="password"
  control={control}
  rules={{
    required: 'Password is required',
    minLength: { value: 8, message: 'At least 8 characters' },
  }}
  render={({ field }) => (
    <FieldContent required error={errors.password?.message}>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput {...field} strengthMeter placeholder="Enter password" />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <Preview>
            <FieldContent required error="Password must be at least 8 characters.">
              <FieldLabel>Password</FieldLabel>
              <PasswordInput defaultValue="123" />
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required error="Password must be at least 8 characters.">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="123" />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Preview>
            <FieldContent disabled>
              <FieldLabel>Password</FieldLabel>
              <PasswordInput defaultValue="secret123" />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent disabled>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="secret123" />
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title:
                    'Use PasswordInput for every field that accepts a password or secret token',
                  body: 'The show/hide toggle reduces transcription errors and helps users verify what they typed. It is especially important on mobile where typing accuracy is lower.',
                },
                {
                  title: 'Enable strengthMeter on sign-up and change-password forms',
                  body: 'Real-time feedback motivates users to create stronger passwords. The meter appears only when the field has a value, so empty fields are not cluttered with an empty indicator.',
                },
                {
                  title: 'Use react-hook-form Controller and spread the field object',
                  body: 'PasswordInput uses forwardRef — spreading the field object from Controller wires up value, onChange, onBlur, and ref correctly in one line.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use PasswordInput for non-secret fields",
                  body: 'A show/hide toggle on an email or username field confuses users — they expect the toggle only on password fields. Use a plain Input for any field that is not a secret.',
                },
                {
                  title: "Don't enable strengthMeter on login forms",
                  body: 'Strength feedback is only meaningful when the user is creating or changing a password. On a login form, the meter is irrelevant and adds visual noise.',
                },
                {
                  title: "Don't use PasswordInput for PIN or OTP fields",
                  body: 'Short numeric codes have different UX requirements — separate digit boxes, numeric keyboard, auto-advance. Use a dedicated PinInput component instead.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always wrap in FieldContent with a FieldLabel',
                  body: 'FieldContent auto-generates the id and wires it to FieldLabel via htmlFor. Without this, the input has no accessible name and screen readers cannot announce what the field is for.',
                },
                {
                  title: 'Always include <FieldError /> when validation is possible',
                  body: 'FieldError renders with role="alert" and is linked to the Input via aria-errormessage. Including it in the tree means screen readers announce the message immediately when it appears.',
                },
                {
                  title: 'Document password requirements in FieldDescription',
                  body: 'The strength meter is visual-only. Add a FieldDescription listing the password requirements so screen reader users know what they need to satisfy without relying on the meter.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't pass type as a prop",
                  body: 'PasswordInput manages type internally, toggling between "password" and "text" for show/hide. Passing a type prop overrides this logic and breaks the toggle behavior.',
                },
                {
                  title:
                    'Use controlled mode (value + onChange) when the strength meter is enabled',
                  body: 'The strength score is calculated from the current value. In uncontrolled mode (defaultValue only), the score cannot update as the user types — the meter stays at 0.',
                },
                {
                  title: 'Extend DEFAULT_STRENGTH_RULES rather than replacing them',
                  body: 'The default rules cover the most common requirements. Spreading them and appending one or two extra rules is easier to maintain and avoids rewriting the base logic.',
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

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <ApiTable
          component="PasswordInput"
          rows={[
            ['value', 'string', '—', 'Controlled value. Omit to use uncontrolled mode.'],
            ['onChange', '(e) => void', '—', 'Change handler. Receives a native input event.'],
            ['defaultValue', 'string', '—', 'Initial value for uncontrolled mode.'],
            [
              'strengthMeter',
              'boolean',
              'false',
              'Show strength indicator below the field. Only visible when the field has a value.',
            ],
            [
              'meterVariant',
              '"bars" | "full"',
              '"bars"',
              'bars = 5 discrete segments. full = single animated bar with color transition.',
            ],
            [
              'strengthRules',
              '((v: string) => boolean)[]',
              'DEFAULT_STRENGTH_RULES',
              'Array of test functions. Each passing rule adds to the score; total is scaled to 0–5. Import DEFAULT_STRENGTH_RULES to extend the defaults.',
            ],
            [
              'variant',
              '"default" | "error" | "disabled"',
              'auto',
              'Visual state — auto-derived from FieldContent context (error → "error", disabled → "disabled").',
            ],
            ['disabled', 'boolean', 'false', 'Disables the field directly without FieldContent.'],
            ['placeholder', 'string', '—', 'Placeholder text for the input.'],
            ['className', 'string', '—', 'CSS classes applied to the inner Input element.'],
            [
              '...props',
              'HTMLInputElement',
              '—',
              'All other native input attributes forwarded to the Input element.',
            ],
          ]}
        />

        <SubSection title="Strength Score Reference">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Score', 'Label', 'Color', 'Triggered by'].map((h) => (
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
                  ['0', '—', 'hidden', 'No value entered'],
                  ['1–3', 'Weak', 'red', 'Fewer than 3 of the 5 default rules pass'],
                  ['4', 'Fair', 'amber', 'Exactly 3 of 5 rules pass'],
                  ['5', 'Strong', 'emerald', 'Exactly 4 of 5 rules pass'],
                  ['5 (max)', 'Very Strong', 'dark emerald', 'All 5 rules pass'],
                ].map(([score, label, color, trigger]) => (
                  <tr key={score} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600">
                      {score}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-violet-700">
                      {label}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-500">
                      {color}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600">
                      {trigger}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>
    </div>
  ),
}
