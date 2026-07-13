import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Pin Input',
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
  <div className="flex flex-col gap-3 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ headers, rows }) => (
  <div className="overflow-x-auto mb-4">
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
        {rows.map((row, i) => (
          <tr key={i} className="even:bg-gray-50">
            {row.map((cell, j) => (
              <td
                key={j}
                className={`px-3 py-2 border border-gray-200 text-xs ${
                  j === 0
                    ? 'font-mono text-violet-700'
                    : j <= 2
                      ? 'font-mono text-gray-500'
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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
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
)

// ─── Demos ────────────────────────────────────────────────────────────────────

function LiveDemo() {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <FieldContent>
        <PinInput length={6} value={value} onChange={setValue} />
      </FieldContent>
      <p className="text-xs text-gray-400">value: &quot;{value}&quot;</p>
    </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Pin Input</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A segmented input for entering fixed-length numeric codes digit by digit. Focus
          auto-advances on entry, Backspace moves back, and pasting a full code fills all cells at
          once. Integrates with FieldContent context and react-hook-form via Controller.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <LiveDemo />
        </Preview>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import PinInput from '@/components/base/PinInput/PinInput'`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [pin, setPin] = useState('')

<PinInput length={6} value={pin} onChange={setPin} />`}</Code>
        </SubSection>

        <SubSection title="With FieldContent">
          <Code>{`<FieldContent>
  <FieldLabel required>Verification code</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
  <FieldDescription>Enter the 6-digit code sent to your phone.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="With react-hook-form">
          <Code>{`const { control, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <FieldContent error={errors.pin?.message}>
    <FieldLabel required>Verification code</FieldLabel>
    <Controller
      name="pin"
      control={control}
      rules={{ required: 'Required.', minLength: { value: 6, message: 'Must be 6 digits.' } }}
      render={({ field }) => (
        <PinInput length={6} value={field.value ?? ''} onChange={field.onChange} ref={field.ref} />
      )}
    />
    <FieldError />
  </FieldContent>
</form>`}</Code>
        </SubSection>

        <SubSection title="Error state">
          <Code>{`<FieldContent error="Invalid code. Please try again.">
  <FieldLabel>Verification code</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Code>{`<FieldContent disabled>
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={4} value="1234" onChange={() => {}} />
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* Keyboard Behavior */}
      <Section title="Keyboard Behavior">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Key', 'Action'].map((h) => (
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
                ['0–9', 'Fill current cell and advance focus to the next cell'],
                [
                  'Backspace',
                  'Clear current cell; if already empty, clear previous cell and move focus back',
                ],
                ['← / →', 'Move focus to previous / next cell'],
                [
                  'Paste',
                  'Fill all cells left-to-right from clipboard digits; focus last filled cell',
                ],
                ['Click', 'Select cell contents for easy overwrite'],
              ].map(([key, action]) => (
                <tr key={key} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {key}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                    {action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="PinInput">
          <ApiTable
            headers={['Prop', 'Type', 'Default', 'Description']}
            rows={[
              ['length', 'number', '6', 'Number of digit cells to render.'],
              ['value', 'string', "''", 'Controlled value — a string of digits, e.g. "1234".'],
              [
                'onChange',
                '(value: string) => void',
                '—',
                'Called with the full value string on every keystroke or paste.',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Disables all cells. Also inherited from FieldContent context.',
              ],
              [
                'variant',
                "'default' | 'error' | 'disabled'",
                '—',
                'Visual variant. Inferred from FieldContent error/disabled state if not set.',
              ],
              [
                'size',
                "'xs' | 'sm' | 'base' | 'md' | 'lg'",
                "'base'",
                'Cell size. Inherited from FieldContent context if not set.',
              ],
              ['className', 'string', '—', 'Extra classes on the wrapper div.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use PinInput for fixed-length numeric codes only',
                  body: 'OTP, SMS verification codes, numeric PINs — any flow where the user enters a known number of digits one cell at a time. Do not use for passwords or alphanumeric codes.',
                },
                {
                  title: 'Match length to the code users receive',
                  body: 'Set length=4 for PINs, length=6 for typical OTPs. The cell count sets the right expectation before users start typing.',
                },
                {
                  title: 'Always wrap in FieldContent for form fields',
                  body: 'FieldContent provides accessible labels, error broadcasting, and size context. Use FieldLabel and FieldError to complete the composition.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Use Controller from react-hook-form — not register',
                  body: 'PinInput calls onChange(string), not a native input event. Using register will not capture the value. Always wrap with Controller.',
                },
                {
                  title: 'Clear and refocus after a failed attempt',
                  body: 'When a verification attempt fails, clear the value and refocus the first cell so users can re-enter without deleting each digit manually.',
                },
                {
                  title: 'Do not auto-submit the instant the last cell fills',
                  body: 'Give users a moment to notice and correct a paste error before the form fires. A short debounce or an explicit submit button prevents accidental submissions.',
                },
              ],
            },
          ]}
        />
      </Section>
    </div>
  ),
}
