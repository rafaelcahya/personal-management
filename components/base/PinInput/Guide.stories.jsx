import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Pin Input' }
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

function LiveDemo() {
  const [value, setValue] = useState('')
  return (
    <FieldContent size="base">
      <PinInput length={6} value={value} onChange={setValue} />
      <p className="text-xs text-gray-400 mt-1">value: "{value}"</p>
    </FieldContent>
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
          A segmented input for entering fixed-length numeric codes digit by digit. Auto-advances on
          entry, supports Backspace, arrow keys, and full-code paste. Integrates with FieldContent
          context and react-hook-form via Controller.
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

        <SubSection title="Controlled (standalone)">
          <Code>{`const [pin, setPin] = useState('')

<FieldContent size="base">
  <FieldLabel>Verification code</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="With react-hook-form">
          <Code>{`const { control, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <FieldContent size="base">
    <FieldLabel>Enter PIN</FieldLabel>
    <Controller
      name="pin"
      control={control}
      rules={{ required: true, minLength: 6 }}
      render={({ field }) => (
        <PinInput length={6} value={field.value ?? ''} onChange={field.onChange} ref={field.ref} />
      )}
    />
  </FieldContent>
</form>`}</Code>
        </SubSection>

        <SubSection title="Error state">
          <Code>{`<FieldContent size="base" error="Invalid code. Please try again.">
  <FieldLabel>Verification code</FieldLabel>
  <PinInput length={6} value={pin} onChange={setPin} />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Code>{`<FieldContent size="base" disabled>
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={4} value="1234" />
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* Keyboard */}
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
                  'Fill all cells left-to-right from clipboard digits, focus next empty cell',
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

      {/* API */}
      <Section title="API Reference">
        <SubSection title="PinInput">
          <div className="overflow-x-auto mb-6">
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
                  ['length', 'number', '6', 'Number of digit cells to render.'],
                  ['value', 'string', "''", 'Controlled value. String of digits, e.g. "1234".'],
                  [
                    'onChange',
                    '(value: string) => void',
                    '—',
                    'Called with the new full value string on every keystroke or paste.',
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
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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
    </div>
  ),
}
