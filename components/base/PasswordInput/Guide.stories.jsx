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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  <div className="flex flex-col gap-4 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80">
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
    <FieldContent size="base" required>
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
          <FieldContent size="base" required error={errors.password?.message}>
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
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">PasswordInput</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A password field with a show/hide toggle and an optional strength meter. Composes with the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">Field</code> system for
          accessible labels, descriptions, and error messages. Works with react-hook-form out of the
          box via <code className="font-mono bg-gray-100 px-1 rounded text-sm">Controller</code>.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <StrengthDemo />
        </Preview>
      </Section>

      {/* Anatomy */}
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
                PasswordInput
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

        <Code>{`<FieldContent size="base" required error={errors.password?.message}>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput placeholder="Enter password" strengthMeter />
  <FieldDescription>Use 12+ characters with symbols.</FieldDescription>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection
          title="Basic"
          description="Minimal usage — no FieldContent required. ID and aria props won't be wired up, so prefer using inside FieldContent for real forms."
        >
          <Preview>
            <PasswordInput placeholder="Enter password" />
          </Preview>
          <Code>{`<PasswordInput placeholder="Enter password" />`}</Code>
        </SubSection>

        <SubSection title="Inside FieldContent">
          <Preview>
            <FieldContent size="base" required>
              <FieldLabel>Password</FieldLabel>
              <PasswordInput placeholder="Enter password" />
              <FieldDescription>Must be at least 8 characters.</FieldDescription>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" required>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput placeholder="Enter password" />
  <FieldDescription>Must be at least 8 characters.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection
          title="Strength Meter — bars (default)"
          description="Add strengthMeter to show a 5-segment indicator as the user types. Score is based on length, uppercase, numbers, and symbols."
        >
          <Preview>
            <StrengthDemo meterVariant="bars" />
          </Preview>
          <Code>{`<PasswordInput value={value} onChange={e => setValue(e.target.value)} strengthMeter />`}</Code>
        </SubSection>

        <SubSection
          title="Strength Meter — full"
          description="meterVariant=full renders a single continuous bar that expands and changes color smoothly as the score increases."
        >
          <Preview>
            <StrengthDemo meterVariant="full" />
          </Preview>
          <Code>{`<PasswordInput value={value} onChange={e => setValue(e.target.value)} strengthMeter meterVariant="full" />`}</Code>
        </SubSection>

        <SubSection
          title="Custom strengthRules"
          description="Pass an array of test functions. Each rule that passes adds to the score. The total is scaled to 0–5 automatically — so 3 rules or 10 rules both work."
        >
          <div className="flex gap-6 flex-wrap mb-4">
            <div className="flex flex-col gap-2 w-72">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Simple (3 rules)
              </p>
              <FieldContent size="base">
                <PasswordInput
                  placeholder="Min 6, uppercase, number"
                  strengthMeter
                  strengthRules={SIMPLE_RULES}
                />
              </FieldContent>
            </div>
            <div className="flex flex-col gap-2 w-72">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Digits only (4 rules)
              </p>
              <FieldContent size="base">
                <PasswordInput
                  placeholder="Digits only PIN"
                  strengthMeter
                  strengthRules={PIN_RULES}
                />
              </FieldContent>
            </div>
          </div>
          <Code>{`import PasswordInput, { DEFAULT_STRENGTH_RULES } from '@/components/base/PasswordInput/PasswordInput'

// simple — 3 rules
const SIMPLE_RULES = [
  (v) => v.length >= 6,
  (v) => /[A-Z]/.test(v),
  (v) => /[0-9]/.test(v),
]

// extend the defaults with an extra rule
const EXTENDED_RULES = [
  ...DEFAULT_STRENGTH_RULES,
  (v) => v.length >= 16,
]

<PasswordInput strengthMeter strengthRules={SIMPLE_RULES} />
<PasswordInput strengthMeter strengthRules={EXTENDED_RULES} />`}</Code>
        </SubSection>

        <SubSection
          title="With react-hook-form"
          description="Use Controller and spread the field object — forwardRef ensures the ref lands on the input element."
        >
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-80">
            <RHFDemo />
          </div>
          <Code>{`const { control, handleSubmit, formState: { errors } } = useForm()

<Controller
  name="password"
  control={control}
  rules={{ required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } }}
  render={({ field }) => (
    <FieldContent size="base" required error={errors.password?.message}>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput {...field} strengthMeter placeholder="Enter password" />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <Preview>
            <FieldContent size="base" required error="Password must be at least 8 characters.">
              <FieldLabel>Password</FieldLabel>
              <PasswordInput defaultValue="123" />
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" required error="Password must be at least 8 characters.">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="123" />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Preview>
            <FieldContent size="base" disabled>
              <FieldLabel>Password</FieldLabel>
              <PasswordInput defaultValue="secret123" />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" disabled>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="secret123" />
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* When to use */}
      <Section title="When to use">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
              Use PasswordInput when
            </p>
            <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
              <li>The field accepts a user password or secret</li>
              <li>Users benefit from seeing what they typed (toggle)</li>
              <li>You want to guide users toward stronger passwords (strengthMeter)</li>
              <li>Building sign-up, change-password, or reset-password forms</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Use plain Input when
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>The field is not a password (use type="text" or type="email")</li>
              <li>You need a PIN or OTP field — use a separate component</li>
              <li>You want custom suffix content (use FieldSuffix directly)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
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
              {[
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
                  'bars = 5 discrete segments. full = single continuous bar with animated width and color transition.',
                ],
                [
                  'strengthRules',
                  '((v: string) => boolean)[]',
                  'DEFAULT_STRENGTH_RULES',
                  'Array of test functions. Each passing rule adds to the score; total is scaled to 0–5. Import DEFAULT_STRENGTH_RULES to extend the defaults.',
                ],
                [
                  'size',
                  '"xs" | "sm" | "base" | "md" | "lg"',
                  'ctx or "base"',
                  'Overrides FieldContent context size when set explicitly.',
                ],
                [
                  'variant',
                  '"default" | "error" | "disabled"',
                  'auto',
                  'Visual state — auto-derived from FieldContent (error → "error", disabled → "disabled").',
                ],
                [
                  'disabled',
                  'boolean',
                  'false',
                  'Disables the field directly without needing FieldContent.',
                ],
                ['placeholder', 'string', '—', 'Placeholder text for the input.'],
                ['className', 'string', '—', 'CSS classes applied to the inner Input element.'],
                [
                  '...props',
                  'HTMLInputProps',
                  '—',
                  'All other native input attributes are forwarded to the Input element.',
                ],
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

        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Strength Score Reference
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Score', 'Label', 'Triggered by'].map((h) => (
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
                  ['1–2', 'Weak', 'Short password — fewer than 2 of the criteria met'],
                  ['3', 'Fair', 'Length ≥ 8 + one of: uppercase, number, or symbol'],
                  ['4', 'Strong', 'Length ≥ 8 + two or more of: uppercase, number, symbol'],
                  ['5', 'Very Strong', 'Length ≥ 12 + uppercase + number + symbol'],
                ].map(([score, label, trigger]) => (
                  <tr key={score} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600">
                      {score}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-violet-700">
                      {label}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600">
                      {trigger}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  ),
}
