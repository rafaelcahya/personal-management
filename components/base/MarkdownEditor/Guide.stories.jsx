import { useState } from 'react'
import MarkdownEditor from './MarkdownEditor'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'MarkdownEditor',
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
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-[680px]">
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

const ApiTable = ({ rows }) => (
  <div className="overflow-x-auto mb-4">
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
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
              {def}
            </td>
            <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8">
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

const SAMPLE = `## Goal\n\nRun a **sub-4:00** marathon by end of year.\n\n- Weekly mileage: 60km+\n- Long run: every Sunday`

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => {
    const [basic, setBasic] = useState(SAMPLE)
    const [errorVal, setErrorVal] = useState('too short')

    return (
      <div className="p-8 max-w-4xl font-sans text-gray-900">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">MarkdownEditor</h1>
            <Tag color="violet">Base Component</Tag>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            A two-tab editor with a plain textarea (Write) and a rendered markdown preview
            (Preview). Integrates with{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
            error and disabled state. Renders markdown via{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-sm">react-markdown</code> with
            GFM and sanitization.
          </p>
        </div>

        {/* Overview */}
        <Section title="Overview">
          <Preview>
            <FieldContent required>
              <FieldLabel>Goal Description</FieldLabel>
              <FieldDescription>
                Supports **bold**, *italic*, lists, headings, links, and code.
              </FieldDescription>
              <MarkdownEditor value={basic} onChange={setBasic} minHeight="200px" />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required>
  <FieldLabel>Goal Description</FieldLabel>
  <FieldDescription>Supports **bold**, *italic*, lists, headings, links, and code.</FieldDescription>
  <MarkdownEditor value={value} onChange={setValue} minHeight="200px" />
</FieldContent>`}</Code>
        </Section>

        {/* Variants */}
        <Section title="Variants" description="Three states: default, error, and disabled.">
          <SubSection title="Default">
            <Preview>
              <FieldContent>
                <FieldLabel>Notes</FieldLabel>
                <MarkdownEditor value={SAMPLE} minHeight="200px" />
              </FieldContent>
            </Preview>
          </SubSection>

          <SubSection title="Error">
            <Preview>
              <FieldContent error="Description must be at least 30 characters.">
                <FieldLabel>Notes</FieldLabel>
                <MarkdownEditor value={errorVal} onChange={setErrorVal} minHeight="200px" />
                <FieldError />
              </FieldContent>
            </Preview>
            <Code>{`<FieldContent error="Description must be at least 30 characters.">
  <FieldLabel>Notes</FieldLabel>
  <MarkdownEditor value={value} onChange={setValue} minHeight="200px" />
  <FieldError />
</FieldContent>`}</Code>
          </SubSection>

          <SubSection title="Disabled">
            <Preview>
              <FieldContent disabled>
                <FieldLabel>Auto-generated Notes</FieldLabel>
                <MarkdownEditor value={SAMPLE} minHeight="200px" />
              </FieldContent>
            </Preview>
            <Code>{`<FieldContent disabled>
  <FieldLabel>Auto-generated Notes</FieldLabel>
  <MarkdownEditor value={value} minHeight="200px" />
</FieldContent>`}</Code>
          </SubSection>
        </Section>

        {/* Height control */}
        <Section
          title="Height Control"
          description="Use minHeight and maxHeight to control the textarea size."
        >
          <div className="flex flex-col gap-4 w-[680px] mb-4">
            {[
              { label: 'minHeight="120px"', minHeight: '120px' },
              { label: 'minHeight="240px"', minHeight: '240px' },
              { label: 'minHeight="480px" (Basic default)', minHeight: '480px' },
              {
                label: 'minHeight="240px" maxHeight="360px"',
                minHeight: '240px',
                maxHeight: '360px',
              },
            ].map(({ label, minHeight, maxHeight }) => (
              <div key={label}>
                <p className="text-xs font-mono text-violet-700 mb-1">{label}</p>
                <MarkdownEditor
                  value=""
                  placeholder="Write here..."
                  minHeight={minHeight}
                  maxHeight={maxHeight}
                />
              </div>
            ))}
          </div>
          <Code>{`<MarkdownEditor minHeight="120px" ... />
<MarkdownEditor minHeight="240px" ... />
<MarkdownEditor minHeight="480px" ... />
<MarkdownEditor minHeight="240px" maxHeight="360px" ... />`}</Code>
        </Section>

        {/* react-hook-form */}
        <Section title="Usage with react-hook-form">
          <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="description"
  control={control}
  render={({ field, fieldState }) => (
    <FieldContent error={fieldState.error?.message}>
      <FieldLabel>Description</FieldLabel>
      <MarkdownEditor
        value={field.value ?? ''}
        onChange={field.onChange}
        minHeight="480px"
      />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
        </Section>

        {/* Best Practices */}
        <Section title="Best Practices">
          <BestPractices
            items={[
              {
                heading: 'When to use',
                cards: [
                  {
                    title: 'Use MarkdownEditor when the value will be rendered as formatted text',
                    body: 'Goal descriptions, race notes, trade journal entries, and AI coach prompts are good candidates — they benefit from headings, bold, lists, and code blocks.',
                  },
                  {
                    title: 'Set minHeight to match expected content length',
                    body: 'A short notes field needs 80–120px; a full description benefits from 160–240px. Match the height to the expected amount of text to avoid the editor feeling cramped or oversized.',
                  },
                ],
              },
              {
                heading: 'When not to use',
                cards: [
                  {
                    title: "Don't use MarkdownEditor for single-line or plain-text values",
                    body: 'Names, tags, and short notes that will never be rendered as markdown should use Input or Textarea. MarkdownEditor adds tab switching overhead that is not worth it for plain text.',
                  },
                ],
              },
              {
                heading: 'Accessibility',
                cards: [
                  {
                    title: 'Always wrap in FieldContent with a FieldLabel',
                    body: 'FieldContent generates the id and wires it to FieldLabel via htmlFor. Without it, the textarea has no accessible name for screen readers.',
                  },
                  {
                    title: 'Include FieldError when validation is possible',
                    body: 'FieldError renders with role="alert" so screen readers announce the error immediately when it appears.',
                  },
                ],
              },
            ]}
          />
        </Section>

        {/* API Reference */}
        <Section title="API Reference">
          <SubSection title="MarkdownEditor">
            <ApiTable
              rows={[
                ['value', 'string', "''", 'The markdown string value (controlled).'],
                [
                  'onChange',
                  '(value: string) => void',
                  '—',
                  'Called with the new markdown string on every keystroke.',
                ],
                [
                  'placeholder',
                  'string',
                  "'Write markdown here...'",
                  'Shown in the Write tab when empty, and in the Preview tab when there is no content.',
                ],
                [
                  'minHeight',
                  'string',
                  "'120px'",
                  'Minimum height of the editor area (CSS value).',
                ],
                [
                  'maxHeight',
                  'string',
                  '—',
                  'Maximum height of the textarea. When set, resize is disabled.',
                ],
                [
                  'variant',
                  '"default" | "error" | "disabled"',
                  'auto',
                  'Auto-derived from FieldContent context. Override when used standalone.',
                ],
                [
                  'disabled',
                  'boolean',
                  'false',
                  'Disables the editor. Also auto-applied via FieldContent disabled prop.',
                ],
                ['className', 'string', '—', 'CSS classes applied to the outer container.'],
              ]}
            />
          </SubSection>
        </Section>
      </div>
    )
  },
}
